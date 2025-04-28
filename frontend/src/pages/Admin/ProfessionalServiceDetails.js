// frontend/src/pages/Admin/ProfessionalServiceDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { professionalServiceService } from '../../services/professional-service.service';
import {
  FaArrowRight, FaCheck, FaTimes, FaExclamationTriangle, FaUser, FaEnvelope, FaPhone,
  FaCalendarAlt, FaClock, FaMoneyBillWave, FaEdit, FaFileAlt, FaCheckCircle,
  FaTimesCircle, FaCog, FaImage, FaSave, FaEye, FaTrashAlt, FaClipboardList, FaInfoCircle
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

const contentAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.2 }
  }
};

// حاوية الصفحة
const PageContainer = styled(motion.div)`
  background-color: #0A0A0A;
  color: #F1F1F1;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

// رأس الصفحة
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

// زر الرجوع
const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: #F1F1F1;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

// البطاقة
const Card = styled(motion.div)`
  background: #111111;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
  
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

// عنوان البطاقة
const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  color: #F1F1F1;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  svg {
    color: #E11D48;
    font-size: 1.25rem;
  }
`;

// معلومات العميل
const ClientInfo = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 1.5rem;
`;

// عنوان معلومات العميل
const ClientTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #F1F1F1;
  margin-bottom: 1rem;
  
  svg {
    color: #E11D48;
  }
`;

// معلومات التواصل
const ContactInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

// عنصر المعلومات
const InfoItem = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: rgba(241, 241, 241, 0.6);
    font-size: 0.9rem;
    width: 16px;
  }
`;

// التسمية
const Label = styled.span`
  color: rgba(241, 241, 241, 0.6);
  margin-left: 0.25rem;
`;

// القيمة
const Value = styled.span`
  color: #F1F1F1;
  font-weight: 500;
`;

// القيمة الثانوية
const SecondaryValue = styled.div`
  color: rgba(241, 241, 241, 0.6);
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

// شبكة المعلومات
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

// وصف المنتج
const Description = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin: 1.5rem 0;
  white-space: pre-wrap;
  line-height: 1.6;
  color: rgba(241, 241, 241, 0.9);
`;

// مجموعة الصور
const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

// حاوية الصورة
const ImageContainer = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    
    .image-actions {
      opacity: 1;
    }
  }
`;

// الصورة
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

// أزرار الصورة
const ImageActions = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: space-between;
  opacity: 0;
  transition: all 0.3s ease;
`;

// زر الصورة
const ImageButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #F1F1F1;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

// شارة الحالة
const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  
  &.status-new {
    background-color: rgba(96, 165, 250, 0.1);
    color: #60A5FA;
    border: 1px solid rgba(96, 165, 250, 0.2);
  }
  
  &.status-reviewing {
    background-color: rgba(245, 158, 11, 0.1);
    color: #F59E0B;
    border: 1px solid rgba(245, 158, 11, 0.2);
  }
  
  &.status-accepted {
    background-color: rgba(139, 92, 246, 0.1);
    color: #8B5CF6;
    border: 1px solid rgba(139, 92, 246, 0.2);
  }
  
  &.status-in-progress {
    background-color: rgba(139, 92, 246, 0.1);
    color: #8B5CF6;
    border: 1px solid rgba(139, 92, 246, 0.2);
  }
  
  &.status-completed {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10B981;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }
  
  &.status-rejected {
    background-color: rgba(239, 68, 68, 0.1);
    color: #EF4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }
  
  &.status-canceled {
    background-color: rgba(107, 114, 128, 0.1);
    color: #6B7280;
    border: 1px solid rgba(107, 114, 128, 0.2);
  }
  
  svg {
    font-size: 0.75rem;
  }
`;

// قسم النموذج
const FormSection = styled.div`
  margin-bottom: 2rem;
`;

// مجموعة الحقول
const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.75rem;
    font-size: 1rem;
    color: #F1F1F1;
    font-weight: 500;
  }
  
  input[type="text"],
  input[type="number"],
  textarea,
  select {
    width: 100%;
    padding: 0.75rem 1rem;
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
  
  textarea {
    min-height: 120px;
    resize: vertical;
    line-height: 1.6;
  }
  
  select {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: left 1rem center;
    background-size: 16px;
    padding-left: 2.5rem;
    
    option {
      background-color: #111111;
      color: #F1F1F1;
    }
  }
`;

// صف النموذج
const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

// أزرار الإجراءات
const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

// أنماط الأزرار
const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:first-child {
    flex: 1;
    background: ${props => props.disabled 
      ? 'rgba(225, 29, 72, 0.5)' 
      : 'linear-gradient(90deg, #E11D48, #BE123C)'};
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
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

// رسالة النجاح
const SuccessAlert = styled.div`
  background-color: rgba(16, 185, 129, 0.1);
  color: #10B981;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
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

// معاينة المستند
const DocumentPreview = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 2rem;
`;

// رأس معاينة المستند
const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h4 {
    color: #F1F1F1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    
    svg {
      color: #E11D48;
    }
  }
`;

// محتوى المعاينة
const PreviewContent = styled.div`
  color: rgba(241, 241, 241, 0.8);
  line-height: 1.6;
  white-space: pre-wrap;
  font-size: 0.95rem;
  padding: 1rem;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.2);
`;

// معلومات الموعد النهائي
const DeadlineInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  
  ${props => props.isPast ? `
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #EF4444;
  ` : `
    background-color: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.2);
    color: #F59E0B;
  `}
  
  svg {
    font-size: 0.9rem;
  }
`;

const ProfessionalServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    adminResponse: '',
    price: '',
    paymentStatus: 'غير مدفوع',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const data = await professionalServiceService.getProfessionalServiceById(id);
        setService(data);
        
        // تحديث بيانات النموذج بالقيم الحالية
        setFormData({
          status: data.status,
          adminResponse: data.adminResponse || '',
          price: data.price || '',
          paymentStatus: data.paymentStatus || 'غير مدفوع',
        });
      } catch (err) {
        setError('حدث خطأ أثناء جلب تفاصيل الطلب');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const updatedService = await professionalServiceService.updateProfessionalService(id, {
        ...formData,
        price: formData.price ? Number(formData.price) : undefined
      });
      
      setService(updatedService);
      setSuccess('تم تحديث الطلب بنجاح');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'حدث خطأ أثناء تحديث الطلب'
      );
    } finally {
      setSaving(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'جديد': return 'status-new';
      case 'قيد المراجعة': return 'status-reviewing';
      case 'تم قبول الطلب': return 'status-accepted';
      case 'قيد التنفيذ': return 'status-in-progress';
      case 'مكتمل': return 'status-completed';
      case 'مرفوض': return 'status-rejected';
      case 'ملغي': return 'status-canceled';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'جديد': return <FaFileAlt />;
      case 'قيد المراجعة': return <FaClock />;
      case 'تم قبول الطلب': return <FaCheckCircle />;
      case 'قيد التنفيذ': return <FaCog />;
      case 'مكتمل': return <FaCheckCircle />;
      case 'مرفوض': return <FaTimesCircle />;
      case 'ملغي': return <FaTimesCircle />;
      default: return <FaFileAlt />;
    }
  };
  
  const isPastDeadline = (deadline) => {
    return new Date(deadline) < new Date();
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
          <span>جاري تحميل تفاصيل الطلب...</span>
        </Loading>
      </PageContainer>
    );
  }

  if (!service) {
    return (
      <PageContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Alert>
          <FaExclamationTriangle />
          <span>الطلب غير موجود أو قد تم حذفه</span>
        </Alert>
        
        <BackButton onClick={() => navigate('/admin/professional-services')}>
          <FaArrowRight /> العودة إلى قائمة الطلبات
        </BackButton>
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
        <h2>تفاصيل طلب الخدمة الاحترافية</h2>
        <BackButton onClick={() => navigate('/admin/professional-services')}>
          <FaArrowRight /> العودة إلى القائمة
        </BackButton>
      </PageHeader>
      
      {error && (
        <Alert>
          <FaExclamationTriangle />
          <span>{error}</span>
        </Alert>
      )}
      
      {success && (
        <SuccessAlert>
          <FaCheck />
          <span>{success}</span>
        </SuccessAlert>
      )}
      
      {/* معلومات أساسية عن الطلب */}
      <Card
        variants={contentAnimation}
        initial="hidden"
        animate="visible"
      >
        <CardTitle>
          <FaClipboardList /> معلومات الطلب الأساسية
        </CardTitle>
        
        <InfoGrid>
          <InfoItem>
            <FaFileAlt />
            <Label>رقم الطلب:</Label>
            <Value>{service._id.substr(-8).toUpperCase()}</Value>
          </InfoItem>
          
          <InfoItem>
            <FaCalendarAlt />
            <Label>تاريخ الإنشاء:</Label>
            <Value>{new Date(service.createdAt).toLocaleDateString('ar-SA')}</Value>
            <SecondaryValue>
              {new Date(service.createdAt).toLocaleTimeString('ar-SA')}
            </SecondaryValue>
          </InfoItem>
          
          <InfoItem>
            <Label>الحالة الحالية:</Label>
            <StatusBadge className={getStatusClass(service.status)}>
              {getStatusIcon(service.status)} {service.status}
            </StatusBadge>
          </InfoItem>
          
          {service.price && (
            <InfoItem>
              <FaMoneyBillWave />
              <Label>السعر المقترح:</Label>
              <Value>{service.price} ريال</Value>
            </InfoItem>
          )}
          
          {service.paymentStatus && (
            <InfoItem>
              <Label>حالة الدفع:</Label>
              <StatusBadge 
                className={
                  service.paymentStatus === 'مدفوع' 
                    ? 'status-completed' 
                    : service.paymentStatus === 'مسترجع'
                      ? 'status-rejected'
                      : 'status-reviewing'
                }
              >
                {service.paymentStatus === 'مدفوع' 
                  ? <FaCheckCircle /> 
                  : service.paymentStatus === 'مسترجع'
                    ? <FaTimesCircle />
                    : <FaClock />
                }
                {service.paymentStatus}
              </StatusBadge>
            </InfoItem>
          )}
        </InfoGrid>
        
        {/* معلومات العميل */}
        <ClientInfo>
          <ClientTitle>
            <FaUser /> معلومات العميل
          </ClientTitle>
          
          <ContactInfo>
            {service.userId ? (
              <>
                <InfoItem>
                  <FaUser />
                  <Label>اسم المستخدم:</Label>
                  <Value>{service.userId.username}</Value>
                </InfoItem>
                
                <InfoItem>
                  <FaEnvelope />
                  <Label>البريد الإلكتروني:</Label>
                  <Value>{service.userId.email}</Value>
                </InfoItem>
                
                <InfoItem>
                  <FaPhone />
                  <Label>رقم الهاتف:</Label>
                  <Value>{service.userId.phone || 'غير متوفر'}</Value>
                </InfoItem>
              </>
            ) : (
              <InfoItem>
                <FaInfoCircle />
                <Value>معلومات العميل غير متوفرة</Value>
              </InfoItem>
            )}
          </ContactInfo>
        </ClientInfo>
      </Card>
      
      {/* تفاصيل الطلب */}
      <Card
        variants={contentAnimation}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <CardTitle>
          <FaFileAlt /> تفاصيل الطلب
        </CardTitle>
        
        <InfoGrid>
          <InfoItem>
            <Label>عنوان الطلب:</Label>
            <Value>{service.title}</Value>
          </InfoItem>
          
          <InfoItem>
            <Label>نوع الخدمة:</Label>
            <Value>{service.serviceType}</Value>
          </InfoItem>
          
          <InfoItem>
            <FaMoneyBillWave />
            <Label>الميزانية:</Label>
            <Value>{service.budget} ريال</Value>
          </InfoItem>
          
          <InfoItem>
            <FaCalendarAlt />
            <Label>الموعد النهائي:</Label>
            <Value>{new Date(service.deadline).toLocaleDateString('ar-SA')}</Value>
          </InfoItem>
        </InfoGrid>
        
        {isPastDeadline(service.deadline) && (
          <DeadlineInfo isPast={true}>
                  <FaExclamationTriangle /> تنبيه: تم تجاوز الموعد النهائي لهذا الطلب. يجب التواصل مع العميل بشأن الموعد الجديد.
          </DeadlineInfo>
        )}
        
        <Label>وصف الطلب:</Label>
        <Description>{service.description}</Description>
        
        {/* الصور المرفقة */}
        {service.images && service.images.length > 0 && (
          <>
            <CardTitle>
              <FaImage /> الصور المرفقة ({service.images.length})
            </CardTitle>
            <ImagesGrid>
              {service.images.map((img, index) => (
                <ImageContainer key={index}>
                  <Image 
                    src={img} 
                    alt={`صورة مرفقة ${index + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x300?text=صورة+غير+متاحة';
                    }}
                  />
                  <ImageActions className="image-actions">
                    <ImageButton 
                      href={img} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title="عرض بالحجم الكامل"
                    >
                      <FaEye />
                    </ImageButton>
                  </ImageActions>
                </ImageContainer>
              ))}
            </ImagesGrid>
          </>
        )}
      </Card>
      
      {/* رد المسؤول السابق */}
      {service.adminResponse && (
        <Card
          variants={contentAnimation}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <CardTitle>
            <FaEdit /> الرد السابق على الطلب
          </CardTitle>
          
          <DocumentPreview>
            <PreviewHeader>
              <h4>
                <FaFileAlt /> رد المسؤول
              </h4>
              <StatusBadge className={getStatusClass(service.status)}>
                {getStatusIcon(service.status)} {service.status}
              </StatusBadge>
            </PreviewHeader>
            
            <PreviewContent>
              {service.adminResponse || 'لا يوجد رد سابق على هذا الطلب.'}
            </PreviewContent>
          </DocumentPreview>
        </Card>
      )}
      
      {/* نموذج تحديث الطلب */}
      <Card
        variants={contentAnimation}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <CardTitle>
          <FaEdit /> تحديث حالة الطلب
        </CardTitle>
        
        <form onSubmit={handleSubmit}>
          <FormSection>
            <FormGroup>
              <label htmlFor="status">حالة الطلب</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="جديد">جديد</option>
                <option value="قيد المراجعة">قيد المراجعة</option>
                <option value="تم قبول الطلب">تم قبول الطلب</option>
                <option value="قيد التنفيذ">قيد التنفيذ</option>
                <option value="مكتمل">مكتمل</option>
                <option value="مرفوض">مرفوض</option>
                <option value="ملغي">ملغي</option>
              </select>
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="adminResponse">الرد على العميل</label>
              <textarea
                id="adminResponse"
                name="adminResponse"
                value={formData.adminResponse}
                onChange={handleChange}
                rows="4"
                placeholder="اكتب ردك أو ملاحظاتك هنا..."
              ></textarea>
            </FormGroup>
            
            <FormRow>
              <FormGroup>
                <label htmlFor="price">السعر المقترح (ريال)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="أدخل السعر المقترح"
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="paymentStatus">حالة الدفع</label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                >
                  <option value="غير مدفوع">غير مدفوع</option>
                  <option value="مدفوع">مدفوع</option>
                  <option value="مسترجع">مسترجع</option>
                </select>
              </FormGroup>
            </FormRow>
          </FormSection>
          
          <FormActions>
            <Button 
              type="submit" 
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="spinner" style={{ width: 20, height: 20, marginLeft: 10 }}></div>
                  جاري حفظ التغييرات...
                </>
              ) : (
                <>
                  <FaSave /> حفظ التغييرات
                </>
              )}
            </Button>
            <Button type="button" onClick={() => navigate('/admin/professional-services')}>
              <FaTimes /> إلغاء
            </Button>
          </FormActions>
        </form>
      </Card>
      
      {/* سجل النشاط على الطلب */}
      {service.statusHistory && service.statusHistory.length > 0 && (
        <Card
          variants={contentAnimation}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <CardTitle>
            <FaClipboardList /> سجل النشاط
          </CardTitle>
          
          <div>
            {service.statusHistory.map((item, index) => (
              <InfoItem key={index} style={{ marginBottom: '1rem' }}>
                <FaCalendarAlt />
                <Value>
                  {new Date(item.date).toLocaleString('ar-SA')}
                </Value>
                <span style={{ marginRight: '0.5rem' }}>
                  تم تغيير الحالة إلى: 
                  <StatusBadge 
                    className={getStatusClass(item.status)}
                    style={{ margin: '0 0.5rem' }}
                  >
                    {getStatusIcon(item.status)} {item.status}
                  </StatusBadge>
                </span>
              </InfoItem>
            ))}
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default ProfessionalServiceDetails;