// frontend/src/components/common/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * مكون لحماية المسارات التي تتطلب مصادقة المستخدم
 */
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    // عرض شاشة التحميل أثناء التحقق من حالة المصادقة
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <div className="spinner"></div>
        <p style={{ marginRight: '10px' }}>جاري التحقق من تسجيل الدخول...</p>
      </div>
    );
  }

  if (!currentUser) {
    // إعادة التوجيه إلى صفحة تسجيل الدخول إذا لم يكن المستخدم مسجلاً
    // مع حفظ المسار الأصلي للعودة إليه بعد تسجيل الدخول
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // عرض المكون المحمي إذا كان المستخدم مسجل الدخول
  return children;
};

export default PrivateRoute;