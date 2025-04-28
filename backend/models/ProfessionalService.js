// backend/models/ProfessionalService.js
const mongoose = require('mongoose');

const professionalServiceSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'يرجى إدخال عنوان الخدمة'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'يرجى إدخال وصف الخدمة'],
    },
    serviceType: {
      type: String,
      required: [true, 'يرجى اختيار نوع الخدمة'],
      enum: ['تصميم', 'خياطة', 'تعديل', 'استشارة', 'أخرى'],
    },
    requirements: {
      type: String,
    },
    timeline: {
      type: String,
    },
    budget: {
      type: Number,
      required: true,
      min: [0, 'لا يمكن أن تكون الميزانية أقل من 0'],
    },
    deadline: {
      type: Date,
      required: [true, 'يرجى تحديد الموعد النهائي'],
    },
    status: {
      type: String,
      enum: ['جديد', 'قيد المراجعة', 'تم قبول الطلب', 'قيد التنفيذ', 'مكتمل', 'مرفوض', 'ملغي'],
      default: 'جديد',
    },
    images: [String],
    price: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['غير مدفوع', 'مدفوع', 'مسترجع'],
      default: 'غير مدفوع',
    },
    assignedTailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    adminResponse: {
      type: String,
    },
    additionalNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ProfessionalService', professionalServiceSchema);