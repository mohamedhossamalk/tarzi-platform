// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    measurementId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Measurement',
    },
    fabricChoice: {
      type: String,
      required: [true, 'يرجى اختيار نوع القماش'],
    },
    colorChoice: {
      type: String,
      required: [true, 'يرجى اختيار اللون'],
    },
    additionalRequests: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: [
        'جديد',
        'قيد المراجعة',
        'قيد التنفيذ',
        'جاهز للتسليم',
        'تم التسليم',
        'مرفوض',
        'ملغي',
      ],
      default: 'جديد',
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['غير مدفوع', 'مدفوع', 'مسترد'],
      default: 'غير مدفوع',
    },
    paymentMethod: {
      type: String,
      enum: ['نقدي', 'بطاقة ائتمان', 'تحويل بنكي', 'غير محدد'],
      default: 'غير محدد',
    },
    paymentDate: {
      type: Date,
    },
    expectedDeliveryDate: {
      type: Date,
    },
    actualDeliveryDate: {
      type: Date,
    },
    assignedTailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
    },
    isRated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);