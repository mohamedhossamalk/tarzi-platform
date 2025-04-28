// backend/routes/professionalService.js
const express = require('express');
const {
  createProfessionalService,
  getMyServices,
  getProfessionalServiceById,
  updateProfessionalService,
  cancelProfessionalService,
  getAllProfessionalServices
} = require('../controllers/professionalService');
const { protect, admin, tailor } = require('../middleware/auth');

const router = express.Router();

// مسارات المستخدمين العاديين
router.route('/')
  .post(protect, createProfessionalService);

router.route('/myservices')
  .get(protect, getMyServices);

router.route('/:id')
  .get(protect, getProfessionalServiceById)
  .put(protect, updateProfessionalService);

router.route('/:id/cancel')
  .put(protect, cancelProfessionalService);

// مسارات المسؤول والخياط
router.route('/all')
  .get(protect, getAllProfessionalServices);

module.exports = router;