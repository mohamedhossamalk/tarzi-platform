// frontend/src/pages/Admin/ProductForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { adminService } from '../../services/admin.service';
import { FaArrowLeft, FaPlus, FaImage, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

// تأثيرات الحركة
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

// حاوية الصفحة
const PageContainer = styled(motion.div)`
  background-color: #0A0A0A;
  color: #F1F1F1;
  padding: 2rem 1rem;
  max-width: 1000px;
  margin: 0 auto;
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

// زر الرجوع
const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: #F1F1F1;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

// تنسيق النموذج
const Form = styled.form`
  background: #111111;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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
`;

// تنسيق مجموعة الحقول
const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.75rem;
    font-size: 1rem;
    color: #F1F1F1;
    font-weight: 500;
  }
  
  input[type="text"],
  input[type="number"],
  textarea,
  select {
    width: 100%;
    padding: 0.75rem 1rem;
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
  
  textarea {
    min-height: 120px;
    resize: vertical;
  }
  
  select {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: left 1rem center;
    background-size: 16px;
    padding-left: 2.5rem;
    
    option {
      background-color: #111111;
      color: #F1F1F1;
    }
  }
`;

// تنسيق مجموعة الخانة
const CheckboxGroup = styled(FormGroup)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    display: inline-block;
    position: relative;
    cursor: pointer;
    
    &:checked {
      background-color: #E11D48;
      border-color: #E11D48;
      
      &::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 2px;
        width: 6px;
        height: 12px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }
    
    &:focus {
      outline: none;
      border-color: #E11D48;
      box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.2);
    }
  }
  
  label {
    margin-bottom: 0;
    cursor: pointer;
  }
`;

// حاوية الخيارات (الأقمشة والألوان)
const OptionsContainer = styled.div`
  margin-top: 0.5rem;
`;

// حقل إضافة خيار جديد
const OptionInput = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  input {
    flex: 1;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #F1F1F1;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #E11D48;
      box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.2);
    }
  }
  
  button {
    padding: 0 1.25rem;
    background: rgba(225, 29, 72, 0.1);
    color: #E11D48;
    border: 1px solid rgba(225, 29, 72, 0.2);
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: rgba(225, 29, 72, 0.2);
    }
    
    svg {
      margin-left: 5px;
    }
  }
`;

// قائمة الخيارات
const OptionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

// الرسالة عندما لا توجد خيارات
const NoOptions = styled.p`
  color: rgba(241, 241, 241, 0.5);
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  text-align: center;
`;

// بطاقة الخيار
const OptionTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  font-size: 0.9rem;
  
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: none;
    background: rgba(239, 68, 68, 0.1);
    color: #EF4444;
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(239, 68, 68, 0.2);
    }
  }
`;

// معاينة الصورة
const ImagePreview = styled.div`
  margin-top: 1rem;
  position: relative;
  max-width: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

// أزرار الإجراءات
const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

// أنماط الأزرار
const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:first-child {
    flex: 1;
    background: ${props => props.disabled 
      ? 'rgba(225, 29, 72, 0.5)' 
      : 'linear-gradient(90deg, #E11D48, #BE123C)'};
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
    }
  }
  
  &:last-child {
    background: rgba(255, 255, 255, 0.05);
    color: #F1F1F1;
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
  }
`;

// رسالة التنبيه
const Alert = styled.div`
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

