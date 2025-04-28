// frontend/src/pages/Admin/ProductList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrashAlt, 
  FaEye, 
  FaEyeSlash,
  FaFilter,
  FaExclamationTriangle,
  FaTags
} from 'react-icons/fa';
import { adminService } from '../../services/admin.service';

// تأثيرات الحركة
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  }
};

// حاوية الصفحة
const PageContainer = styled.div`
  background-color: #0A0A0A;
  color: #F1F1F1;
  padding: 2rem 1rem;
`;

// رأس الصفحة
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 2rem;
    color: #F1F1F1;
    margin: 0;
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

// زر إضافة منتج
const AddButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #E11D48, #BE123C);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// حاوية البحث والفلترة
const FilterContainer = styled(motion.div)`
  background: #111111;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 60%;
    height: 3px;
    background: linear-gradient(90deg, #E11D48, transparent);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// حاوية البحث
const SearchContainer = styled.div`
  flex: 1;
  min-width: 250px;
  position: relative;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #F1F1F1;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #E11D48;
      box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.2);
    }
    
    &::placeholder {
      color: rgba(241, 241, 241, 0.3);
    }
  }
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(241, 241, 241, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

// حاوية الفلتر
const FilterOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  select {
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    appearance: none;
    background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(241, 241, 241, 0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E") no-repeat left 1rem center/16px;
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #F1F1F1;
    font-size: 1rem;
    min-width: 220px;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #E11D48;
      box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.2);
    }
    
    option {
      background-color: #111111;
      color: #F1F1F1;
      padding: 10px;
    }
  }
  
  svg {
    color: rgba(241, 241, 241, 0.5);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    
    select {
      width: 100%;
    }
  }
`;

// رسالة تنبيه
const Alert = styled(motion.div)`
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    flex-shrink: 0;
  }
`;

// شبكة المنتجات
const ProductsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

// بطاقة المنتج
const ProductCard = styled(motion.div)`
  background: #111111;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  }
  
  ${props => props.inactive && `
    opacity: 0.7;
  `}
`;

// حاوية صورة المنتج
const ProductImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

// شارة الحالة
const StatusBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.35rem 0.75rem;
  background-color: rgba(239, 68, 68, 0.9);
  color: white;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 2;
`;

// معلومات المنتج
const ProductInfo = styled.div`
  padding: 1.25rem;
  
  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
    color: #F1F1F1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// فئة المنتج
const ProductCategory = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50px;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
`;

// سعر المنتج
const ProductPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #E11D48;
`;

// إجراءات إدارة المنتج
const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  
  @media (max-width: 350px) {
    flex-direction: column;
  }
`;

// زر إجرائي
const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  
  &.edit {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3B82F6;
    border: 1px solid rgba(59, 130, 246, 0.2);
    
    &:hover {
      background-color: rgba(59, 130, 246, 0.2);
    }
  }
  
  &.toggle-active {
    background-color: ${props => props.active 
      ? 'rgba(245, 158, 11, 0.1)' 
      : 'rgba(16, 185, 129, 0.1)'};
    color: ${props => props.active ? '#F59E0B' : '#10B981'};
    border: 1px solid ${props => props.active 
      ? 'rgba(245, 158, 11, 0.2)' 
      : 'rgba(16, 185, 129, 0.2)'};
    
    &:hover {
      background-color: ${props => props.active 
        ? 'rgba(245, 158, 11, 0.2)' 
        : 'rgba(16, 185, 129, 0.2)'};
    }
  }
  
  &.delete {
    background-color: rgba(239, 68, 68, 0.1);
    color: #EF4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
    
    &:hover {
      background-color: rgba(239, 68, 68, 0.2);
    }
  }
`;

// رسالة عدم وجود نتائج
const NoResults = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 3rem 1.5rem;
  text-align: center;
  color: rgba(241, 241, 241, 0.6);
  font-size: 1.1rem;
  grid-column: 1 / -1;
  
  svg {
    font-size: 3rem;
    color: rgba(241, 241, 241, 0.3);
    margin-bottom: 1rem;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
`;

// حالة التحميل
const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: rgba(241, 241, 241, 0.7);
  font-size: 1.2rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #E11D48;
    animation: spin 1s linear infinite;
    margin-left: 1rem;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await adminService.getProducts();
        setProducts(data);
      } catch (err) {
        setError('حدث خطأ أثناء جلب بيانات المنتجات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        setDeletingId(id);
        await adminService.deleteProduct(id);
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        setError('حدث خطأ أثناء حذف المنتج');
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      setUpdatingId(product._id);
      const updatedProduct = await adminService.updateProduct(product._id, {
        ...product,
        isActive: !product.isActive
      });
      
      setProducts(products.map(p => 
        p._id === updatedProduct._id ? updatedProduct : p
      ));
    } catch (err) {
      setError('حدث خطأ أثناء تحديث حالة المنتج');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProducts = products.filter(product => {
    // تطبيق البحث
    const searchMatch = (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                        (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    // تطبيق الفلترة
    if (filter === 'all') return searchMatch;
    if (filter === 'active') return searchMatch && product.isActive;
    if (filter === 'inactive') return searchMatch && !product.isActive;
    if (filter === product.category) return searchMatch;

    return searchMatch;
  });

  // استخراج قائمة الفئات الفريدة
  const categories = [
    'all', 
    'active', 
    'inactive', 
    ...new Set(products.filter(p => p.category).map(p => p.category))
  ];

  // ترجمات الفئات
  const categoryTranslations = {
    all: 'جميع المنتجات',
    active: 'المنتجات النشطة',
    inactive: 'المنتجات غير النشطة'
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState>
          <div className="spinner"></div>
          <span>جاري تحميل المنتجات...</span>
        </LoadingState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <h2>إدارة المنتجات</h2>
        <AddButton to="/admin/products/create">
          <FaPlus /> إضافة منتج جديد
        </AddButton>
      </PageHeader>

      <FilterContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SearchContainer>
          <FaSearch />
          <input 
            type="text"
            placeholder="بحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        <FilterOptions>
          <FaFilter />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {categoryTranslations[category] || category}
              </option>
            ))}
          </select>
        </FilterOptions>
      </FilterContainer>

      {error && (
        <Alert
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaExclamationTriangle />
          <span>{error}</span>
        </Alert>
      )}

      <ProductsGrid
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                variants={itemVariants}
                inactive={!product.isActive}
              >
                <ProductImageContainer>
                  <img 
                    src={product.imageUrl}
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=صورة+غير+متوفرة';
                    }}
                  />
                  {!product.isActive && <StatusBadge>غير نشط</StatusBadge>}
                </ProductImageContainer>
                <ProductInfo>
                  <h3 title={product.name}>{product.name}</h3>
                  <ProductCategory>
                    <FaTags style={{ marginLeft: '5px', fontSize: '0.7rem' }} />
                    {product.category || 'بدون تصنيف'}
                  </ProductCategory>
                  <ProductPrice>{product.price} ريال</ProductPrice>
                  
                  <ProductActions>
                    <ActionButton
                      as={Link}
                      to={`/admin/products/${product._id}/edit`}
                      className="edit"
                    >
                      <FaEdit /> تعديل
                    </ActionButton>
                    <ActionButton 
                      onClick={() => handleToggleStatus(product)}
                      className="toggle-active"
                      active={product.isActive}
                      disabled={updatingId === product._id}
                    >
                      {updatingId === product._id ? (
                        <span className="spinner-sm"></span>
                      ) : product.isActive ? (
                        <><FaEyeSlash /> إيقاف</>
                      ) : (
                        <><FaEye /> تنشيط</>
                      )}
                    </ActionButton>
                    <ActionButton 
                      onClick={() => handleDelete(product._id)}
                      className="delete"
                      disabled={deletingId === product._id}
                    >
                      {deletingId === product._id ? (
                        <span className="spinner-sm"></span>
                      ) : (
                        <><FaTrashAlt /> حذف</>
                      )}
                    </ActionButton>
                  </ProductActions>
                </ProductInfo>
              </ProductCard>
            ))
          ) : (
            <NoResults variants={itemVariants}>
              <FaSearch />
              <p>لا توجد منتجات مطابقة للبحث أو التصفية</p>
            </NoResults>
          )}
        </AnimatePresence>
      </ProductsGrid>
    </PageContainer>
  );
};

export default ProductList;
