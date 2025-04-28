// frontend/src/services/professional-service.service.js
import api from './api';

// الخدمات الاحترافية
export const professionalServiceService = {
  /**
   * إنشاء طلب خدمة احترافية
   * @param {Object} serviceData - بيانات الخدمة
   * @returns {Promise<Object>} البيانات المرجعة من الخادم
   */
  createProfessionalService: async (serviceData) => {
    try {
      const response = await api.post('/professionalservices', serviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * الحصول على خدمات المستخدم الحالي
   * @returns {Promise<Array>} قائمة الخدمات
   */
  getMyServices: async () => {
    try {
      const response = await api.get('/professionalservices/myservices');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * الحصول على تفاصيل خدمة معينة
   * @param {string} id - معرف الخدمة
   * @returns {Promise<Object>} بيانات الخدمة
   */
  getProfessionalServiceById: async (id) => {
    try {
      const response = await api.get(`/professionalservices/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * تحديث طلب خدمة
   * @param {string} id - معرف الخدمة
   * @param {Object} serviceData - بيانات التحديث
   * @returns {Promise<Object>} بيانات الخدمة المحدثة
   */
  updateProfessionalService: async (id, serviceData) => {
    try {
      const response = await api.put(`/professionalservices/${id}`, serviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * إلغاء طلب خدمة
   * @param {string} id - معرف الخدمة
   * @returns {Promise<Object>} نتيجة العملية
   */
  cancelProfessionalService: async (id) => {
    try {
      const response = await api.put(`/professionalservices/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * الحصول على جميع طلبات الخدمة (للمسؤول)
   * @param {Object} params - معلمات التصفية والترقيم
   * @returns {Promise<Object>} قائمة الخدمات ومعلومات الترقيم
   */
  getAllProfessionalServices: async (params = {}) => {
    try {
      const response = await api.get(`/professionalservices/all`, { params });
      // استخدام وظيفة التوحيد لمعالجة الاستجابة
      return api.normalizeResponse(response.data);
    } catch (error) {
      throw error;
    }
  }
};

export default professionalServiceService;