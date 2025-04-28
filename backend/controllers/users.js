// backend/controllers/users.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    تحديث الملف الشخصي
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    // تحديث البيانات المتغيرة
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    // التحقق من عدم وجود مستخدم آخر بنفس البريد الإلكتروني
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error('البريد الإلكتروني مستخدم بالفعل');
      }
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
    });
  } else {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }
});

// @desc    تغيير كلمة المرور
// @route   PUT /api/users/changepassword
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    // التحقق من كلمة المرور الحالية
    const isMatch = await user.matchPassword(req.body.currentPassword);
    
    if (!isMatch) {
      res.status(401);
      throw new Error('كلمة المرور الحالية غير صحيحة');
    }
    
    // تحديث كلمة المرور
    user.password = req.body.newPassword;
    await user.save();
    
    res.json({ message: 'تم تغيير كلمة المرور بنجاح' });
  } else {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }
});

module.exports = { updateProfile, changePassword };