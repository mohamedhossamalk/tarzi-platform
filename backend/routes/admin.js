// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const { 
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
} = require('../controllers/admin');
const { protect, admin } = require('../middleware/auth');

// التأكد من حماية جميع مسارات المسؤول
router.use(protect);
router.use(admin);

// مسارات المستخدمين
router.route('/users').get(getUsers);
router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// مسارات المنتجات
router.route('/products').get(getProducts).post(createProduct);
router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

// مسارات الطلبات
router.route('/orders').get(getOrders);
router.route('/orders/:id')
  .get(getOrderById)
  .put(updateOrder);

// مسارات الإحصائيات
router.route('/statistics').get(getStatistics);

// مسار الصحة للتأكد من عمل واجهة المسؤول
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'Admin API is working correctly',
    timestamp: new Date()
  });
});

module.exports = router;