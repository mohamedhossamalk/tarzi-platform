// frontend/src/pages/Admin/DataManagementPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaDatabase, FaPlus, FaEdit, FaTrash, FaDownload, FaUpload } from 'react-icons/fa';

// ستايل مكونات الصفحة
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #0A0A0A;
  color: #F1F1F1;
  border-radius: 10px;
  direction: rtl;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
  
  h1 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #E11D48;
    margin: 0;
    
    svg {
      font-size: 1.4rem;
    }
  }
`;

const TabContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  button {
    padding: 0.75rem 1.25rem;
    background: ${props => props.active ? 'rgba(225, 29, 72, 0.2)' : 'transparent'};
    color: ${props => props.active ? '#E11D48' : '#F1F1F1'};
    border: 1px solid ${props => props.active ? '#E11D48' : 'rgba(255, 255, 255, 0.1)'};
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    white-space: nowrap;
    
    &:hover {
      background: rgba(225, 29, 72, 0.1);
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    background: rgba(255, 255, 255, 0.05);
    padding: 0.75rem 1rem;
    text-align: right;
    color: #E11D48;
  }
  
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  tr:hover td {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  
  button {
    background: transparent;
    border: none;
    color: #F1F1F1;
    cursor: pointer;
    padding: 0.25rem;
    
    &:hover {
      color: #E11D48;
    }
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #111111;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  h3 {
    margin: 0 0 0.5rem;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
  }
  
  .value {
    font-size: 2rem;
    color: #E11D48;
    font-weight: bold;
  }
`;

const ImportExportSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: rgba(255, 255, 255, 0.05);
    color: #F1F1F1;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    cursor: pointer;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const DataManagementPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    services: 0
  });
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  
  // جلب البيانات الإحصائية
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setStats(response.data);
    } catch (err) {
      console.error('خطأ في جلب الإحصائيات:', err);
    }
  };
  
  // جلب البيانات حسب التبويب النشط
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let endpoint;
      
      switch(activeTab) {
        case 'users':
          endpoint = '/admin/users';
          break;
        case 'products':
          endpoint = '/admin/products';
          break;
        case 'orders':
          endpoint = '/admin/orders';
          break;
        case 'services':
          endpoint = '/admin/professionalservices';
          break;
        case 'measurements':
          endpoint = '/admin/measurements';
          break;
        default:
          endpoint = '/admin/users';
      }
      
      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setData(response.data);
    } catch (err) {
      console.error(`خطأ في جلب بيانات ${activeTab}:`, err);
      setError('فشل في جلب البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };
  
  // تنفيذ عند تحميل المكون أو تغيير التبويب
  useEffect(() => {
    fetchData();
    fetchStats();
  }, [activeTab]);
  
  // تصدير البيانات
  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/export/${activeTab}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      });
      
      // إنشاء رابط تنزيل
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tarzi_${activeTab}_${new Date().toISOString()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('خطأ في تصدير البيانات:', err);
      alert('فشل تصدير البيانات. يرجى المحاولة مرة أخرى.');
    }
  };
  
  // رسم جدول البيانات حسب التبويب
  const renderDataTable = () => {
    if (loading) return <p>جاري تحميل البيانات...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!data.length) return <p>لا توجد بيانات متاحة.</p>;
    
    // تحديد الحقول حسب التبويب
    let fields = [];
    switch(activeTab) {
      case 'users':
        fields = ['_id', 'username', 'email', 'role', 'createdAt'];
        break;
      case 'products':
        fields = ['_id', 'name', 'category', 'price', 'isActive'];
        break;
      case 'orders':
        fields = ['_id', 'status', 'totalPrice', 'paymentStatus', 'createdAt'];
        break;
      case 'services':
        fields = ['_id', 'title', 'serviceType', 'status', 'price', 'createdAt'];
        break;
      case 'measurements':
        fields = ['_id', 'name', 'userId', 'isDefault', 'createdAt'];
        break;
      default:
        fields = ['_id', 'name'];
    }
    
    return (
      <Table>
        <thead>
          <tr>
            {fields.map(field => (
              <th key={field}>{getFieldTitle(field)}</th>
            ))}
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item._id}>
              {fields.map(field => (
                <td key={`${item._id}-${field}`}>{formatField(item[field], field)}</td>
              ))}
              <td>
                <ActionButtons>
                  <button title="تعديل" onClick={() => handleEdit(item._id)}>
                    <FaEdit />
                  </button>
                  <button title="حذف" onClick={() => handleDelete(item._id)}>
                    <FaTrash />
                  </button>
                </ActionButtons>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };
  
  // تنسيق قيمة الحقل حسب نوعه
  const formatField = (value, fieldName) => {
    if (!value) return '-';
    
    if (fieldName === 'createdAt' && typeof value === 'string') {
      return new Date(value).toLocaleDateString('ar-SA');
    }
    
    if (typeof value === 'boolean') {
      return value ? 'نعم' : 'لا';
    }
    
    if (fieldName === 'price' || fieldName === 'totalPrice') {
      return `${value} ريال`;
    }
    
    return value;
  };
  
  // الحصول على عنوان الحقل بالعربية
  const getFieldTitle = (field) => {
    const titles = {
      _id: 'المعرف',
      username: 'اسم المستخدم',
      email: 'البريد الإلكتروني',
      role: 'الدور',
      createdAt: 'تاريخ الإنشاء',
      name: 'الاسم',
      category: 'الفئة',
      price: 'السعر',
      isActive: 'نشط',
      status: 'الحالة',
      totalPrice: 'السعر الإجمالي',
      paymentStatus: 'حالة الدفع',
      title: 'العنوان',
      serviceType: 'نوع الخدمة',
      userId: 'معرف المستخدم',
      isDefault: 'افتراضي'
    };
    
    return titles[field] || field;
  };
  
  // معالجة التعديل
  const handleEdit = (id) => {
    // توجيه المستخدم لصفحة التعديل
    window.location.href = `/admin/${activeTab}/edit/${id}`;
  };
  
  // معالجة الحذف
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا العنصر؟')) {
      try {
        await axios.delete(`${API_URL}/admin/${activeTab}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        // تحديث البيانات بعد الحذف
        setData(data.filter(item => item._id !== id));
        alert('تم الحذف بنجاح');
      } catch (err) {
        console.error('خطأ في حذف العنصر:', err);
        alert('فشل حذف العنصر. يرجى المحاولة مرة أخرى.');
      }
    }
  };
  
  return (
    <PageContainer>
      <Header>
        <h1><FaDatabase /> إدارة بيانات المنصة</h1>
      </Header>
      
      <StatsSection>
        <StatCard>
          <h3>المستخدمون</h3>
          <div className="value">{stats.users}</div>
        </StatCard>
        <StatCard>
          <h3>المنتجات</h3>
          <div className="value">{stats.products}</div>
        </StatCard>
        <StatCard>
          <h3>الطلبات</h3>
          <div className="value">{stats.orders}</div>
        </StatCard>
        <StatCard>
          <h3>الخدمات الاحترافية</h3>
          <div className="value">{stats.services}</div>
        </StatCard>
      </StatsSection>
      
      <ImportExportSection>
        <button onClick={handleExport}>
          <FaDownload /> تصدير البيانات
        </button>
      </ImportExportSection>
      
      <TabContainer>
        <TabButtons>
          <button 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            المستخدمون
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            المنتجات
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            الطلبات
          </button>
          <button 
            className={activeTab === 'services' ? 'active' : ''}
            onClick={() => setActiveTab('services')}
          >
            الخدمات الاحترافية
          </button>
          <button 
            className={activeTab === 'measurements' ? 'active' : ''}
            onClick={() => setActiveTab('measurements')}
          >
            المقاسات
          </button>
        </TabButtons>
        
        {renderDataTable()}
      </TabContainer>
    </PageContainer>
  );
};

export default DataManagementPage;