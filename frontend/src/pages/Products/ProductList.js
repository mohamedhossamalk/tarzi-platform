// frontend/src/pages/Products/ProductList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { productService } from '../../services/product.service';

// تنسيق حاوية صفحة قائمة المنتجات
const ProductsContainer = styled.div`
  background-color: #0A0A0A;
  color: #F1F1F1;
  padding: 2rem 1rem;
  min-height: 80vh;
  max-width: 1200px;
  margin: 0 auto;
  
  h2 {
    font-size: 2rem;
    color: #F1F1F1;
    margin-bottom: 2rem;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      right: 0;
      width: 60px;
      height: 4px;
      background: linear-gradient(90deg, #E11D48, #BE123C);
      border-radius: 2px;
    }
  }
`;

// تنسيق أدوات الفلترة
const ProductsFilters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const SearchFilter = styled.div`
  flex: 1;
  
  input {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: #F1F1F1;
    font-size: 1rem;
    transition: all 0.3s ease;
    width: 100%;
    
    &:focus {
      outline: none;
      border-color: rgba(225, 29, 72, 0.5);
      box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.2);
    }
    
    &::placeholder {
      color: rgba(241, 241, 241, 0.3);
    }
  }
`;

const CategoryFilter = styled.div`
  min-width: 200px;
  
  select {
    appearance: none;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: #F1F1F1;
    font-size: 1rem;
    transition: all 0.3s ease;
    width: 100%;
    cursor: pointer;
    background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
    background-repeat: no-repeat;
    background-position: left 10px center;
    
    &:focus {
      outline: none;
      border-color: rgba(225, 29, 72, 0.5);
      box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.2);
    }
    
    option {
      background-color: #111111;
    }
  }
`;

// تنسيق شبكة المنتجات
const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

// تنسيق بطاقة المنتج
const ProductCard = styled(motion.div)`
  background: #111111;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    border-color: rgba(225, 29, 72, 0.3);
  }
`;

const ProductImage = styled.div`
  height: 220px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${ProductCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
  
  h3 {
    font-size: 1.2rem;
    color: #F1F1F1;
    margin: 0 0 0.5rem;
    transition: color 0.3s ease;
  }
  
  ${ProductCard}:hover & h3 {
    color: #E11D48;
  }
`;

const ProductCategory = styled.p`
  font-size: 0.9rem;
  color: rgba(241, 241, 241, 0.6);
  margin: 0 0 0.5rem;
`;

const ProductPrice = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
  color: #E11D48;
  margin: 0.5rem 0 0;
`;

const ProductActions = styled.div`
  padding: 0 1.5rem 1.5rem;
`;

const Button = styled(Link)`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(90deg, #E11D48, #BE123C);
  color: #FFFFFF;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
  }
`;

// تنسيق رسائل الخالية والتحميل والخطأ
const NoProducts = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: rgba(241, 241, 241, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: rgba(241, 241, 241, 0.7);
  font-size: 1.2rem;
  background-color: #0A0A0A;
`;

const ErrorAlert = styled.div`
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  text-align: right;
`;



