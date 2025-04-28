// backend/routes/products.js
const express = require('express');
const {
  getProducts,
  getProductById,
  getCategories,
  getFeaturedProducts
} = require('../controllers/products');

const router = express.Router();

router.route('/').get(getProducts);
router.route('/categories').get(getCategories);
router.route('/featured').get(getFeaturedProducts);
router.route('/:id').get(getProductById);

module.exports = router;