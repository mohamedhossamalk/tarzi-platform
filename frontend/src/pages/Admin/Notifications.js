import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBell, FaExclamationTriangle } from 'react-icons/fa';

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

// بطاقة المحتوى
const NotificationsCard = styled.div`
  background: #111111;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

// بطاقة البناء
const ComingSoonSection = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  margin: 2rem auto;
  max-width: 800px;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(225, 29, 72, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #E11D48;
  margin-left: 1rem;
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const NotificationText = styled.div`
  color: rgba(241, 241, 241, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const NotificationTime = styled.div`
  color: rgba(241, 241, 241, 0.5);
  font-size: 0.8rem;
  margin-top: 0.5rem;
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

function AdminNotifications() {
  const notifications = [
    {
      id: 1,
      title: 'طلب خدمة جديد',
      text: 'تم إنشاء طلب خدمة احترافية جديد بواسطة أحمد محمد.',
      time: 'منذ 20 دقيقة',
      icon: <FaBell />
    },
    {
      id: 2,
      title: 'اكتمال طلب',
      text: 'تم اكتمال طلب رقم #12345 وتم إرساله للعميل.',
      time: 'منذ ساعتين',
      icon: <FaBell />
    },
    {
      id: 3,
      title: 'تسجيل مستخدم جديد',
      text: 'قام مستخدم جديد بالتسجيل في المنصة.',
      time: 'منذ 3 ساعات',
      icon: <FaBell />
    }
  ];

  return (
    <PageContainer
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <PageHeader>
        <h2>الإشعارات</h2>
      </PageHeader>
      
      <NotificationsCard>
        {notifications.map(notification => (
          <NotificationItem key={notification.id}>
            <NotificationIcon>
              {notification.icon}
            </NotificationIcon>
            <NotificationContent>
              <NotificationTitle>{notification.title}</NotificationTitle>
              <NotificationText>{notification.text}</NotificationText>
              <NotificationTime>{notification.time}</NotificationTime>
            </NotificationContent>
          </NotificationItem>
        ))}
        
        <ComingSoonSection>
          <Message>
            هذه نسخة أولية من نظام الإشعارات. سيتم تطوير المزيد من المميزات قريبًا.
          </Message>
        </ComingSoonSection>
      </NotificationsCard>
    </PageContainer>
  );
}

export default AdminNotifications;