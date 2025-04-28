// frontend/src/services/measurement.service.js
import api from './api';

export const measurementService = {
  // إنشاء مقاس جديد
  createMeasurement: async (measurementData) => {
    const response = await api.post('/measurements', measurementData);
    return response.data;
  },

  // الحصول على جميع مقاسات المستخدم
  getMeasurements: async () => {
    const response = await api.get('/measurements');
    return response.data;
  },

  // الحصول على مقاس محدد
  getMeasurementById: async (id) => {
    const response = await api.get(`/measurements/${id}`);
    return response.data;
  },

  // تحديث مقاس
  updateMeasurement: async (id, measurementData) => {
    const response = await api.put(`/measurements/${id}`, measurementData);
    return response.data;
  },

  // حذف مقاس
  deleteMeasurement: async (id) => {
    const response = await api.delete(`/measurements/${id}`);
    return response.data;
  },

  // تعيين مقاس كافتراضي
  setDefaultMeasurement: async (id) => {
    const response = await api.put(`/measurements/${id}/default`);
    return response.data;
  }
};