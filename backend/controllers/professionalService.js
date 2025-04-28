// backend/controllers/professionalService.js
const asyncHandler = require('express-async-handler');
const ProfessionalService = require('../models/ProfessionalService');
const User = require('../models/User');

/**
 * @desc    إنشاء طلب خدمة احترافية
 * @route   POST /api/professionalservices
 * @access  Private
 */
const createProfessionalService = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    serviceType,
    requirements,
    timeline,
    budget,
    deadline,
    additionalNotes,
    images
  } = req.body;

  const service = await ProfessionalService.create({
    userId: req.user._id,
    title,
    description,
    serviceType,
    requirements: requirements || '',
    timeline: timeline || '',
    budget,
    deadline,
    additionalNotes: additionalNotes || '',
    images: images || []
  });

  if (service) {
    res.status(201).json(service);
  } else {
    res.status(400);
    throw new Error('بيانات الخدمة غير صالحة');
  }
});

/**
 * @desc    الحصول على خدمات المستخدم الحالي
 * @route   GET /api/professionalservices/myservices
 * @access  Private
 */
const getMyServices = asyncHandler(async (req, res) => {
  const services = await ProfessionalService.find({ userId: req.user._id })
    .sort({ createdAt: -1 });
  
  res.json(services);
});

/**
 * @desc    الحصول على تفاصيل خدمة معينة
 * @route   GET /api/professionalservices/:id
 * @access  Private
 */
const getProfessionalServiceById = asyncHandler(async (req, res) => {
  const service = await ProfessionalService.findById(req.params.id)
    .populate('userId', 'username email')
    .populate('assignedTailor', 'username');
  
  if (!service) {
    res.status(404);
    throw new Error('الخدمة غير موجودة');
  }
  
  // التحقق من ملكية الخدمة أو صلاحيات المسؤول/الخياط
  if (service.userId._id.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin' && 
      req.user.role !== 'tailor') {
    res.status(403);
    throw new Error('غير مصرح بالوصول');
  }
  
  res.json(service);
});

/**
 * @desc    تحديث خدمة
 * @route   PUT /api/professionalservices/:id
 * @access  Private
 */
const updateProfessionalService = asyncHandler(async (req, res) => {
  const service = await ProfessionalService.findById(req.params.id);
  
  if (!service) {
    res.status(404);
    throw new Error('الخدمة غير موجودة');
  }
  
  // للمستخدم العادي: يمكنه تحديث خدماته فقط إذا كانت بحالة جديدة أو قيد المراجعة
  if (service.userId.toString() === req.user._id.toString()) {
    if (service.status !== 'جديد' && service.status !== 'قيد المراجعة') {
      res.status(400);
      throw new Error('لا يمكن تحديث الخدمة في حالتها الحالية');
    }
    
    // تحديث البيانات المسموح للمستخدم بتحديثها
    service.title = req.body.title || service.title;
    service.description = req.body.description || service.description;
    service.serviceType = req.body.serviceType || service.serviceType;
    service.requirements = req.body.requirements !== undefined ? req.body.requirements : service.requirements;
    service.timeline = req.body.timeline !== undefined ? req.body.timeline : service.timeline;
    service.budget = req.body.budget !== undefined ? req.body.budget : service.budget;
    service.deadline = req.body.deadline || service.deadline;
    service.additionalNotes = req.body.additionalNotes !== undefined ? req.body.additionalNotes : service.additionalNotes;
    service.images = req.body.images || service.images;
    
  // للمسؤول والخياط: يمكنهم تحديث جميع حقول الخدمة
  } else if (req.user.role === 'admin' || req.user.role === 'tailor') {
    service.title = req.body.title || service.title;
    service.description = req.body.description || service.description;
    service.serviceType = req.body.serviceType || service.serviceType;
    service.requirements = req.body.requirements !== undefined ? req.body.requirements : service.requirements;
    service.timeline = req.body.timeline !== undefined ? req.body.timeline : service.timeline;
    service.budget = req.body.budget !== undefined ? req.body.budget : service.budget;
    service.deadline = req.body.deadline || service.deadline;
    service.status = req.body.status || service.status;
    service.price = req.body.price !== undefined ? req.body.price : service.price;
    service.paymentStatus = req.body.paymentStatus || service.paymentStatus;
    service.assignedTailor = req.body.assignedTailor || service.assignedTailor;
    service.adminResponse = req.body.adminResponse !== undefined ? req.body.adminResponse : service.adminResponse;
    service.additionalNotes = req.body.additionalNotes !== undefined ? req.body.additionalNotes : service.additionalNotes;
    service.images = req.body.images || service.images;
  } else {
    res.status(403);
    throw new Error('غير مصرح بالوصول');
  }
  
  const updatedService = await service.save();
  res.json(updatedService);
});

/**
 * @desc    إلغاء طلب خدمة
 * @route   PUT /api/professionalservices/:id/cancel
 * @access  Private
 */
const cancelProfessionalService = asyncHandler(async (req, res) => {
  const service = await ProfessionalService.findById(req.params.id);
  
  if (!service) {
    res.status(404);
    throw new Error('الخدمة غير موجودة');
  }
  
  // التحقق من ملكية الخدمة أو صلاحيات المسؤول
  if (service.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('غير مصرح بالوصول');
  }
  
  // التحقق من إمكانية إلغاء الخدمة
  if (service.status === 'مكتمل' || service.status === 'ملغي') {
    res.status(400);
    throw new Error('لا يمكن إلغاء الخدمة في حالتها الحالية');
  }
  
  service.status = 'ملغي';
  
  const updatedService = await service.save();
  res.json(updatedService);
});

/**
 * @desc    الحصول على كل طلبات الخدمة (للمسؤول والخياط)
 * @route   GET /api/professionalservices/all
 * @access  Private/Admin/Tailor
 */
const getAllProfessionalServices = asyncHandler(async (req, res) => {
  // التحقق من الصلاحيات
  if (req.user.role !== 'admin' && req.user.role !== 'tailor') {
    res.status(403);
    throw new Error('غير مصرح بالوصول');
  }
  
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  const status = req.query.status || '';
  
  const statusFilter = status ? { status } : {};
  
  const filter = {
    ...statusFilter
  };
  
  // للخياط، عرض الطلبات المعينة له فقط أو الطلبات الجديدة
  if (req.user.role === 'tailor') {
    filter.$or = [
      { assignedTailor: req.user._id },
      { status: 'جديد' }
    ];
  }
  
  const count = await ProfessionalService.countDocuments(filter);
  const services = await ProfessionalService.find(filter)
    .populate('userId', 'username email')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  
  res.json({
    professionalServices: services,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

module.exports = {
  createProfessionalService,
  getMyServices,
  getProfessionalServiceById,
  updateProfessionalService,
  cancelProfessionalService,
  getAllProfessionalServices
};