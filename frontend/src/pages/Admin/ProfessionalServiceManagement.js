// frontend/src/pages/Admin/ProfessionalServiceManagement.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { professionalServiceService } from '../../services/professional-service.service';

const ProfessionalServiceManagement = () => {
  // ===== حالة المكون =====
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');

  // ===== جلب البيانات =====
  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('جاري جلب الخدمات...', { page, status });
        setLoading(true);
        setError('');
        
        const response = await professionalServiceService.getAllProfessionalServices({
          page,
          status: status || undefined
        });
        
        console.log('استجابة الواجهة الخلفية:', response);

        // معالجة البيانات بمرونة مهما كان تنسيقها
        let servicesList = [];
        let totalPages = 1;
        
        // التعامل مع مختلف هياكل البيانات المحتملة
        if (response) {
          // استخراج قائمة الخدمات
          if (response.professionalServices && Array.isArray(response.professionalServices)) {
            servicesList = response.professionalServices;
          } else if (response.services && Array.isArray(response.services)) {
            servicesList = response.services;
          } else if (Array.isArray(response)) {
            servicesList = response;
          }
          
          // استخراج معلومات التصفح
          if (typeof response.pages === 'number') {
            totalPages = response.pages;
          } else if (response.pagination && typeof response.pagination.totalPages === 'number') {
            totalPages = response.pagination.totalPages;
          } else if (response.totalPages) {
            totalPages = response.totalPages;
          }
        }
        
        console.log('البيانات المعالجة:', { 
          servicesCount: servicesList.length,
          totalPages 
        });
        
        setServices(servicesList);
        setPages(totalPages || 1);
      } catch (error) {
        console.error('خطأ في جلب الخدمات:', error);
        setError('حدث خطأ أثناء جلب طلبات الخدمة');
        setServices([]);
        setPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [page, status]);

  // ===== معالجة التفاعل =====
  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      setPage(newPage);
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!id) return;
    
    try {
      setError('');
      console.log('تحديث حالة الخدمة:', { id, newStatus });
      
      const updatedService = await professionalServiceService.updateProfessionalService(id, {
        status: newStatus
      });
      
      console.log('الخدمة بعد التحديث:', updatedService);
      
      if (updatedService) {
        setServices(prevServices => {
          if (!Array.isArray(prevServices)) return [];
          
          return prevServices.map(service => 
            service && service._id === id ? updatedService : service
          );
        });
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة الخدمة:', error);
      setError('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  // ===== وظائف مساعدة =====
  const getStatusClass = (status) => {
    if (!status) return {};
    
    switch (status) {
      case 'جديد': return styles.statusNew;
      case 'قيد المراجعة': return styles.statusReviewing;
      case 'تم قبول الطلب': return styles.statusAccepted;
      case 'قيد التنفيذ': return styles.statusInProgress;
      case 'مكتمل': return styles.statusCompleted;
      case 'مرفوض': return styles.statusRejected;
      case 'ملغي': return styles.statusCanceled;
      default: return {};
    }
  };

  // التعامل مع القوائم المنسدلة
  const handleDropdownToggle = (id) => {
    if (!id) return;
    
    try {
      const dropdown = document.getElementById(`dropdown-${id}`);
      if (!dropdown) return;
      
      const isDisplayed = dropdown.style.display === 'block';
      
      // إغلاق جميع القوائم المنسدلة
      try {
        const allDropdowns = document.querySelectorAll('.dropdown-menu');
        if (allDropdowns && allDropdowns.length > 0) {
          allDropdowns.forEach(menu => {
            if (menu) menu.style.display = 'none';
          });
        }
      } catch (e) {
        console.error('خطأ في إغلاق القوائم المنسدلة:', e);
      }
      
      // فتح القائمة الحالية
      if (!isDisplayed) {
        dropdown.style.display = 'block';
      }
    } catch (e) {
      console.error('خطأ في التعامل مع القائمة المنسدلة:', e);
    }
  };

  // إغلاق القوائم المنسدلة عند النقر في أي مكان آخر
  useEffect(() => {
    const closeDropdowns = (event) => {
      try {
        if (!event || !event.target) return;
        
        if (!event.target.matches || !event.target.matches('.dropdown-toggle')) {
          const dropdowns = document.querySelectorAll('.dropdown-menu');
          if (dropdowns && dropdowns.length > 0) {
            dropdowns.forEach(menu => {
              if (menu) menu.style.display = 'none';
            });
          }
        }
      } catch (e) {
        console.error('خطأ في معالج إغلاق القوائم المنسدلة:', e);
      }
    };

    document.addEventListener('click', closeDropdowns);
    return () => {
      document.removeEventListener('click', closeDropdowns);
    };
  }, []);

  // ===== الأنماط =====
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl'
    },
    heading: {
      borderBottom: '1px solid #eee',
      paddingBottom: '15px',
      marginBottom: '20px',
      color: '#333'
    },
    alert: {
      padding: '10px 15px',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    filterControls: {
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '6px'
    },
    filterGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    label: {
      fontWeight: 'bold',
      color: '#555'
    },
    select: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    noServices: {
      textAlign: 'center',
      padding: '40px',
      backgroundColor: '#f9f9f9',
      borderRadius: '6px',
      color: '#555'
    },
    tableContainer: {
      overflowX: 'auto',
      backgroundColor: '#fff',
      borderRadius: '6px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      backgroundColor: '#f4f4f4',
      padding: '12px',
      textAlign: 'right',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333',
      borderBottom: '2px solid #ddd'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #eee',
      fontSize: '14px',
      verticalAlign: 'top'
    },
    statusBadge: {
      padding: '5px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#fff',
      display: 'inline-block',
      textAlign: 'center'
    },
    statusNew: {
      backgroundColor: '#17a2b8'
    },
    statusReviewing: {
      backgroundColor: '#ffc107',
      color: '#212529'
    },
    statusAccepted: {
      backgroundColor: '#28a745'
    },
    statusInProgress: {
      backgroundColor: '#007bff'
    },
    statusCompleted: {
      backgroundColor: '#6610f2'
    },
    statusRejected: {
      backgroundColor: '#dc3545'
    },
    statusCanceled: {
      backgroundColor: '#6c757d'
    },
    actionsGroup: {
      display: 'flex',
      gap: '5px'
    },
    btnPrimary: {
      backgroundColor: '#007bff',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center'
    },
    btnSecondary: {
      backgroundColor: '#6c757d',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      position: 'relative',
      textAlign: 'center'
    },
    dropdown: {
      position: 'relative',
      display: 'inline-block'
    },
    dropdownToggle: {
      backgroundColor: '#6c757d',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      position: 'relative'
    },
    dropdownMenu: {
      display: 'none',
      position: 'absolute',
      backgroundColor: '#fff',
      minWidth: '160px',
      boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
      zIndex: '1',
      borderRadius: '4px',
      padding: '5px 0',
      left: '0',
      top: '100%'
    },
    dropdownItem: {
      display: 'block',
      width: '100%',
      padding: '8px 15px',
      textAlign: 'right',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#333',
      textDecoration: 'none'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '20px',
      gap: '15px'
    },
    paginationBtn: {
      backgroundColor: '#f4f4f4',
      border: '1px solid #ddd',
      padding: '5px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#333'
    },
    paginationBtnDisabled: {
      backgroundColor: '#e9ecef',
      border: '1px solid #ddd',
      padding: '5px 12px',
      borderRadius: '4px',
      color: '#aaa',
      cursor: 'not-allowed'
    },
    pageInfo: {
      fontSize: '14px',
      color: '#555'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px',
      color: '#666'
    },
    textMuted: {
      color: '#6c757d',
      fontSize: '12px'
    }
  };

  // ===== العرض =====
  // عرض رسالة التحميل
  if (loading) {
    return <div style={styles.loading}>جاري التحميل...</div>;
  }

  // التأكد من قابلية عرض البيانات
  const safeServices = Array.isArray(services) ? services : [];
  const hasServices = safeServices.length > 0;

  // عرض الواجهة الرئيسية
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>إدارة طلبات الخدمات الاحترافية</h2>
      
      {/* رسائل الخطأ */}
      {error && <div style={styles.alert}>{error}</div>}
      
      {/* فلاتر */}
      <div style={styles.filterControls}>
        <div style={styles.filterGroup}>
          <label htmlFor="statusFilter" style={styles.label}>تصفية حسب الحالة:</label>
          <select
            id="statusFilter"
            value={status || ''}
            onChange={handleStatusChange}
            style={styles.select}
          >
            <option value="">جميع الحالات</option>
            <option value="جديد">جديد</option>
            <option value="قيد المراجعة">قيد المراجعة</option>
            <option value="تم قبول الطلب">تم قبول الطلب</option>
            <option value="قيد التنفيذ">قيد التنفيذ</option>
            <option value="مكتمل">مكتمل</option>
            <option value="مرفوض">مرفوض</option>
            <option value="ملغي">ملغي</option>
          </select>
        </div>
      </div>

      {/* عرض الخدمات أو رسالة فارغة */}
      {!hasServices ? (
        <div style={styles.noServices}>
          <p>لا توجد طلبات خدمة متطابقة مع معايير التصفية.</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>رقم الطلب</th>
                <th style={styles.th}>العميل</th>
                <th style={styles.th}>عنوان الطلب</th>
                <th style={styles.th}>نوع الخدمة</th>
                <th style={styles.th}>الميزانية</th>
                <th style={styles.th}>الموعد النهائي</th>
                <th style={styles.th}>تاريخ الطلب</th>
                <th style={styles.th}>الحالة</th>
                <th style={styles.th}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {/* عرض قائمة الخدمات */}
              {safeServices.map((service, index) => {
                if (!service) return null;
                
                return (
                  <tr key={service._id || `service-${index}`}>
                    <td style={styles.td}>
                      {service._id ? 
                        (typeof service._id === 'string' && service._id.length >= 6 ? 
                          service._id.substr(-6).toUpperCase() : service._id) 
                        : 'غير متوفر'}
                    </td>
                    <td style={styles.td}>
                      {service.userId && typeof service.userId === 'object' && service.userId.username ? (
                        <>
                          {service.userId.username}<br />
                          <span style={styles.textMuted}>
                            {service.userId.email || 'البريد غير متوفر'}
                          </span>
                        </>
                      ) : (
                        <span style={styles.textMuted}>غير متوفر</span>
                      )}
                    </td>
                    <td style={styles.td}>{service.title || 'غير متوفر'}</td>
                    <td style={styles.td}>{service.serviceType || 'غير متوفر'}</td>
                    <td style={styles.td}>
                      {service.budget ? `${service.budget} ريال` : 'غير متوفر'}
                    </td>
                    <td style={styles.td}>
                      {service.deadline ? 
                        (() => {
                          try {
                            return new Date(service.deadline).toLocaleDateString('ar-SA');
                          } catch {
                            return 'تاريخ غير صالح';
                          }
                        })() : 'غير محدد'
                      }
                    </td>
                    <td style={styles.td}>
                      {service.createdAt ? 
                        (() => {
                          try {
                            return new Date(service.createdAt).toLocaleDateString('ar-SA');
                          } catch {
                            return 'تاريخ غير صالح';
                          }
                        })() : 'غير محدد'
                      }
                    </td>
                    <td style={styles.td}>
                      {service.status ? (
                        <span 
                          style={{
                            ...styles.statusBadge, 
                            ...(getStatusClass(service.status))
                          }}
                        >
                          {service.status}
                        </span>
                      ) : (
                        <span style={styles.textMuted}>غير محدد</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionsGroup}>
                        {service._id && (
                          <>
                            <Link to={`/admin/service/${service._id}`} style={styles.btnPrimary}>
                              عرض
                            </Link>
                            <div style={styles.dropdown} className="dropdown">
                              <button
                                type="button"
                                className="dropdown-toggle"
                                style={styles.dropdownToggle}
                                onClick={() => handleDropdownToggle(service._id)}
                              >
                                تغيير الحالة
                              </button>
                              <div
                                id={`dropdown-${service._id}`}
                                className="dropdown-menu"
                                style={styles.dropdownMenu}
                              >
                                {['قيد المراجعة', 'تم قبول الطلب', 'قيد التنفيذ', 'مكتمل', 'مرفوض'].map((statusOption) => (
                                  <button
                                    key={statusOption}
                                    type="button"
                                    onClick={() => handleStatusUpdate(service._id, statusOption)}
                                    style={styles.dropdownItem}
                                  >
                                    {statusOption}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* ترقيم الصفحات */}
          <div style={styles.pagination}>
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              style={page <= 1 ? styles.paginationBtnDisabled : styles.paginationBtn}
            >
              السابق
            </button>
            <span style={styles.pageInfo}>
              الصفحة {page} من {Math.max(1, pages)}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= pages}
              style={page >= pages ? styles.paginationBtnDisabled : styles.paginationBtn}
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalServiceManagement;