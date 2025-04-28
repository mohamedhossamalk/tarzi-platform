// frontend/src/pages/Orders/OrderCreate.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { productService } from '../../services/product.service';
import { measurementService } from '../../services/measurement.service';
import { orderService } from '../../services/order.service';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaRuler, 
  FaShoppingCart, 
  FaPalette, 
  FaTshirt, // استبدال FaFabric بـ FaTshirt
  FaRegStickyNote, 
  FaPlusCircle, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaTimes
} from 'react-icons/fa';

// ==================== ألوان التطبيق ====================
const COLORS = {
  primary: {
    main: '#E11D48', // أحمر
    dark: '#BE123C',
    light: 'rgba(225, 29, 72, 0.08)',
    hover: 'rgba(225, 29, 72, 0.9)',
    gradient: 'linear-gradient(135deg, #E11D48, #9F1239)'
  },
  background: {
    dark: '#000000',
    darker: '#0A0A0A', // أحلك قليلاً لتباين أفضل
    card: '#111111',
    glass: 'rgba(17, 17, 17, 0.85)',
    input: 'rgba(15, 15, 15, 0.4)'
  },
  text: {
    main: '#F1F1F1', // نص أبيض فاتح
    light: 'rgba(241, 241, 241, 0.85)',
    muted: 'rgba(241, 241, 241, 0.6)',
    dim: 'rgba(241, 241, 241, 0.4)'
  },
  border: {
    light: 'rgba(255, 255, 255, 0.08)',
    focus: 'rgba(225, 29, 72, 0.6)',
    active: '#E11D48' // أحمر
  },
  action: {
    hover: 'rgba(255, 255, 255, 0.05)',
    active: 'rgba(225, 29, 72, 0.2)',
    disabled: 'rgba(150, 150, 150, 0.4)'
  }
};

// ==================== تأثيرات الحركة ====================
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const staggerItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// ==================== المكونات المنسقة ====================
const PageContainer = styled(motion.div)`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  color: ${COLORS.text.main};
  direction: rtl;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  h2 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.75rem;
    margin: 0;
    color: ${COLORS.text.main};
    
    svg {
      color: ${COLORS.primary.main};
    }
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: ${COLORS.text.light};
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${COLORS.action.hover};
    color: ${COLORS.text.main};
  }
`;

const Alert = styled.div`
  background-color: rgba(220, 53, 69, 0.15);
  color: #ff6b6b;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-right: 4px solid #dc3545;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    flex-shrink: 0;
    font-size: 1.25rem;
  }
`;

const Card = styled.div`
  background: ${COLORS.background.card};
  border-radius: 12px;
  border: 1px solid ${COLORS.border.light};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ProductSummary = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  
  img {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid ${COLORS.border.light};
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    
    img {
      width: 100%;
      height: 180px;
      margin-bottom: 1rem;
    }
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  
  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.4rem;
    color: ${COLORS.text.main};
  }
  
  .price {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${COLORS.primary.main};
    margin-bottom: 0;
  }
  
  .category {
    color: ${COLORS.text.muted};
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
`;

const FormSection = styled(motion.div)`
  margin-bottom: 2rem;
  
  h3 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    color: ${COLORS.text.main};
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid ${COLORS.border.light};
    
    svg {
      color: ${COLORS.primary.main};
    }
  }
`;

const NoMeasurements = styled.div`
  background-color: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.2);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  
  p {
    margin-bottom: 1rem;
    color: ${COLORS.text.light};
  }
`;

const MeasurementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const MeasurementCard = styled.label`
  display: block;
  background: ${props => props.isSelected ? 'rgba(225, 29, 72, 0.15)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.isSelected ? COLORS.primary.main : COLORS.border.light};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.isSelected ? 'rgba(225, 29, 72, 0.15)' : COLORS.action.hover};
    border-color: ${props => props.isSelected ? COLORS.primary.main : 'rgba(255, 255, 255, 0.2)'};
  }
  
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
`;

const MeasurementName = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  
  span {
    font-weight: 600;
    font-size: 1.1rem;
    color: ${props => props.isSelected ? COLORS.primary.main : COLORS.text.main};
  }
