// backend/routes/measurements.js
const express = require('express');
const {
  createMeasurement,
  getMeasurements,
  getMeasurementById,
  updateMeasurement,
  deleteMeasurement,
  setDefaultMeasurement
} = require('../controllers/measurements');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createMeasurement)
  .get(protect, getMeasurements);

router.route('/:id')
  .get(protect, getMeasurementById)
  .put(protect, updateMeasurement)
  .delete(protect, deleteMeasurement);

router.route('/:id/default')
  .put(protect, setDefaultMeasurement);

module.exports = router;