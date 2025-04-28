import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCog, FaExclamationTriangle } from 'react-icons/fa';

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
  max-width: 1400px;
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

// بطاقة البناء
const ComingSoonCard = styled.div`
  background: #111111;
  border-radius: 10px;
  padding: 3rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const Icon = styled.div`
  font-size: 4rem;
  color: #E11D48;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #F1F1F1;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: rgba(241, 241, 241, 0.7);
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto 2rem;
`;

function AdminSettings() {
  return (
    <PageContainer
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <PageHeader>
        <h2>إعدادات النظام</h2>
      </PageHeader>
      
      <ComingSoonCard>
        <Icon>
          <FaCog />
        </Icon>
        <Title>صفحة الإعدادات قيد التطوير</Title>
        <Message>
          نعمل على تطوير لوحة إعدادات متكاملة للنظام. ستتمكن قريبًا من تخصيص إعدادات الموقع والتحكم في المظهر والوظائف المختلفة من هنا.
        </Message>
      </ComingSoonCard>
    </PageContainer>
  );
}

export default AdminSettings;