// حالة التحميل
const Loading = styled.div`
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

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(!!id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    imageUrl: '',
    price: '',
    fabricOptions: [],
    colorOptions: [],
    isActive: true
  });
  
  const [newFabric, setNewFabric] = useState('');
  const [newColor, setNewColor] = useState('');
  
  const categories = ['قميص', 'بنطلون', 'جاكيت', 'فستان', 'تنورة', 'أخرى'];

  useEffect(() => {
    const fetchProductData = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const product = await adminService.getProductById(id);
          setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            imageUrl: product.imageUrl,
            price: product.price,
            fabricOptions: product.fabricOptions || [],
            colorOptions: product.colorOptions || [],
            isActive: product.isActive !== undefined ? product.isActive : true
          });
        } catch (err) {
          setError('حدث خطأ أثناء جلب بيانات المنتج');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addFabric = () => {
    if (newFabric.trim() && !formData.fabricOptions.includes(newFabric.trim())) {
      setFormData({
        ...formData,
        fabricOptions: [...formData.fabricOptions, newFabric.trim()]
      });
      setNewFabric('');
    }
  };

  const removeFabric = (fabric) => {
    setFormData({
      ...formData,
      fabricOptions: formData.fabricOptions.filter(f => f !== fabric)
    });
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colorOptions.includes(newColor.trim())) {
      setFormData({
        ...formData,
        colorOptions: [...formData.colorOptions, newColor.trim()]
      });
      setNewColor('');
    }
  };

  const removeColor = (color) => {
    setFormData({
      ...formData,
      colorOptions: formData.colorOptions.filter(c => c !== color)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (isEditMode) {
        await adminService.updateProduct(id, productData);
      } else {
        await adminService.createProduct(productData);
      }

      navigate('/admin/products');
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : isEditMode
            ? 'حدث خطأ أثناء تحديث المنتج'
            : 'حدث خطأ أثناء إنشاء المنتج'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  if (loading && isEditMode) {
    return (
      <PageContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Loading>
          <div className="spinner"></div>
          <span>جاري تحميل بيانات المنتج...</span>
        </Loading>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <PageHeader>
        <h2>{isEditMode ? 'تعديل منتج' : 'إضافة منتج جديد'}</h2>
        <BackButton onClick={() => navigate('/admin/products')}>
          <FaArrowLeft /> العودة للمنتجات
        </BackButton>
      </PageHeader>
      
      {error && (
        <Alert>
          <FaExclamationTriangle />
          <span>{error}</span>
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="name">اسم المنتج</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="أدخل اسم المنتج..."
          />
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="description">وصف المنتج</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="أدخل وصفًا تفصيليًا للمنتج..."
          ></textarea>
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="category">الفئة</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">اختر الفئة</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="imageUrl">رابط الصورة</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            placeholder="أدخل رابط صورة المنتج..."
          />
          {formData.imageUrl && (
            <ImagePreview>
              <img 
                src={formData.imageUrl} 
                alt="معاينة المنتج"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x300?text=صورة+غير+متاحة';
                }} 
              />
            </ImagePreview>
          )}
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="price">السعر (ريال)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="أدخل سعر المنتج..."
          />
        </FormGroup>
        
        <FormGroup>
          <label>خيارات الأقمشة</label>
          <OptionsContainer>
            <OptionInput>
              <input
                type="text"
                value={newFabric}
                onChange={(e) => setNewFabric(e.target.value)}
                placeholder="أضف نوع قماش جديد..."
                onKeyDown={(e) => handleKeyDown(e, addFabric)}
              />
              <button type="button" onClick={addFabric}>
                <FaPlus /> إضافة
              </button>
            </OptionInput>
            
            {formData.fabricOptions.length === 0 ? (
              <NoOptions>لا توجد خيارات أقمشة. أضف بعض الخيارات.</NoOptions>
            ) : (
              <OptionsList>
                {formData.fabricOptions.map((fabric, index) => (
                  <OptionTag key={index}>
                    {fabric}
                    <button
                      type="button"
                      onClick={() => removeFabric(fabric)}
                      title="إزالة"
                    >
                      ×
                    </button>
                  </OptionTag>
                ))}
              </OptionsList>
            )}
          </OptionsContainer>
        </FormGroup>
        
        <FormGroup>
          <label>خيارات الألوان</label>
          <OptionsContainer>
            <OptionInput>
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="أضف لون جديد..."
                onKeyDown={(e) => handleKeyDown(e, addColor)}
              />
              <button type="button" onClick={addColor}>
                <FaPlus /> إضافة
              </button>
            </OptionInput>
            
            {formData.colorOptions.length === 0 ? (
              <NoOptions>لا توجد خيارات ألوان. أضف بعض الخيارات.</NoOptions>
            ) : (
              <OptionsList>
                {formData.colorOptions.map((color, index) => (
                  <OptionTag key={index}>
                    {color}
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      title="إزالة"
                    >
                      ×
                    </button>
                  </OptionTag>
                ))}
              </OptionsList>
            )}
          </OptionsContainer>
        </FormGroup>
        
        <CheckboxGroup>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label htmlFor="isActive">منتج نشط ومتاح للعرض</label>
        </CheckboxGroup>
        
        <FormActions>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner" style={{ width: 20, height: 20, marginLeft: 10 }}></div>
                {isEditMode ? 'جاري حفظ التغييرات...' : 'جاري إنشاء المنتج...'}
              </>
            ) : (
              <>
                <FaCheck /> {isEditMode ? 'حفظ التغييرات' : 'إضافة المنتج'}
              </>
            )}
          </Button>
          <Button type="button" onClick={() => navigate('/admin/products')}>
            <FaTimes /> إلغاء
          </Button>
        </FormActions>
      </Form>
    </PageContainer>
  );
};

export default ProductForm;
