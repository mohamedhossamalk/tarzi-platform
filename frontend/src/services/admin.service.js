// src/services/admin.service.js
import api from './api'; // استيراد ملف الإعدادات المحسن للـ API

// استخدام محاكاة البيانات في حالة عدم وجود خادم خلفي
const USE_MOCK_DATA = true; // قم بتغيير هذا إلى false عند وجود خادم خلفي حقيقي

// ----- بيانات المحاكاة -----

// بيانات المستخدمين الوهمية للاختبار
const mockUsers = [
  {
    _id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    phone: '0511111111',
    isActive: true,
    createdAt: '2023-01-01T12:00:00Z'
  },
  {
    _id: '2',
    username: 'user1',
    email: 'user1@example.com',
    role: 'user',
    phone: '0522222222',
    isActive: true,
    createdAt: '2023-01-05T12:00:00Z'
  },
  {
    _id: '3',
    username: 'user2',
    email: 'user2@example.com',
    role: 'user',
    phone: '0533333333',
    isActive: false,
    createdAt: '2023-01-10T12:00:00Z'
  },
  {
    _id: '4',
    username: 'tailor1',
    email: 'tailor1@example.com',
    role: 'tailor',
    phone: '0544444444',
    isActive: true,
    createdAt: '2023-02-15T12:00:00Z'
  }
];

// بيانات المنتجات الوهمية
const mockProducts = [
  { 
    _id: '1', 
    name: 'قميص كلاسيكي', 
    description: 'قميص كلاسيكي بتصميم أنيق مناسب للمناسبات الرسمية',
    price: 150, 
    category: 'قميص', 
    imageUrl: 'https://example.com/shirt.jpg',
    fabricOptions: ['قطن', 'كتان', 'بوليستر'],
    colorOptions: ['أبيض', 'أزرق', 'أسود'],
    isActive: true,
    createdAt: '2023-01-05T10:30:00Z'
  },
  { 
    _id: '2', 
    name: 'بنطلون قطني', 
    description: 'بنطلون قطني مريح وعملي للاستخدام اليومي',
    price: 200, 
    category: 'بنطلون', 
    imageUrl: 'https://example.com/pants.jpg',
    fabricOptions: ['قطن', 'جينز', 'كتان'],
    colorOptions: ['أسود', 'بني', 'كحلي'],
    isActive: true,
    createdAt: '2023-01-10T14:20:00Z'
  },
  { 
    _id: '3', 
    name: 'جاكيت شتوي', 
    description: 'جاكيت شتوي دافئ وعصري بتصميم أنيق',
    price: 350, 
    category: 'جاكيت', 
    imageUrl: 'https://example.com/jacket.jpg',
    fabricOptions: ['صوف', 'جلد', 'قطن سميك'],
    colorOptions: ['أسود', 'بني', 'رمادي'],
    isActive: true,
    createdAt: '2023-01-15T09:45:00Z'
  }
];

// بيانات الطلبات الوهمية
const mockOrders = [
  {
    _id: '1',
    userId: '2',
    productId: '1',
    status: 'pending',
    totalAmount: 150,
    paymentStatus: 'paid',
    deliveryAddress: 'الرياض، حي النخيل',
    createdAt: '2023-02-01T10:30:00Z',
    user: {
      username: 'user1',
      email: 'user1@example.com',
      phone: '0522222222'
    },
    product: {
      name: 'قميص كلاسيكي'
    }
  },
  {
    _id: '2',
    userId: '3',
    productId: '2',
    status: 'processing',
    totalAmount: 200,
    paymentStatus: 'pending',
    deliveryAddress: 'جدة، حي السلامة',
    createdAt: '2023-02-05T14:45:00Z',
    user: {
      username: 'user2',
      email: 'user2@example.com',
      phone: '0533333333'
    },
    product: {
      name: 'بنطلون قطني'
    }
  },
  {
    _id: '3',
    userId: '2',
    productId: '3',
    status: 'completed',
    totalAmount: 350,
    paymentStatus: 'paid',
    deliveryAddress: 'الرياض، حي النخيل',
    createdAt: '2023-01-20T09:15:00Z',
    deliveredAt: '2023-01-27T15:30:00Z',
    user: {
      username: 'user1',
      email: 'user1@example.com',
      phone: '0522222222'
    },
    product: {
      name: 'جاكيت شتوي'
    }
  }
];

