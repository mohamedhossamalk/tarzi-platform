// frontend/src/services/auth.service.js
import api from './api';

// استخدام محاكاة البيانات في حالة عدم وجود خادم خلفي
const USE_MOCK_DATA = true; // قم بتغيير هذا إلى false عند وجود خادم خلفي حقيقي

// ----- بيانات المحاكاة -----
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
    isActive: true,
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

// تخزين بيانات كلمات المرور المحاكاة (للاختبار فقط)
const mockPasswords = {
  'admin@example.com': 'admin123',
  'user1@example.com': 'user1234',
  'user2@example.com': 'user1234',
  'tailor1@example.com': 'tailor1234',
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
 * @param {Error} error - كائن الخطأ
 * @returns {Error} خطأ محسن مع رسالة مفهومة
 */
const handleApiError = (error) => {
  let message = 'حدث خطأ غير معروف';
  
  if (error.response) {
    // استجابة الخادم بكود خطأ
    if (error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else {
      switch (error.response.status) {
        case 400:
          message = 'طلب غير صالح';
          break;
        case 401:
          message = 'لم يتم التصريح. يرجى تسجيل الدخول مرة أخرى';
          break;
        case 403:
          message = 'عذرًا، ليس لديك صلاحية للوصول إلى هذه الخدمة';
          break;
        case 404:
          message = 'المورد المطلوب غير موجود';
          break;
        case 500:
          message = 'حدث خطأ في الخادم';
          break;
        default:
          message = `حدث خطأ (${error.response.status})`;
      }
    }
    
    console.error('خطأ من الخادم:', error.response.data);
  } else if (error.request) {
    message = 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت';
    console.error('لا توجد استجابة من الخادم:', error.request);
  } else {
    message = error.message || 'حدث خطأ غير معروف';
    console.error('خطأ في إعداد الطلب:', error.message);
  }
  
  const enhancedError = new Error(message);
  enhancedError.originalError = error;
  return enhancedError;
};

/**
 * تخزين توكن التصريح في التخزين المحلي
 * @param {string} token - توكن التصريح
 * @param {Object} user - بيانات المستخدم
 */
const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * الحصول على المستخدم الحالي من التخزين المحلي
 * @returns {Object|null} بيانات المستخدم المخزنة أو null
 */
const getStoredUser = () => {
  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('خطأ في قراءة بيانات المستخدم من التخزين المحلي:', error);
    return null;
  }
};

// ----- خدمات المصادقة -----

export const authService = {
  /**
   * تسجيل مستخدم جديد
   * @param {Object} userData - بيانات المستخدم
   */
  register: async (userData) => {
    try {
      await mockDelay(1200);
      
      if (USE_MOCK_DATA) {
        // التحقق من عدم وجود المستخدم بالفعل
        const existingUser = mockUsers.find(user => user.email === userData.email);
        if (existingUser) {
          const error = new Error('البريد الإلكتروني مستخدم بالفعل');
          error.response = { status: 400, data: { message: 'البريد الإلكتروني مستخدم بالفعل' } };
          throw error;
        }
        
        // إنشاء مستخدم جديد وهمي
        const newUserId = (mockUsers.length + 1).toString();
        const newUser = {
          _id: newUserId,
          username: userData.username,
          email: userData.email,
          phone: userData.phone || '',
          role: 'user', // المستخدمون الجدد هم دائمًا من نوع "user"
          isActive: true,
          createdAt: new Date().toISOString()
        };
        
        // تخزين كلمة المرور (للمحاكاة فقط - لا تفعل هذا في الإنتاج!)
        mockPasswords[userData.email] = userData.password;
        
        // إضافة المستخدم الجديد إلى المصفوفة الوهمية
        mockUsers.push(newUser);
        
        // إنشاء توكن وهمي
        const token = `mock-token-${newUserId}-${Date.now()}`;
        
        // تخزين بيانات المستخدم في التخزين المحلي
        setAuthData(token, newUser);
        
        // إرجاع البيانات كما لو كانت من الخادم
        return {
          success: true,
          token,
          user: { ...newUser, password: undefined } // لا ترجع كلمة المرور أبدًا
        };
      }
      
      const response = await api.post('/auth/register', userData);
      
      // تخزين البيانات في التخزين المحلي
      if (response.data.token && response.data.user) {
        setAuthData(response.data.token, response.data.user);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * تسجيل الدخول
   * @param {Object} credentials - بيانات الاعتماد (البريد الإلكتروني وكلمة المرور)
   */
  login: async (credentials) => {
    if (!credentials || !credentials.email || !credentials.password) {
      throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
    }
    
    try {
      await mockDelay(1000);
      
      if (USE_MOCK_DATA) {
        const user = mockUsers.find(user => user.email === credentials.email);
        
        // التحقق من وجود المستخدم وصحة كلمة المرور
        if (!user || mockPasswords[credentials.email] !== credentials.password) {
          const error = new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
          error.response = { status: 401, data: { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' } };
          throw error;
        }
        
        // التحقق من أن الحساب نشط
        if (!user.isActive) {
          const error = new Error('الحساب غير نشط، يرجى التواصل مع الإدارة');
          error.response = { status: 403, data: { message: 'الحساب غير نشط، يرجى التواصل مع الإدارة' } };
          throw error;
        }
        
        // إنشاء توكن وهمي
        const token = `mock-token-${user._id}-${Date.now()}`;
        
        // تخزين بيانات المستخدم في التخزين المحلي
        setAuthData(token, user);
        
        // إرجاع البيانات كما لو كانت من الخادم
        return {
          success: true,
          token,
          user: { ...user, password: undefined } // لا ترجع كلمة المرور أبدًا
        };
      }
      
      const response = await api.post('/auth/login', credentials);
      
      // تخزين البيانات في التخزين المحلي
      if (response.data.token && response.data.user) {
        setAuthData(response.data.token, response.data.user);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * الحصول على بيانات المستخدم الحالي
   */
  getMe: async () => {
    try {
      await mockDelay();
      
      if (USE_MOCK_DATA) {
        // الحصول على المستخدم من التخزين المحلي
        const user = getStoredUser();
        
        // التحقق من وجود المستخدم
        if (!user) {
          const error = new Error('المستخدم غير مسجل الدخول');
          error.response = { status: 401, data: { message: 'المستخدم غير مسجل الدخول' } };
          throw error;
        }
        
        // البحث عن المستخدم في قاعدة البيانات الوهمية للتأكد من أن بياناته محدثة
        const currentUser = mockUsers.find(u => u._id === user._id);
        
        if (!currentUser) {
          const error = new Error('المستخدم غير موجود');
          error.response = { status: 404, data: { message: 'المستخدم غير موجود' } };
          throw error;
        }
        
        // تحديث بيانات المستخدم في التخزين المحلي
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        return { user: currentUser };
      }
      
      const response = await api.get('/auth/me');
      
      // تحديث بيانات المستخدم في التخزين المحلي
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      // إذا كان الخطأ 401، نقوم بتسجيل الخروج تلقائيًا
      if (error.response && error.response.status === 401) {
        authService.logout();
      }
      
      throw handleApiError(error);
    }
  },

  /**
   * تحديث الملف الشخصي
   * @param {Object} userData - بيانات المستخدم المحدثة
   */
  updateProfile: async (userData) => {
    try {
      await mockDelay(1200);
      
      if (USE_MOCK_DATA) {
        // الحصول على المستخدم من التخزين المحلي
        const user = getStoredUser();
        
        // التحقق من وجود المستخدم
        if (!user) {
          const error = new Error('المستخدم غير مسجل الدخول');
          error.response = { status: 401, data: { message: 'المستخدم غير مسجل الدخول' } };
          throw error;
        }
        
        // البحث عن المستخدم في قاعدة البيانات الوهمية
        const userIndex = mockUsers.findIndex(u => u._id === user._id);
        
        if (userIndex === -1) {
          const error = new Error('المستخدم غير موجود');
          error.response = { status: 404, data: { message: 'المستخدم غير موجود' } };
          throw error;
        }
        
        // تحديث بيانات المستخدم
        const updatedUser = {
          ...mockUsers[userIndex],
          ...userData,
          updatedAt: new Date().toISOString()
        };
        
        // لا يمكن تغيير البريد الإلكتروني أو الدور
        updatedUser.email = mockUsers[userIndex].email;
        updatedUser.role = mockUsers[userIndex].role;
        
        // تحديث المستخدم في المصفوفة الوهمية
        mockUsers[userIndex] = updatedUser;
        
        // تحديث بيانات المستخدم في التخزين المحلي
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return {
          success: true,
          user: updatedUser,
          message: 'تم تحديث الملف الشخصي بنجاح'
        };
      }
      
      const response = await api.put('/users/profile', userData);
      
      // تحديث بيانات المستخدم في التخزين المحلي
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * تغيير كلمة المرور
   * @param {Object} passwordData - البيانات المطلوبة لتغيير كلمة المرور
   */
  changePassword: async (passwordData) => {
    try {
      await mockDelay(1200);
      
      if (USE_MOCK_DATA) {
        // الحصول على المستخدم من التخزين المحلي
        const user = getStoredUser();
        
        // التحقق من وجود المستخدم
        if (!user) {
          const error = new Error('المستخدم غير مسجل الدخول');
          error.response = { status: 401, data: { message: 'المستخدم غير مسجل الدخول' } };
          throw error;
        }
        
        // التحقق من صحة كلمة المرور الحالية
        if (mockPasswords[user.email] !== passwordData.currentPassword) {
          const error = new Error('كلمة المرور الحالية غير صحيحة');
          error.response = { status: 400, data: { message: 'كلمة المرور الحالية غير صحيحة' } };
          throw error;
        }
        
        // تحديث كلمة المرور
        mockPasswords[user.email] = passwordData.newPassword;
        
        return {
          success: true,
          message: 'تم تغيير كلمة المرور بنجاح'
        };
      }
      
      const response = await api.put('/users/changepassword', passwordData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * طلب إعادة تعيين كلمة المرور
   * @param {string} email - البريد الإلكتروني للمستخدم
   */
  requestPasswordReset: async (email) => {
    try {
      await mockDelay(1200);
      
      if (USE_MOCK_DATA) {
        // التحقق من وجود المستخدم
        const user = mockUsers.find(user => user.email === email);
        
        if (!user) {
          // للأمان، لا نخبر المستخدم ما إذا كان البريد الإلكتروني موجودًا أم لا
          return {
            success: true,
            message: 'إذا كان البريد الإلكتروني مسجلًا لدينا، سيتم إرسال رابط لإعادة تعيين كلمة المرور'
          };
        }
        
        // في الواقع، سنرسل بريدًا إلكترونيًا، ولكن في المحاكاة نكتفي برسالة نجاح
        console.log(`[محاكاة] تم إرسال رابط إعادة تعيين كلمة المرور إلى: ${email}`);
        
        return {
          success: true,
          message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
        };
      }
      
      const response = await api.post('/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * إعادة تعيين كلمة المرور
   * @param {string} token - توكن إعادة تعيين كلمة المرور
   * @param {string} newPassword - كلمة المرور الجديدة
   */
  resetPassword: async (token, newPassword) => {
    try {
      await mockDelay(1200);
      
      if (USE_MOCK_DATA) {
        // في الواقع، سنتحقق من التوكن، ولكن في المحاكاة نكتفي برسالة نجاح
        return {
          success: true,
          message: 'تم إعادة تعيين كلمة المرور بنجاح'
        };
      }
      
      const response = await api.post('/auth/reset-password/confirm', { token, newPassword });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * تسجيل الخروج
   */
  logout: async () => {
    try {
      await mockDelay(800);
      
      if (USE_MOCK_DATA) {
        // مسح بيانات المصادقة من التخزين المحلي
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        return { success: true, message: 'تم تسجيل الخروج بنجاح' };
      }
      
      // محاولة تسجيل الخروج من الخادم
      await api.get('/auth/logout');
      
      // مسح بيانات المصادقة من التخزين المحلي
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return { success: true, message: 'تم تسجيل الخروج بنجاح' };
    } catch (error) {
      // مسح بيانات المصادقة من التخزين المحلي حتى في حالة الخطأ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      console.warn('خطأ أثناء تسجيل الخروج من الخادم:', error.message);
      return { success: true, message: 'تم تسجيل الخروج محليًا', error: error.message };
    }
  },
  
  /**
   * التحقق مما إذا كان المستخدم مسجل الدخول
   * @returns {boolean} حالة تسجيل الدخول
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  /**
   * الحصول على توكن المستخدم الحالي
   * @returns {string|null} توكن المستخدم أو null
   */
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  /**
   * الحصول على بيانات المستخدم الحالي من التخزين المحلي
   * @returns {Object|null} بيانات المستخدم أو null
   */
  getCurrentUser: () => {
    return getStoredUser();
  },
  
  /**
   * التحقق مما إذا كان المستخدم الحالي من المشرفين
   * @returns {boolean} حالة الإشراف
   */
  isAdmin: () => {
    const user = getStoredUser();
    return user && user.role === 'admin';
  }
};

export default authService;