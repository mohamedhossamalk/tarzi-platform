// backend/controllers/measurements.js
const asyncHandler = require('express-async-handler');
const Measurement = require('../models/Measurement');

/**
 * @desc    إنشاء مقاس جديد
 * @route   POST /api/measurements
 * @access  Private
 */
const createMeasurement = asyncHandler(async (req, res) => {
  const { name, chest, waist, hips, shoulderWidth, sleeveLength, inseam, neckSize, height, weight, notes } = req.body;

  // التحقق من وجود مقاس بنفس الاسم للمستخدم نفسه
  const existingMeasurement = await Measurement.findOne({ userId: req.user._id, name });
  
  if (existingMeasurement) {
    res.status(400);
    throw new Error('يوجد مقاس بهذا الاسم بالفعل');
  }

  // معرفة ما إذا كان هذا أول مقاس للمستخدم
  const measurementCount = await Measurement.countDocuments({ userId: req.user._id });
  const isDefault = measurementCount === 0;

  const measurement = await Measurement.create({
    userId: req.user._id,
    name,
    chest,
    waist,
    hips,
    shoulderWidth,
    sleeveLength,
    inseam: inseam || 0,
    neckSize: neckSize || 0,
    height: height || 0,
    weight: weight || 0,
    notes: notes || '',
    isDefault,
  });

  res.status(201).json(measurement);
});

/**
 * @desc    الحصول على مقاسات المستخدم
 * @route   GET /api/measurements
 * @access  Private
 */
const getMeasurements = asyncHandler(async (req, res) => {
  const measurements = await Measurement.find({ userId: req.user._id });
  res.json(measurements);
});

/**
 * @desc    الحصول على مقاس محدد
 * @route   GET /api/measurements/:id
 * @access  Private
 */
const getMeasurementById = asyncHandler(async (req, res) => {
  const measurement = await Measurement.findById(req.params.id);
  
  if (!measurement) {
    res.status(404);
    throw new Error('المقاس غير موجود');
  }
  
  // التحقق من ملكية المقاس
  if (measurement.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('غير مصرح بالوصول');
  }
  
  res.json(measurement);
});

/**
 * @desc    تحديث مقاس
 * @route   PUT /api/measurements/:id
 * @access  Private
 */
const updateMeasurement = asyncHandler(async (req, res) => {
  const measurement = await Measurement.findById(req.params.id);
  
  if (!measurement) {
    res.status(404);
    throw new Error('المقاس غير موجود');
  }

    // التحقق من ملكية المقاس
    if (measurement.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('غير مصرح بالوصول');
    }
  
    const { name, chest, waist, hips, shoulderWidth, sleeveLength, inseam, neckSize, height, weight, notes } = req.body;
  
    measurement.name = name || measurement.name;
    measurement.chest = chest !== undefined ? chest : measurement.chest;
    measurement.waist = waist !== undefined ? waist : measurement.waist;
    measurement.hips = hips !== undefined ? hips : measurement.hips;
    measurement.shoulderWidth = shoulderWidth !== undefined ? shoulderWidth : measurement.shoulderWidth;
    measurement.sleeveLength = sleeveLength !== undefined ? sleeveLength : measurement.sleeveLength;
    measurement.inseam = inseam !== undefined ? inseam : measurement.inseam;
    measurement.neckSize = neckSize !== undefined ? neckSize : measurement.neckSize;
    measurement.height = height !== undefined ? height : measurement.height;
    measurement.weight = weight !== undefined ? weight : measurement.weight;
    measurement.notes = notes !== undefined ? notes : measurement.notes;
  
    const updatedMeasurement = await measurement.save();
    res.json(updatedMeasurement);
  });
  
  /**
   * @desc    حذف مقاس
   * @route   DELETE /api/measurements/:id
   * @access  Private
   */
  const deleteMeasurement = asyncHandler(async (req, res) => {
    const measurement = await Measurement.findById(req.params.id);
    
    if (!measurement) {
      res.status(404);
      throw new Error('المقاس غير موجود');
    }
    
    // التحقق من ملكية المقاس
    if (measurement.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('غير مصرح بالوصول');
    }
  
    // إذا كان المقاس المراد حذفه هو الافتراضي، يجب تعيين مقاس آخر كافتراضي
    if (measurement.isDefault) {
      const otherMeasurement = await Measurement.findOne({ 
        userId: req.user._id, 
        _id: { $ne: req.params.id } 
      });
      
      if (otherMeasurement) {
        otherMeasurement.isDefault = true;
        await otherMeasurement.save();
      }
    }
  
    await measurement.remove();
    res.json({ message: 'تم حذف المقاس بنجاح' });
  });
  
  /**
   * @desc    تعيين مقاس كافتراضي
   * @route   PUT /api/measurements/:id/default
   * @access  Private
   */
  const setDefaultMeasurement = asyncHandler(async (req, res) => {
    // إلغاء تعيين جميع المقاسات كافتراضية
    await Measurement.updateMany(
      { userId: req.user._id },
      { isDefault: false }
    );
  
    // تعيين المقاس المحدد كافتراضي
    const measurement = await Measurement.findById(req.params.id);
    
    if (!measurement) {
      res.status(404);
      throw new Error('المقاس غير موجود');
    }
    
    // التحقق من ملكية المقاس
    if (measurement.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('غير مصرح بالوصول');
    }
  
    measurement.isDefault = true;
    const updatedMeasurement = await measurement.save();
    res.json(updatedMeasurement);
  });
  
  module.exports = {
    createMeasurement,
    getMeasurements,
    getMeasurementById,
    updateMeasurement,
    deleteMeasurement,
    setDefaultMeasurement
  };