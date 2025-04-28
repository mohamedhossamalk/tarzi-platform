// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * وسيط لحماية المسارات التي تتطلب تسجيل الدخول
 * يتحقق من وجود توكن صالح ويضيف معلومات المستخدم إلى الطلب
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // فحص وجود التوكن في رؤوس الطلب
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // استخراج التوكن
      token = req.headers.authorization.split(' ')[1];

      // سجل للتشخيص
      console.log(`🔐 التحقق من التوكن: ${token.substring(0, 10)}...`);

      // التحقق من صحة التوكن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      console.log(`✅ تم التحقق من التوكن بنجاح. معرف المستخدم: ${decoded.id}`);

      // جلب بيانات المستخدم بدون كلمة المرور
      req.user = await User.findById(decoded.id).select('-password');

      // إذا لم يتم العثور على المستخدم في قاعدة البيانات
      if (!req.user) {
        console.log(`❌ لم يتم العثور على المستخدم بالمعرف: ${decoded.id}`);
        res.status(401);
        throw new Error('غير مصرح به، المستخدم غير موجود');
      }

      // التحقق من حالة المستخدم
      if (req.user.isActive === false) {
        console.log(`🚫 المستخدم ${req.user._id} (${req.user.email}) غير نشط`);
        res.status(403);
        throw new Error('تم تعطيل حسابك. يرجى التواصل مع الإدارة للمساعدة.');
      }

      // تحديث آخر نشاط للمستخدم (اختياري، يمكن تعليقه إذا لم يكن مطلوبًا)
      /*
      req.user.lastActive = Date.now();
      await req.user.save({ validateBeforeSave: false });
      */

      console.log(`👤 تم التعرف على المستخدم: ${req.user.username} (${req.user.role})`);
      next();
    } catch (error) {
      console.error('❌ خطأ في المصادقة:', error.message);
      
      // رسائل خطأ أكثر تفصيلاً بناءً على نوع الخطأ
      if (error.name === 'JsonWebTokenError') {
        res.status(401);
        throw new Error('غير مصرح به، التوكن غير صالح');
      } else if (error.name === 'TokenExpiredError') {
        res.status(401);
        throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
      } else {
        res.status(401);
        throw new Error('فشل المصادقة، يرجى تسجيل الدخول مرة أخرى');
      }
    }
  } else {
    // لا يوجد توكن في رؤوس الطلب
    const requestPath = req.originalUrl || req.url;
    console.log(`🔒 طلب بدون توكن مصادقة: ${requestPath}`);
    res.status(401);
    throw new Error('غير مصرح به، لا يوجد توكن');
  }
});

/**
 * وسيط لحماية المسارات التي تتطلب صلاحيات المسؤول فقط
 * يجب استخدامه بعد وسيط protect
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log(`👑 صلاحيات المسؤول مؤكدة: ${req.user.email}`);
    next();
  } else {
    console.log(`🚫 محاولة وصول بدون صلاحيات مسؤول: ${req.user?.email || 'مستخدم غير مسجل'}`);
    res.status(403);
    throw new Error('غير مصرح به، مطلوب صلاحيات مسؤول');
  }
};

/**
 * وسيط لحماية المسارات التي تتطلب صلاحيات الخياط أو المسؤول
 * يجب استخدامه بعد وسيط protect
 */
const tailor = (req, res, next) => {
  if (req.user && (req.user.role === 'tailor' || req.user.role === 'admin')) {
    console.log(`✂️ صلاحيات الخياط مؤكدة: ${req.user.email} (${req.user.role})`);
    next();
  } else {
    console.log(`🚫 محاولة وصول بدون صلاحيات خياط: ${req.user?.email || 'مستخدم غير مسجل'}`);
    res.status(403);
    throw new Error('غير مصرح به، مطلوب صلاحيات خياط');
  }
};

/**
 * وسيط للتحقق من ملكية المورد
 * يستخدم للتأكد من أن المستخدم يملك المورد أو لديه صلاحيات المسؤول
 * @param {string} modelField - اسم حقل المستخدم في نموذج المورد (افتراضي: 'userId')
 */
const checkOwnership = (modelField = 'userId') => {
  return asyncHandler(async (req, res, next) => {
    // يجب أن يكون المستخدم مصادقاً بالفعل (استخدم protect أولاً)
    if (!req.user) {
      res.status(401);
      throw new Error('المصادقة مطلوبة');
    }

    // إذا كان المستخدم مسؤولاً، السماح بالوصول
    if (req.user.role === 'admin') {
      next();
      return;
    }

    // الحصول على معرف المورد من معلمات الطلب
    const resourceId = req.params.id;
    if (!resourceId) {
      res.status(400);
      throw new Error('معرف المورد مطلوب');
    }

    // الحصول على نموذج المورد من req.resource (يجب تعيينه في معالج المسار قبل استدعاء هذا الوسيط)
    const resource = req.resource;

    // التحقق إذا كان المستخدم هو مالك المورد
    const ownerId = resource[modelField].toString();
    const userId = req.user._id.toString();

    if (ownerId !== userId) {
      console.log(`🚫 محاولة وصول غير مصرح به: المستخدم ${userId} يحاول الوصول إلى مورد يملكه ${ownerId}`);
      res.status(403);
      throw new Error('غير مصرح به، لا تملك صلاحية الوصول إلى هذا المورد');
    }

    next();
  });
};

module.exports = { protect, admin, tailor, checkOwnership };
