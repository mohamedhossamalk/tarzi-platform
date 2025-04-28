// frontend/src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// مكونات الحماية
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

// مكون بسيط للتحميل
const SimpleLoadingScreen = ({ message = 'جاري التحميل...' }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
    flexDirection: 'column',
    gap: '15px'
  }}>
    <div className="spinner" style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(225, 29, 72, 0.2)',
      borderRadius: '50%',
      borderTop: '3px solid rgba(225, 29, 72, 1)',
      animation: 'spin 1s ease-in-out infinite'
    }}></div>
    <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>{message}</p>
  </div>
);

// تحميل المكونات عند الحاجة لتحسين الأداء
// صفحات الموقع العامة
const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));

// صفحات المصادقة
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Profile = lazy(() => import('./pages/Auth/Profile'));
const LogoutSuccess = lazy(() => import('./pages/Auth/LogoutSuccess'));

// صفحات المنتجات
const ProductList = lazy(() => import('./pages/Products/ProductList'));
const ProductDetails = lazy(() => import('./pages/Products/ProductDetails'));

// صفحات المقاسات
const MeasurementList = lazy(() => import('./pages/Measurements/MeasurementList'));
const MeasurementCreate = lazy(() => import('./pages/Measurements/MeasurementCreate'));
const MeasurementEdit = lazy(() => import('./pages/Measurements/MeasurementEdit'));

// صفحات الطلبات
const OrderList = lazy(() => import('./pages/Orders/OrderList'));
const OrderDetails = lazy(() => import('./pages/Orders/OrderDetails'));
const OrderCreate = lazy(() => import('./pages/Orders/OrderCreate'));

// صفحات الخدمات الاحترافية
const CreateProfessionalService = lazy(() => import('./pages/ProfessionalService/CreateProfessionalService'));
const MyProfessionalServices = lazy(() => import('./pages/ProfessionalService/MyProfessionalServices'));
const ProfessionalServiceDetails = lazy(() => import('./pages/ProfessionalService/ProfessionalServiceDetails'));

// صفحات لوحة المسؤول
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminUsersList = lazy(() => import('./pages/Admin/UsersList'));
const AdminUserEdit = lazy(() => import('./pages/Admin/AdminUserEdit'));
const AdminProductList = lazy(() => import('./pages/Admin/ProductList'));
const AdminProductForm = lazy(() => import('./pages/Admin/ProductForm'));
const AdminOrdersList = lazy(() => import('./pages/Admin/OrdersList'));
const AdminOrderDetails = lazy(() => import('./pages/Admin/OrderDetails'));
const ProfessionalServiceManagement = lazy(() => import('./pages/Admin/ProfessionalServiceManagement'));
const AdminProfessionalServiceDetails = lazy(() => import('./pages/Admin/ProfessionalServiceDetails'));
const AdminStatistics = lazy(() => import('./pages/Admin/Statistics'));
const AdminSettings = lazy(() => import('./pages/Admin/Settings'));

// مكون لتحريك الصفحة للأعلى عند الانتقال بين الصفحات
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Header />
          <ScrollToTop />
          <main className="container">
            <Suspense fallback={<SimpleLoadingScreen message="جاري تحميل الصفحة..." />}>
              <Routes>
                {/* المسارات العامة */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/logout-success" element={<LogoutSuccess />} />
                
                {/* المنتجات */}
                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                
                {/* المقاسات - مسارات خاصة */}
                <Route 
                  path="/measurements" 
                  element={
                    <PrivateRoute>
                      <MeasurementList />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/measurement/create" 
                  element={
                    <PrivateRoute>
                      <MeasurementCreate />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/measurement/:id/edit" 
                  element={
                    <PrivateRoute>
                      <MeasurementEdit />
                    </PrivateRoute>
                  } 
                />
                
                {/* الطلبات - مسارات خاصة */}
                <Route 
                  path="/orders" 
                  element={
                    <PrivateRoute>
                      <OrderList />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/order/:id" 
                  element={
                    <PrivateRoute>
                      <OrderDetails />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/order/create/:productId" 
                  element={
                    <PrivateRoute>
                      <OrderCreate />
                    </PrivateRoute>
                  } 
                />
                
                {/* الخدمات الاحترافية - مسارات خاصة */}
                <Route 
                  path="/service/create" 
                  element={
                    <PrivateRoute>
                      <CreateProfessionalService />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/my-services" 
                  element={
                    <PrivateRoute>
                      <MyProfessionalServices />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/service/:id" 
                  element={
                    <PrivateRoute>
                      <ProfessionalServiceDetails />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/service/:id/edit" 
                  element={
                    <PrivateRoute>
                      <CreateProfessionalService isEditMode={true} />
                    </PrivateRoute>
                  } 
                />
                
                {/* الملف الشخصي - مسار خاص */}
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />
                
                {/* مسارات لوحة المسؤول */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                
                {/* مسارات المستخدمين في لوحة المسؤول */}
                <Route 
                  path="/admin/users" 
                  element={
                    <AdminRoute>
                      <AdminUsersList />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/users/:id/edit" 
                  element={
                    <AdminRoute>
                      <AdminUserEdit />
                    </AdminRoute>
                  } 
                />
                
                {/* مسارات المنتجات في لوحة المسؤول */}
                <Route 
                  path="/admin/products" 
                  element={
                    <AdminRoute>
                      <AdminProductList />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/products/create" 
                  element={
                    <AdminRoute>
                      <AdminProductForm />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/products/:id/edit" 
                  element={
                    <AdminRoute>
                      <AdminProductForm isEditMode={true} />
                    </AdminRoute>
                  } 
                />
                
                {/* مسارات الطلبات في لوحة المسؤول */}
                <Route 
                  path="/admin/orders" 
                  element={
                    <AdminRoute>
                      <AdminOrdersList />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/orders/:id" 
                  element={
                    <AdminRoute>
                      <AdminOrderDetails />
                    </AdminRoute>
                  } 
                />
                
                {/* مسارات الخدمات الاحترافية في لوحة المسؤول */}
                <Route 
                  path="/admin/professional-services" 
                  element={
                    <AdminRoute>
                      <ProfessionalServiceManagement />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/service/:id" 
                  element={
                    <AdminRoute>
                      <AdminProfessionalServiceDetails />
                    </AdminRoute>
                  } 
                />
                
                {/* مسارات إضافية للوحة المسؤول */}
                <Route 
                  path="/admin/statistics" 
                  element={
                    <AdminRoute>
                      <AdminStatistics />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <AdminRoute>
                      <AdminSettings />
                    </AdminRoute>
                  } 
                />
                
                {/* صفحة 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

// إضافة الأنيميشن للسبينر
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default App;
