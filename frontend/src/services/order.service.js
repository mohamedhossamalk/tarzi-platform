// frontend/src/services/order.service.js
import api from './api';

export const orderService = {
  // إنشاء طلب جديد
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // الحصول على جميع طلبات المستخدم
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // الحصول على طلب محدد
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // إلغاء طلب
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  }
};