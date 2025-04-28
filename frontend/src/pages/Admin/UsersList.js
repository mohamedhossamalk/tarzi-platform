// frontend/src/pages/Admin/UsersList.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { adminService } from '../../services/admin.service';
import { 
  FaUser, FaSearch, FaPlus, FaEdit, FaTrashAlt, FaExclamationTriangle, 
  FaUserShield, FaFilter, FaSortAmountDown, FaSortAmountUp, FaDownload, 
  FaEye, FaCheck, FaTimes, FaUserCog
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

const tableRowVariants = {
  hidden: { opacity: 0 },
  visible: i => ({
    opacity: 1,
    transition: {
      delay: i * 0.05,
    },
  }),
  exit: { opacity: 0 }
};

// حاوية الصفحة
const PageContainer = styled(motion.div)`
  background-color: #0A0A0A;
  color: #F1F1F1;
  padding: 2rem 1rem;
  max-width: 1400px;
  margin: 0 auto;
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
    flex-direction: column;
    align-items: stretch;
  }
  
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

// شريط بحث وأدوات
const ToolBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// مجموعة البحث
const SearchGroup = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(241, 241, 241, 0.4);
  }
  
  input {
    width: 100%;
    padding: 0.75rem 1rem;
    padding-left: 2.5rem;
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
`;

// أزرار الإجراءات الرئيسية
const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

// زر الإجراء
const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.primary 
    ? 'linear-gradient(90deg, #E11D48, #BE123C)' 
    : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.primary ? '#FFFFFF' : '#F1F1F1'};
  border: ${props => props.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.primary 
      ? 'linear-gradient(90deg, #BE123C, #9F1239)' 
      : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
    box-shadow: ${props => props.primary 
      ? '0 5px 15px rgba(225, 29, 72, 0.3)' 
      : '0 5px 15px rgba(0, 0, 0, 0.1)'};
  }
  
  svg {
    font-size: 0.9rem;
  }
  
  @media (max-width: 576px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
`;

// شريط الفلترة
const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

// قائمة منسدلة
const Select = styled.select`
  padding: 0.65rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #F1F1F1;
  font-size: 0.9rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left 0.75rem center;
  background-size: 16px;
  padding-left: 2.5rem;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #E11D48;
    box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.1);
  }
  
  option {
    background-color: #111111;
    color: #F1F1F1;
  }
`;

// وسم الفلترة
const FilterLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(241, 241, 241, 0.7);
  font-size: 0.9rem;
  
  svg {
    color: #E11D48;
    font-size: 1rem;
  }
`;

// معلومات الفلترة
const FilterInfo = styled.div`
  margin-right: auto;
  font-size: 0.9rem;
  color: rgba(241, 241, 241, 0.5);
  
  span {
    color: #E11D48;
    font-weight: 500;
    margin: 0 0.25rem;
  }
`;

// جدول البيانات
const TableContainer = styled.div`
  background: #111111;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(225, 29, 72, 0.3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
`;

// الجدول
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

// رأس الجدول
const TableHead = styled.thead`
  background: rgba(255, 255, 255, 0.03);
  
  th {
    padding: 1rem;
    text-align: right;
    font-weight: 500;
    color: rgba(241, 241, 241, 0.8);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    white-space: nowrap;
    position: relative;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.02);
    }
    
    &.sortable {
      cursor: pointer;
      padding-left: 2rem;
      
      &::after {
        content: '';
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        width: 0.75rem;
        height: 0.75rem;
        background-size: contain;
        background-repeat: no-repeat;
      }
      
      &.asc::after {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(225, 29, 72, 1)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 15l-6-6-6 6'%3E%3C/path%3E%3C/svg%3E");
      }
      
      &.desc::after {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(225, 29, 72, 1)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
      }
    }
  }
`;

// جسم الجدول
const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.02);
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  td {
    padding: 1rem;
    vertical-align: middle;
    
    &.actions-cell {
      white-space: nowrap;
    }
  }
  
  .empty-table {
    text-align: center;
    padding: 3rem 1rem;
    color: rgba(241, 241, 241, 0.5);
    font-style: italic;
  }