// بيانات الخدمات الاحترافية الوهمية
const mockProfessionalServices = [
  {
    _id: '1',
    userId: '2',
    title: 'تصميم فستان زفاف',
    description: 'تصميم فستان زفاف مخصص بتفاصيل دقيقة',
    status: 'pending',
    price: null, // السعر لم يتم تحديده بعد
    createdAt: '2023-02-10T11:20:00Z',
    user: {
      username: 'user1',
      email: 'user1@example.com',
      phone: '0522222222'
    }
  },
  {
    _id: '2',
    userId: '3',
    title: 'تعديل بدلة',
    description: 'تعديل مقاسات بدلة رسمية',
    status: 'accepted',
    price: 120,
    createdAt: '2023-02-08T09:30:00Z',
    acceptedAt: '2023-02-09T14:15:00Z',
    user: {
      username: 'user2',
      email: 'user2@example.com',
      phone: '0533333333'
    }
  },
  {
    _id: '3',
    userId: '2',
    title: 'تصميم عباءة',
    description: 'تصميم عباءة مخصصة بنمط عصري وأنيق',
    status: 'completed',
    price: 300,
    createdAt: '2023-01-15T13:10:00Z',
    completedAt: '2023-01-25T15:45:00Z',
    user: {
      username: 'user1',
      email: 'user1@example.com',
      phone: '0522222222'
    }
  }
];

// بيانات إحصائيات لوحة التحكم الوهمية
const mockDashboardStats = {
  totalUsers: mockUsers.length,
  activeUsers: mockUsers.filter(user => user.isActive).length,
  totalProducts: mockProducts.length,
  totalOrders: mockOrders.length,
  pendingOrders: mockOrders.filter(order => order.status === 'pending').length,
  processingOrders: mockOrders.filter(order => order.status === 'processing').length,
  completedOrders: mockOrders.filter(order => order.status === 'completed').length,
  totalServices: mockProfessionalServices.length,
  pendingServices: mockProfessionalServices.filter(service => service.status === 'pending').length,
  acceptedServices: mockProfessionalServices.filter(service => service.status === 'accepted').length,
  completedServices: mockProfessionalServices.filter(service => service.status === 'completed').length,
  totalRevenue: [...mockOrders, ...mockProfessionalServices]
    .filter(item => item.status === 'completed' && item.price)
    .reduce((total, item) => total + (item.totalAmount || item.price), 0),
  recentOrders: mockOrders.slice(0, 3),
  recentServices: mockProfessionalServices.slice(0, 3),
  monthlyData: [
    { month: 'يناير', orders: 12, services: 5, revenue: 3500 },
    { month: 'فبراير', orders: 15, services: 8, revenue: 4200 },
    { month: 'مارس', orders: 10, services: 7, revenue: 3800 }
  ]
};

// ----- وظائف مساعدة -----

/**
 * محاكاة تأخير الشبكة
 */
const mockDelay = async (ms = 800) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
};

/**
 * معالجة أخطاء API
 */
const handleApiError = (error) => {
  if (error.response) {
    // استجابة الخادم بكود خطأ
    console.error('Error response:', error.response.data);
    console.error('Status code:', error.response.status);
    
    if (error.response.status === 404) {
      console.error('Resource not found (404):', error.config.url);
    } else if (error.response.status === 401) {
      console.error('Unauthorized access (401). Please check authentication.');
    } else if (error.response.status === 403) {
      console.error('Forbidden access (403). Insufficient permissions.');
    }
  } else if (error.request) {
    // لم يتم استلام استجابة
    console.error('No response received:', error.request);
  } else {
    // خطأ في إعداد الطلب
    console.error('Request error:', error.message);
  }

  // إعادة توجيه الخطأ للمعالجة
  throw error;
};

// ----- خدمات المستخدمين -----

/**
 * جلب جميع المستخدمين
 */
const getUsers = async (params = {}) => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      // تطبيق التصفية والترتيب على البيانات الوهمية إذا تم تقديمهما
      let filteredUsers = [...mockUsers];
      
      // تصفية حسب الدور
      if (params.role) {
        filteredUsers = filteredUsers.filter(user => user.role === params.role);
      }
      
      // تصفية حسب الحالة
      if (params.isActive !== undefined) {
        const isActive = params.isActive === 'true' || params.isActive === true;
        filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
      }
      
      // تصفية حسب البحث
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.username.toLowerCase().includes(searchTerm) || 
          user.email.toLowerCase().includes(searchTerm) ||
          user.phone.includes(searchTerm)
        );
      }
      
      return filteredUsers;
    }

    const response = await api.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * جلب بيانات مستخدم محدد
 */
