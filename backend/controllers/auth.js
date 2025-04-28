// backend/controllers/auth.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * @desc    تسجيل مستخدم جديد
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, phone } = req.body;
  
  console.log(`محاولة تسجيل مستخدم جديد: ${email}`);

  // التحقق من وجود المستخدم
  const userExists = await User.findOne({ email });

  if (userExists) {
    console.log(`المستخدم موجود بالفعل: ${email}`);
    res.status(400);
    throw new Error('المستخدم موجود بالفعل');
  }

  // إنشاء مستخدم جديد
  try {
    const user = await User.create({
      username,
      email,
      password,
      phone,
    });

    if (user) {
      console.log(`تم إنشاء المستخدم بنجاح: ${user._id} (${email})`);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: user.getSignedJwtToken(),
      });
    } else {
      console.log('فشل في إنشاء المستخدم - لم يتم إرجاع بيانات المستخدم');
      res.status(400);
      throw new Error('بيانات المستخدم غير صالحة');
    }
  } catch (error) {
    console.error(`خطأ في تسجيل المستخدم:`, error);
    res.status(400);
    throw new Error(error.message || 'بيانات المستخدم غير صالحة');
  }
});

/**
 * @desc    تسجيل الدخول
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  console.log('✳️ بدء محاولة تسجيل دخول جديدة');
  
  const { email, password } = req.body;
  
  console.log(`📧 بريد إلكتروني: ${email}`);
  console.log(`🔐 تم توفير كلمة مرور: ${password ? 'نعم' : 'لا'}`);

  // التحقق من وجود المستخدم
  const user = await User.findOne({ email });

  if (!user) {
    console.log(`❌ المستخدم غير موجود: ${email}`);
    res.status(401);
    throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }

  console.log(`✅ تم العثور على المستخدم: ${user._id} (${user.username})`);
  
  // مقارنة كلمة المرور
  try {
    console.log('⏳ جاري التحقق من كلمة المرور...');
    const isMatch = await user.matchPassword(password);
    
    console.log(`🔑 نتيجة التحقق من كلمة المرور: ${isMatch ? 'صحيحة ✓' : 'غير صحيحة ✗'}`);
    
    if (isMatch) {
      // تحديث آخر تسجيل دخول
      user.lastLogin = Date.now();
      await user.save();

      // إنشاء التوكن
      const token = user.getSignedJwtToken();
      console.log(`🎟️ تم إنشاء التوكن بنجاح${token ? ' ✓' : ' ✗'}`);

      console.log(`🟢 تسجيل دخول ناجح: ${user._id} (${user.email})`);
      
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: token,
      });
    } else {
      console.log(`❌ كلمة المرور غير صحيحة للمستخدم: ${email}`);
      res.status(401);
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  } catch (error) {
    console.error(`❌ خطأ أثناء مقارنة كلمة المرور:`, error);
    res.status(401);
    throw new Error('حدث خطأ أثناء عملية تسجيل الدخول');
  }
});

/**
 * @desc    الحصول على بيانات المستخدم الحالي
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }
});

/**
 * @desc    تحديث بيانات المستخدم الشخصية
 * @route   PUT /api/auth/updateprofile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      city: updatedUser.city,
      token: updatedUser.getSignedJwtToken(),
    });
  } else {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }
});

/**
 * @desc    اختبار المصادقة
 * @route   GET /api/auth/test
 * @access  Public
 */
const testAuth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'نقطة نهاية المصادقة تعمل بشكل صحيح',
    timestamp: new Date().toISOString()
  });
};

/**
 * @desc    اختبار التحقق من كلمة المرور
 * @route   POST /api/auth/test-password
 * @access  Public (للتشخيص فقط، يجب إزالته في بيئة الإنتاج)
 */
const testPassword = asyncHandler(async (req, res) => {
  const { email, testPassword } = req.body;
  
  // للأمان، لا نريد طباعة كلمة المرور في السجلات
  console.log(`🔍 اختبار كلمة المرور للمستخدم: ${email}`);
  
  if (!email || !testPassword) {
    return res.status(400).json({
      success: false,
      message: 'الرجاء تقديم البريد الإلكتروني وكلمة المرور'
    });
  }
  
  // البحث عن المستخدم
  const user = await User.findOne({ email });
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'لم يتم العثور على المستخدم',
      email: email
    });
  }
  
  try {
    // التحقق من كلمة المرور
    console.log('⏳ جاري اختبار مقارنة كلمة المرور...');
    const isMatch = await user.matchPassword(testPassword);
    
    console.log(`🔑 نتيجة اختبار كلمة المرور: ${isMatch ? 'صحيحة ✓' : 'غير صحيحة ✗'}`);
    
    return res.json({
      success: true,
      message: 'تم اختبار كلمة المرور بنجاح',
      isMatch,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      passwordInfo: {
        hashedPasswordLength: user.password ? user.password.length : 0,
        providedPasswordLength: testPassword.length
      }
    });
  } catch (error) {
    console.error('❌ خطأ في اختبار كلمة المرور:', error);
    
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء اختبار كلمة المرور',
      error: error.message
    });
  }
});

/**
 * @desc    إنشاء حساب مستخدم اختباري
 * @route   POST /api/auth/test-account
 * @access  Public (للتشخيص فقط، يجب إزالته في بيئة الإنتاج)
 */
const createTestAccount = asyncHandler(async (req, res) => {
  // إنشاء حساب اختباري بكلمة مرور معروفة
  const testUser = {
    username: 'مستخدم_اختباري',
    email: 'test@example.com',
    password: 'Test@123',
    phone: '0123456789'
  };
  
  // التحقق مما إذا كان المستخدم موجودًا بالفعل
  const userExists = await User.findOne({ email: testUser.email });
  
  if (userExists) {
    // إعادة تعيين كلمة المرور إذا كان المستخدم موجودًا
    userExists.password = testUser.password;
    await userExists.save();
    
    return res.json({
      success: true,
      message: 'تم إعادة تعيين كلمة مرور الحساب الاختباري',
      user: {
        id: userExists._id,
        email: userExists.email,
        username: userExists.username
      },
      credentials: {
        email: testUser.email,
        password: testUser.password
      }
    });
  }
  
  // إنشاء المستخدم الاختباري
  const newUser = await User.create(testUser);
  
  res.status(201).json({
    success: true,
    message: 'تم إنشاء حساب اختباري',
    user: {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username
    },
    credentials: {
      email: testUser.email,
      password: testUser.password
    }
  });
});

module.exports = { 
  registerUser, 
  loginUser, 
  getMe, 
  updateProfile,
  testAuth,
  testPassword,
  createTestAccount
};
