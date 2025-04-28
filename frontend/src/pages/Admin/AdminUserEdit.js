import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { adminService } from '../../services/admin.service';
import { 
  FaArrowRight, FaUser, FaEnvelope, FaPhone, FaShieldAlt, 
  FaCheck, FaTimes, FaExclamationTriangle, FaSave, FaUserEdit
} from 'react-icons/fa';

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
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1.5rem 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
`;

// رأس الصفحة
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 576px) {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
  
  h2 {
    font-size: clamp(1.5rem, 5vw, 2rem);
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
      
      @media (max-width: 576px) {
        width: 40px;
        height: 3px;
        bottom: -6px;
      }
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
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 576px) {
    width: 100%;
    justify-content: center;
  }
  
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
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 8px;
  }
  
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
  
  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.75rem;
    font-size: 1rem;
    color: #F1F1F1;
    font-weight: 500;
    
    @media (max-width: 768px) {
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }
  }
  
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="password"],
  select {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #F1F1F1;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    @media (max-width: 768px) {
      padding: 0.6rem 0.8rem;
      font-size: 0.95rem;
    }
    
    &:focus {
      outline: none;
      border-color: #E11D48;
      box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.2);
    }
    
    &::placeholder {
      color: rgba(241, 241, 241, 0.3);
    }
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
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      width: 18px;
      height: 18px;
    }
    
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
        
        @media (max-width: 768px) {
          left: 5px;
          top: 2px;
          width: 5px;
          height: 10px;
        }
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

// صف النموذج
const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

// أزرار الإجراءات
const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 0.75rem;
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
  
  @media (max-width: 768px) {
    padding: 0.7rem 1.5rem;
    font-size: 0.95rem;
  }
  
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
    
    @media (max-width: 576px) {
      order: -1;
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
  
  .spinner {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    animation: spin 1s linear infinite;
    margin-left: 8px;
    
    @media (max-width: 768px) {
      width: 16px;
      height: 16px;
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
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    margin-bottom: 1.25rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    border-radius: 6px;
  }
  
  svg {
    flex-shrink: 0;
  }
`;

// رسالة النجاح
const SuccessAlert = styled.div`
  background-color: rgba(16, 185, 129, 0.1);
  color: #10B981;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    margin-bottom: 1.25rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    border-radius: 6px;
  }
  
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
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 768px) {
    height: 250px;
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    height: 200px;
    font-size: 1rem;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #E11D48;
    animation: spin 1s linear infinite;
    margin-left: 1rem;
    
    @media (max-width: 768px) {
      width: 35px;
      height: 35px;
    }
    
    @media (max-width: 480px) {
      width: 30px;
      height: 30px;
    }
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// عنوان القسم
const SectionTitle = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  h3 {
    color: #F1F1F1;
    font-size: 1.25rem;
    position: relative;
    padding-right: 1rem;
    margin-bottom: 0.5rem;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1rem;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      right: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, #E11D48, #BE123C);
      border-radius: 2px;
      
      @media (max-width: 480px) {
        width: 30px;
        height: 2px;
      }
    }
  }
`;

const AdminUserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    role: 'user',
    isActive: true,
    password: '',
    confirmPassword: '',
  });
  
  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await adminService.getUserById(id);
        
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'user',
          isActive: userData.isActive !== false,
          password: '',
          confirmPassword: '',
        });
      } catch (err) {
        setError('حدث خطأ أثناء جلب بيانات المستخدم');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    // التحقق من تطابق كلمة المرور إذا تم إدخالها
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setSaving(false);
      return;
    }
    
    try {
      // تجهيز البيانات للإرسال (استبعاد حقول غير ضرورية)
      const userData = { ...formData };
      
      // حذف حقل تأكيد كلمة المرور
      delete userData.confirmPassword;
      
      // إذا كانت كلمة المرور فارغة، نحذفها من البيانات المرسلة
      if (!userData.password) {
        delete userData.password;
      }
      
      // تحديث بيانات المستخدم
      await adminService.updateUser(id, userData);
      
      setSuccess('تم تحديث بيانات المستخدم بنجاح');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'حدث خطأ أثناء تحديث بيانات المستخدم'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Loading>
          <div className="spinner"></div>
          <span>جاري تحميل بيانات المستخدم...</span>
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
        <h2>تعديل بيانات المستخدم</h2>
        <BackButton onClick={() => navigate('/admin/users')}>
          <FaArrowRight /> العودة للمستخدمين
        </BackButton>
      </PageHeader>
      
      {error && (
        <Alert>
          <FaExclamationTriangle />
          <span>{error}</span>
        </Alert>
      )}
      
      {success && (
        <SuccessAlert>
          <FaCheck />
          <span>{success}</span>
        </SuccessAlert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormRow>
          <FormGroup>
            <label htmlFor="username">
              <FaUser /> اسم المستخدم
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="أدخل اسم المستخدم"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="email">
              <FaEnvelope /> البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="أدخل البريد الإلكتروني"
              required
            />
          </FormGroup>
        </FormRow>
        
        <FormRow>
          <FormGroup>
            <label htmlFor="phone">
              <FaPhone /> رقم الهاتف
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="أدخل رقم الهاتف"
            />
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="role">
              <FaShieldAlt /> الدور
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">مستخدم عادي</option>
              <option value="admin">مسؤول النظام</option>
            </select>
          </FormGroup>
        </FormRow>
        
        <CheckboxGroup>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label htmlFor="isActive">حساب نشط</label>
        </CheckboxGroup>
        
        <SectionTitle>
          <h3>تغيير كلمة المرور (اختياري)</h3>
        </SectionTitle>
        
        <FormRow>
          <FormGroup>
            <label htmlFor="password">كلمة المرور الجديدة</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="اترك فارغًا للاحتفاظ بكلمة المرور الحالية"
            />
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="تأكيد كلمة المرور الجديدة"
            />
          </FormGroup>
        </FormRow>
        
        <FormActions>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <div className="spinner"></div>
                جاري الحفظ...
              </>
            ) : (
              <>
                <FaSave /> حفظ التغييرات
              </>
            )}
          </Button>
          <Button type="button" onClick={() => navigate('/admin/users')}>
            <FaTimes /> إلغاء
          </Button>
        </FormActions>
      </Form>
    </PageContainer>
  );
};

export default AdminUserEdit;
