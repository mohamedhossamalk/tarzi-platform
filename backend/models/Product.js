// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'يرجى إدخال اسم المنتج'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'يرجى إدخال وصف المنتج'],
    },
    category: {
      type: String,
      required: [true, 'يرجى اختيار فئة المنتج'],
      enum: ['قميص', 'بنطلون', 'جاكيت', 'فستان', 'تنورة', 'عباية', 'ثوب', 'أخرى'],
    },
    imageUrl: {
      type: String,
      required: [true, 'يرجى إدخال رابط صورة المنتج'],
    },
    images: [String],
    price: {
      type: Number,
      required: [true, 'يرجى إدخال سعر المنتج'],
      min: [0, 'لا يمكن أن يكون السعر أقل من 0'],
    },
    fabricOptions: {
      type: [String],
      required: [true, 'يرجى إدخال خيارات الأقمشة المتاحة'],
    },
    colorOptions: {
      type: [String],
      required: [true, 'يرجى إدخال خيارات الألوان المتاحة'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);