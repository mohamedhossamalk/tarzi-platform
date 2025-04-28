// frontend/src/pages/Admin/ProfessionalServiceManagement.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { professionalServiceService } from '../../services/professional-service.service';

const ProfessionalServiceManagement = () => {
  // 1. تهيئة الحالات بقيم افتراضية آمنة
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  
  useEffect(() => {
    // 2. تعيين loading إلى true قبل جلب البيانات
    setLoading(true);
    const fetchServices = async () => {
      try {
        const data = await professionalServiceService.getAllProfessionalServices({
          page,
          status: status || undefined
        });
        
        // 3. تأكد من أن البيانات موجودة وفي الشكل المتوقع
        if (data && data.professionalServices) {
          setServices(data.professionalServices);
          setPages(data.pages || 1);
        } else {
          console.error('بيانات غير صالحة من API:', data);
          setServices([]);
          setPages(1);
        }
      } catch (err) {
        console.error('خطأ في جلب الخدمات:', err);
        setError('حدث خطأ أثناء جلب طلبات الخدمة');
        setServices([]);
        setPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [page, status]);

  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      setPage(newPage);
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1); // إعادة تعيين الصفحة عند تغيير الحالة
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!id) return;
    
    try {
      const updatedService = await professionalServiceService.updateProfessionalService(id, {
        status: newStatus
      });
      
      if (updatedService) {
        setServices(
          services.map((service) =>
            service._id === id ? updatedService : service
          )
        );
      }
    } catch (err) {
      console.error('خطأ في تحديث الحالة:', err);
      setError('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

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

  // تنفيذ الوظائف التفاعلية للقائمة المنسدلة
  const handleDropdownToggle = (id) => {
    if (!id) return;
    
    const dropdown = document.getElementById(`dropdown-${id}`);
    if (!dropdown) return;
    
    const isDisplayed = dropdown.style.display === 'block';
    
    // إغلاق جميع القوائم المنسدلة المفتوحة
    const allDropdowns = document.querySelectorAll('.dropdown-menu');
    if (allDropdowns && allDropdowns.length > 0) {
      allDropdowns.forEach(menu => {
        if (menu) menu.style.display = 'none';
      });
    }
    
    // فتح أو إغلاق القائمة الحالية
    if (!isDisplayed) {
      dropdown.style.display = 'block';
    }
  };

  // إغلاق القوائم المنسدلة عند النقر في أي مكان آخر
  useEffect(() => {
    const closeDropdowns = (event) => {
      if (!event.target || !event.target.matches) return;
      
      if (!event.target.matches('.dropdown-toggle')) {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        if (dropdowns && dropdowns.length > 0) {
          dropdowns.forEach(menu => {
            if (menu) menu.style.display = 'none';
          });
        }
      }
    };

    document.addEventListener('click', closeDropdowns);
    return () => {
      document.removeEventListener('click', closeDropdowns);
    };
  }, []);

  // 4. إضافة تحقق إضافي من الحالة قبل تصيير المكون
  if (loading) {
    return <div style={styles.loading}>جاري التحميل...</div>;
  }

  // 5. ما يلي هو التصيير الآمن للمكون
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>إدارة طلبات الخدمات الاحترافية</h2>
      {error && <div style={styles.alert}>{error}</div>}
      
      <div style={styles.filterControls}>
        <div style={styles.filterGroup}>
          <label htmlFor="statusFilter" style={styles.label}>تصفية حسب الحالة:</label>
          <select
            id="statusFilter"
            value={status}
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

      {/* 6. استخدام === بدلاً من == للمقارنة الدقيقة */}
      {!Array.isArray(services) || services.length === 0 ? (
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
              {/* 7. استخدام الحماية الإضافية مع Array.isArray */}
              {Array.isArray(services) && services.map((service, index) => {
                // 8. التحقق من وجود العنصر قبل محاولة عرضه
                if (!service) return null;
                
                return (
                  <tr key={service._id || `service-${index}`}>
                    <td style={styles.td}>{service._id ? service._id.substr(-6).toUpperCase() : 'غير متوفر'}</td>
                    <td style={styles.td}>
                      {service.userId && typeof service.userId === 'object' && service.userId.username ? (
                        <>
                          {service.userId.username}<br />
                          <span style={styles.textMuted}>{service.userId.email || "البريد غير متوفر"}</span>
                        </>
                      ) : (
                        <span style={styles.textMuted}>غير متوفر</span>
                      )}
                    </td>
                    <td style={styles.td}>{service.title || 'غير متوفر'}</td>
                    <td style={styles.td}>{service.serviceType || 'غير متوفر'}</td>
                    <td style={styles.td}>{service.budget ? `${service.budget} ريال` : 'غير متوفر'}</td>
                    <td style={styles.td}>
                      {service.deadline ? new Date(service.deadline).toLocaleDateString('ar-SA') : 'غير محدد'}
                    </td>
                    <td style={styles.td}>
                      {service.createdAt ? new Date(service.createdAt).toLocaleDateString('ar-SA') : 'غير محدد'}
                    </td>
                    <td style={styles.td}>
                      {service.status ? (
                        <span style={{
                          ...styles.statusBadge, 
                          ...(getStatusClass(service.status) || {})
                        }}>
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
                                className="dropdown-toggle"
                                style={styles.dropdownToggle}
                                onClick={() => handleDropdownToggle(service._id)}
                                type="button"
                              >
                                تغيير الحالة
                              </button>
                              <div 
                                id={`dropdown-${service._id}`} 
                                className="dropdown-menu" 
                                style={styles.dropdownMenu}
                              >
                                <button 
                                  onClick={() => handleStatusUpdate(service._id, 'قيد المراجعة')}
                                  style={styles.dropdownItem}
                                  type="button"
                                >
                                  قيد المراجعة
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(service._id, 'تم قبول الطلب')}
                                  style={styles.dropdownItem}
                                  type="button"
                                >
                                  قبول الطلب
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(service._id, 'قيد التنفيذ')}
                                  style={styles.dropdownItem}
                                  type="button"
                                >
                                  قيد التنفيذ
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(service._id, 'مكتمل')}
                                  style={styles.dropdownItem}
                                  type="button"
                                >
                                  مكتمل
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(service._id, 'مرفوض')}
                                  style={styles.dropdownItem}
                                  type="button"
                                >
                                  رفض
                                </button>
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
          
          <div style={styles.pagination}>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              style={page <= 1 ? styles.paginationBtnDisabled : styles.paginationBtn}
              type="button"
            >
              السابق
            </button>
            <span style={styles.pageInfo}>
              الصفحة {page} من {Math.max(1, pages)}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= pages}
              style={page >= pages ? styles.paginationBtnDisabled : styles.paginationBtn}
              type="button"
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