`;

const DefaultBadge = styled.div`
  background: ${COLORS.primary.main};
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
`;

const MeasurementDetails = styled.div`
  font-size: 0.85rem;
  color: ${COLORS.text.muted};
  
  p {
    margin: 0.25rem 0;
    display: flex;
    align-items: center;
    
    &:before {
      content: '•';
      margin-left: 0.5rem;
      color: ${props => props.isSelected ? COLORS.primary.main : COLORS.text.dim};
    }
  }
`;

const AddNewButton = styled.div`
  margin-top: 1rem;
  
  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    color: ${COLORS.text.main};
    border: 1px dashed ${COLORS.border.light};
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    svg {
      color: ${COLORS.primary.main};
    }
  }
`;

const OptionsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
`;

const OptionLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.isSelected ? 'rgba(225, 29, 72, 0.15)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.isSelected ? COLORS.primary.main : COLORS.border.light};
  border-radius: 8px;
  padding: 1rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.isSelected ? 'rgba(225, 29, 72, 0.15)' : COLORS.action.hover};
    border-color: ${props => props.isSelected ? COLORS.primary.main : 'rgba(255, 255, 255, 0.2)'};
  }
  
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
  
  span {
    margin-top: 0.5rem;
    font-weight: ${props => props.isSelected ? '600' : 'normal'};
    color: ${props => props.isSelected ? COLORS.primary.main : COLORS.text.light};
  }
  
  svg {
    font-size: 1.75rem;
    color: ${props => props.isSelected ? COLORS.primary.main : COLORS.text.muted};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: ${COLORS.background.input};
  border: 1px solid ${COLORS.border.light};
  border-radius: 8px;
  padding: 1rem;
  color: ${COLORS.text.main};
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary.main};
    box-shadow: 0 0 0 2px ${COLORS.border.focus};
  }
  
  &::placeholder {
    color: ${COLORS.text.dim};
  }
