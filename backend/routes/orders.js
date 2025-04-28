// backend/routes/orders.js
const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  rateOrder
} = require('../controllers/orders');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, getOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/cancel')
  .put(protect, cancelOrder);

router.route('/:id/rate')
  .put(protect, rateOrder);

module.exports = router;