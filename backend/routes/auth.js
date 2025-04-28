// backend/routes/auth.js
const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  testAuth,
  testPassword,
  createTestAccount
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

// الطرق العامة
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/test').get(testAuth);

// الطرق الخاصة (تتطلب المصادقة)
router.route('/me').get(protect, getMe);
router.route('/updateprofile').put(protect, updateProfile);

// طرق التشخيص (يجب إزالتها في بيئة الإنتاج)
if (process.env.NODE_ENV !== 'production') {
  router.route('/test-password').post(testPassword);
  router.route('/test-account').post(createTestAccount);
  
  console.log('⚠️ تم تمكين طرق التشخيص: /api/auth/test-password و /api/auth/test-account');
  console.log('⚠️ تأكد من تعطيل هذه الطرق في بيئة الإنتاج!');
}

module.exports = router;