`;

const OrderSummary = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid ${COLORS.border.light};
  
  h3 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    color: ${COLORS.text.main};
    margin-bottom: 1.25rem;
    
    svg {
      color: ${COLORS.primary.main};
    }
  }
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: ${COLORS.text.light};
  
  &.total {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid ${COLORS.border.light};
    font-size: 1.25rem;
    font-weight: bold;
    color: ${COLORS.primary.main};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: ${props => props.large ? '1rem 2rem' : '0.75rem 1.5rem'};
  background: ${props => props.secondary 
    ? 'rgba(255, 255, 255, 0.05)' 
    : props.disabled 
      ? COLORS.action.disabled 
      : COLORS.primary.gradient};
  color: ${props => props.secondary ? COLORS.text.light : '#fff'};
  border: ${props => props.secondary ? `1px solid ${COLORS.border.light}` : 'none'};
  border-radius: 8px;
  font-size: ${props => props.large ? '1.1rem' : '1rem'};
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex: ${props => props.secondary ? '0' : '1'};
  
  &:hover {
    ${props => !props.disabled && `
      transform: translateY(-2px);
      ${props.secondary 
        ? 'background: rgba(255, 255, 255, 0.1);' 
        : 'box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);'}
    `}
  }
  
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// ==================== المكون الرئيسي ====================
const OrderCreate = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [formData, setFormData] = useState({
    measurementId: '',
    fabricChoice: location.state?.fabric || '',
    colorChoice: location.state?.color || '',
    additionalRequests: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات المنتج
        const productData = await productService.getProductById(productId);
        setProduct(productData);
        
        // تعيين الاختيارات الافتراضية إذا لم تكن مُعينة
        if (!formData.fabricChoice && productData.fabricOptions.length > 0) {
          setFormData(prev => ({ ...prev, fabricChoice: productData.fabricOptions[0] }));
        }
        if (!formData.colorChoice && productData.colorOptions.length > 0) {
          setFormData(prev => ({ ...prev, colorChoice: productData.colorOptions[0] }));
        }

        // جلب مقاسات المستخدم
        const measurementsData = await measurementService.getMeasurements();
        setMeasurements(measurementsData);
        
        // تعيين المقاس الافتراضي
        const defaultMeasurement = measurementsData.find(m => m.isDefault);
        if (defaultMeasurement) {
          setFormData(prev => ({ ...prev, measurementId: defaultMeasurement._id }));
        } else if (measurementsData.length > 0) {
          setFormData(prev => ({ ...prev, measurementId: measurementsData[0]._id }));
        }
      } catch (err) {
        setError('حدث خطأ أثناء تحميل البيانات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, formData.fabricChoice, formData.colorChoice]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.measurementId) {
      setError('يرجى اختيار مقاس');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const orderData = {
        productId,
        measurementId: formData.measurementId,
        fabricChoice: formData.fabricChoice,
        colorChoice: formData.colorChoice,
        additionalRequests: formData.additionalRequests,
      };

      const result = await orderService.createOrder(orderData);
      navigate(`/order/${result._id}`, { state: { newOrder: true } });
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'حدث خطأ أثناء إنشاء الطلب'
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
          <LoadingSpinner style={{ width: '30px', height: '30px' }} />
          <span style={{ marginRight: '15px' }}>جاري تحميل بيانات الطلب...</span>
        </div>
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Card>
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <FaExclamationCircle size={40} style={{ color: '#DC3545', marginBottom: '1rem' }} />
            <h2>المنتج غير موجود</h2>
            <p style={{ color: COLORS.text.muted, marginBottom: '1.5rem' }}>
              {error || 'لم نتمكن من العثور على المنتج المطلوب. قد يكون قد تم حذفه أو تعديله.'}
            </p>
            <Button onClick={() => navigate('/products')}>
              العودة للتصاميم
            </Button>
          </div>
        </Card>
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
        <h2><FaShoppingCart /> إنشاء طلب جديد</h2>
        <BackButton onClick={() => navigate(`/product/${productId}`)}>
          <FaArrowLeft /> العودة للمنتج
        </BackButton>
      </PageHeader>

      {error && (
        <Alert>
          <FaExclamationCircle />
          <span>{error}</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <ProductSummary>
            <img src={product.imageUrl} alt={product.name} />
            <ProductInfo>
              <h3>{product.name}</h3>
              <div className="category">{product.category}</div>
              <div className="price">{product.price} ريال</div>
            </ProductInfo>
          </ProductSummary>
        </Card>

        <motion.div variants={staggerItems}>
          <FormSection variants={fadeIn}>
            <h3><FaRuler /> اختر المقاس</h3>
            {measurements.length === 0 ? (
              <NoMeasurements>
                <p>لا يوجد لديك مقاسات مسجلة حالياً. يرجى إضافة مقاس جديد للمتابعة.</p>
                <Button 
                  onClick={() => navigate('/measurement/create', { state: { redirect: `/order/create/${productId}` } })}
                >
                  <FaPlusCircle /> إضافة مقاس جديد
                </Button>
              </NoMeasurements>
            ) : (
              <>
                <MeasurementsGrid>
                  {measurements.map((measurement) => (
                    <MeasurementCard 
                      key={measurement._id} 
                      isSelected={formData.measurementId === measurement._id}
                    >
                      <input
                        type="radio"
                        name="measurementId"
                        value={measurement._id}
                        checked={formData.measurementId === measurement._id}
                        onChange={handleChange}
                      />
                      <MeasurementName isSelected={formData.measurementId === measurement._id}>
                        <span>{measurement.name}</span>
                        {measurement.isDefault && <DefaultBadge>افتراضي</DefaultBadge>}
                      </MeasurementName>
                      <MeasurementDetails isSelected={formData.measurementId === measurement._id}>
                        <p>الصدر: {measurement.chest} سم</p>
                        <p>الخصر: {measurement.waist} سم</p>
                        <p>الأرداف: {measurement.hips} سم</p>
                      </MeasurementDetails>
                    </MeasurementCard>
                  ))}
                </MeasurementsGrid>
                
                <AddNewButton>
                  <button 
                    type="button" 
                    onClick={() => navigate('/measurement/create', { state: { redirect: `/order/create/${productId}` } })}
                  >
                    <FaPlusCircle /> إضافة مقاس جديد
                  </button>
                </AddNewButton>
              </>
            )}
          </FormSection>

          <FormSection variants={fadeIn}>
            <h3><FaTshirt /> اختر القماش</h3> {/* استبدلنا FaFabric بـ FaTshirt */}
            <OptionsGrid variants={staggerItems}>
              {product.fabricOptions.map((fabric) => (
                <OptionLabel 
                  key={fabric} 
                  isSelected={formData.fabricChoice === fabric}
                >
                  <input
                    type="radio"
                    name="fabricChoice"
                    value={fabric}
                    checked={formData.fabricChoice === fabric}
                    onChange={handleChange}
                    required
                  />
                  <FaTshirt /> {/* استبدلنا FaFabric بـ FaTshirt */}
                  <span>{fabric}</span>
                </OptionLabel>
              ))}
            </OptionsGrid>
          </FormSection>

          <FormSection variants={fadeIn}>
            <h3><FaPalette /> اختر اللون</h3>
            <OptionsGrid variants={staggerItems}>
              {product.colorOptions.map((color) => (
                <OptionLabel 
                  key={color} 
                  isSelected={formData.colorChoice === color}
                >
                  <input
                    type="radio"
                    name="colorChoice"
                    value={color}
                    checked={formData.colorChoice === color}
                    onChange={handleChange}
                    required
                  />
                  <div 
                    style={{ 
                      width: '30px', 
                      height: '30px', 
                      borderRadius: '50%', 
                      background: color === 'أبيض' ? '#fff' : 
                                  color === 'أسود' ? '#000' : 
                                  color === 'أحمر' ? '#e11d48' : 
                                  color === 'أزرق' ? '#3b82f6' : 
                                  color === 'أزرق فاتح' ? '#93c5fd' : 
                                  color === 'بيج' ? '#e3d5ca' :
                                  color === 'كحلي' ? '#1e3a8a' :
                                  color === 'رمادي' ? '#6b7280' :
                                  color === 'ذهبي' ? '#d4af37' : color,
                      border: color === 'أبيض' ? '1px solid #ddd' : 'none'
                    }}
                  />
                  <span>{color}</span>
                </OptionLabel>
              ))}
            </OptionsGrid>
          </FormSection>

          <FormSection variants={fadeIn}>
            <h3><FaRegStickyNote /> طلبات إضافية</h3>
            <TextArea
              name="additionalRequests"
              value={formData.additionalRequests}
              onChange={handleChange}
              placeholder="يمكنك كتابة أي تعليمات أو طلبات خاصة حول التصميم أو الخياطة هنا..."
              rows="4"
            />
          </FormSection>
          
          <Card>
            <OrderSummary>
              <h3><FaShoppingCart /> ملخص الطلب</h3>
              
              <SummaryItem>
                <span>المنتج:</span>
                <span>{product.name}</span>
              </SummaryItem>
              
              <SummaryItem>
                <span>المقاس:</span>
                <span>
                  {formData.measurementId 
                    ? measurements.find(m => m._id === formData.measurementId)?.name || '-' 
                    : 'لم يتم الاختيار'}
                </span>
              </SummaryItem>
              
              <SummaryItem>
                <span>القماش:</span>
                <span>{formData.fabricChoice || '-'}</span>
              </SummaryItem>
              
              <SummaryItem>
                <span>اللون:</span>
                <span>{formData.colorChoice || '-'}</span>
              </SummaryItem>
              
              <SummaryItem className="total">
                <span>الإجمالي:</span>
                <span>{product.price} ريال</span>
              </SummaryItem>
            </OrderSummary>

            <FormActions>
              <Button 
                type="submit" 
                large 
                disabled={submitting || !formData.measurementId}
              >
                {submitting ? (
                  <>
                    <LoadingSpinner /> جاري إنشاء الطلب...
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> إتمام الطلب
                  </>
                )}
              </Button>
              <Button
                type="button"
                secondary
                onClick={() => navigate(`/product/${productId}`)}
              >
                <FaTimes /> إلغاء
              </Button>
            </FormActions>
          </Card>
        </motion.div>
      </form>
    </PageContainer>
  );
};

export default OrderCreate;
