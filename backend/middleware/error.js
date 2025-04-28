// backend/middleware/error.js
// وسيط للتعامل مع المسارات غير الموجودة
const notFound = (req, res, next) => {
  const error = new Error(`غير موجود - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// وسيط لمعالجة الأخطاء
const errorHandler = (err, req, res, next) => {
  // تحديد رمز الحالة (إذا كان 200 فهو خطأ في الخادم)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // تعيين رمز الحالة للاستجابة
  res.status(statusCode);
  
  // إرسال معلومات الخطأ بصيغة JSON
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    error: true
  });
};

module.exports = { notFound, errorHandler };