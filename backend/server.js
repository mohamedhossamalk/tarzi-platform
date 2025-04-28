// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middleware/error');
const path = require('path');
const fs = require('fs');

// ============== تهيئة المتغيرات البيئية ==============
// تحميل متغيرات البيئة مرة واحدة فقط
dotenv.config();

// التحقق من متغيرات البيئة الرئيسية
console.log('التحقق من متغيرات البيئة:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI موجود؟', !!process.env.MONGO_URI);

// تصحيح MongoDB URI إذا كان مكرراً
let MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI && MONGO_URI.includes('MONGO_URI=')) {
  const matches = MONGO_URI.match(/(mongodb:\/\/|mongodb\+srv:\/\/)([^=]+)/);
  if (matches && matches.length >= 3) {
    const correctedURI = matches[1] + matches[2];
    console.log('⚠️ تصحيح MONGO_URI:');
    MONGO_URI = correctedURI;
    process.env.MONGO_URI = correctedURI;
  }
}

// عرض بداية عنوان MongoDB بشكل آمن (بدون كشف كلمة المرور)
console.log('MONGO_URI بعد التصحيح:', 
  MONGO_URI ? MONGO_URI.replace(/:([^:@]+)@/, ':****@').substring(0, 50) + '...' : 'غير موجود'
);

// ============== الاتصال بقاعدة البيانات ==============
// دالة محسنة للاتصال بقاعدة البيانات مع خيار محلي احتياطي
const connectDB = async () => {
  // إعدادات Mongoose المشتركة
  mongoose.set('strictQuery', true);
  
  // خيارات الاتصال
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 ثوانٍ قبل الفشل
    maxPoolSize: 10,
  };

  try {
    // محاولة الاتصال بـ MongoDB Atlas
    if (MONGO_URI && MONGO_URI.startsWith('mongodb')) {
      try {
        console.log('🔄 محاولة الاتصال بـ MongoDB Atlas...');
        const conn = await mongoose.connect(MONGO_URI, options);
        console.log(`✅ اتصال ناجح بـ MongoDB Atlas: ${conn.connection.host}`);
        return;
      } catch (atlasError) {
        console.error('❌ فشل الاتصال بـ MongoDB Atlas:', atlasError.message);
        console.log('أسباب شائعة للفشل:');
        console.log('1. عنوان IP الخاص بك غير مدرج في قائمة السماح في MongoDB Atlas');
        console.log('2. مشكلة في اتصال الشبكة أو جدار الحماية');
        console.log('3. كلمة المرور أو اسم المستخدم غير صحيح');
        
        // محاولة استخدام قاعدة بيانات محلية كبديل
        console.log('🔄 محاولة الاتصال بقاعدة بيانات محلية كبديل...');
      }
    } else {
      console.warn('⚠️ رابط MONGO_URI غير صالح، استخدام قاعدة بيانات محلية بدلاً من ذلك');
    }
    
    // محاولة الاتصال بقاعدة بيانات محلية
    try {
      const localUri = 'mongodb://localhost:27017/tarzi';
      const conn = await mongoose.connect(localUri, options);
      console.log(`✅ اتصال ناجح بقاعدة البيانات المحلية: ${conn.connection.host}`);
    } catch (localError) {
      console.error('❌ فشل الاتصال بقاعدة البيانات المحلية:', localError.message);
      console.log('⚠️ تشغيل التطبيق مع خدمة بيانات مؤقتة في الذاكرة');
      console.log('🔑 يمكنك استخدام: test@example.com / password123 للدخول');
      
      // هنا يمكن تهيئة خدمة بيانات بديلة في الذاكرة
      global.inMemoryDB = {
        enabled: true,
        users: [
          {
            _id: '1',
            username: 'مستخدم_اختباري',
            email: 'test@example.com',
            password: '$2a$10$XlA.Ntxv.vUtO5RSN4m.4eHsaA97/DYs2EXuKaqNUxYyOfLO.liiK', // password123
            role: 'user'
          },
          {
            _id: '2',
            username: 'مسؤول',
            email: 'admin@example.com',
            password: '$2a$10$XlA.Ntxv.vUtO5RSN4m.4eHsaA97/DYs2EXuKaqNUxYyOfLO.liiK', // password123
            role: 'admin'
          }
        ],
        products: [],
        orders: []
      };
    }
  } catch (error) {
    console.error('❌ خطأ عام في الاتصال بقاعدة البيانات:', error);
    process.exit(1);
  }
};

