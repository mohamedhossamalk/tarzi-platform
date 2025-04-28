// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // التحقق من وجود مستخدم مخزن عند تحميل التطبيق
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            const response = await api.get('/auth/me');
            
            if (response.data) {
              const updatedUser = {
                ...user,
                ...response.data
              };
              
              localStorage.setItem('user', JSON.stringify(updatedUser));
              setCurrentUser(updatedUser);
            } else {
              logout();
            }
          } catch (err) {
            console.error('خطأ في التحقق من صحة الجلسة:', err);
            logout();
          }
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('خطأ في التحقق من حالة المصادقة:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedInUser();
  }, []);

  // وظيفة تسجيل الدخول
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('جاري محاولة تسجيل الدخول بالبيانات:', {
        email: credentials.email,
        passwordLength: credentials.password ? credentials.password.length : 0
      });
      
      const response = await api.post('/auth/login', credentials);
      
      console.log('استجابة تسجيل الدخول:', response.status);
      
      const userData = response.data;
      
      if (!userData || !userData.token) {
        throw new Error('بيانات المستخدم أو توكن المصادقة غير موجود في الاستجابة');
      }
      
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setCurrentUser(userData);
      
      console.log('تم تسجيل الدخول بنجاح:', userData.username);
      
      return userData;
    } catch (err) {
      console.error('خطأ في تسجيل الدخول:', err);
      
      let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
      
      if (err.response) {
        // خطأ من الخادم
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `خطأ ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        // لم يتم استلام استجابة
        errorMessage = 'لم يتم استلام استجابة من الخادم. تأكد من اتصالك بالإنترنت.';
      }
      
      setError(errorMessage);
      throw Object.assign(err, { userMessage: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // وظيفة التسجيل
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/register', userData);
      const newUser = response.data;
      
      localStorage.setItem('token', newUser.token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setCurrentUser(newUser);
      return newUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'حدث خطأ أثناء التسجيل';
      
      setError(errorMessage);
      throw Object.assign(err, { userMessage: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // وظيفة تسجيل الخروج
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // وظيفة تحديث الملف الشخصي
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put('/auth/updateprofile', userData);
      const updatedUser = response.data;
      
      const currentUserData = JSON.parse(localStorage.getItem('user'));
      const newUserData = { ...currentUserData, ...updatedUser };
      
      localStorage.setItem('user', JSON.stringify(newUserData));
      setCurrentUser(newUserData);
      
      return updatedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'حدث خطأ أثناء تحديث الملف الشخصي';
      
      setError(errorMessage);
      throw Object.assign(err, { userMessage: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // وظيفة تغيير كلمة المرور
  const changePassword = async (passwords) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put('/users/changepassword', passwords);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'حدث خطأ أثناء تغيير كلمة المرور';
      
      setError(errorMessage);
      throw Object.assign(err, { userMessage: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // القيمة المصدرة للسياق
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!currentUser,
    isAdmin: () => currentUser && currentUser.role === 'admin',
    isTailor: () => currentUser && (currentUser.role === 'tailor' || currentUser.role === 'admin')
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
