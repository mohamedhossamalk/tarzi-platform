// frontend/src/services/api.js
import axios from 'axios';

// --------- التكوين الأساسي ---------

// تكوين عنوان URL الأساسي
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// تكوين المهلة الزمنية، يمكن تجاوزها في الطلبات الفردية
const DEFAULT_TIMEOUT = 15000;

// وضع المحاكاة - لمحاكاة الطلبات بدون خادم حقيقي
const MOCK_MODE = process.env.REACT_APP_MOCK_MODE === 'true' || false;

// طباعة معلومات التكوين في وضع التطوير
if (process.env.NODE_ENV === 'development') {
  console.log('🔌 تكوين API:');
  console.log(`  - عنوان API الأساسي: ${API_URL}`);
  console.log(`  - المهلة الزمنية الافتراضية: ${DEFAULT_TIMEOUT}ms`);
  console.log(`  - وضع المحاكاة: ${MOCK_MODE ? 'مفعل ✓' : 'معطل ✗'}`);
}

// --------- إنشاء مثيل الطلب ---------

const apiInstance = axios.create({
  baseURL: API_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// --------- وظائف مساعدة ---------

/**
 * تحصيل رمز المستخدم من التخزين المحلي
 * @returns {string|null} رمز المستخدم أو null إذا لم يكن المستخدم مسجل الدخول
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * تحصيل معلومات المستخدم من التخزين المحلي
 * @returns {Object|null} معلومات المستخدم أو null إذا لم يكن المستخدم مسجل الدخول
 */
const getUser = () => {
  const userStr = localStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error('خطأ في قراءة بيانات المستخدم من التخزين المحلي:', e);
    return null;
  }
};

/**
 * تسجيل الخروج وإعادة توجيه المستخدم
 * @param {string} message - رسالة للمستخدم (اختياري)
 * @param {string} redirectUrl - رابط إعادة التوجيه (اختياري، الافتراضي هو /login)
 */
const logoutAndRedirect = (message = null, redirectUrl = '/login') => {
  // تنظيف التخزين المحلي
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // إذا تم تقديم رسالة، عرضها للمستخدم
  if (message && typeof window !== 'undefined') {
    // استخدام toast إذا كان متاحًا، وإلا استخدام alert
    if (window.toast) {
      window.toast.error(message);
    } else {
      alert(message);
    }
  }
  
  // إعادة التوجيه بعد تأخير قصير
  setTimeout(() => {
    if (typeof window !== 'undefined' && window.location) {
      window.location.href = redirectUrl;
    }
  }, 100);
};

/**
 * تنسيق رسالة الخطأ لتكون مفهومة للمستخدم
 * @param {Error} error - كائن الخطأ
 * @returns {string} رسالة الخطأ المنسقة
 */
const formatErrorMessage = (error) => {
  // إذا كان الخطأ من الخادم ويحتوي على رسالة
  if (error.response && error.response.data) {
    if (typeof error.response.data === 'string') {
      return error.response.data;
    }
    if (error.response.data.message) {
      return error.response.data.message;
    }
    if (error.response.data.error) {
      return error.response.data.error;
    }
  }
  
  // إذا لم تكن هناك استجابة ولكن هناك طلب
  if (error.request && !error.response) {
    return 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.';
  }
  
  // استخدام رسالة الخطأ العادية للحالات الأخرى
  return error.message || 'حدث خطأ غير معروف';
};

/**
 * إنشاء معرف فريد - مفيد لتمييز الطلبات في السجلات
 * @returns {string} معرف فريد
 */
const generateRequestId = () => {
  return `req_${Math.random().toString(36).substring(2, 10)}`;
};

// --------- اعتراض الطلبات الصادرة ---------

apiInstance.interceptors.request.use(
  (config) => {
    // إنشاء معرف فريد للطلب لتتبعه في السجلات
    const requestId = generateRequestId();
    config.requestId = requestId;
    
    // تسجيل تفاصيل الطلب في وضع التطوير
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 [${requestId}] إرسال طلب ${config.method?.toUpperCase() || 'GET'} إلى: ${config.baseURL}${config.url}`);
      
      // إضافة معلومات البيانات المرسلة (إن وجدت) للتشخيص
      if (config.data) {
        try {
          const printableData = typeof config.data === 'string' 
            ? JSON.parse(config.data) 
            : config.data;
          console.log(`📦 [${requestId}] البيانات المرسلة:`, 
            JSON.stringify(printableData).length > 500 
              ? JSON.stringify(printableData).substring(0, 500) + '...' 
              : JSON.stringify(printableData));
        } catch (e) {
          console.log(`📦 [${requestId}] البيانات المرسلة: [غير قابلة للعرض]`);
        }
      }
    }
    
    // إضافة توكن المصادقة إذا كان متاحًا
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // إضافة معرف عشوائي لمنع التخزين المؤقت للطلبات GET
    if (config.method === 'get' || !config.method) {
      config.params = {
        ...config.params,
        _t: new Date().getTime()
      };
    }
    
    // إضافة توقيت بداية الطلب لقياس الأداء
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    console.error('❌ خطأ في إرسال الطلب:', error.message);
    return Promise.reject(error);
  }
);

// --------- اعتراض الاستجابات الواردة ---------

apiInstance.interceptors.response.use(
  (response) => {
    // حساب وقت استجابة الطلب
    const requestTime = response.config.metadata 
      ? new Date() - response.config.metadata.startTime 
      : null;
    
    const requestId = response.config.requestId || 'unknown';
    
    // تسجيل نجاح الطلب في وضع التطوير
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `✅ [${requestId}] استلام استجابة ناجحة من: ${response.config.url}`,
        requestTime ? `(${requestTime}ms)` : ''
      );
      
      // إضافة معلومات البيانات المستلمة للتشخيص
      try {
        const dataStr = JSON.stringify(response.data);
        const dataPreview = dataStr.length > 200 ? `${dataStr.substring(0, 200)}...` : dataStr;
        console.log(`📥 [${requestId}] البيانات المستلمة: ${dataPreview}`);
      } catch (e) {
        console.log(`📥 [${requestId}] البيانات المستلمة: [غير قابلة للعرض]`);
      }
    }

    // معالجة هياكل البيانات الشائعة وتوحيدها
    if (response.data && typeof response.data === 'object') {
      // دعم للاستجابات التي تستخدم services أو professionalServices
      if (response.data.services || response.data.professionalServices) {
        // توحيد الهيكل (استجابة متناسقة) لجميع المكونات
        if (!response.data.professionalServices && response.data.services) {
          response.data.professionalServices = response.data.services;
        }
      }

      // دعم صفحات الترقيم المختلفة
      if (response.data.pagination || response.data.pages) {
        if (!response.data.pages && response.data.pagination && response.data.pagination.totalPages) {
          response.data.pages = response.data.pagination.totalPages;
        }
      }
    }
    
    return response;
  },
  (error) => {
    const requestId = error.config?.requestId || 'unknown';
    
    // حساب وقت الطلب (حتى في حالة الخطأ)
    const requestTime = error.config?.metadata 
      ? new Date() - error.config.metadata.startTime 
      : null;
    
    // معالجة وتسجيل الأخطاء بشكل أفضل
    if (error.response) {
      // الخادم رد مع حالة خارج نطاق 2xx
      console.error(
        `❌ [${requestId}] خطأ استجابة (${error.response.status}):`,
        error.response.data,
        requestTime ? `(${requestTime}ms)` : ''
      );
      console.error(
        `📝 [${requestId}] المسار: ${error.config?.method?.toUpperCase() || 'GET'} ${error.config?.baseURL || ''}${error.config?.url || ''}`
      );
      
      // تسجيل الخروج إذا كان الخطأ 401 (غير مصرح)
      if (error.response.status === 401) {
        console.warn(`⚠️ [${requestId}] جلسة غير مصرح بها، جاري تسجيل الخروج...`);
        
        // فحص إذا كان الطلب نفسه هو طلب تسجيل الدخول أو تسجيل الخروج
        const isAuthRequest = error.config?.url?.includes('/auth/');
        
        if (!isAuthRequest) {
          // تسجيل الخروج فقط إذا لم يكن الطلب الحالي هو طلب مصادقة
          logoutAndRedirect('انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.');
        }
      }
      
      // معالجة خطأ 404 (غير موجود)
      if (error.response.status === 404) {
        console.error(`🔍 [${requestId}] المسار المطلوب غير موجود على الخادم:`, error.config.url);
        
        // تحقق إذا كان المسار متعلقًا بلوحة التحكم
        if (error.config.url.includes('/dashboard') || error.config.url.includes('/admin')) {
          // تسجيل معلومات إضافية لأخطاء لوحة التحكم
          console.error(`⚠️ [${requestId}] خطأ في بيانات لوحة التحكم. تحقق من صلاحيات المستخدم ومن الخادم الخلفي.`);
        }
      }
      
      // معالجة خطأ 403 (ممنوع)
      if (error.response.status === 403) {
        console.error(`🚫 [${requestId}] ليس لديك صلاحية للوصول إلى هذا المورد:`, error.config.url);
      }
    } else if (error.request) {
      // تم إرسال الطلب لكن لم يتم استلام استجابة
      console.error(
        `❌ [${requestId}] لم يتم استلام استجابة من الخادم:`,
        error.request,
        requestTime ? `(${requestTime}ms)` : ''
      );
      console.error(`⏱️ [${requestId}] هل الخادم يعمل على المنفذ الصحيح؟`);
      
      // إضافة نصائح استكشاف الأخطاء وإصلاحها
      console.info(`💡 [${requestId}] نصائح استكشاف المشكلات:`);
      console.info(`1. [${requestId}] تأكد من أن الخادم الخلفي يعمل على العنوان الصحيح:`, API_URL);
      console.info(`2. [${requestId}] تحقق من اتصال الشبكة`);
      console.info(`3. [${requestId}] تحقق من سجلات الخادم الخلفي للبحث عن الأخطاء`);
      console.info(`4. [${requestId}] تحقق من وجود جدران حماية أو خوادم وسيطة تمنع الاتصال`);
    } else {
      // حدث خطأ أثناء إعداد الطلب
      console.error(`❌ [${requestId}] خطأ في إعداد الطلب:`, error.message);
    }
    
    // تنسيق رسالة الخطأ وإضافتها إلى كائن الخطأ
    error.userMessage = formatErrorMessage(error);
    
    return Promise.reject(error);
  }
);

// --------- وظيفة للتوافق مع أنماط استجابة مختلفة ---------

/**
 * تحويل هيكل الاستجابة لتناسب توقعات المكونات المختلفة
 * مثل: تحويل services -> professionalServices
 * @param {Object} response - الاستجابة الأصلية
 * @param {Object} options - خيارات التحويل
 * @returns {Object} الاستجابة المحولة
 */
apiInstance.normalizeResponse = (response, options = {}) => {
  const {
    serviceField = true, // تحويل services <-> professionalServices
    paginationField = true // تحويل حقول الصفحات
  } = options;

  if (!response || typeof response !== 'object') {
    return response;
  }

  const result = { ...response };

  // توحيد حقول الخدمات
  if (serviceField) {
    // تحويل services -> professionalServices إذا لم تكن موجودة
    if (result.services && !result.professionalServices) {
      result.professionalServices = result.services;
    }
    // تحويل professionalServices -> services إذا لم تكن موجودة
    if (result.professionalServices && !result.services) {
      result.services = result.professionalServices;
    }
  }

  // توحيد حقول التصفيح
  if (paginationField) {
    // تحويل pagination.totalPages -> pages
    if (result.pagination && result.pagination.totalPages && !result.pages) {
      result.pages = result.pagination.totalPages;
    }
    // تحويل pages -> pagination.totalPages
    if (result.pages && (!result.pagination || !result.pagination.totalPages)) {
      result.pagination = result.pagination || {};
      result.pagination.totalPages = result.pages;
    }
  }

  return result;
};

// --------- وظائف الخدمة المساعدة ---------

/**
 * التحقق من حالة الاتصال بالخادم
 * @returns {Promise<Object>} نتيجة الفحص
 */
apiInstance.checkConnection = async () => {
  try {
    // استخدام وقت انتهاء مهلة أقصر للفحص
    const response = await apiInstance.get('/health-check', { timeout: 5000 });
    console.log('✅ الاتصال بالخادم ناجح:', response.data);
    return { 
      status: true, 
      data: response.data,
      serverTime: response.headers.date ? new Date(response.headers.date) : new Date()
    };
  } catch (error) {
    console.error('❌ فشل الاتصال بالخادم:', error.message);
    
    // معلومات تشخيصية أكثر تفصيلاً
    if (error.response) {
      return { 
        status: false, 
        error: `خطأ استجابة: ${error.response.status}`, 
        details: error.response.data,
        message: formatErrorMessage(error)
      };
    }
    
    return { 
      status: false, 
      error: error.message,
      details: 'تأكد من تشغيل الخادم الخلفي وأنه متاح على المسار الصحيح',
      message: formatErrorMessage(error)
    };
  }
};

/**
 * اختبار خاص لمصادقة المستخدم
 * @returns {Promise<Object>} نتيجة الاختبار
 */
apiInstance.testAuthEndpoint = async () => {
  try {
    console.log('⚙️ اختبار نقطة نهاية المصادقة...');
    
    const response = await apiInstance.get('/auth/test', { timeout: 5000 });
    
    console.log('✅ اختبار المصادقة ناجح:', response.data);
    
    return {
      status: true,
      message: 'نقطة نهاية المصادقة تعمل بشكل صحيح',
      data: response.data
    };
  } catch (error) {
    console.error('❌ فشل اختبار المصادقة:', error);
    
    let details = {};
    
    if (error.response) {
      details = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      };
    }
    
    return {
      status: false,
      message: 'فشل الاتصال بنقطة نهاية المصادقة',
      error: error.message,
      details
    };
  }
};

/**
 * اختبار كامل لربط تسجيل الدخول
 * يتحقق من الاتصال بالخادم ونقاط النهاية المطلوبة
 * @returns {Promise<Object>} نتيجة الاختبار الشامل
 */
apiInstance.testLoginConnectivity = async () => {
  console.log('🔍 بدء اختبار اتصال تسجيل الدخول الشامل...');
  
  const results = {
    server: null,
    auth: null,
    login: null,
    overall: null
  };
  
  try {
    // اختبار 1: الاتصال بالخادم
    console.log('📡 اختبار الاتصال بالخادم...');
    results.server = await apiInstance.checkConnection();
    
    // اختبار 2: نقطة نهاية المصادقة
    if (results.server.status) {
      console.log('🔐 اختبار نقطة نهاية المصادقة...');
      results.auth = await apiInstance.testAuthEndpoint();
    }
    
    // اختبار 3: محاولة طلب تسجيل دخول بدون بيانات (لاختبار الاستجابة فقط)
    if (results.auth && results.auth.status) {
      console.log('🧪 اختبار طلب تسجيل الدخول (بدون بيانات)...');
      
      try {
        // لا نريد نجاح تسجيل الدخول بالفعل، فقط اختبار الاتصال
        await apiInstance.post('/auth/login', {});
      } catch (loginError) {
        // نتوقع خطأ هنا لأننا لم نرسل بيانات صحيحة
        // نتحقق فقط من أن نقطة النهاية متاحة وترد بشكل صحيح
        if (loginError.response) {
          results.login = {
            status: true,
            message: 'نقطة نهاية تسجيل الدخول متاحة',
            responseStatus: loginError.response.status,
            details: 'الخادم يستجيب لطلبات تسجيل الدخول بشكل صحيح'
          };
        } else {
          results.login = {
            status: false,
            message: 'مشكلة في نقطة نهاية تسجيل الدخول',
            error: loginError.message
          };
        }
      }
    }
    
    // تقييم النتيجة الإجمالية
    const serverOk = results.server && results.server.status;
    const authOk = results.auth && results.auth.status;
    const loginOk = results.login && results.login.status;
    
    results.overall = {
      status: serverOk && authOk && loginOk,
      message: serverOk && authOk && loginOk
        ? 'جميع اختبارات الاتصال ناجحة. يمكن تسجيل الدخول بشكل صحيح.'
        : 'فشلت بعض اختبارات الاتصال. تسجيل الدخول قد لا يعمل بشكل صحيح.',
      details: {
        server: serverOk ? '✅ متصل' : '❌ غير متصل',
        auth: authOk ? '✅ يعمل' : '❌ لا يعمل',
        login: loginOk ? '✅ يعمل' : '❌ لا يعمل'
      }
    };
    
    console.log(
      results.overall.status
        ? '✅ اختبار الاتصال الشامل ناجح'
        : '❌ فشل اختبار الاتصال الشامل',
      results.overall
    );
    
    return results;
  } catch (error) {
    console.error('❌ فشل اختبار الاتصال الشامل بخطأ غير متوقع:', error);
    
    return {
      ...results,
      overall: {
        status: false,
        message: 'حدث خطأ غير متوقع أثناء اختبار الاتصال',
        error: error.message
      }
    };
  }
};

/**
 * وظيفة مساعدة لإرسال طلب مع إعادة المحاولة تلقائيًا
 * @param {string} method - نوع الطلب (get, post, put, delete)
 * @param {string} url - مسار الطلب
 * @param {Object|null} data - بيانات الطلب
 * @param {Object} options - خيارات الطلب
 * @returns {Promise<Object>} استجابة الطلب
 */
apiInstance.retryRequest = async (method, url, data = null, options = {}) => {
  const { 
    retries = 3, 
    initialDelay = 1000, 
    maxDelay = 10000,
    timeout = DEFAULT_TIMEOUT,
    onRetry = null 
  } = options;
  
  let lastError;
  let delay = initialDelay;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      let response;
      
      switch (method.toLowerCase()) {
        case 'get':
          response = await apiInstance.get(url, { 
            params: data, 
            timeout,
            ...options.requestConfig 
          });
          break;
        case 'post':
          response = await apiInstance.post(url, data, { 
            timeout,
            ...options.requestConfig 
          });
          break;
        case 'put':
          response = await apiInstance.put(url, data, { 
            timeout,
            ...options.requestConfig 
          });
          break;
        case 'delete':
          response = await apiInstance.delete(url, { 
            data,
            timeout,
            ...options.requestConfig 
          });
          break;
        case 'patch':
          response = await apiInstance.patch(url, data, { 
            timeout,
            ...options.requestConfig 
          });
          break;
        default:
          throw new Error(`نوع الطلب غير مدعوم: ${method}`);
      }
      
      return response; // إذا نجح الطلب، أرجع الاستجابة
    } catch (error) {
      lastError = error;
      
      // لا تعد المحاولة لبعض أخطاء الخادم مثل 401, 403, 404
      if (error.response) {
        const status = error.response.status;
        if (status === 401 || status === 403 || status === 404) {
          throw error;
        }
      }
      
      if (attempt < retries) {
        console.warn(`⚠️ محاولة ${attempt}/${retries} فشلت. إعادة المحاولة بعد ${delay}ms...`);
        
        // استدعاء دالة معالجة إعادة المحاولة إذا تم توفيرها
        if (onRetry && typeof onRetry === 'function') {
          onRetry(attempt, delay, error);
        }
        
        // انتظر قبل إعادة المحاولة
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // زيادة التأخير تدريجياً مع كل محاولة (استراتيجية الانتظار التراجعي الأسي)
        // لكن لا تتجاوز الحد الأقصى للتأخير
        delay = Math.min(delay * 2, maxDelay);
      }
    }
  }
  
  console.error(`❌ فشلت جميع محاولات إعادة المحاولة (${retries}) للمسار: ${url}`);
  throw lastError;
};

/**
 * نقطة نهاية للتعامل مع تحميل الملفات
 * @param {string} url - مسار التحميل
 * @param {FormData} formData - كائن FormData مع الملفات
 * @param {Object} options - خيارات إضافية
 * @returns {Promise<Object>} استجابة التحميل
 */
apiInstance.uploadFile = async (url, formData, options = {}) => {
  const { 
    onProgress = null,
    timeout = 60000, // مهلة أطول للتحميلات
    ...requestConfig 
  } = options;
  
  // إنشاء معلمات الطلب، بما في ذلك تتبع التقدم إذا تم توفير onProgress
  const config = {
    timeout,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...requestConfig
  };
  
  // إضافة معالج التقدم إذا تم توفيره
  if (onProgress && typeof onProgress === 'function') {
    config.onUploadProgress = (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(percentCompleted, progressEvent);
    };
  }
  
  try {
    const response = await apiInstance.post(url, formData, config);
    return response.data;
  } catch (error) {
    error.userMessage = formatErrorMessage(error);
    throw error;
  }
};
/**
 * استخراج رسالة الخطأ من الاستجابة
 * @param {Error} error - كائن الخطأ
 * @returns {string} رسالة الخطأ
 */
apiInstance.extractErrorMessage = formatErrorMessage;

/**
 * إعادة تكوين عنوان API الأساسي (مفيد عند تحديث البيئة)
 * @param {string} newBaseUrl - عنوان API الأساسي الجديد
 */
apiInstance.reconfigureBaseUrl = (newBaseUrl) => {
  if (!newBaseUrl) {
    console.error('❌ محاولة إعادة تكوين عنوان API الأساسي بقيمة فارغة');
    return;
  }
  
  console.log(`🔄 إعادة تكوين عنوان API الأساسي من: ${apiInstance.defaults.baseURL} إلى: ${newBaseUrl}`);
  apiInstance.defaults.baseURL = newBaseUrl;
};

/**
 * الطلب المباشر دون استخدام معترضات
 * مفيدة لحالات الاختبار أو عندما لا تريد معالجة الخطأ التلقائية
 * @param {Object} config - تكوين الطلب المباشر
 * @returns {Promise<Object>} الاستجابة المباشرة
 */
apiInstance.directRequest = async (config) => {
  try {
    const axiosInstance = axios.create({
      baseURL: API_URL,
      timeout: DEFAULT_TIMEOUT
    });
    
    return await axiosInstance(config);
  } catch (error) {
    throw error;
  }
};

/**
 * تعيين رمز توكن المصادقة يدوياً
 * مفيدة لاختبارات المصادقة أو الحالات الخاصة
 * @param {string} token - التوكن المراد تعيينه
 */
apiInstance.setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    console.log('✅ تم تعيين التوكن بنجاح');
  } else {
    localStorage.removeItem('token');
    console.log('⚠️ تم إزالة التوكن');
  }
};

/**
 * وظيفة خاصة لفحص صحة تكوين CORS
 * @returns {Promise<Object>} نتيجة اختبار CORS
 */
apiInstance.testCORS = async () => {
  try {
    console.log('🔄 اختبار تكوين CORS...');
    
    // استخدام طلب مخصص مع رؤوس إضافية لاختبار CORS
    const response = await apiInstance.directRequest({
      method: 'OPTIONS',
      url: '/health-check',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': response.headers['access-control-allow-headers'],
      'Access-Control-Allow-Credentials': response.headers['access-control-allow-credentials']
    };
    
    console.log('✅ اختبار CORS ناجح:', corsHeaders);
    
    return {
      status: true,
      message: 'تكوين CORS صحيح',
      corsHeaders
    };
  } catch (error) {
    console.error('❌ فشل اختبار CORS:', error);
    
    return {
      status: false,
      message: 'فشل اختبار CORS',
      error: error.message,
      suggestion: 'تأكد من تكوين CORS بشكل صحيح على الخادم الخلفي'
    };
  }
};

/**
 * اختبار تفصيلي لمسار تسجيل الدخول
 * يساعد في تشخيص مشاكل المصادقة
 * @param {Object} credentials - بيانات اعتماد الاختبار (لا تستخدم بيانات حقيقية هنا)
 * @returns {Promise<Object>} نتيجة اختبار تسجيل الدخول
 */
apiInstance.debugLogin = async (credentials = { email: 'test@example.com', password: 'password' }) => {
  console.group('🔍 تشخيص مسار تسجيل الدخول');
  console.log('بدء اختبار تسجيل الدخول مع بيانات اعتماد اختبار');
  
  try {
    // 1. اختبار الاتصال بالخادم أولاً
    const serverConnection = await apiInstance.checkConnection();
    console.log('نتيجة اتصال الخادم:', serverConnection);
    
    if (!serverConnection.status) {
      console.groupEnd();
      return {
        status: false,
        stage: 'server_connection',
        message: 'فشل الاتصال بالخادم. تأكد من تشغيل الخادم الخلفي.',
        details: serverConnection
      };
    }
    
    // 2. محاولة تسجيل دخول باستخدام مثيل axios منفصل
    // لتجنب سلوك معترض الاستجابة
    console.log('محاولة طلب تسجيل دخول مباشر...');
    
    try {
      const directLoginResponse = await axios.post(`${API_URL}/auth/login`, credentials, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('استجابة تسجيل الدخول المباشرة:', directLoginResponse);
      
      console.groupEnd();
      return {
        status: true,
        stage: 'login_success',
        message: 'طلب تسجيل الدخول ناجح',
        response: {
          status: directLoginResponse.status,
          hasToken: !!directLoginResponse.data?.token,
          dataKeys: Object.keys(directLoginResponse.data || {})
        }
      };
    } catch (loginError) {
      console.log('خطأ تسجيل الدخول المباشر:', loginError);
      
      // 3. تحليل الخطأ
      if (loginError.response) {
        // الخادم استجاب، لكن مع حالة خطأ
        console.groupEnd();
        return {
          status: false,
          stage: 'login_error_response',
          message: 'خطأ في استجابة تسجيل الدخول من الخادم',
          error: {
            status: loginError.response.status,
            statusText: loginError.response.statusText,
            data: loginError.response.data
          },
          suggestion: loginError.response.status === 401
            ? 'بيانات الاعتماد غير صحيحة أو نقطة نهاية تسجيل الدخول تتوقع تنسيق بيانات مختلف'
            : 'تحقق من سجلات الخادم الخلفي للحصول على مزيد من المعلومات'
        };
      } else if (loginError.request) {
        // تم إرسال الطلب، لكن لم يتم استلام استجابة
        console.groupEnd();
        return {
          status: false,
          stage: 'login_no_response',
          message: 'لم يتم استلام استجابة من خادم تسجيل الدخول',
          error: {
            message: loginError.message,
            request: loginError.request instanceof XMLHttpRequest
              ? 'XMLHttpRequest (محتويات مفصلة غير متاحة)'
              : loginError.request
          },
          suggestion: 'تحقق من نقطة نهاية تسجيل الدخول وتأكد من أنها تعمل بشكل صحيح'
        };
      } else {
        // حدث خطأ أثناء إعداد الطلب
        console.groupEnd();
        return {
          status: false,
          stage: 'login_request_setup',
          message: 'خطأ في إعداد طلب تسجيل الدخول',
          error: loginError.message,
          suggestion: 'تحقق من تكوين axios وعنوان API'
        };
      }
    }
  } catch (error) {
    console.error('خطأ غير متوقع أثناء تشخيص تسجيل الدخول:', error);
    console.groupEnd();
    
    return {
      status: false,
      stage: 'unexpected_error',
      message: 'حدث خطأ غير متوقع أثناء تشخيص تسجيل الدخول',
      error: error.message
    };
  }
};

/**
 * استيراد وظائف المساعدة المتعلقة بالمصادقة
 */
apiInstance.auth = {
  getToken,
  getUser,
  isAuthenticated: () => !!getToken(),
  isAdmin: () => {
    const user = getUser();
    return user && user.role === 'admin';
  },
  hasRole: (role) => {
    const user = getUser();
    return user && user.role === role;
  },
  logout: () => logoutAndRedirect(),
  setToken: (token) => apiInstance.setAuthToken(token),
  checkLoginConfiguration: async () => apiInstance.testLoginConnectivity()
};

// تصدير api كافتراضي
export default apiInstance;