// ============== إنشاء التطبيق وتهيئته ==============
const app = express();

// إعدادات CORS المحسنة
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || 'http://localhost:3000']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// تطبيق Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// إنشاء مجلد التحميل إذا لم يكن موجودًا
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// المسارات الثابتة
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// مسار فحص الصحة
app.get('/api/health-check', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'متصل' : 'غير متصل',
    inMemoryMode: !!global.inMemoryDB?.enabled
  });
});

// ============== مسارات API ==============
// إضافة معلومات قاعدة البيانات إلى req
app.use((req, res, next) => {
  req.dbStatus = {
    connected: mongoose.connection.readyState === 1,
    inMemoryMode: !!global.inMemoryDB?.enabled
  };
  next();
});

// تعريف مسارات API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/measurements', require('./routes/measurements'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/professionalservices', require('./routes/professionalService'));

// ============== الصفحات الثابتة وإعادة التوجيه ==============
if (process.env.NODE_ENV === 'production') {
  // الدليل الذي يحتوي على ملفات واجهة المستخدم المُجمعة
  const frontendBuildPath = path.join(__dirname, '../frontend/build');
  
  if (fs.existsSync(frontendBuildPath)) {
    // خدمة الملفات الثابتة
    app.use(express.static(frontendBuildPath));
    
    // أي مسار غير API يوجه إلى index.html
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
    });
  } else {
    console.warn('تحذير: مجلد build للواجهة الأمامية غير موجود.');
  }
} else {
  // في بيئة التطوير
  
  // صفحة الترحيب للجذر
  app.get('/api', (req, res) => {
    // معلومات عن حالة الاتصال بقاعدة البيانات
    const dbStatus = mongoose.connection.readyState === 1 
      ? '<span style="color: green;">متصل ✓</span>' 
      : '<span style="color: red;">غير متصل ✗</span>';
    
    const dbMode = global.inMemoryDB?.enabled 
      ? '<span style="color: orange;">وضع الذاكرة المؤقتة</span>'
      : '<span style="color: green;">قاعدة بيانات حقيقية</span>';
    
    res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px; direction: rtl;">
        <h1>منصة ترزي - واجهة برمجة التطبيقات</h1>
        <p>API يعمل بنجاح في بيئة ${process.env.NODE_ENV || 'development'}</p>
        <p>حالة قاعدة البيانات: ${dbStatus} (${dbMode})</p>
        <p style="margin-top: 20px; color: #666;">وقت التشغيل: ${new Date().toLocaleString('ar-SA')}</p>
        ${global.inMemoryDB?.enabled ? `
          <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffeeba; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #856404;">وضع الذاكرة المؤقتة نشط</h3>
            <p>يمكنك استخدام بيانات الاعتماد التالية للدخول:</p>
            <ul style="text-align: right; display: inline-block;">
              <li><strong>البريد الإلكتروني:</strong> test@example.com</li>
              <li><strong>كلمة المرور:</strong> password123</li>
            </ul>
          </div>
        ` : ''}
      </div>
    `);
  });
  
  // إعادة توجيه طلبات الواجهة الأمامية في بيئة التطوير
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.redirect(`http://localhost:3000${req.originalUrl}`);
    } else {
      res.status(404).json({ message: 'API Endpoint not found' });
    }
  });
}

// ============== معالجة الأخطاء ==============
app.use(notFound);
app.use(errorHandler);

// ============== معالجة الإغلاق بأمان ==============
process.on('SIGTERM', () => {
  console.log('👋 تم استلام إشارة SIGTERM، يتم إغلاق الخادم بأمان');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 تم استلام إشارة SIGINT، يتم إغلاق الخادم بأمان');
  process.exit(0);
});

// ============== بدء تشغيل الخادم ==============
// بدء الاتصال بقاعدة البيانات أولاً ثم تشغيل الخادم
const startServer = async () => {
  try {
    // محاولة الاتصال بقاعدة البيانات
    await connectDB();
    
    // تشغيل الخادم
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
      console.log(`📅 تم بدء التشغيل في ${new Date().toLocaleString('ar-SA')}`);
      console.log(`🌐 واجهة API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ فشل بدء التشغيل:', error);
    process.exit(1);
  }
};

// بدء التشغيل
startServer();
