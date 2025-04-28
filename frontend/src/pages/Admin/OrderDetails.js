// frontend/src/pages/Admin/OrderDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaBoxOpen, FaRulerCombined, FaUser, FaClipboardList, FaEdit } from 'react-icons/fa';
import { adminService } from '../../services/admin.service';

// تنسيق الحاوية الرئيسية
const PageContainer = styled.div`
  background-color: #0A0A0A;
  color: #F1F1F1;
  padding: 2rem 1rem;
`;

// عنوان الصفحة
const PageHeader = styled.h2`
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
`;

// رسائل التنبيه
const Alert = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  background-color: ${props => props.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.type === 'success' ? '#10B981' : '#EF4444'};
  border: 1px solid ${props => props.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;

// قسم مع عنوان
const Section = styled(motion.div)`
  background: #111111;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
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
  
  h3 {
    font-size: 1.5rem;
    color: #F1F1F1;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    svg {
      color: #E11D48;
    }
  }
`;

// نموذج التحديث
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    color: rgba(241, 241, 241, 0.7);
    font-size: 0.95rem;
  }
  
  select, input {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.75rem;
    color: #F1F1F1;
    font-family: 'Cairo', sans-serif;
    
    &:focus {
      outline: none;
      border-color: #E11D48;
      box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.1);
    }
    
    option {
      background-color: #111111;
    }
  }
`;

// زر الإرسال
const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #E11D48, #BE123C);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Cairo', sans-serif;
  align-self: flex-start;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// تفاصيل المنتج
const ProductDetails = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProductImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    height: 250px;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #F1F1F1;
  }
  
  .price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #E11D48;
    margin-bottom: 1rem;
  }
`;

const ProductSpecs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const SpecItem = styled.div`
  display: flex;
  gap: 1rem;
  
  span:first-child {
    color: rgba(241, 241, 241, 0.6);
    min-width: 80px;
  }
  
  span:last-child {
    color: #F1F1F1;
    font-weight: 500;
  }
`;

// شبكة المقاسات
const MeasurementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const MeasurementItem = styled.div`
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  span:first-child {
    display: block;
    color: rgba(241, 241, 241, 0.6);
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  
  span:last-child {
    display: block;
    color: #F1F1F1;
    font-weight: 500;
    font-size: 1.1rem;
  }
`;

// معلومات العميل
const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  
  span:first-child {
    color: rgba(241, 241, 241, 0.6);
    min-width: 120px;
  }
  
  span:last-child {
    color: #F1F1F1;
    font-weight: 500;
  }
`;

// معلومات الطلب
const OrderInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  span:first-child {
    display: block;
    color: rgba(241, 241, 241, 0.6);
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.9rem;
  background-color: ${props => {
    switch (props.status) {
      case 'جديد':
        return 'rgba(59, 130, 246, 0.1)';
      case 'تم التسليم':
        return 'rgba(16, 185, 129, 0.1)';
      case 'ملغي':
        return 'rgba(239, 68, 68, 0.1)';
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
      case 'ملغي':
        return '#EF4444';
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
      case 'ملغي':
        return 'rgba(239, 68, 68, 0.2)';
      default:
        return 'rgba(245, 158, 11, 0.2)';
    }
  }};
`;

const PaymentStatus = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.9rem;
  background-color: ${props => props.status === 'مدفوع' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.status === 'مدفوع' ? '#10B981' : '#EF4444'};
  border: 1px solid ${props => props.status === 'مدفوع' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;

// أزرار الإجراءات
const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  color: #F1F1F1;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-family: 'Cairo', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(225, 29, 72, 0.3);
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 1rem;
  }
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

// مكون الخطأ
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  
  h2 {
    font-size: 2rem;
    color: #E11D48;
    margin-bottom: 1rem;
  }
  
  p {
    color: rgba(241, 241, 241, 0.7);
    margin-bottom: 2rem;
  }
`;

// مكون صفحة تفاصيل الطلب
const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState('');

  // حالات الطلب المتاحة
  const orderStatuses = [
    'جديد',
    'قيد المعالجة',
    'قيد التنفيذ',
    'جاهز للتسليم',
    'تم التسليم',
    'ملغي'
  ];

  // حالات الدفع المتاحة
  const paymentStatuses = ['غير مدفوع', 'مدفوع'];

  const [formData, setFormData] = useState({
    status: '',
    paymentStatus: '',
    expectedDeliveryDate: ''
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await adminService.getOrderById(id);
        setOrder(data);
        setFormData({
          status: data.status,
          paymentStatus: data.paymentStatus,
          expectedDeliveryDate: data.expectedDeliveryDate 
            ? new Date(data.expectedDeliveryDate).toISOString().split('T')[0]
            : ''
        });
      } catch (err) {
        setError('حدث خطأ أثناء جلب بيانات الطلب');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const updatedOrder = await adminService.updateOrderStatus(id, formData);
      setOrder(updatedOrder);
      setSuccess('تم تحديث حالة الطلب بنجاح');
      
      // تمرير تلقائي إلى موقع رسالة النجاح
      setTimeout(() => {
        if (document.querySelector('.success-message')) {
          document.querySelector('.success-message').scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      setError('حدث خطأ أثناء تحديث حالة الطلب');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>جاري التحميل...</LoadingContainer>
      </PageContainer>
    );
  }

  if (!order) {
    return (
      <PageContainer>
        <ErrorContainer>
          <h2>خطأ</h2>
          <p>{error || 'الطلب غير موجود'}</p>
          <BackButton onClick={() => navigate('/admin/orders')}>
            <FaArrowLeft />
            العودة للطلبات
          </BackButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader>تفاصيل الطلب #{order._id.substring(0, 8)}</PageHeader>

        {error && <Alert type="error" className="error-message">{error}</Alert>}
        {success && <Alert type="success" className="success-message">{success}</Alert>}

        <Section
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3>
            <FaEdit /> 
            تحديث حالة الطلب
          </h3>
          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <label htmlFor="status">حالة الطلب</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  {orderStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup>
                <label htmlFor="paymentStatus">حالة الدفع</label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  required
                >
                  {paymentStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </FormGroup>
            </FormRow>
            <FormGroup>
              <label htmlFor="expectedDeliveryDate">تاريخ التسليم المتوقع</label>
              <input
                type="date"
                id="expectedDeliveryDate"
                name="expectedDeliveryDate"
                value={formData.expectedDeliveryDate}
                onChange={handleChange}
              />
            </FormGroup>
            <SubmitButton type="submit" disabled={updating}>
              {updating ? 'جاري التحديث...' : 'تحديث حالة الطلب'}
            </SubmitButton>
          </Form>
        </Section>

        <Section
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3>
            <FaBoxOpen /> 
            معلومات المنتج
          </h3>
          <ProductDetails>
            <ProductImage>
              {order.productId.imageUrl ? (
                <img
                  src={order.productId.imageUrl}
                  alt={order.productId.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200?text=صورة+غير+متوفرة';
                  }}
                />
              ) : (
                <span>صورة غير متوفرة</span>
              )}
            </ProductImage>
            <ProductInfo>
              <h4>{order.productId.name}</h4>
              <p className="price">{order.totalPrice} ريال</p>
              <ProductSpecs>
                <SpecItem>
                  <span>القماش:</span>
                  <span>{order.fabricChoice}</span>
                </SpecItem>
                <SpecItem>
                  <span>اللون:</span>
                  <span>{order.colorChoice}</span>
                </SpecItem>
                <SpecItem>
                  <span>الفئة:</span>
                  <span>{order.productId.category}</span>
                </SpecItem>
              </ProductSpecs>
            </ProductInfo>
          </ProductDetails>
        </Section>

        <Section
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3>
            <FaRulerCombined /> 
            معلومات المقاسات
          </h3>
          <h4 style={{ fontSize: '1.2rem', color: '#F1F1F1', marginBottom: '1rem' }}>
            {order.measurementId.name}
          </h4>
          <MeasurementsGrid>
            <MeasurementItem>
              <span>الصدر</span>
              <span>{order.measurementId.chest} سم</span>
            </MeasurementItem>
            <MeasurementItem>
              <span>الخصر</span>
              <span>{order.measurementId.waist} سم</span>
            </MeasurementItem>
            <MeasurementItem>
              <span>الأرداف</span>
              <span>{order.measurementId.hips} سم</span>
            </MeasurementItem>
            <MeasurementItem>
              <span>عرض الكتفين</span>
              <span>{order.measurementId.shoulderWidth} سم</span>
            </MeasurementItem>
            <MeasurementItem>
              <span>طول الأكمام</span>
              <span>{order.measurementId.sleeveLength} سم</span>
            </MeasurementItem>
            {order.measurementId.inseam && (
              <MeasurementItem>
                <span>طول الساق الداخلي</span>
                <span>{order.measurementId.inseam} سم</span>
              </MeasurementItem>
            )}
            {order.measurementId.neckSize && (
              <MeasurementItem>
                <span>مقاس الرقبة</span>
                <span>{order.measurementId.neckSize} سم</span>
              </MeasurementItem>
            )}
          </MeasurementsGrid>
        </Section>

        {order.additionalRequests && (
          <Section
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3>طلبات إضافية</h3>
            <p style={{ color: 'rgba(241, 241, 241, 0.8)', lineHeight: '1.7' }}>
              {order.additionalRequests}
            </p>
          </Section>
        )}

        <Section
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3>
            <FaUser /> 
            معلومات العميل
          </h3>
          <CustomerInfo>
            <InfoRow>
              <span>اسم المستخدم</span>
              <span>{order.userId.username}</span>
            </InfoRow>
            <InfoRow>
              <span>البريد الإلكتروني</span>
              <span>{order.userId.email}</span>
            </InfoRow>
            <InfoRow>
              <span>رقم الهاتف</span>
              <span>{order.userId.phone || 'غير متوفر'}</span>
            </InfoRow>
          </CustomerInfo>
        </Section>

        <Section
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3>
            <FaClipboardList /> 
            معلومات الطلب
          </h3>
          <OrderInfoGrid>
            <InfoItem>
              <span>تاريخ الطلب</span>
              <span>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
            </InfoItem>
            <InfoItem>
              <span>حالة الدفع</span>
              <PaymentStatus status={order.paymentStatus}>
                {order.paymentStatus}
              </PaymentStatus>
            </InfoItem>
            <InfoItem>
              <span>حالة الطلب</span>
              <StatusBadge status={order.status}>
                {order.status}
              </StatusBadge>
            </InfoItem>
            {order.expectedDeliveryDate && (
              <InfoItem>
                <span>تاريخ التسليم المتوقع</span>
                <span>{new Date(order.expectedDeliveryDate).toLocaleDateString('ar-SA')}</span>
              </InfoItem>
            )}
          </OrderInfoGrid>
        </Section>

        <ActionsContainer
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <BackButton onClick={() => navigate('/admin/orders')}>
            <FaArrowLeft />
            العودة للطلبات
          </BackButton>
        </ActionsContainer>
      </motion.div>
    </PageContainer>
  );
};

export default OrderDetails;
