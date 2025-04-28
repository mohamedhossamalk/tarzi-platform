// backend/config/db.js
const mongoose = require('mongoose');

// التعامل مع التحذيرات
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    // طباعة معلومات الاتصال (مع إخفاء كلمة المرور للأمان)
    const mongoUriForLog = process.env.MONGO_URI
      ? process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@')
      : 'غير متوفر';
      
    console.log('جاري الاتصال بقاعدة بيانات MongoDB Atlas...');
    console.log('عنوان الاتصال:', mongoUriForLog);
    
    // خيارات إضافية لتحسين الاتصال بـ MongoDB Atlas
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // الحد الأقصى لعدد الاتصالات المتزامنة
      socketTimeoutMS: 45000, // مهلة التوقف للعمليات
      serverSelectionTimeoutMS: 10000, // مهلة اختيار الخادم
      family: 4 // استخدام IPv4 بدلاً من IPv6
    };
    
    // الاتصال بقاعدة البيانات
    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`🔌 اتصال ناجح بقاعدة البيانات: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ خطأ في الاتصال بقاعدة البيانات: ${error.message}`);
    console.error('تفاصيل الخطأ:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
