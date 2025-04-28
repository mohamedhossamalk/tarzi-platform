// backend/controllers/admin.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ProfessionalService = require('../models/ProfessionalService');

/**
 * @desc    الحصول على جميع المستخدمين
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

/**
 * @desc    الحصول على مستخدم محدد
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }
});

/**
 * @desc    تحديث مستخدم
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      phone: updatedUser.phone,
      address: updatedUser.address,
      city: updatedUser.city,
    });
  } else {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }
});

/**
 * @desc    حذف مستخدم
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    if (user._id.equals(req.user._id)) {
      res.status(400);
      throw new Error('لا يمكن حذف الحساب الحالي');
    }
    
    await user.remove();
    res.json({ message: 'تم حذف المستخدم' });
  } else {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }
});

/**
 * @desc    الحصول على جميع المنتجات
 * @route   GET /api/admin/products
 * @access  Private/Admin
 */
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
});

/**
 * @desc    إنشاء منتج جديد
 * @route   POST /api/admin/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const { 
    name, 
    description, 
    category, 
    price, 
    imageUrl, 
    images, 
    fabricOptions, 
    colorOptions, 
    isFeatured 
  } = req.body;
  
  const product = await Product.create({
    name,
    description,
    category,
    price,
    imageUrl,
    images: images || [],
    fabricOptions,
    colorOptions,
    isFeatured: isFeatured || false,
    createdBy: req.user._id,
  });
  
  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error('بيانات المنتج غير صالحة');
  }
});

/**
 * @desc    تحديث منتج
 * @route   PUT /api/admin/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { 
    name, 
    description, 
    category, 
    price, 
    imageUrl, 
    images, 
    fabricOptions, 
    colorOptions, 
    isActive, 
    isFeatured 
  } = req.body;
  
  const product = await Product.findById(req.params.id);
  
  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price !== undefined ? price : product.price;
    product.imageUrl = imageUrl || product.imageUrl;
    product.images = images || product.images;
    product.fabricOptions = fabricOptions || product.fabricOptions;
    product.colorOptions = colorOptions || product.colorOptions;
    product.isActive = isActive !== undefined ? isActive : product.isActive;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }
});

/**
 * @desc    حذف منتج
 * @route   DELETE /api/admin/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    await product.remove();
    res.json({ message: 'تم حذف المنتج' });
  } else {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }
});

/**
 * @desc    الحصول على جميع الطلبات
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('userId', 'username email')
    .populate('productId', 'name price')
    .sort({ createdAt: -1 });
  
  res.json(orders);
});

/**
 * @desc    الحصول على طلب محدد
 * @route   GET /api/admin/orders/:id
 * @access  Private/Admin
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('userId', 'username email phone')
    .populate('productId', 'name description price imageUrl')
    .populate('measurementId', 'name chest waist hips shoulderWidth sleeveLength')
    .populate('assignedTailor', 'username email');
  
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('الطلب غير موجود');
  }
});
// backend/controllers/admin.js (تتمة)
/**
 * @desc    تحديث طلب
 * @route   PUT /api/admin/orders/:id
 * @access  Private/Admin
 */
const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (order) {
    order.status = req.body.status || order.status;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    order.paymentMethod = req.body.paymentMethod || order.paymentMethod;
    order.expectedDeliveryDate = req.body.expectedDeliveryDate || order.expectedDeliveryDate;
    order.notes = req.body.notes !== undefined ? req.body.notes : order.notes;
    order.assignedTailor = req.body.assignedTailor || order.assignedTailor;
    
    if (req.body.paymentStatus === 'مدفوع' && !order.paymentDate) {
      order.paymentDate = new Date();
    }
    
    if (req.body.status === 'تم التسليم' && !order.actualDeliveryDate) {
      order.actualDeliveryDate = new Date();
    }
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('الطلب غير موجود');
  }
});

/**
 * @desc    الحصول على إحصائيات عامة
 * @route   GET /api/admin/statistics
 * @access  Private/Admin
 */
const getStatistics = asyncHandler(async (req, res) => {
  // إحصائيات المستخدمين
  const totalUsers = await User.countDocuments({});
  const totalCustomers = await User.countDocuments({ role: 'user' });
  const totalTailors = await User.countDocuments({ role: 'tailor' });
  
  // إحصائيات المنتجات
  const totalProducts = await Product.countDocuments({});
  const activeProducts = await Product.countDocuments({ isActive: true });
  
  // إحصائيات الطلبات
  const totalOrders = await Order.countDocuments({});
  const pendingOrders = await Order.countDocuments({ status: { $in: ['جديد', 'قيد المراجعة', 'قيد التنفيذ'] } });
  const completedOrders = await Order.countDocuments({ status: 'تم التسليم' });
  const canceledOrders = await Order.countDocuments({ status: { $in: ['مرفوض', 'ملغي'] } });
  
  // إحصائيات مالية
  const revenue = await Order.aggregate([
    { $match: { status: 'تم التسليم', paymentStatus: 'مدفوع' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  const totalRevenue = revenue.length > 0 ? revenue[0].total : 0;
  
  // إحصائيات الخدمات الاحترافية
  const totalServices = await ProfessionalService.countDocuments({});
  const pendingServices = await ProfessionalService.countDocuments({ status: { $in: ['جديد', 'قيد المراجعة', 'تم قبول الطلب'] } });
  const inProgressServices = await ProfessionalService.countDocuments({ status: 'قيد التنفيذ' });
  const completedServices = await ProfessionalService.countDocuments({ status: 'مكتمل' });
  
  // إحصائيات لآخر 7 أيام
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
  const newOrders = await Order.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
  const recentRevenue = await Order.aggregate([
    { $match: { status: 'تم التسليم', paymentStatus: 'مدفوع', updatedAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  const recentRevenueTotal = recentRevenue.length > 0 ? recentRevenue[0].total : 0;
  
  res.json({
    users: {
      total: totalUsers,
      customers: totalCustomers,
      tailors: totalTailors,
      newUsersLast7Days: newUsers
    },
    products: {
      total: totalProducts,
      active: activeProducts
    },
    orders: {
      total: totalOrders,
      pending: pendingOrders,
      completed: completedOrders,
      canceled: canceledOrders,
      newOrdersLast7Days: newOrders
    },
    professionalServices: {
      total: totalServices,
      pending: pendingServices,
      inProgress: inProgressServices,
      completed: completedServices
    },
    financial: {
      totalRevenue,
      revenueLast7Days: recentRevenueTotal
    }
  });
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrderById,
  updateOrder,
  getStatistics
};