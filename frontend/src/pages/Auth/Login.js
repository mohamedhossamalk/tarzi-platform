// frontend/src/pages/Auth/Login.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSignInAlt, FaExclamationCircle } from 'react-icons/fa';

// ==================== ألوان التطبيق ====================
const COLORS = {
  primary: {
    main: '#E11D48', // أحمر
    dark: '#BE123C',
    light: 'rgba(225, 29, 72, 0.08)',
    hover: 'rgba(225, 29, 72, 0.9)',
    gradient: 'linear-gradient(135deg, #E11D48, #9F1239)'
  },
  background: {
    dark: '#000000',
    darker: '#0A0A0A', // أحلك قليلاً لتباين أفضل
    card: 'rgba(17, 17, 17, 0.85)',
    input: 'rgba(15, 15, 15, 0.4)'
  },
  text: {
    main: '#F1F1F1', // نص أبيض فاتح
    light: 'rgba(241, 241, 241, 0.85)',
    muted: 'rgba(241, 241, 241, 0.6)',
  },
  border: {
    light: 'rgba(255, 255, 255, 0.08)',
    focus: 'rgba(225, 29, 72, 0.6)'
  },
  action: {
    hover: 'rgba(255, 255, 255, 0.03)',
    disabled: 'rgba(150, 150, 150, 0.4)'
  }
};

// ==================== تأثيرات الحركة ====================
const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const shine = keyframes`
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
`;

// ==================== المكونات المنسقة بشكل احترافي ====================
const LoginContainer = styled(motion.div)`
  max-width: 450px;
  width: 90%;
  margin: 4rem auto;
  padding: 2.5rem;
  background: ${COLORS.background.darker};
  border-radius: 16px;
  border: 1px solid ${COLORS.border.light};
  color: ${COLORS.text.main};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  direction: rtl;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${COLORS.primary.gradient};
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(225, 29, 72, 0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
  }

  @media (max-width: 576px) {
    margin: 2rem auto;
    padding: 1.75rem;
  }
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  
  h2 {
    font-size: 2rem;
    margin: 0;
    color: ${COLORS.text.main};
    display: inline-block;
    background: ${COLORS.primary.gradient};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    padding: 0 0.5rem;
  }
  
  p {
    margin: 0.8rem 0 0;
    color: ${COLORS.text.muted};
    font-size: 0.95rem;
  }
`;

const Alert = styled.div`
  background-color: rgba(220, 53, 69, 0.15);
  color: #ff6b6b;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  margin-bottom: 1.75rem;
  border-right: 4px solid #dc3545;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    flex-shrink: 0;
    font-size: 1.1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: ${COLORS.text.light};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${COLORS.primary.main};
    font-size: 0.9rem;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1.25rem;
  background: ${COLORS.background.input};
  border: 1px solid ${COLORS.border.light};
  border-radius: 10px;
  color: ${COLORS.text.main};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary.main};
    box-shadow: 0 0 0 2px ${COLORS.border.focus};
  }
  
  &::placeholder {
    color: ${COLORS.text.muted};
    opacity: 0.7;
  }
`;

const SubmitButton = styled.button`
  padding: 1rem;
  background: ${COLORS.primary.gradient};
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  box-shadow: 0 4px 15px rgba(225, 29, 72, 0.25);
  position: relative;
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(225, 29, 72, 0.35);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(225, 29, 72, 0.3);
  }
  
  &:disabled {
    background: ${COLORS.action.disabled};
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  
  svg {
    font-size: 1.1rem;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    bottom: -50%;
    left: -50%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0) 100%);
    transform: rotate(30deg);
    transition: all 0.7s;
    opacity: 0;
  }
  
  &:hover::after {
    opacity: 1;
    transform: rotate(30deg) translate(-100px, 0);
    transition: all 0.7s;
  }
`;

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LinkContainer = styled.div`
  margin-top: 1.75rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid ${COLORS.border.light};
  
  p {
    margin: 0;
    color: ${COLORS.text.light};
    font-size: 0.95rem;
  }
  
  a {
    color: ${COLORS.primary.main};
    text-decoration: none;
    font-weight: 500;
    position: relative;
    margin-right: 0.25rem;
    
    &:hover {
      text-decoration: none;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 1px;
      background: ${COLORS.primary.main};
      transform: scaleX(0);
      transition: transform 0.2s ease;
      transform-origin: right;
    }
    
    &:hover::after {
      transform: scaleX(1);
      transform-origin: left;
    }
  }
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2.5rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${COLORS.text.main};
    margin: 0;
    background: linear-gradient(45deg, ${COLORS.text.main}, ${COLORS.primary.main} 70%);
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${shine} 5s linear infinite;
  }
`;

// المكون الرئيسي لصفحة تسجيل الدخول
const Login = () => {
  // حالة النموذج
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  
  // استخدام سياق المصادقة
  const { login, error: contextError, loading, currentUser } = useContext(AuthContext);
  
  // متغيرات التوجيه
  const navigate = useNavigate();
  const location = useLocation();
  
  const { email, password } = formData;

  // التحقق مما إذا كان المستخدم مسجل الدخول بالفعل
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
    
    // الحصول على أي رسائل خطأ محتملة من موقع الإحالة
    const searchParams = new URLSearchParams(location.search);
    const errorMsg = searchParams.get('error');
    if (errorMsg) {
      setLocalError(errorMsg);
    }
  }, [currentUser, navigate, location]);

  // معالج تغيير الحقول
  const handleChange = (e) => {
    setLocalError(''); // مسح أي أخطاء سابقة
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // معالج إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // تنظيف الأخطاء
    setLocalError('');
    
    // التحقق من الحقول
    if (!email || !password) {
      setLocalError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      // استدعاء وظيفة تسجيل الدخول من سياق المصادقة
      await login({ email, password });
      
      // سيتم التوجيه تلقائياً عندما يتغير currentUser في useEffect
    } catch (err) {
      setLocalError(
        err.userMessage || err.message || 'حدث خطأ أثناء تسجيل الدخول'
      );
    }
  };

  // تحديد رسالة الخطأ من السياق أو المحلية
  const errorMessage = localError || contextError;

  return (
    <LoginContainer
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <Logo>
        <h1>ترزي</h1>
      </Logo>
      
      <LoginHeader>
        <h2>
          تسجيل الدخول
        </h2>
        <p>قم بتسجيل الدخول للوصول إلى حسابك</p>
      </LoginHeader>
      
      {errorMessage && (
        <Alert>
          <FaExclamationCircle />
          {errorMessage}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">
            <FaEnvelope /> البريد الإلكتروني
          </Label>
          <InputWrapper>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="أدخل البريد الإلكتروني"
              required
              autoComplete="email"
            />
          </InputWrapper>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">
            <FaLock /> كلمة المرور
          </Label>
          <InputWrapper>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="أدخل كلمة المرور"
              required
              autoComplete="current-password"
            />
          </InputWrapper>
        </FormGroup>
        
        <SubmitButton type="submit" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner /> جاري التحميل...
            </>
          ) : (
            <>
              <FaSignInAlt /> تسجيل الدخول
            </>
          )}
        </SubmitButton>
      </Form>
      
      <LinkContainer>
        <p>
          ليس لديك حساب؟{' '}
          <Link to="/register">إنشاء حساب جديد</Link>
        </p>
      </LinkContainer>
    </LoginContainer>
  );
};

export default Login;
