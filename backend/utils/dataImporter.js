// backend/utils/dataImporter.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// تحميل متغيرات البيئة
dotenv.config();

// اتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('تم الاتصال بقاعدة البيانات للتحميل'))
  .catch(err => {
    console.error('خطأ في الاتصال بقاعدة البيانات:', err);
    process.exit(1);
  });

// استيراد بيانات المنتجات
const importProducts = async () => {
  try {
    // التحقق من وجود مستخدم مسؤول
    let adminUser = await User.findOne({ role: 'admin' });
    
    // إنشاء مستخدم مسؤول إذا لم يكن موجودًا
    if (!adminUser) {
      const passwordHash = await bcrypt.hash('admin123456', 10);
      adminUser = await User.create({
        username: 'مدير النظام',
        email: 'admin@tarzi.com',
        password: passwordHash,
        role: 'admin',
        phone: '966500000000'
      });
      console.log('تم إنشاء مستخدم مسؤول:');
      console.log({
        username: 'مدير النظام',
        email: 'admin@tarzi.com',
        password: 'admin123456' // للتطوير فقط، يجب تغيير هذا فورًا في الإنتاج
      });
    }
    
    // قراءة ملف بيانات المنتجات
    const productsFilePath = path.join(__dirname, '../data/products.json');
    
    // التحقق من وجود ملف المنتجات
    if (!fs.existsSync(productsFilePath)) {
      console.error(`ملف المنتجات غير موجود: ${productsFilePath}`);
      return;
    }
    
    const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    
    // إضافة معرف المسؤول للمنتجات
    const productsWithAdmin = productsData.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));
    
    // حذف المنتجات الموجودة (اختياري)
    await Product.deleteMany();
    
    // إدخال المنتجات الجديدة
    const result = await Product.insertMany(productsWithAdmin);
    
    console.log(`✅ تم استيراد ${result.length} منتج بنجاح`);
  } catch (error) {
    console.error('❌ خطأ في استيراد المنتجات:', error);
  }
};

// تنفيذ الاستيراد
importProducts()
  .then(() => {
    console.log('🏁 اكتمل استيراد البيانات');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ فشل استيراد البيانات:', err);
    process.exit(1);
  });