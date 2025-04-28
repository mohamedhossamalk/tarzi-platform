// backend/models/Measurement.js
const mongoose = require('mongoose');

const measurementSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'يرجى إدخال اسم مجموعة المقاسات'],
      trim: true,
    },
    chest: {
      type: Number,
      required: [true, 'يرجى إدخال قياس الصدر'],
    },
    waist: {
      type: Number,
      required: [true, 'يرجى إدخال قياس الخصر'],
    },
    hips: {
      type: Number,
      required: [true, 'يرجى إدخال قياس الأرداف'],
    },
    shoulderWidth: {
      type: Number,
      required: [true, 'يرجى إدخال عرض الكتفين'],
    },
    sleeveLength: {
      type: Number,
      required: [true, 'يرجى إدخال طول الأكمام'],
    },
    inseam: {
      type: Number,
    },
    neckSize: {
      type: Number,
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    notes: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Measurement', measurementSchema);