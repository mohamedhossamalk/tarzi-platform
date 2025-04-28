// frontend/src/pages/Admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlus, FaClipboardList, FaEdit, FaUsers } from 'react-icons/fa';
import { adminService } from '../../services/admin.service';

// تنسيق حاوية لوحة التحكم
const DashboardContainer = styled.div`
  background-color: #0A0A0A;
  color: #F1F1F1;
  padding: 2rem 1rem;
  
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

// تنسيق البطاقات الإحصائية
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: #111111;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
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
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #E11D48;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: rgba(241, 241, 241, 0.7);
  margin-bottom: 1rem;
`;

const StatLink = styled(Link)`
  color: #E11D48;
  font-size: 0.9rem;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

// تنسيق قسم الطلبات الحديثة
const SectionContainer = styled.div`
  background: #111111;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  
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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.5rem;
    color: #F1F1F1;
    margin: 0;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #F1F1F1;
  
  th, td {
    padding: 0.75rem 1rem;
    text-align: right;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  th {
    color: rgba(241, 241, 241, 0.7);
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  tr:hover td {
    background-color: rgba(255, 255, 255, 0.02);
  }
  
  .empty-table {
    text-align: center;
    padding: 2rem 0;
    color: rgba(241, 241, 241, 0.5);
  }
  
  @media (max-width: 992px) {
    display: block;
    overflow-x: auto;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  background-color: ${props => {
    switch (props.status) {
      case 'جديد':
        return 'rgba(59, 130, 246, 0.1)';
      case 'تم التسليم':
        return 'rgba(16, 185, 129, 0.1)';
      default:
        return 'rgba(245, 158, 11, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'جديد':
        return '#3B82F6';
      case 'تم التسليم':
        return '#10B981';
      default:
        return '#F59E0B';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'جديد':
        return 'rgba(59, 130, 246, 0.2)';
      case 'تم التسليم':
        return 'rgba(16, 185, 129, 0.2)';
      default:
        return 'rgba(245, 158, 11, 0.2)';
    }
  }};
`;

// تنسيق الأزرار
const Button = styled(Link)`
  display: inline-block;
  padding: ${props => props.size === 'sm' ? '0.4rem 0.75rem' : '0.75rem 1.5rem'};
  background: ${props => props.variant === 'primary' ? 'linear-gradient(90deg, #E11D48, #BE123C)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.variant === 'primary' ? '#FFFFFF' : 'rgba(241, 241, 241, 0.7)'};
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  font-size: ${props => props.size === 'sm' ? '0.8rem' : '0.95rem'};
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.variant === 'primary' ? '0 5px 15px rgba(225, 29, 72, 0.3)' : 'none'};
    background: ${props => props.variant === 'primary' ? 'linear-gradient(90deg, #E11D48, #BE123C)' : 'rgba(255, 255, 255, 0.1)'};
    border-color: ${props => props.variant === 'primary' ? 'none' : 'rgba(225, 29, 72, 0.3)'};
  }
`;

// تنسيق قسم الإجراءات
const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: rgba(241, 241, 241, 0.7);
  text-decoration: none;
  
  svg {
    font-size: 2rem;
    color: #E11D48;
    margin-bottom: 1rem;
  }
  
  span {
    font-weight: 500;
  }
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(225, 29, 72, 0.05);
    border-color: rgba(225, 29, 72, 0.3);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

// مكون رسالة الخطأ
const ErrorAlert = styled.div`
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
`;

// مكون حالة التحميل
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: rgba(241, 241, 241, 0.7);
  font-size: 1.2rem;
`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    productsCount: 0,
    ordersCount: 0,
    newOrdersCount: 0,
    completedOrdersCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // جلب إحصائيات عامة
        const usersData = await adminService.getUsers();
        const productsData = await adminService.getProducts();
        const ordersData = await adminService.getOrders();
        
        setStats({
          usersCount: usersData.length,
          productsCount: productsData.length,
          ordersCount: ordersData.length,
          newOrdersCount: ordersData.filter(order => order.status === 'جديد').length,
          completedOrdersCount: ordersData.filter(order => order.status === 'تم التسليم').length
        });

        // جلب أحدث الطلبات
        const recent = ordersData.slice(0, 5);
        setRecentOrders(recent);
      } catch (err) {
        setError('حدث خطأ أثناء جلب بيانات لوحة التحكم');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingContainer>جاري التحميل...</LoadingContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>لوحة تحكم المسؤول</h2>
        {error && <ErrorAlert>{error}</ErrorAlert>}

        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <StatValue>{stats.usersCount}</StatValue>
            <StatLabel>المستخدمين</StatLabel>
            <StatLink to="/admin/users">عرض الكل</StatLink>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <StatValue>{stats.productsCount}</StatValue>
            <StatLabel>المنتجات</StatLabel>
            <StatLink to="/admin/products">عرض الكل</StatLink>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <StatValue>{stats.ordersCount}</StatValue>
            <StatLabel>الطلبات</StatLabel>
            <StatLink to="/admin/orders">عرض الكل</StatLink>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <StatValue>{stats.newOrdersCount}</StatValue>
            <StatLabel>طلبات جديدة</StatLabel>
            <StatLink to="/admin/orders?status=جديد">عرض الكل</StatLink>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <StatValue>{stats.completedOrdersCount}</StatValue>
            <StatLabel>تم تسليمها</StatLabel>
            <StatLink to="/admin/orders?status=تم التسليم">عرض الكل</StatLink>
          </StatCard>
        </StatsGrid>

        <SectionContainer
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SectionHeader>
            <h3>أحدث الطلبات</h3>
            <Button to="/admin/orders" variant="secondary" size="sm">عرض جميع الطلبات</Button>
          </SectionHeader>
          
          <Table>
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>المستخدم</th>
                <th>المنتج</th>
                <th>السعر</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.substring(0, 8)}</td>
                    <td>{order.userId.username}</td>
                    <td>{order.productId.name}</td>
                    <td>{order.totalPrice} ريال</td>
                    <td>
                      <StatusBadge status={order.status}>
                        {order.status}
                      </StatusBadge>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
                    <td>
                      <Button to={`/admin/orders/${order._id}`} variant="primary" size="sm">
                        التفاصيل
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-table">لا توجد طلبات حديثة</td>
                </tr>
              )}
            </tbody>
          </Table>
        </SectionContainer>

        <ActionsGrid>
          <ActionCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <Link to="/admin/products/create" style={{ color: "inherit", textDecoration: "none" }}>
              <FaPlus />
              <span>إضافة منتج جديد</span>
            </Link>
          </ActionCard>
          
          <ActionCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <Link to="/admin/orders?status=جديد" style={{ color: "inherit", textDecoration: "none" }}>
              <FaClipboardList />
              <span>معالجة الطلبات الجديدة</span>
            </Link>
          </ActionCard>
          
          <ActionCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <Link to="/admin/products" style={{ color: "inherit", textDecoration: "none" }}>
              <FaEdit />
              <span>تعديل المنتجات</span>
            </Link>
          </ActionCard>
          
          <ActionCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            whileHover={{ y: -5 }}
          >
            <Link to="/admin/users" style={{ color: "inherit", textDecoration: "none" }}>
              <FaUsers />
              <span>إدارة المستخدمين</span>
            </Link>
          </ActionCard>
        </ActionsGrid>
      </motion.div>
    </DashboardContainer>
  );
};

export default Dashboard;