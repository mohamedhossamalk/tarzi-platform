// frontend/src/pages/Products/ProductDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { productService } from '../../services/product.service';
import { AuthContext } from '../../contexts/AuthContext';

// تنسيق حاوية صفحة تفاصيل المنتج
const ProductDetailsContainer = styled.div`
  background-color: #0A0A0A;
  color: #F1F1F1;
  padding: 2rem 1rem;
  min-height: 80vh;
`;

const ProductDetailsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

// تنسيق حاوية صورة المنتج
const ProductImageContainer = styled.div`
  background: #111111;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
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

const ProductImageLarge = styled.img`
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 4px;
`;

// تنسيق حاوية معلومات المنتج
const ProductInfoContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProductTitle = styled.h2`
  font-size: 2.2rem;
  color: #F1F1F1;
  margin: 0;
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

const ProductCategory = styled.p`
  color: rgba(241, 241, 241, 0.6);
  font-size: 1rem;
  margin: 0.5rem 0 0;
`;

const ProductPrice = styled.p`
  font-size: 1.8rem;
  font-weight: 700;
  color: #E11D48;
  margin: 0.5rem 0;
`;

// تنسيق وصف المنتج
const ProductDescription = styled.div`
  margin-top: 1rem;
  
  h3 {
    font-size: 1.4rem;
    color: #F1F1F1;
    margin-bottom: 0.8rem;
  }
  
  p {
    color: rgba(241, 241, 241, 0.8);
    line-height: 1.6;
  }
`;

// تنسيق خيارات المنتج
const ProductOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1rem 0;
`;

const OptionsSection = styled.div`
  h3 {
    font-size: 1.2rem;
    color: #F1F1F1;
    margin-bottom: 1rem;
  }
`;

const OptionsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const OptionLabel = styled.label`
  display: inline-flex;
  align-items: center;
  background: ${props => props.checked ? 'rgba(225, 29, 72, 0.1)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.checked ? 'rgba(225, 29, 72, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 50px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: ${props => props.checked ? 'rgba(225, 29, 72, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
  }
  
  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    font-size: 0.9rem;
    color: ${props => props.checked ? '#E11D48' : 'rgba(241, 241, 241, 0.8)'};
  }
`;

// تنسيق الأزرار
const ProductActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Button = styled(Link)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: ${props => props.primary ? 'linear-gradient(90deg, #E11D48, #BE123C)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.primary ? '#FFFFFF' : 'rgba(241, 241, 241, 0.8)'};
  border: ${props => props.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: ${props => props.large ? '180px' : 'auto'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.primary ? '0 5px 15px rgba(225, 29, 72, 0.3)' : 'none'};
    background: ${props => props.primary ? 'linear-gradient(90deg, #E11D48, #BE123C)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const ActionButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #E11D48, #BE123C);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
  }
`;

// تنسيق حالة التحميل والخطأ
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: rgba(241, 241, 241, 0.7);
  font-size: 1.2rem;
  background-color: #0A0A0A;
`;

const ErrorContainer = styled.div`
  background: #111111;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  margin: 3rem auto;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #F1F1F1;
  
  h2 {
    font-size: 1.8rem;
    color: #EF4444;
    margin-bottom: 1rem;
  }
  
  p {
    color: rgba(241, 241, 241, 0.7);
    margin-bottom: 1.5rem;
  }
`;

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await productService.getProductById(id);
        setProduct(productData);
        setSelectedFabric(productData.fabricOptions[0] || '');
        setSelectedColor(productData.colorOptions[0] || '');
      } catch (err) {
        setError('حدث خطأ أثناء جلب تفاصيل المنتج');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleOrder = () => {
    if (!currentUser) {
      navigate('/login', { state: { redirect: `/product/${id}` } });
      return;
    }

    navigate(`/order/create/${id}`, {
      state: { fabric: selectedFabric, color: selectedColor }
    });
  };

  if (loading) {
    return <LoadingContainer>جاري التحميل...</LoadingContainer>;
  }

  if (!product) {
    return (
      <ErrorContainer>
        <h2>خطأ</h2>
        <p>{error || 'المنتج غير موجود'}</p>
        <Button to="/products" primary>
          العودة للتصاميم
        </Button>
      </ErrorContainer>
    );
  }

  return (
    <ProductDetailsContainer>
      <ProductDetailsGrid>
        <ProductImageContainer>
          <ProductImageLarge src={product.imageUrl} alt={product.name} />
        </ProductImageContainer>
        <ProductInfoContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <ProductTitle>{product.name}</ProductTitle>
            <ProductCategory>{product.category}</ProductCategory>
            <ProductPrice>{product.price} ريال</ProductPrice>
          </div>
          
          <ProductDescription>
            <h3>الوصف</h3>
            <p>{product.description}</p>
          </ProductDescription>
          
          <ProductOptions>
            <OptionsSection>
              <h3>اختر القماش</h3>
              <OptionsGrid>
                {product.fabricOptions.map((fabric) => (
                  <OptionLabel 
                    key={fabric} 
                    checked={selectedFabric === fabric}
                  >
                    <input
                      type="radio"
                      name="fabric"
                      value={fabric}
                      checked={selectedFabric === fabric}
                      onChange={() => setSelectedFabric(fabric)}
                    />
                    <span>{fabric}</span>
                  </OptionLabel>
                ))}
              </OptionsGrid>
            </OptionsSection>

            <OptionsSection>
              <h3>اختر اللون</h3>
              <OptionsGrid>
                {product.colorOptions.map((color) => (
                  <OptionLabel 
                    key={color} 
                    checked={selectedColor === color}
                  >
                    <input
                      type="radio"
                      name="color"
                      value={color}
                      checked={selectedColor === color}
                      onChange={() => setSelectedColor(color)}
                    />
                    <span>{color}</span>
                  </OptionLabel>
                ))}
              </OptionsGrid>
            </OptionsSection>
          </ProductOptions>

          <ProductActions>
            <ActionButton onClick={handleOrder}>
              طلب هذا التصميم
            </ActionButton>
            <Button to="/products">
              العودة للتصاميم
            </Button>
          </ProductActions>
        </ProductInfoContainer>
      </ProductDetailsGrid>
    </ProductDetailsContainer>
  );
};

export default ProductDetails;
