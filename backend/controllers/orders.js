// backend/controllers/orders.js
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @desc    إنشاء طلب جديد
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = asyncHandler(async (req, res) => {
  const { 
    productId, 
    measurementId, 
    fabricChoice, 
    colorChoice, 
    additionalRequests 
  } = req.body;

  // التحقق من وجود المنتج
  const product = await Product.findById(productId);
  
  if (!product) {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }

  const order = await Order.create({
    userId: req.user._id,
    productId,
    measurementId,
    fabricChoice,
    colorChoice,
    additionalRequests: additionalRequests || '',
    totalPrice: product.price,
  });

  if (order) {
    res.status(201).json(order);
  } else {
    res.status(400);
    throw new Error('بيانات الطلب غير صالحة');
  }
});

/**
 * @desc    الحصول على طلبات المستخدم
 * @route   GET /api/orders
 * @access  Private
 */
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate('productId', 'name price imageUrl')
    .sort({ createdAt: -1 });
  
  res.json(orders);
});

/**
 * @desc    الحصول على طلب محدد
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('productId', 'name description price imageUrl fabricOptions colorOptions')
    .populate('measurementId', 'name chest waist hips shoulderWidth sleeveLength inseam neckSize height weight');
  
  if (!order) {
    res.status(404);
    throw new Error('الطلب غير موجود');
  }
  
  // التحقق من ملكية الطلب أو صلاحيات المسؤول/الخياط
  if (order.userId.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin' && 
      req.user.role !== 'tailor') {
    res.status(403);
    throw new Error('غير مصرح بالوصول');
  }
  
  res.json(order);
});

/**
 * @desc    إلغاء طلب
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('الطلب غير موجود');
  }
  
  // التحقق من ملكية الطلب أو صلاحيات المسؤول
  if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('غير مصرح بالوصول');
  }
  
  // التحقق من إمكانية إلغاء الطلب
  if (order.status === 'تم التسليم' || order.status === 'ملغي') {
    res.status(400);
    throw new Error('لا يمكن إلغاء الطلب في حالته الحالية');
  }
  
  order.status = 'ملغي';
  
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

/**
 * @desc    تقييم طلب مكتمل
 * @route   PUT /api/orders/:id/rate
 * @access  Private
 */
const rateOrder = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('الطلب غير موجود');
  }
  
  // التحقق من ملكية الطلب
  if (order.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('غير مصرح بالوصول');
  }
  
  // التحقق من أن الطلب مكتمل
  if (order.status !== 'تم التسليم') {
    res.status(400);
    throw new Error('يمكن تقييم الطلبات المكتملة فقط');
  }
  
  // التحقق من أن الطلب لم يتم تقييمه من قبل
  if (order.isRated) {
    res.status(400);
    throw new Error('تم تقييم هذا الطلب مسبقاً');
  }
  
  // تحديث الطلب
  order.isRated = true;
  
  // تحديث تقييم المنتج
  const product = await Product.findById(order.productId);
  
  if (product) {
    product.numReviews = product.numReviews + 1;
    product.rating = ((product.rating * (product.numReviews - 1)) + Number(rating)) / product.numReviews;
    
    await product.save();
  }
  
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  rateOrder,
};