const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // تأكد من أن المتغيرات محمية قبل الاستدعاء
        setLoading(true);
        setError('');
        console.log('جاري جلب المنتجات...');
        
        const productsResponse = await productService.getProducts();
        console.log('بيانات المنتجات المستلمة:', productsResponse);
        
        // التعامل مع هيكل البيانات الصحيح بشكل دفاعي
        if (productsResponse && productsResponse.products && Array.isArray(productsResponse.products)) {
          setProducts(productsResponse.products);
          
          if (productsResponse.pagination) {
            setPagination(productsResponse.pagination);
          }
        } else if (Array.isArray(productsResponse)) {
          setProducts(productsResponse);
        } else {
          console.warn('هيكل بيانات غير متوقع:', productsResponse);
          setProducts([]);
          setError('تنسيق بيانات المنتجات غير صالح');
        }
        
        // جلب الفئات بنفس المنهج الدفاعي
        try {
          const categoriesResponse = await productService.getCategories();
          console.log('بيانات الفئات المستلمة:', categoriesResponse);
          
          if (categoriesResponse && categoriesResponse.categories && Array.isArray(categoriesResponse.categories)) {
            const categoryNames = categoriesResponse.categories.map(cat => cat && cat.name ? cat.name : 'غير مصنف');
            setCategories(categoryNames.filter(Boolean)); // إزالة القيم الفارغة
          } else if (Array.isArray(categoriesResponse)) {
            setCategories(categoriesResponse.filter(Boolean));
          } else {
            console.warn('هيكل بيانات الفئات غير متوقع:', categoriesResponse);
            setCategories([]);
          }
        } catch (catError) {
          console.error('خطأ عند جلب الفئات:', catError);
          setCategories([]);
        }
      } catch (err) {
        console.error('خطأ عند جلب المنتجات:', err);
        setError('حدث خطأ أثناء جلب المنتجات');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // دالة للتحقق من احتواء النص على كلمة البحث بأمان
  const safeIncludes = (text, searchText) => {
    if (!text || typeof text !== 'string') return false;
    if (!searchText) return true;
    return text.toLowerCase().includes(searchText.toLowerCase());
  };

  // التأكد من أن products مصفوفة قبل استخدام filter
  // استخدام معالجة أكثر أمانًا للبيانات
  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts.filter((product) => {
    if (!product) return false;
    
    // التحقق من الفئة
    const categoryMatch = !selectedCategory || product.category === selectedCategory;
    
    // التحقق من نص البحث
    const searchMatch = !filter || 
                        safeIncludes(product.name, filter) || 
                        safeIncludes(product.description, filter);
    
    return categoryMatch && searchMatch;
  });

  // تسجيل للتأكد من أن المتغيرات في حالة صحيحة
  console.log('State before rendering:', {
    productsLength: safeProducts.length,
    filteredProductsLength: filteredProducts.length,
    categoriesLength: categories.length,
    loading,
    error
  });

  if (loading) {
    return <LoadingContainer>جاري التحميل...</LoadingContainer>;
  }

  return (
    <ProductsContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>التصاميم المتاحة</h2>
        {error && <ErrorAlert>{error}</ErrorAlert>}

        <ProductsFilters>
          <SearchFilter>
            <input
              type="text"
              placeholder="ابحث عن تصميم..."
              value={filter || ''}
              onChange={(e) => setFilter(e.target.value)}
            />
          </SearchFilter>
          <CategoryFilter>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">جميع الفئات</option>
              {Array.isArray(categories) && categories.map((category, index) => (
                category ? (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ) : null
              ))}
            </select>
          </CategoryFilter>
        </ProductsFilters>

        {filteredProducts.length === 0 ? (
          <NoProducts>
            <p>لا توجد منتجات متطابقة مع معايير البحث.</p>
          </NoProducts>
        ) : (
          <ProductGrid>
            {filteredProducts.map((product, index) => (
              product ? (
                <ProductCard
                  key={product._id || `product-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.1, 1.5) }}
                  whileHover={{ y: -5 }}
                >
                  <ProductImage>
                    <img 
                      src={product.imageUrl || 'https://via.placeholder.com/500x600?text=No+Image'} 
                      alt={product.name || 'تصميم بدون اسم'} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/500x600?text=Error+Loading+Image';
                      }}
                    />
                  </ProductImage>
                  <ProductInfo>
                    <h3>{product.name || 'بدون اسم'}</h3>
                    <ProductCategory>{product.category || 'غير مصنف'}</ProductCategory>
                    <ProductPrice>{product.price ? `${product.price} ريال` : 'السعر غير متوفر'}</ProductPrice>
                  </ProductInfo>
                  <ProductActions>
                    <Button to={`/product/${product._id || index}`}>
                      عرض التفاصيل
                    </Button>
                  </ProductActions>
                </ProductCard>
              ) : null
            ))}
          </ProductGrid>
        )}
        
        {pagination && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p>
              الصفحة {pagination.currentPage || 1} من {pagination.totalPages || 1} | 
              إجمالي المنتجات: {pagination.totalProducts || 0}
            </p>
          </div>
        )}
      </motion.div>
    </ProductsContainer>
  );
};

export default ProductList;

