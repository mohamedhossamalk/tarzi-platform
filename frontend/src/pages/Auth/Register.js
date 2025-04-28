// frontend/src/pages/Auth/Register.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { authService } from '../../services/auth.service';
import { AuthContext } from '../../contexts/AuthContext';

// تنسيق حاوية صفحة التسجيل
const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: #0A0A0A;
  color: #F1F1F1;
`;

// تنسيق نموذج التسجيل
const AuthForm = styled(motion.div)`
  background: #111111;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
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
  
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-size: 0.95rem;
    font-weight: 500;
    color: rgba(241, 241, 241, 0.8);
  }
  
  input {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: #F1F1F1;
    font-size: 1rem;
    transition: all 0.3s ease;
    
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

const ErrorAlert = styled.div`
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  text-align: right;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #E11D48, #BE123C);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const AuthLinks = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.95rem;
  color: rgba(241, 241, 241, 0.7);
  
  a {
    color: #E11D48;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { username, email, password, confirmPassword, phone } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setLoading(true);

    try {
      const userData = await authService.register({
        username,
        email,
        password,
        phone,
      });
      login(userData);
      navigate('/');
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'حدث خطأ أثناء إنشاء الحساب'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthForm
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>إنشاء حساب جديد</h2>
        {error && <ErrorAlert>{error}</ErrorAlert>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="username">اسم المستخدم</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="phone">رقم الهاتف</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="password">كلمة المرور</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </FormGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'جاري التحميل...' : 'إنشاء حساب'}
          </Button>
        </form>
        <AuthLinks>
          <p>
            لديك حساب بالفعل؟{' '}
            <Link to="/login">تسجيل الدخول</Link>
          </p>
        </AuthLinks>
      </AuthForm>
    </AuthContainer>
  );
};

export default Register;