const getUserById = async (id) => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      const user = mockUsers.find(user => user._id === id);
      if (!user) {
        const error = new Error('المستخدم غير موجود');
        error.status = 404;
        throw error;
      }
      
      return user;
    }

    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * تحديث بيانات مستخدم
 */
const updateUser = async (id, userData) => {
  try {
    await mockDelay(1200);
    
    if (USE_MOCK_DATA) {
      const userIndex = mockUsers.findIndex(user => user._id === id);
      if (userIndex === -1) {
        const error = new Error('المستخدم غير موجود');
        error.status = 404;
        throw error;
      }
      
      // تحديث بيانات المستخدم في المصفوفة
      const updatedUser = {
        ...mockUsers[userIndex],
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      mockUsers[userIndex] = updatedUser;
      
      return updatedUser;
    }

    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * إنشاء مستخدم جديد
 */
const createUser = async (userData) => {
  try {
    await mockDelay(1200);
    
    if (USE_MOCK_DATA) {
      // التحقق من عدم وجود المستخدم بالفعل
      const existingUser = mockUsers.find(user => user.email === userData.email);
      if (existingUser) {
        const error = new Error('البريد الإلكتروني مستخدم بالفعل');
        error.status = 400;
        throw error;
      }
      
      const newId = (mockUsers.length + 1).toString();
      const newUser = {
        _id: newId,
        ...userData,
        isActive: userData.isActive ?? true,
        createdAt: new Date().toISOString()
      };
      
      mockUsers.push(newUser);
      return newUser;
    }

    const response = await api.post('/admin/users', userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * حذف مستخدم
 */
const deleteUser = async (id) => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      const userIndex = mockUsers.findIndex(user => user._id === id);
      if (userIndex === -1) {
        const error = new Error('المستخدم غير موجود');
        error.status = 404;
        throw error;
      }
      
      // التحقق من أن المستخدم ليس المشرف الرئيسي
      if (mockUsers[userIndex].username === 'admin') {
        const error = new Error('لا يمكن حذف المشرف الرئيسي');
        error.status = 403;
        throw error;
      }
      
      const deletedUser = mockUsers.splice(userIndex, 1)[0];
      return { success: true, deletedUser };
    }

    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ----- خدمات المنتجات -----

/**
 * جلب المنتجات
 */
const getProducts = async (params = {}) => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      // تطبيق التصفية والترتيب على البيانات الوهمية إذا تم تقديمهما
      let filteredProducts = [...mockProducts];
      
      // تصفية حسب التصنيف
      if (params.category) {
        filteredProducts = filteredProducts.filter(product => 
          product.category === params.category
        );
      }
      
      // تصفية حسب الحالة
      if (params.isActive !== undefined) {
        const isActive = params.isActive === 'true' || params.isActive === true;
        filteredProducts = filteredProducts.filter(product => product.isActive === isActive);
      }
      
      // تصفية حسب البحث
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchTerm) || 
          (product.description && product.description.toLowerCase().includes(searchTerm))
        );
      }
      
      return filteredProducts;
    }

    const response = await api.get('/admin/products', { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * جلب بيانات منتج محدد
 */
const getProductById = async (id) => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      const product = mockProducts.find(product => product._id === id);
      if (!product) {
        const error = new Error('المنتج غير موجود');
        error.status = 404;
        throw error;
      }
      
      return product;
    }

    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * إنشاء منتج جديد
 */
const createProduct = async (productData) => {
  try {
    await mockDelay(1200);
    
    if (USE_MOCK_DATA) {
      const newId = (mockProducts.length + 1).toString();
      const newProduct = {
        _id: newId,
        ...productData,
        isActive: productData.isActive ?? true,
        createdAt: new Date().toISOString()
      };
      
      mockProducts.push(newProduct);
      return newProduct;
    }

    const response = await api.post('/admin/products', productData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * تحديث منتج
 */
const updateProduct = async (id, productData) => {
  try {
    await mockDelay(1200);
    
    if (USE_MOCK_DATA) {
      const productIndex = mockProducts.findIndex(product => product._id === id);
      if (productIndex === -1) {
        const error = new Error('المنتج غير موجود');
        error.status = 404;
        throw error;
      }
      
      // تحديث بيانات المنتج في المصفوفة
      const updatedProduct = {
        ...mockProducts[productIndex],
        ...productData,
        updatedAt: new Date().toISOString()
      };
      
      mockProducts[productIndex] = updatedProduct;
      
      return updatedProduct;
    }

    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * حذف منتج
 */
const deleteProduct = async (id) => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      const productIndex = mockProducts.findIndex(product => product._id === id);
      if (productIndex === -1) {
        const error = new Error('المنتج غير موجود');
        error.status = 404;
        throw error;
      }
      
      const deletedProduct = mockProducts.splice(productIndex, 1)[0];
      return { success: true, deletedProduct };
    }

    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ----- خدمات الطلبات -----

/**
 * جلب جميع الطلبات
 */
const getOrders = async (params = {}) => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      // تطبيق التصفية والترتيب على البيانات الوهمية
      let filteredOrders = [...mockOrders];
      
      // تصفية حسب الحالة
      if (params.status) {
        filteredOrders = filteredOrders.filter(order => order.status === params.status);
      }
      
      // تصفية حسب المستخدم
      if (params.userId) {
        filteredOrders = filteredOrders.filter(order => order.userId === params.userId);
      }
      
      return filteredOrders;
    }

    const response = await api.get('/admin/orders', { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * جلب بيانات طلب محدد
 */
const getOrderById = async (id) => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      const order = mockOrders.find(order => order._id === id);
      if (!order) {
        const error = new Error('الطلب غير موجود');
        error.status = 404;
        throw error;
      }
      
      return order;
    }

    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * تحديث حالة الطلب
 */
const updateOrderStatus = async (id, { status, notes }) => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      const orderIndex = mockOrders.findIndex(order => order._id === id);
      if (orderIndex === -1) {
        const error = new Error('الطلب غير موجود');
        error.status = 404;
        throw error;
      }
      
      const updatedOrder = {
        ...mockOrders[orderIndex],
        status,
        notes: notes || mockOrders[orderIndex].notes,
        updatedAt: new Date().toISOString(),
      };
      
      // إضافة تاريخ إكمال الطلب إذا تم الانتهاء منه
      if (status === 'completed' && !updatedOrder.deliveredAt) {
        updatedOrder.deliveredAt = new Date().toISOString();
      }
      
      mockOrders[orderIndex] = updatedOrder;
      
      return updatedOrder;
    }

    const response = await api.patch(`/admin/orders/${id}/status`, { status, notes });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ----- خدمات الخدمات الاحترافية -----

/**
 * جلب جميع طلبات الخدمات الاحترافية
 */
const getProfessionalServices = async (params = {}) => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      // تطبيق التصفية والترتيب على البيانات الوهمية
      let filteredServices = [...mockProfessionalServices];
      
      // تصفية حسب الحالة
      if (params.status) {
        filteredServices = filteredServices.filter(service => service.status === params.status);
      }
      
      // تصفية حسب المستخدم
      if (params.userId) {
        filteredServices = filteredServices.filter(service => service.userId === params.userId);
      }
      
      return filteredServices;
    }

    const response = await api.get('/admin/professional-services', { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * جلب بيانات طلب خدمة محدد
 */
const getProfessionalServiceById = async (id) => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      const service = mockProfessionalServices.find(service => service._id === id);
      if (!service) {
        const error = new Error('طلب الخدمة غير موجود');
        error.status = 404;
        throw error;
      }
      
      return service;
    }

    const response = await api.get(`/admin/professional-services/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * تحديث حالة طلب الخدمة
 */
const updateProfessionalServiceStatus = async (id, { status, price, notes }) => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      const serviceIndex = mockProfessionalServices.findIndex(service => service._id === id);
      if (serviceIndex === -1) {
        const error = new Error('طلب الخدمة غير موجود');
        error.status = 404;
        throw error;
      }
      
      const updatedService = {
        ...mockProfessionalServices[serviceIndex],
        status,
        updatedAt: new Date().toISOString(),
      };
      
      // إضافة السعر إذا تم تقديمه
      if (price !== undefined) {
        updatedService.price = price;
      }
      
      // إضافة ملاحظات إذا تم تقديمها
      if (notes) {
        updatedService.notes = notes;
      }
      
      // إضافة تواريخ الحالة المناسبة
      if (status === 'accepted' && !updatedService.acceptedAt) {
        updatedService.acceptedAt = new Date().toISOString();
      } else if (status === 'completed' && !updatedService.completedAt) {
        updatedService.completedAt = new Date().toISOString();
      } else if (status === 'rejected' && !updatedService.rejectedAt) {
        updatedService.rejectedAt = new Date().toISOString();
      }
      
      mockProfessionalServices[serviceIndex] = updatedService;
      
      return updatedService;
    }

    const response = await api.patch(`/admin/professional-services/${id}/status`, { status, price, notes });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ----- خدمات لوحة التحكم والإحصاءات -----

/**
 * جلب إحصاءات لوحة التحكم
 */
const getDashboardStats = async () => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      return mockDashboardStats;
    }

    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * جلب بيانات إحصائية حسب الفترة الزمنية
 */
const getStatsByPeriod = async (period = 'monthly') => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      // إنشاء بيانات إحصائية وهمية مختلفة حسب الفترة
      if (period === 'weekly') {
        return [
          { day: 'السبت', orders: 5, services: 2, revenue: 1200 },
          { day: 'الأحد', orders: 7, services: 3, revenue: 1500 },
          { day: 'الاثنين', orders: 4, services: 1, revenue: 950 },
          { day: 'الثلاثاء', orders: 6, services: 2, revenue: 1300 },
          { day: 'الأربعاء', orders: 8, services: 4, revenue: 1700 },
          { day: 'الخميس', orders: 10, services: 5, revenue: 2100 },
          { day: 'الجمعة', orders: 3, services: 1, revenue: 800 }
        ];
      } else if (period === 'monthly') {
        return mockDashboardStats.monthlyData;
      } else if (period === 'yearly') {
        return [
          { year: 2021, orders: 120, services: 45, revenue: 32000 },
          { year: 2022, orders: 150, services: 60, revenue: 42000 },
          { year: 2023, orders: 180, services: 75, revenue: 56000 }
        ];
      }
      
      return mockDashboardStats.monthlyData;
    }

    const response = await api.get(`/admin/dashboard/stats/${period}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
/**
 * جلب إحصاءات حسب التصنيفات
 */
const getStatsByCategory = async () => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      return [
        { category: 'قميص', count: 10, revenue: 1500 },
        { category: 'بنطلون', count: 15, revenue: 3000 },
        { category: 'جاكيت', count: 8, revenue: 2800 },
        { category: 'فستان', count: 12, revenue: 4200 },
        { category: 'عباءة', count: 5, revenue: 1750 }
      ];
    }

    const response = await api.get('/admin/dashboard/stats/categories');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * جلب إحصاءات المستخدمين
 */
const getUserStats = async () => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      return {
        totalUsers: mockUsers.length,
        activeUsers: mockUsers.filter(user => user.isActive).length,
        usersByRole: [
          { role: 'user', count: mockUsers.filter(user => user.role === 'user').length },
          { role: 'admin', count: mockUsers.filter(user => user.role === 'admin').length },
          { role: 'tailor', count: mockUsers.filter(user => user.role === 'tailor').length }
        ],
        registrationTrend: [
          { month: 'يناير', count: 5 },
          { month: 'فبراير', count: 8 },
          { month: 'مارس', count: 12 }
        ]
      };
    }

    const response = await api.get('/admin/dashboard/stats/users');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ----- خدمات الإشعارات والرسائل -----

/**
 * جلب إشعارات لوحة التحكم
 */
const getAdminNotifications = async (params = {}) => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      const mockNotifications = [
        {
          _id: '1',
          type: 'new_order',
          message: 'طلب جديد بانتظار المراجعة',
          createdAt: '2023-03-01T10:30:00Z',
          isRead: false,
          data: { orderId: '1' }
        },
        {
          _id: '2',
          type: 'new_user',
          message: 'تم تسجيل مستخدم جديد',
          createdAt: '2023-03-01T09:15:00Z',
          isRead: true,
          data: { userId: '4' }
        },
        {
          _id: '3',
          type: 'new_service_request',
          message: 'طلب خدمة احترافية جديد',
          createdAt: '2023-02-28T14:45:00Z',
          isRead: false,
          data: { serviceId: '1' }
        },
        {
          _id: '4',
          type: 'payment_received',
          message: 'تم استلام دفعة جديدة',
          createdAt: '2023-02-28T11:20:00Z',
          isRead: true,
          data: { orderId: '2', amount: 200 }
        },
        {
          _id: '5',
          type: 'stock_low',
          message: 'مخزون القماش القطني منخفض',
          createdAt: '2023-02-27T16:30:00Z',
          isRead: false,
          data: { materialId: '3', currentStock: 5 }
        }
      ];
      
      // تصفية الإشعارات
      let filteredNotifications = [...mockNotifications];
      
      // تصفية حسب النوع
      if (params.type) {
        filteredNotifications = filteredNotifications.filter(notification => 
          notification.type === params.type
        );
      }
      
      // تصفية حسب حالة القراءة
      if (params.isRead !== undefined) {
        const isRead = params.isRead === 'true' || params.isRead === true;
        filteredNotifications = filteredNotifications.filter(notification => 
          notification.isRead === isRead
        );
      }
      
      // تطبيق الترتيب (افتراضياً من الأحدث إلى الأقدم)
      filteredNotifications.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      return filteredNotifications;
    }

    const response = await api.get('/admin/notifications', { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * تحديث حالة قراءة الإشعار
 */
const markNotificationAsRead = async (id) => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      return { success: true, message: 'تم تحديث حالة الإشعار بنجاح' };
    }

    const response = await api.patch(`/admin/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * تعليم جميع الإشعارات كمقروءة
 */
const markAllNotificationsAsRead = async () => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      return { success: true, message: 'تم تعليم جميع الإشعارات كمقروءة' };
    }

    const response = await api.patch('/admin/notifications/read-all');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ----- خدمات إعدادات النظام -----

/**
 * جلب إعدادات النظام
 */
const getSystemSettings = async () => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      return {
        siteTitle: 'منصة ترزي للخياطة',
        siteLogo: 'https://example.com/logo.png',
        contactEmail: 'info@tarzi.com',
        contactPhone: '0551234567',
        deliveryFee: 20,
        vatPercentage: 15,
        socialLinks: {
          facebook: 'https://facebook.com/tarzi',
          twitter: 'https://twitter.com/tarzi',
          instagram: 'https://instagram.com/tarzi'
        },
        maintenanceMode: false,
        paymentGateways: [
          { name: 'مدى', isActive: true },
          { name: 'فيزا/ماستركارد', isActive: true },
          { name: 'آبل باي', isActive: false }
        ]
      };
    }

    const response = await api.get('/admin/settings');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * تحديث إعدادات النظام
 */
const updateSystemSettings = async (settings) => {
  try {
    await mockDelay(1200);
    
    if (USE_MOCK_DATA) {
      return {
        success: true,
        message: 'تم تحديث الإعدادات بنجاح',
        settings
      };
    }

    const response = await api.put('/admin/settings', settings);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * فحص حالة النظام وأداؤه
 */
const getSystemHealth = async () => {
  try {
    await mockDelay();
    
    if (USE_MOCK_DATA) {
      return {
        status: 'healthy',
        uptime: '5 days, 12 hours',
        databaseConnected: true,
        storageUsed: '45%',
        cpuUsage: '12%',
        memoryUsage: '35%',
        activeUsers: 28,
        lastBackup: '2023-03-01T03:00:00Z'
      };
    }

    const response = await api.get('/admin/system/health');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// تصدير خدمات Admin
export const adminService = {
  // خدمات المستخدمين
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  
  // خدمات المنتجات
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // خدمات الطلبات
  getOrders,
  getOrderById,
  updateOrderStatus,
  
  // خدمات الخدمات الاحترافية
  getProfessionalServices,
  getProfessionalServiceById,
  updateProfessionalServiceStatus,
  
  // خدمات لوحة التحكم والإحصاءات
  getDashboardStats,
  getStatsByPeriod,
  getStatsByCategory,
  getUserStats,
  
  // خدمات الإشعارات والرسائل
  getAdminNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  
  // خدمات إعدادات النظام
  getSystemSettings,
  updateSystemSettings,
  getSystemHealth
};

export default adminService;