`;

// خلية هوية المستخدم
const UserIdCell = styled.td`
  font-family: monospace;
  background: rgba(255, 255, 255, 0.02);
  border-left: 1px solid rgba(255, 255, 255, 0.03);
`;

// شارة الدور
const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  
  &.admin-role {
    background-color: rgba(225, 29, 72, 0.1);
    color: #E11D48;
    border: 1px solid rgba(225, 29, 72, 0.2);
  }
  
  &.user-role {
    background-color: rgba(96, 165, 250, 0.1);
    color: #60A5FA;
    border: 1px solid rgba(96, 165, 250, 0.2);
  }
  
  svg {
    font-size: 0.75rem;
  }
`;

// شارة الحالة
const StatusBadge = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 5px;
  
  &.active {
    background-color: #10B981;
    box-shadow: 0 0 5px #10B981;
  }
  
  &.inactive {
    background-color: #6B7280;
  }
`;

// أزرار الإجراءات
const ActionButtonsCell = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// زر إجراء في الجدول
const TableActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: ${props => {
    if (props.edit) return 'rgba(96, 165, 250, 0.1)';
    if (props.delete) return 'rgba(239, 68, 68, 0.1)';
    if (props.view) return 'rgba(16, 185, 129, 0.1)';
    return 'rgba(255, 255, 255, 0.05)';
  }};
  color: ${props => {
    if (props.edit) return '#60A5FA';
    if (props.delete) return '#EF4444';
    if (props.view) return '#10B981';
    return '#F1F1F1';
  }};
  border: 1px solid ${props => {
    if (props.edit) return 'rgba(96, 165, 250, 0.2)';
    if (props.delete) return 'rgba(239, 68, 68, 0.2)';
    if (props.view) return 'rgba(16, 185, 129, 0.2)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  border-radius: 6px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  
  &:hover:not(:disabled) {
    background: ${props => {
      if (props.edit) return 'rgba(96, 165, 250, 0.2)';
      if (props.delete) return 'rgba(239, 68, 68, 0.2)';
      if (props.view) return 'rgba(16, 185, 129, 0.2)';
      return 'rgba(255, 255, 255, 0.1)';
    }};
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 0.9rem;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

// صف الصفحات
const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

// معلومات الصفحات
const PaginationInfo = styled.div`
  color: rgba(241, 241, 241, 0.6);
  font-size: 0.9rem;
