// frontend/src/components/layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// تنسيق الحاوية الرئيسية للفوتر
const FooterContainer = styled.footer`
  background: linear-gradient(to top, #0A0A0A, #131313);
  color: rgba(241, 241, 241, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 4rem 0 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(225, 29, 72, 0.5), transparent);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.02)' fill-rule='evenodd'/%3E%3C/svg%3E");
    pointer-events: none;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  position: relative;
  z-index: 2;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

// تنسيق أقسام الفوتر
const FooterSection = styled(motion.div)`
  h2 {
    color: #F1F1F1;
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      right: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, #E11D48, transparent);
      border-radius: 2px;
      
      @media (max-width: 992px) {
        right: 50%;
        transform: translateX(50%);
      }
    }
  }
  
  p {
    line-height: 1.7;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }
`;

// تنسيق قسم About
const AboutSection = styled(FooterSection)`
  .contact-info {
    margin-top: 1.5rem;
    
    div {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 0.8rem;
      
      @media (max-width: 992px) {
        justify-content: center;
      }
      
      i {
        color: #E11D48;
        font-size: 1.2rem;
      }
    }
  }
`;

// تنسيق وسائل التواصل الاجتماعي
const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 992px) {
    justify-content: center;
  }
`;

const SocialLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(241, 241, 241, 0.8);
  font-size: 1.2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    background: #E11D48;
    color: #F1F1F1;
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
  }
`;

// تنسيق قسم الروابط
const LinksSection = styled(FooterSection)`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 0.8rem;
    
    a {
      color: rgba(241, 241, 241, 0.8);
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s ease;
      position: relative;
      padding-right: 1.2rem;
      
      &::before {
        content: '●';
        position: absolute;
        right: 0;
        color: #E11D48;
        font-size: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.7;
        transition: all 0.3s ease;
      }
      
      &:hover {
        color: #E11D48;
        transform: translateX(-5px);
        
        &::before {
          opacity: 1;
          transform: translateY(-50%) scale(1.2);
        }
      }
    }
  }
`;

// تنسيق قسم النشرة البريدية
const NewsletterSection = styled(FooterSection)`
  form {
    display: flex;
    margin-top: 1.5rem;
    
    @media (max-width: 992px) {
      max-width: 400px;
      margin: 1.5rem auto 0;
    }
  }
  
  input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px 0 0 8px;
    color: #F1F1F1;
    font-size: 0.95rem;
    
    &:focus {
      outline: none;
      border-color: rgba(225, 29, 72, 0.5);
    }
    
    &::placeholder {
      color: rgba(241, 241, 241, 0.4);
    }
  }
  
  button {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(90deg, #E11D48, #BE123C);
    color: #FFFFFF;
    border: none;
    border-radius: 0 8px 8px 0;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(90deg, #BE123C, #9F1239);
      box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
    }
  }
`;

// تنسيق الجزء السفلي من الفوتر
const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 3rem auto 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem 2rem;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(241, 241, 241, 0.6);
  position: relative;
  z-index: 2;
`;

const Footer = () => {
  const year = new Date().getFullYear();

  // متغيرات التحريك
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <FooterContainer>
      <FooterContent>
        <AboutSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <h2>منصة ترزي</h2>
          <p>
            منصة ترزي هي منصة إلكترونية متخصصة في مجال الخياطة والتصاميم المخصصة،
            تهدف إلى ربط المصممين والخياطين بالعملاء من خلال تقديم تجربة تسوق فريدة ومميزة.
          </p>
          <div className="contact-info">
            <div>
              <i className="fas fa-phone"></i>
              <span>+123 456 789</span>
            </div>
            <div>
              <i className="fas fa-envelope"></i>
              <span>info@tarzi.com</span>
            </div>
            <div>
              <i className="fas fa-map-marker-alt"></i>
              <span>الرياض، المملكة العربية السعودية</span>
            </div>
          </div>
          <SocialLinks>
            <SocialLink 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <i className="fab fa-facebook-f"></i>
            </SocialLink>
            <SocialLink 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <i className="fab fa-twitter"></i>
            </SocialLink>
            <SocialLink 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <i className="fab fa-instagram"></i>
            </SocialLink>
            <SocialLink 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <i className="fab fa-linkedin-in"></i>
            </SocialLink>
          </SocialLinks>
        </AboutSection>

        <LinksSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <h2>روابط سريعة</h2>
          <ul>
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/products">التصاميم</Link></li>
            <li><Link to="/about">عن المنصة</Link></li>
            <li><Link to="/contact">اتصل بنا</Link></li>
            <li><Link to="/terms">الشروط والأحكام</Link></li>
            <li><Link to="/privacy">سياسة الخصوصية</Link></li>
            <li><Link to="/faq">الأسئلة الشائعة</Link></li>
          </ul>
        </LinksSection>

        <NewsletterSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <h2>النشرة البريدية</h2>
          <p>
            اشترك في نشرتنا البريدية للحصول على آخر التحديثات والعروض الحصرية. 
            نحن نهتم بخصوصيتك ولن نشارك معلوماتك مع أي طرف ثالث.
          </p>
          <form>
            <input type="email" placeholder="البريد الإلكتروني" />
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              اشتراك
            </motion.button>
          </form>
        </NewsletterSection>
      </FooterContent>
      <FooterBottom>
        <p>&copy; {year} منصة ترزي للخياطة والتصاميم المخصصة. جميع الحقوق محفوظة.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
