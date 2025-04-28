// backend/controllers/admin/dataController.js
const asyncHandler = require('express-async-handler');
const User = require('../../models/User');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const ProfessionalService = require('../../models/ProfessionalService');
const Measurement = require('../../models/Measurement');

// @desc    الحصول على إحصائيات النظام
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const [usersCount, productsCount, ordersCount, servicesCount] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    ProfessionalService.countDocuments()
  ]);
  
  res.json({
    users: usersCount,
    products: productsCount,
    orders: ordersCount,
    services: servicesCount
  });
});

// @desc    تصدير بيانات حسب النوع
// @route   GET /api/admin/export/:type
// @access  Private/Admin
const exportData = asyncHandler(async (req, res) => {
  const { type } = req.params;
  let data = [];
  
  switch (type) {
    case 'users':
      data = await User.find().select('-password');
      break;
    case 'products':
      data = await Product.find();
      break;
    case 'orders':
      data = await Order.find();
      break;
    case 'services':
      data = await ProfessionalService.find();
      break;
    case 'measurements':
      data = await Measurement.find();
      break;
    default:
      return res.status(400).json({ message: 'نوع البيانات غير صالح' });
  }
  
  // تنسيق البيانات للتصدير
  const exportData = {
    exportedAt: new Date(),
    type,
    count: data.length,
    data
  };
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=${type}_export_${Date.now()}.json`);
  res.json(exportData);
});

module.exports = {
  getStats,
  exportData
};