`;

// أزرار الصفحات
const PaginationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// زر الصفحة
const PageButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.active ? 'rgba(225, 29, 72, 0.1)' : 'rgba(255, 255, 255, 0.03)'};
  color: ${props => props.active ? '#E11D48' : '#F1F1F1'};
  border: ${props => props.active ? '1px solid rgba(225, 29, 72, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? 'rgba(225, 29, 72, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
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
  flex-direction: column;
  gap: 1rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #E11D48;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// مودال التأكيد
const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

// محتوى المودال
const ModalContent = styled(motion.div)`
  background: #111111;
  border-radius: 10px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  h3 {
    color: #F1F1F1;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    svg {
      color: #EF4444;
    }
  }
  
  p {
    color: rgba(241, 241, 241, 0.8);
    margin-bottom: 1.5rem;
    
    strong {
      color: #F1F1F1;
      font-weight: 600;
    }
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    
    button {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:first-child {
        background: linear-gradient(90deg, #E11D48, #BE123C);
        color: white;
        border: none;
        
        &:hover {
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
    }
  }
`;

// مكون القائمة
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // حالة الفرز والصفحات
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  
  // حالة مودال الحذف
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await adminService.getUsers();
        setUsers(data);
      } catch (err) {
        setError('حدث خطأ أثناء جلب بيانات المستخدمين');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await adminService.deleteUser(userToDelete._id);
      setUsers(users.filter(user => user._id !== userToDelete._id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      setError('حدث خطأ أثناء حذف المستخدم');
      console.error(err);
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  
  const handleSort = (field) => {
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
  };
  
  // فلترة المستخدمين
  const filteredUsers = users.filter(user => {
    // فلتر البحث
    const searchMatch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));
    
    // فلتر الدور
    const roleMatch = roleFilter === 'all' || user.role === roleFilter;
    
    return searchMatch && roleMatch;
  });
  
  // ترتيب المستخدمين
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === 'createdAt') {
      return sortOrder === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  // تقسيم الصفحات
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const exportUsers = () => {
    const data = filteredUsers.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone || '-',
      createdAt: new Date(user.createdAt).toLocaleDateString('ar-SA')
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "معرف المستخدم,اسم المستخدم,البريد الإلكتروني,الدور,رقم الهاتف,تاريخ التسجيل\n"
      + data.map(user => Object.values(user).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <span>جاري تحميل بيانات المستخدمين...</span>
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
        <h2>إدارة المستخدمين</h2>
        <ActionButton
          primary
          onClick={() => navigate('/admin/users/create')}
        >
          <FaPlus /> إضافة مستخدم جديد
        </ActionButton>
      </PageHeader>
      
      {error && (
        <Alert>
          <FaExclamationTriangle />
          <span>{error}</span>
        </Alert>
      )}
      
      <ToolBar>
        <SearchGroup>
          <FaSearch />
          <input 
            type="text"
            placeholder="بحث عن مستخدم بالاسم، البريد، أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchGroup>
        
        <ActionButtons>
          <ActionButton onClick={exportUsers}>
            <FaDownload /> تصدير
          </ActionButton>
          
          <ActionButton 
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('all');
              setSortField('createdAt');
              setSortOrder('desc');
            }}
          >
            <FaFilter /> إعادة ضبط
          </ActionButton>
        </ActionButtons>
      </ToolBar>
      
      <FilterBar>
        <FilterLabel>
          <FaUserCog /> فلترة حسب الدور:
        </FilterLabel>
        
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">جميع الأدوار</option>
          <option value="admin">المسؤولين</option>
          <option value="user">المستخدمين العاديين</option>
        </Select>
        
        <FilterLabel>
          <FaSortAmountDown /> ترتيب حسب:
        </FilterLabel>
        
        <Select
          value={sortField}
          onChange={(e) => {
            setSortField(e.target.value);
            setSortOrder('desc');
          }}
        >
           <option value="createdAt">تاريخ التسجيل</option>
          <option value="username">اسم المستخدم</option>
          <option value="email">البريد الإلكتروني</option>
          <option value="role">الدور</option>
        </Select>
        
        <ActionButton 
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
          {sortOrder === 'asc' ? ' تصاعدي' : ' تنازلي'}
        </ActionButton>
        
        <FilterInfo>
          يتم عرض <span>{filteredUsers.length}</span> من أصل <span>{users.length}</span> مستخدم
        </FilterInfo>
      </FilterBar>
      
      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <th>المعرف</th>
              <th 
                className={`sortable ${sortField === 'username' ? sortOrder : ''}`}
                onClick={() => handleSort('username')}
              >
                اسم المستخدم
              </th>
              <th 
                className={`sortable ${sortField === 'email' ? sortOrder : ''}`}
                onClick={() => handleSort('email')}
              >
                البريد الإلكتروني
              </th>
              <th 
                className={`sortable ${sortField === 'role' ? sortOrder : ''}`}
                onClick={() => handleSort('role')}
              >
                الدور
              </th>
              <th>رقم الهاتف</th>
              <th 
                className={`sortable ${sortField === 'createdAt' ? sortOrder : ''}`}
                onClick={() => handleSort('createdAt')}
              >
                تاريخ التسجيل
              </th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </TableHead>
          <TableBody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, i) => (
                <motion.tr 
                  key={user._id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={tableRowVariants}
                >
                  <UserIdCell title={user._id}>{user._id.substring(0, 8)}...</UserIdCell>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <RoleBadge className={`${user.role === 'admin' ? 'admin-role' : 'user-role'}`}>
                      {user.role === 'admin' ? (
                        <>
                          <FaUserShield /> مسؤول
                        </>
                      ) : (
                        <>
                          <FaUser /> مستخدم
                        </>
                      )}
                    </RoleBadge>
                  </td>
                  <td>{user.phone || '-'}</td>
                  <td title={new Date(user.createdAt).toLocaleString('ar-SA')}>
                    {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <StatusBadge 
                        className={user.isActive !== false ? 'active' : 'inactive'} 
                        title={user.isActive !== false ? 'نشط' : 'غير نشط'}
                      />
                      {user.isActive !== false ? 'نشط' : 'غير نشط'}
                    </div>
                  </td>
                  <td>
                    <ActionButtonsCell>
                      <TableActionButton 
                        view 
                        title="عرض بيانات المستخدم"
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                      >
                        <FaEye />
                      </TableActionButton>
                      
                      <TableActionButton 
                        edit 
                        title="تعديل المستخدم"
                        onClick={() => navigate(`/admin/users/${user._id}/edit`)}
                      >
                        <FaEdit />
                      </TableActionButton>
                      
                      <TableActionButton 
                        delete 
                        title={user.role === 'admin' ? 'لا يمكن حذف المسؤولين' : 'حذف المستخدم'}
                        onClick={() => openDeleteModal(user)}
                        disabled={user.role === 'admin'}
                      >
                        <FaTrashAlt />
                      </TableActionButton>
                    </ActionButtonsCell>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-table">
                  {searchTerm || roleFilter !== 'all' ? 'لا توجد نتائج مطابقة للبحث' : 'لا يوجد مستخدمين حتى الآن'}
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {sortedUsers.length > usersPerPage && (
        <PaginationRow>
          <PaginationInfo>
            عرض {indexOfFirstUser + 1} - {Math.min(indexOfLastUser, sortedUsers.length)} من {sortedUsers.length} مستخدم
          </PaginationInfo>
          
          <PaginationButtons>
            <PageButton
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
              title="الصفحة الأولى"
            >
              &laquo;
            </PageButton>
            
            <PageButton
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              title="الصفحة السابقة"
            >
              &lsaquo;
            </PageButton>
            
            {[...Array(totalPages).keys()].map(number => {
              // عرض 5 صفحات فقط حول الصفحة الحالية
              if (
                number + 1 === 1 ||
                number + 1 === totalPages ||
                (number + 1 >= currentPage - 1 && number + 1 <= currentPage + 1)
              ) {
                return (
                  <PageButton
                    key={number}
                    onClick={() => paginate(number + 1)}
                    active={currentPage === number + 1}
                  >
                    {number + 1}
                  </PageButton>
                );
              } else if (
                number + 1 === currentPage - 2 ||
                number + 1 === currentPage + 2
              ) {
                return <span key={number} style={{ color: 'rgba(255, 255, 255, 0.5)' }}>...</span>;
              }
              return null;
            })}
            
            <PageButton
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              title="الصفحة التالية"
            >
              &rsaquo;
            </PageButton>
            
            <PageButton
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages}
              title="الصفحة الأخيرة"
            >
              &raquo;
            </PageButton>
          </PaginationButtons>
        </PaginationRow>
      )}
      
      {/* مودال تأكيد الحذف */}
      {showDeleteModal && (
        <ConfirmModal>
          <ModalContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <h3>
              <FaExclamationTriangle /> تأكيد الحذف
            </h3>
            <p>
              هل أنت متأكد من رغبتك في حذف المستخدم <strong>{userToDelete?.username}</strong>؟
              <br />
              لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="modal-actions">
              <button onClick={handleConfirmDelete}>
                <FaCheck /> نعم، حذف
              </button>
              <button onClick={() => setShowDeleteModal(false)}>
                <FaTimes /> إلغاء
              </button>
            </div>
          </ModalContent>
        </ConfirmModal>
      )}
    </PageContainer>
  );
};

export default UsersList;
