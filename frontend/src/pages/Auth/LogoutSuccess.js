// src/pages/Auth/LogoutSuccess.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaSignInAlt, FaHome } from 'react-icons/fa';

// تأثيرات الحركة
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

// حاوية الصفحة
const PageContainer = styled(motion.div)`
  background-color: #0A0A0A;
  color: #F1F1F1;
  padding: 2rem 1rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1.5rem 0.75rem;
  }
`;

// بطاقة الرسالة
const MessageCard = styled.div`
  background: #111111;
  border-radius: 10px;
  padding: 3rem 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  text-align: center;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 3px;
    background: linear-gradient(90deg, transparent, #10B981, transparent);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    font-size: 4rem;
    color: #10B981;
  }
  
  @media (max-width: 576px) {
    svg {
      font-size: 3rem;
    }
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: #F1F1F1;
  
  @media (max-width: 576px) {
    font-size: 1.5rem;
  }
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  line-height: 1.6;
  
  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 0.7rem 1.5rem;
    font-size: 0.95rem;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(90deg, #E11D48, #BE123C);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(255, 255, 255, 0.05);
  color: #F1F1F1;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

// كاونتر تنازلي للانتقال التلقائي
const CountdownText = styled.div`
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
`;

const LogoutSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = React.useState(5);
  
  // تنفيذ الانتقال التلقائي إلى الصفحة الرئيسية بعد عدة ثوانٍ
  useEffect(() => {
    if (countdown <= 0) {
      navigate('/');
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, navigate]);
  
  return (
    <PageContainer
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <MessageCard>
        <IconWrapper>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20, 
              delay: 0.3 
            }}
          >
            <FaCheckCircle />
          </motion.div>
        </IconWrapper>
        
        <Title>تم تسجيل الخروج بنجاح</Title>
        
        <Message>
          شكراً لاستخدامك منصتنا. لقد تم تسجيل خروجك بنجاح من حسابك.
          يمكنك الآن العودة للصفحة الرئيسية أو تسجيل الدخول مرة أخرى.
        </Message>
        
        <ButtonsContainer>
          <PrimaryButton to="/login">
            <FaSignInAlt /> تسجيل الدخول مرة أخرى
          </PrimaryButton>
          
          <SecondaryButton to="/">
            <FaHome /> الصفحة الرئيسية
          </SecondaryButton>
        </ButtonsContainer>
        
        <CountdownText>
          سيتم توجيهك تلقائياً إلى الصفحة الرئيسية خلال {countdown} ثوانٍ...
        </CountdownText>
      </MessageCard>
    </PageContainer>
  );
};

export default LogoutSuccess;
