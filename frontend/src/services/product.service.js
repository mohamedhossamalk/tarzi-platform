// frontend/src/services/product.service.js
import api from './api';

// استخدام محاكاة البيانات في حالة عدم وجود خادم خلفي
const USE_MOCK_DATA = true; // قم بتغيير هذا إلى false عند وجود خادم خلفي حقيقي

// ----- بيانات المحاكاة -----
const mockProducts = [
  {
    _id: '1',
    name: 'قميص كلاسيكي',
    description: 'قميص كلاسيكي بتصميم أنيق مناسب للمناسبات الرسمية',
    price: 150,
    category: 'قميص',
    imageUrl: 'https://via.placeholder.com/500x600?text=Classic+Shirt',
    fabricOptions: ['قطن', 'كتان', 'بوليستر'],
    colorOptions: ['أبيض', 'أزرق فاتح', 'أسود'],
    isActive: true,
    rating: 4.5,
    reviewCount: 12,
    stockStatus: 'متوفر',
    createdAt: '2023-01-05T10:30:00Z'
  },
  {
    _id: '2',
    name: 'بنطلون قطني',
    description: 'بنطلون قطني مريح وعملي للاستخدام اليومي',
    price: 200,
    category: 'بنطلون',
    imageUrl: 'https://via.placeholder.com/500x600?text=Cotton+Pants',
    fabricOptions: ['قطن', 'جينز', 'كتان'],
    colorOptions: ['أسود', 'بني', 'كحلي'],
    isActive: true,
    rating: 4.2,
    reviewCount: 8,
    stockStatus: 'متوفر',
    createdAt: '2023-01-10T14:20:00Z'
  },
  {
    _id: '3',
    name: 'جاكيت شتوي',
    description: 'جاكيت شتوي دافئ وعصري بتصميم أنيق',
    price: 350,
    category: 'جاكيت',
    imageUrl: 'https://via.placeholder.com/500x600?text=Winter+Jacket',
    fabricOptions: ['صوف', 'جلد', 'قطن سميك'],
    colorOptions: ['أسود', 'بني', 'رمادي'],
    isActive: true,
    rating: 4.8,
    reviewCount: 15,
    stockStatus: 'متوفر',
    createdAt: '2023-01-15T09:45:00Z'
  },
  {
    _id: '4',
    name: 'قميص كاجوال',
    description: 'قميص كاجوال عصري مناسب للاستخدام اليومي',
    price: 120,
    category: 'قميص',
    imageUrl: 'https://via.placeholder.com/500x600?text=Casual+Shirt',
    fabricOptions: ['قطن', 'بوليستر', 'كتان خفيف'],
    colorOptions: ['أزرق', 'أخضر فاتح', 'رمادي'],
    isActive: true,
    rating: 4.3,
    reviewCount: 9,
    stockStatus: 'متوفر',
    createdAt: '2023-01-20T16:30:00Z'
  },
  {
    _id: '5',
    name: 'بنطلون رسمي',
    description: 'بنطلون رسمي أنيق للمناسبات الرسمية والعمل',
    price: 250,
    category: 'بنطلون',
    imageUrl: 'https://via.placeholder.com/500x600?text=Formal+Pants',
    fabricOptions: ['قماش ناعم', 'صوف', 'بوليستر'],
    colorOptions: ['أسود', 'كحلي', 'رمادي داكن'],
    isActive: true,
    rating: 4.6,
    reviewCount: 11,
    stockStatus: 'متوفر',
    createdAt: '2023-01-25T11:15:00Z'
  },
  {
    _id: '6',
    name: 'ثوب عربي',
    description: 'ثوب عربي تقليدي بقصة حديثة وخامة فاخرة',
    price: 300,
    category: 'ثوب',
    imageUrl: 'https://via.placeholder.com/500x600?text=Arabic+Thobe',
    fabricOptions: ['قطن', 'كتان', 'بوليستر'],
    colorOptions: ['أبيض', 'بيج', 'رمادي فاتح'],
    isActive: true,
    rating: 4.9,
    reviewCount: 18,
    stockStatus: 'متوفر',
    createdAt: '2023-02-01T13:20:00Z'
  },
  {
    _id: '7',
    name: 'بدلة رسمية',
    description: 'بدلة رسمية فاخرة بقصة عصرية وخامات عالية الجودة',
    price: 800,
    category: 'بدلة',
    imageUrl: 'https://via.placeholder.com/500x600?text=Formal+Suit',
    fabricOptions: ['صوف', 'قطن', 'مخلوط'],
    colorOptions: ['أسود', 'كحلي', 'رمادي'],
    isActive: true,
    rating: 4.7,
    reviewCount: 14,
    stockStatus: 'متوفر',
    createdAt: '2023-02-05T10:10:00Z'
  },
  {
    _id: '8',
    name: 'عباءة نسائية',
    description: 'عباءة نسائية عصرية بتطريزات أنيقة',
    price: 280,
    category: 'عباءة',
    imageUrl: 'https://via.placeholder.com/500x600?text=Abaya',
    fabricOptions: ['شيفون', 'حرير', 'قطن مطرز'],
    colorOptions: ['أسود', 'كحلي'],
    isActive: true,
    rating: 4.4,
    reviewCount: 7,
    stockStatus: 'متوفر',
    createdAt: '2023-02-10T14:50:00Z'
  }
];

