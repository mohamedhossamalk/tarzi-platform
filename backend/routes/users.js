// backend/routes/users.js
const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ملاحظة: ستُستخدم هذه المسارات لعمليات المستخدم الخاصة في المستقبل
// حاليًا، يتم التعامل مع معظم عمليات المستخدمين من خلال مسارات المصادقة وخدمات أخرى

// نقطة نهاية للتحقق من صحة التوكن
router.get('/verify-token', protect, (req, res) => {
  res.json({
    success: true,
    message: 'توكن صالح',
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

module.exports = router;