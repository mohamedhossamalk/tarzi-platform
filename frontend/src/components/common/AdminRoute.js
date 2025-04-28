// frontend/src/components/common/AdminRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * مكون لحماية المسارات التي تتطلب صلاحيات المسؤول
 */
const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    // عرض شاشة التحميل أثناء التحقق من حالة المصادقة
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <div className="spinner"></div>
        <p style={{ marginRight: '10px' }}>جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  // التحقق من وجود المستخدم وأن لديه صلاحيات المسؤول
  if (!currentUser || currentUser.role !== 'admin') {
    // إعادة التوجيه إلى الصفحة الرئيسية إذا لم يكن المستخدم مسؤولاً
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // عرض المكون المحمي إذا كان المستخدم مسؤولاً
  return children;
};

export default AdminRoute;