// فئات المنتجات
const mockCategories = [
  {
    id: '1',
    name: 'قميص',
    description: 'قمصان رجالية بتصاميم متنوعة',
    iconName: 'shirt',
    count: 2
  },
  {
    id: '2',
    name: 'بنطلون',
    description: 'بناطيل رجالية بتصاميم مختلفة',
    iconName: 'pants',
    count: 2
  },
  {
    id: '3',
    name: 'جاكيت',
    description: 'جاكيتات رجالية للشتاء والخريف',
    iconName: 'jacket',
    count: 1
  },
  {
    id: '4',
    name: 'ثوب',
    description: 'أثواب رجالية تقليدية وعصرية',
    iconName: 'thobe',
    count: 1
  },
  {
    id: '5',
    name: 'بدلة',
    description: 'بدلات رجالية رسمية وشبه رسمية',
    iconName: 'suit',
    count: 1
  },
  {
    id: '6',
    name: 'عباءة',
    description: 'عباءات نسائية بتصاميم عصرية',
    iconName: 'abaya',
    count: 1
  }
];

// تقييمات المنتجات
const mockReviews = {
  '1': [
    { _id: '101', userId: '2', username: 'user1', rating: 5, comment: 'قميص رائع وخامة ممتازة', createdAt: '2023-02-15T10:30:00Z' },
    { _id: '102', userId: '3', username: 'user2', rating: 4, comment: 'جودة القماش ممتازة لكن المقاس أصغر قليلاً', createdAt: '2023-02-16T14:20:00Z' }
  ],
  '2': [
    { _id: '103', userId: '2', username: 'user1', rating: 4, comment: 'بنطلون مريح وعملي', createdAt: '2023-02-17T09:45:00Z' },
    { _id: '104', userId: '4', username: 'tailor1', rating: 5, comment: 'خامة القماش ممتازة وقصة البنطلون رائعة', createdAt: '2023-02-18T16:30:00Z' }
  ],
  '3': [
    { _id: '105', userId: '3', username: 'user2', rating: 5, comment: 'جاكيت دافئ جدًا ومناسب للشتاء', createdAt: '2023-02-19T11:15:00Z' }
  ]
};

// منتجات ذات صلة
const getRelatedProducts = (productId, category, limit = 4) => {
  // البحث عن منتجات من نفس الفئة، باستثناء المنتج الحالي
  const related = mockProducts
    .filter(product => product.category === category && product._id !== productId)
    .slice(0, limit);
  
  // إذا لم نجد ما يكفي من المنتجات ذات الصلة، نضيف منتجات أخرى
  if (related.length < limit) {
    const additional = mockProducts
      .filter(product => product.category !== category && product._id !== productId)
      .slice(0, limit - related.length);
    
    return [...related, ...additional];
  }
  
  return related;
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
        case 404:
          message = 'المنتج غير موجود';
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

// ----- خدمات المنتجات -----

// frontend/src/services/product.service.js

// لا داعي لتعديل معظم الملف، فقط دالة getProducts تحتاج تعديل في نهايتها

export const productService = {
  /**
   * الحصول على جميع المنتجات
   * @param {Object} params - معلمات التصفية والترتيب
   * @returns {Promise<Object>} كائن يحتوي على مصفوفة المنتجات ومعلومات التصفح
   */
  getProducts: async (params = {}) => {
    try {
      await mockDelay();
      
      if (USE_MOCK_DATA) {
        // نسخة من المنتجات لتطبيق التصفية والترتيب عليها
        let filteredProducts = [...mockProducts];
        
        // تصفية حسب الفئة
        if (params.category) {
          filteredProducts = filteredProducts.filter(product => 
            product.category === params.category
          );
        }
        
        // تصفية حسب السعر
        if (params.minPrice) {
          filteredProducts = filteredProducts.filter(product => 
            product.price >= Number(params.minPrice)
          );
        }
        
        if (params.maxPrice) {
          filteredProducts = filteredProducts.filter(product => 
            product.price <= Number(params.maxPrice)
          );
        }
        
        // تصفية حسب البحث
        if (params.search) {
          const searchLower = params.search.toLowerCase();
          filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchLower) || 
            product.description.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower)
          );
        }
        
        // ترتيب المنتجات
        if (params.sort) {
          switch (params.sort) {
            case 'price-asc':
              filteredProducts.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              filteredProducts.sort((a, b) => b.price - a.price);
              break;
            case 'newest':
              filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              break;
            case 'rating':
              filteredProducts.sort((a, b) => b.rating - a.rating);
              break;
            default:
              // ترتيب افتراضي حسب الأحدث
              filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          }
        }
        
        // تنفيذ الحد والصفحة
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || filteredProducts.length;
        const startIndex = (page - 1) * limit;
        const endIndex = Math.min(startIndex + limit, filteredProducts.length);
        
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        console.log('تم جلب المنتجات بنجاح. عدد المنتجات:', paginatedProducts.length);
        
        // ----- التعديل هنا: نرجع المصفوفة نفسها وليس كائناً يحتوي على المصفوفة -----
        // الخيار 1: إرجاع المصفوفة مباشرة إذا كان من المتوقع أن مكون ProductList يتعامل مع مصفوفة
        // return paginatedProducts;
        
        // الخيار 2: إرجاع مصفوفة في كائن، لكن مع التأكد من أن المكون يتعامل مع الهيكل الصحيح
        return {
          products: paginatedProducts,
          pagination: {
            totalProducts: filteredProducts.length,
            totalPages: Math.ceil(filteredProducts.length / limit),
            currentPage: page,
            hasMore: endIndex < filteredProducts.length
          }
        };
      }
      
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('خطأ عند جلب المنتجات:', error);
      // في حالة حدوث خطأ، نرجع مصفوفة فارغة أو كائن يحتوي على مصفوفة فارغة
      return { products: [], pagination: { totalProducts: 0, totalPages: 0, currentPage: 1, hasMore: false } };
    }
  },

  // باقي الدوال بدون تعديل...
};


export default productService;
