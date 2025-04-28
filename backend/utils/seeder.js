// backend/utils/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const colors = require('colors'); // إضافة ألوان للتنسيق (قم بتثبيت الحزمة إذا لم تكن موجودة: npm install colors)

// تحميل متغيرات البيئة
dotenv.config();

// تكوين السجل الملون
colors.setTheme({
  info: 'green',
  warn: 'yellow',
  error: 'red',
  success: 'cyan'
});

// اتصال بقاعدة البيانات
const connectDB = async () => {
  try {
    console.log('⏳ جاري الاتصال بقاعدة البيانات...'.warn);
    
    // التحقق من وجود رابط الاتصال
    if (!process.env.MONGO_URI) {
      throw new Error('رابط الاتصال بقاعدة البيانات (MONGO_URI) غير موجود في متغيرات البيئة');
    }
    
    // في بيئة التطوير، يمكن طباعة بداية الرابط للتحقق
    if (process.env.NODE_ENV !== 'production') {
      const mongoUriPreview = process.env.MONGO_URI.substring(0, 20) + '...';
      console.log(`🔌 رابط الاتصال: ${mongoUriPreview}`.info);
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ اتصال ناجح بقاعدة البيانات'.success);
  } catch (err) {
    console.error(`❌ خطأ في الاتصال بقاعدة البيانات: ${err.message}`.error);
    process.exit(1);
  }
};

// بيانات المسؤول المحدثة
const adminUser = {
  username: 'admin',
  email: 'admin@tarzi.com',
  password: 'Admin@123', // كلمة مرور أقوى
  role: 'admin',
  phone: '0123456789',
};

// بيانات مستخدم عادي
const regularUser = {
  username: 'محمد',
  email: 'user@tarzi.com',
  password: 'User@123',
  role: 'user',
  phone: '0123456788',
};

// بيانات المنتجات المحدثة مع صور حقيقية
const products = [
  {
    name: 'قميص كلاسيك أبيض',
    description: 'قميص كلاسيكي بقصة أنيقة من القطن المصري عالي الجودة. مناسب للمناسبات الرسمية والعمل اليومي. يتميز بتفاصيل دقيقة وخياطة ممتازة.',
    category: 'قميص',
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1025&auto=format&fit=crop',
    price: 350,
    fabricOptions: ['قطن مصري', 'قطن بيما', 'قطن أكسفورد', 'بوبلين'],
    colorOptions: ['أبيض', 'أزرق فاتح', 'أزرق سماوي', 'وردي فاتح'],
  },
  {
    name: 'بنطلون كلاسيك أسود',
    description: 'بنطلون كلاسيكي بقصة مستقيمة مصنوع من مزيج الصوف والبوليستر لمظهر أنيق ومريح. مثالي للمناسبات الرسمية واجتماعات العمل.',
    category: 'بنطلون',
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1287&auto=format&fit=crop',
    price: 420,
    fabricOptions: ['صوف 100%', 'مزيج صوف وبوليستر', 'قطن تويل', 'غابردين'],
    colorOptions: ['أسود', 'كحلي', 'رمادي فحمي', 'رمادي فاتح', 'بني داكن'],
  },
  {
    name: 'بدلة رسمية كاملة',
    description: 'بدلة رسمية كاملة بقصة إيطالية أنيقة مصنوعة من الصوف الفاخر. تشمل جاكيت وبنطلون متناسقين. مثالية للمناسبات الرسمية والحفلات الخاصة.',
    category: 'جاكيت',
    imageUrl: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1287&auto=format&fit=crop',
    price: 1500,
    fabricOptions: ['صوف إيطالي', 'صوف ميرينو', 'صوف وكشمير', 'حرير وصوف'],
    colorOptions: ['أسود', 'كحلي', 'رمادي', 'أزرق داكن'],
  },
  {
    name: 'قميص كاجوال',
    description: 'قميص كاجوال عصري مصنوع من القطن المريح. يتميز بأكمام قابلة للطي وقصة مريحة تناسب الإطلالات غير الرسمية والخروجات اليومية.',
    category: 'قميص',
    imageUrl: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1287&auto=format&fit=crop',
    price: 280,
    fabricOptions: ['قطن', 'دينيم خفيف', 'كتان', 'تويل قطني'],
    colorOptions: ['أزرق فاتح', 'أخضر زيتوني', 'برتقالي', 'أبيض'],
  },
  {
    name: 'فستان سهرة أنيق',
    description: 'فستان سهرة أنيق طويل مصمم من الساتان الفاخر مع تطريزات يدوية دقيقة. مثالي للحفلات الرسمية والمناسبات الخاصة.',
    category: 'فستان',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1530&auto=format&fit=crop',
    price: 1200,
    fabricOptions: ['ساتان', 'حرير', 'شيفون', 'كريب'],
    colorOptions: ['أسود', 'أحمر ياقوتي', 'ذهبي', 'فضي', 'أزرق ملكي'],
  },
  {
    name: 'تنورة قلم رصاص',
    description: 'تنورة قلم رصاص كلاسيكية بخصر مرتفع وشق خلفي. مصنوعة من مزيج القطن المرن لراحة مثالية طوال اليوم. مثالية للإطلالات الرسمية في العمل.',
    category: 'تنورة',
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1324&auto=format&fit=crop',
    price: 320,
    fabricOptions: ['قطن مرن', 'بوليستر', 'مزيج صوف', 'جاكار'],
    colorOptions: ['أسود', 'كحلي', 'بيج', 'رمادي', 'أحمر داكن'],
  },
  {
    name: 'ثوب رجالي تقليدي',
    description: 'ثوب رجالي فاخر بقصة عربية تقليدية مصنوع من القطن المصري عالي الجودة. مريح للغاية ومناسب للمناسبات الرسمية والتقليدية.',
    category: 'أخرى',
    imageUrl: 'https://images.unsplash.com/photo-1591370644363-2ba9a39070ea?q=80&w=1287&auto=format&fit=crop',
    price: 650,
    fabricOptions: ['قطن مصري', 'بوبلين فاخر', 'حرير قطني', 'كتان'],
    colorOptions: ['أبيض', 'بيج', 'رمادي فاتح', 'أزرق سماوي', 'أسود'],
  },
  {
    name: 'جاكيت جلد كاجوال',
    description: 'جاكيت جلد طبيعي بقصة كلاسيكية وبطانة دافئة. يتميز بتفاصيل مميزة وجيوب عملية. إطلالة عصرية تناسب مختلف المناسبات غير الرسمية.',
    category: 'جاكيت',
    imageUrl: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=1292&auto=format&fit=crop',
    price: 1800,
    fabricOptions: ['جلد طبيعي', 'جلد نابا', 'جلد صناعي فاخر'],
    colorOptions: ['أسود', 'بني داكن', 'بني كونياك', 'أحمر داكن'],
  },
  {
    name: 'قفطان مغربي مطرز',
    description: 'قفطان مغربي فاخر بتطريز يدوي متقن وأقمشة فاخرة. مثالي للمناسبات الخاصة والحفلات التقليدية. تصميم أصيل يجمع بين الفخامة والراحة.',
    category: 'فستان',
    imageUrl: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=1287&auto=format&fit=crop',
    price: 1500,
    fabricOptions: ['حرير', 'ساتان', 'شيفون مطرز', 'كريب'],
    colorOptions: ['ذهبي', 'أزرق تركواز', 'أرجواني', 'أخضر زمردي', 'فضي'],
  },
  {
    name: 'بنطلون جينز عصري',
    description: 'بنطلون جينز عصري بقصة مستقيمة وخامة قطنية مريحة. مناسب للإطلالات اليومية الكاجوال مع تفاصيل عصرية تمنحك مظهرًا متجددًا.',
    category: 'بنطلون',
    imageUrl: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=1335&auto=format&fit=crop',
    price: 380,
    fabricOptions: ['دينيم قطني', 'دينيم مرن', 'دينيم خفيف'],
    colorOptions: ['أزرق داكن', 'أزرق فاتح', 'أسود', 'رمادي'],
  }
];

// استيراد البيانات
const importData = async () => {
  try {
    console.log('⏳ جاري حذف البيانات السابقة...'.warn);
    
    // حذف البيانات الموجودة
    await User.deleteMany();
    await Product.deleteMany();
    
    // إنشاء كلمات مرور مشفرة
    const salt = await bcrypt.genSalt(10);
    const adminHashedPassword = await bcrypt.hash(adminUser.password, salt);
    const userHashedPassword = await bcrypt.hash(regularUser.password, salt);

    // إنشاء مستخدمين
    const createdAdmin = await User.create({
      ...adminUser,
      password: adminHashedPassword,
    });
    
    await User.create({
      ...regularUser,
      password: userHashedPassword,
    });
    
    console.log('✅ تم إنشاء المستخدمين بنجاح'.success);
    console.log(`👤 المسؤول: ${adminUser.email}`.info);
    console.log(`👤 مستخدم عادي: ${regularUser.email}`.info);

    // إضافة المنتجات
    console.log('⏳ جاري إضافة المنتجات...'.warn);
    
    const createdProducts = [];
    
    for (const product of products) {
      const createdProduct = await Product.create({
        ...product,
        createdBy: createdAdmin._id,
      });
      createdProducts.push(createdProduct);
    }

    console.log(`✅ تم إضافة ${createdProducts.length} منتج بنجاح`.success);

    console.log('\n🎉 تم استيراد جميع البيانات بنجاح!'.success);
    console.log(`👤 المستخدمين: ${await User.countDocuments()}`.info);
    console.log(`🛍️ المنتجات: ${await Product.countDocuments()}`.info);
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ خطأ أثناء استيراد البيانات: ${error.message}`.error);
    if (error.stack) {
      console.error(error.stack.error);
    }
    process.exit(1);
  }
};

// حذف البيانات
const destroyData = async () => {
  try {
    console.log('⏳ جاري حذف جميع البيانات...'.warn);
    
    // حذف البيانات
    await User.deleteMany();
    console.log('✅ تم حذف المستخدمين'.success);
    
    await Product.deleteMany();
    console.log('✅ تم حذف المنتجات'.success);

    console.log('\n🗑️ تم حذف جميع البيانات بنجاح'.success);
    process.exit(0);
  } catch (error) {
    console.error(`❌ خطأ أثناء حذف البيانات: ${error.message}`.error);
    process.exit(1);
  }
};

// تنفيذ الوظيفة الرئيسية
const runSeeder = async () => {
  try {
    // الاتصال بقاعدة البيانات أولاً
    await connectDB();
    
    // تحديد العملية المطلوبة
    if (process.argv[2] === '-d') {
      await destroyData();
    } else {
      await importData();
    }
  } catch (error) {
    console.error(`❌ خطأ غير متوقع: ${error}`.error);
    process.exit(1);
  }
};

// بدء تنفيذ السكريبت
console.log('\n📦 أداة تعبئة بيانات منصة ترزي\n'.cyan);
runSeeder();
