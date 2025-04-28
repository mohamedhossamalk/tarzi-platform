// backend/controllers/products.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

/**
 * @desc    الحصول على كل المنتجات
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.page) || 1;
  const category = req.query.category || '';
  const keyword = req.query.keyword || '';
  
  const categoryFilter = category ? { category } : {};
  const keywordFilter = keyword ? {
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ],
  } : {};
  
  const filter = {
    isActive: true,
    ...categoryFilter,
    ...keywordFilter,
  };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

/**
 * @desc    الحصول على منتج بالمعرف
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }
});

/**
 * @desc    الحصول على كل فئات المنتجات المتاحة
 * @route   GET /api/products/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json({ categories });
});

/**
 * @desc    الحصول على المنتجات المميزة
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(6);
  
  res.json(products);
});

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  getFeaturedProducts
};