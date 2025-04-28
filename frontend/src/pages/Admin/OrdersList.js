// frontend/src/pages/Admin/OrdersList.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaClipboardList, FaCog } from 'react-icons/fa';
import { adminService } from '../../services/admin.service';

// تنسيق حاوية الصفحة
const PageContainer = styled.div`
  background-color: #0A0A0A;
  color: #F1F1F1;
  padding: 2rem 1rem;
`;

// رأس الصفحة
const PageHeader = styled.div`
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

// حاوية الفلترة والبحث
const FilterContainer = styled(motion.div)`
  background: #111111;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

// مكون البحث
const SearchBox = styled.div`
  flex: 1;
  min-width: 250px;
  position: relative;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    font-size: 0.95rem;
    color: #F1F1F1;
    
    &:focus {
      outline: none;
      border-color: #E11D48;
      box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1);
    }
    
    &::placeholder {
      color: rgba(241, 241, 241, 0.4);
    }
  }
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(241, 241, 241, 0.4);
  }
`;

// مكون الفلتر
const FilterOptions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  select {
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    appearance: none;
    background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(241, 241, 241, 0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E") no-repeat left 0.75rem center/16px;
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #F1F1F1;
    width: 200px;
    font-family: 'Cairo', sans-serif;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #E11D48;
      box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1);
    }
    
    option {
      background-color: #111111;
      padding: 0.5rem;
    }
  }
  
  .filter-icon {
    margin-left: 0.5rem;
    color: rgba(241, 241, 241, 0.6);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    
    select {
      width: 100%;
    }
  }
`;

// حاوية الجدول
const TableContainer = styled(motion.div)`
  background: #111111;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 2rem;
  position: relative;
  overflow: auto;
  
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

// تصميم الجدول
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  
  th, td {
    padding: 1rem;
    text-align: right;
  }
  
  th {
    color: rgba(241, 241, 241, 0.7);
    font-weight: 600;
    font-size: 0.9rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  tbody tr {
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.02);
    }
  }
  
  .empty-table {
    text-align: center;
    padding: 3rem 0;
    color: rgba(241, 241, 241, 0.5);
  }
`;

// بادج الحالة
const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  background-color: ${props => {
    switch (props.status) {
      case 'جديد':
        return 'rgba(59, 130, 246, 0.1)';
      case 'قيد المعالجة':
      case 'قيد التنفيذ':
        return 'rgba(245, 158, 11, 0.1)';
      case 'جاهز للتسليم':
        return 'rgba(139, 92, 246, 0.1)';
      case 'تم التسليم':
        return 'rgba(16, 185, 129, 0.1)';
      case 'ملغي':
        return 'rgba(239, 68, 68, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'جديد':
        return '#3B82F6';
      case 'قيد المعالجة':
      case 'قيد التنفيذ':
        return '#F59E0B';
      case 'جاهز للتسليم':
        return '#8B5CF6';
      case 'تم التسليم':
        return '#10B981';
      case 'ملغي':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'جديد':
        return 'rgba(59, 130, 246, 0.2)';
      case 'قيد المعالجة':
      case 'قيد التنفيذ':
        return 'rgba(245, 158, 11, 0.2)';
      case 'جاهز للتسليم':
        return 'rgba(139, 92, 246, 0.2)';
      case 'تم التسليم':
        return 'rgba(16, 185, 129, 0.2)';
      case 'ملغي':
        return 'rgba(239, 68, 68, 0.2)';
      default:
        return 'rgba(107, 114, 128, 0.2)';
    }
  }};
`;

// حالة الدفع
const PaymentStatus = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  background-color: ${props => props.status === 'مدفوع' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.status === 'مدفوع' ? '#10B981' : '#EF4444'};
  border: 1px solid ${props => props.status === 'مدفوع' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;

// زر الإجراء
const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(90deg, #E11D48, #BE123C);
  color: white;
  border-radius: 8px;
  font-size: 0.9rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

// رسالة خطأ
const ErrorAlert = styled.div`
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
`;

// مكون التحميل
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: rgba(241, 241, 241, 0.7);
  font-size: 1.2rem;
`;

// تأثيرات الحركة
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

// المكون الرئيسي
const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusParam = queryParams.get('status');

  useEffect(() => {
    if (statusParam) {
      setStatusFilter(statusParam);
    }
  }, [statusParam]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await adminService.getOrders();
        setOrders(data);
      } catch (err) {
        setError('حدث خطأ أثناء جلب بيانات الطلبات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    // تطبيق البحث
    const searchMatch = 
      (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.userId && order.userId.username && order.userId.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.productId && order.productId.name && order.productId.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // تطبيق فلتر الحالة
    const statusMatch = statusFilter ? order.status === statusFilter : true;

    return searchMatch && statusMatch;
  });

  // استخراج قائمة الحالات الفريدة
  const statusOptions = ['', ...new Set(orders.map(order => order.status).filter(Boolean))];

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          جاري التحميل...
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <PageHeader>
          <motion.h2 variants={childVariants}>إدارة الطلبات</motion.h2>
        </PageHeader>

        <FilterContainer variants={childVariants}>
          <SearchBox>
            <FaSearch />
            <input 
              type="text"
              placeholder="بحث في الطلبات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          <FilterOptions>
            <FaFilter className="filter-icon" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">جميع الحالات</option>
              {statusOptions.filter(status => status).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </FilterOptions>
        </FilterContainer>

        {error && <ErrorAlert variants={childVariants}>{error}</ErrorAlert>}

        <TableContainer variants={childVariants}>
          <Table>
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>المستخدم</th>
                <th>المنتج</th>
                <th>السعر</th>
                <th>حالة الطلب</th>
                <th>حالة الدفع</th>
                <th>تاريخ الطلب</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td>#{order._id.substring(0, 8)}</td>
                    <td>{order.userId.username}</td>
                    <td>{order.productId.name}</td>
                    <td>{order.totalPrice} ريال</td>
                    <td>
                      <StatusBadge status={order.status}>
                        {order.status}
                      </StatusBadge>
                    </td>
                    <td>
                      <PaymentStatus status={order.paymentStatus}>
                        {order.paymentStatus}
                      </PaymentStatus>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
                    <td>
                      <ActionButton to={`/admin/orders/${order._id}`}>
                        <FaCog /> إدارة
                      </ActionButton>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table">لا توجد طلبات مطابقة</td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableContainer>
      </motion.div>
    </PageContainer>
  );
};

export default OrdersList;
