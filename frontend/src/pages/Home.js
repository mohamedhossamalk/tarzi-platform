// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { productService } from '../services/product.service';

// أسلوب رسالة النجاح
const SuccessMessage = styled.div`
  background-color: rgba(16, 185, 129, 0.1);
  color: #10B981;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  animation: fadeIn 0.5s, fadeOut 0.5s 4.5s;
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  svg {
    flex-shrink: 0;
    font-size: 1.2rem;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; transform: translate(-50%, 0); }
    to { opacity: 0; transform: translate(-50%, -20px); }
  }
`;

// تنسيق الحاوية الرئيسية
const HomeContainer = styled.div`
  background-color: #0A0A0A;
  color: #F1F1F1;
  overflow: hidden;
`;

// ===== قسم العرض الرئيسي =====
const HeroSection = styled.section`
  position: relative;
  height: 80vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(45deg, #0A0A0A, #111111);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(225, 29, 72, 0.1) 0%, transparent 70%);
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.03)' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.5;
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  z-index: 2;
  position: relative;
  
  h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    margin-bottom: 1.5rem;
    background: linear-gradient(90deg, #FFFFFF, #E11D48);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -15px;
      right: 50%;
      transform: translateX(50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #E11D48, #BE123C);
      border-radius: 2px;
    }
  }
  
  p {
    font-size: clamp(1.1rem, 2vw, 1.5rem);
    margin-bottom: 2.5rem;
    color: rgba(255, 255, 255, 0.8);
    max-width: 600px;
    margin: 2.5rem auto;
    line-height: 1.6;
  }
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ButtonPrimary = styled(Link)`
  display: inline-block;
  padding: 0.75rem 2rem;
  background: linear-gradient(90deg, #E11D48, #BE123C);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
  }
`;

const ButtonSecondary = styled(Link)`
  display: inline-block;
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

// ===== قسم المنتجات المميزة =====
const FeaturedSection = styled.section`
  padding: 5rem 2rem;
  background: #0A0A0A;
  position: relative;
  
  h2 {
    font-size: 2.2rem;
    text-align: center;
    margin-bottom: 3rem;
    position: relative;
    display: inline-block;
    margin-right: auto;
    margin-left: auto;
    color: #F1F1F1;
    
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

const SectionTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
`;

const FeaturedProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeaturedProduct = styled(motion.div)`
  background: #111111;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    border-color: rgba(225, 29, 72, 0.3);
  }
`;

const FeaturedImage = styled.div`
  height: 250px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(45deg, #151515, #222222);
  display: flex;
  align-items: center;
  justify-content: center;
  
  span {
    font-size: 1.2rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
    position: relative;
    z-index: 1;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(225, 29, 72, 0.1) 0%, transparent 70%);
  }
`;

const FeaturedInfo = styled.div`
  padding: 1.5rem;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #F1F1F1;
  }
  
  p {
    font-size: 1.2rem;
    font-weight: 700;
    color: #E11D48;
    margin-bottom: 1.5rem;
  }
  
  a {
    display: block;
    width: 100%;
    padding: 0.75rem;
    text-align: center;
    background: linear-gradient(90deg, #E11D48, #BE123C);
    color: #FFFFFF;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
    }
  }
`;

const ViewAll = styled.div`
  margin-top: 3rem;
  text-align: center;
  
  a {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: rgba(255, 255, 255, 0.05);
    color: #FFFFFF;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: rgba(241, 241, 241, 0.7);
`;

// ===== قسم الخدمات الاحترافية (جديد) =====
const ProfessionalServicesSection = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #0A0A0A 0%, #111111 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center left, rgba(225, 29, 72, 0.08) 0%, transparent 70%);
    z-index: 1;
  }
`;

const ServicesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const ServiceCardsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const ServiceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(225, 29, 72, 0.3);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    
    .service-image::after {
      opacity: 0.3;
    }
  }
`;

const ServiceImage = styled.div`
  height: 200px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #111111, #1a1a1a);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(225, 29, 72, 0.2) 0%, transparent 100%);
    opacity: 0.1;
    transition: opacity 0.3s ease;
  }
  
  i {
    font-size: 3rem;
    color: rgba(225, 29, 72, 0.7);
    z-index: 1;
  }
`;

const ServiceContent = styled.div`
  padding: 1.5rem;
  position: relative;
  
  h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #F1F1F1;
  }
  
  p {
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    color: rgba(255, 255, 255, 0.7);
    height: 4.5rem;
    overflow: hidden;
  }
`;

const ServiceButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 0.75rem;
  text-align: center;
  background: linear-gradient(90deg, #E11D48, #BE123C);
  color: #FFFFFF;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
  }
`;

// ===== قسم كيفية العمل =====
const HowSection = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(to bottom, #0A0A0A, #111111);
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zm-24.596 0L12.143 6.485l1.415 1.414 7.9-7.9h-2.83zm16.728 0L41.23 6.485l-1.414 1.414-7.9-7.9h2.83zm-8.86 0L18.857 6.485l1.415 1.414 7.9-7.9h-2.83zM0 8.057l2.828 2.83-1.414 1.414-1.414-1.413V8.057zM0 18.627l2.828 2.83-1.414 1.414-1.414-1.415v-2.83zm0 10.572l2.828 2.828-1.414 1.414L0 32.03V29.2zm0 10.57l2.828 2.83L1.414 44.57 0 43.16v-2.83zm0 10.573l2.828 2.828-1.414 1.414L0 53.186v-2.83zM60 8.057l-2.83 2.83 1.415 1.414 1.414-1.413V8.057zm0 10.572l-2.83 2.83 1.415 1.414 1.414-1.415v-2.83zm0 10.57l-2.83 2.83 1.415 1.414 1.414-1.413v-2.83zm0 10.573l-2.83 2.83 1.415 1.414 1.414-1.414v-2.83zm0 10.573l-2.83 2.83 1.415 1.414 1.414-1.414v-2.83L60 60l-2.83-2.83 2.83-2.83v2.83l-2.83-2.83 1.414-1.414 1.414 1.413v2.83zm0-5.434l-2.83-2.828L60 40.23v2.83zm0-5.365L57.17 40.23l1.414-1.414 1.414 1.414v2.83zm0-5.367l-2.83-2.83L60 29.2v2.83zm0-5.433l-2.83-2.83L60 18.628v2.83zM0 55.434l2.828 2.83-1.414 1.414-1.414-1.414v-2.83zm0 5.433l2.828 2.83-1.414 1.415-.828-.83-.586-.586v-2.83z' fill='rgba(255,255,255,0.02)' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.5;
    z-index: 1;
  }
  
  h2 {
    font-size: 2.2rem;
    text-align: center;
    margin-bottom: 3rem;
    position: relative;
    display: inline-block;
    color: #F1F1F1;
    z-index: 2;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      right: 50%;
      transform: translateX(50%);
      width: 60px;
      height: 4px;
      background: linear-gradient(90deg, #E11D48, #BE123C);
      border-radius: 2px;
    }
  }
`;

const StepsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  &::after {
    content: '';
    position: absolute;
    top: 36px;
    width: 70%;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, rgba(225, 29, 72, 0.5) 50%, transparent 100%);
    z-index: -1;
    
    @media (max-width: 992px) {
      display: none;
    }
  }
`;

const Step = styled(motion.div)`
  width: 250px;
  padding: 0 1.5rem;
  margin: 0 1rem 2rem;
  text-align: center;
  position: relative;
  z-index: 2;
  
  h3 {
    font-size: 1.2rem;
    margin: 1rem 0;
    color: #F1F1F1;
  }
  
  p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
  }
`;

const StepNumber = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E11D48, #9F1239);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 10px 20px rgba(225, 29, 72, 0.3);
  border: 4px solid #0A0A0A;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
    opacity: 0.5;
  }
`;

// ===== قسم المميزات =====
const FeaturesSection = styled.section`
  padding: 5rem 2rem;
  background: #0A0A0A;
  position: relative;
  
  h2 {
    font-size: 2.2rem;
    text-align: center;
    margin-bottom: 3rem;
    position: relative;
    display: inline-block;
    color: #F1F1F1;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      right: 50%;
      transform: translateX(50%);
      width: 60px;
      height: 4px;
      background: linear-gradient(90deg, #E11D48, #BE123C);
      border-radius: 2px;
    }
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Feature = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(225, 29, 72, 0.05);
    border-color: rgba(225, 29, 72, 0.3);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
  
  i {
    font-size: 2.5rem;
    color: #E11D48;
    margin-bottom: 1rem;
    opacity: 0.9;
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #F1F1F1;
  }
  
  p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
  }
`;

// ===== قسم دعوة للعمل =====
const CtaSection = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #0A0A0A 0%, #111111 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(225, 29, 72, 0.15) 0%, transparent 70%);
    z-index: 1;
  }
`;

const CtaContent = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
  
  h2 {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    color: #F1F1F1;
  }
  
  p {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 2.5rem;
  }
  
  a {
    display: inline-block;
    padding: 0.75rem 2.5rem;
    background: linear-gradient(90deg, #E11D48, #BE123C);
      color: #FFFFFF;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
    
    &:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 10px 25px rgba(225, 29, 72, 0.4);
    }
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`;

// ===== المكون الرئيسي =====
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  
  // التحقق من وجود رسائل نجاح في state التوجيه
  useEffect(() => {
    const success = location.state?.loginSuccess || location.state?.logoutSuccess;
    
    if (success) {
      setShowMessage(true);
      setMessage(location.state.message || 'تمت العملية بنجاح');
      
      // إخفاء الرسالة بعد 5 ثوان
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      
      // تنظيف state التوجيه لتجنب ظهور الرسالة عند تحديث الصفحة
      window.history.replaceState({}, document.title);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  // جلب المنتجات المميزة
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await productService.getProducts({ limit: 4 });
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // إنشاء منتج إفتراضي في حالة عدم وجود منتجات
  const placeholderProduct = {
    _id: 'placeholder',
    name: 'منتج إفتراضي',
    price: 350,
    category: 'قميص'
  };

  // استخدام المنتجات الفعلية أو الوهمية
  const displayProducts = featuredProducts.length > 0 
    ? featuredProducts 
    : [placeholderProduct, placeholderProduct, placeholderProduct, placeholderProduct];

  // متغيرات التحريك
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // الخدمات الاحترافية
  const professionalServices = [
    {
      id: 1,
      icon: "fas fa-tshirt",
      title: "تصميم فستان مخصص",
      description: "تصميم فستان مخصص يناسب مقاساتك وذوقك الشخصي بأعلى جودة، مع اختيار الأقمشة والألوان والتفاصيل المفضلة لديك",
      link: "/service/create"
    },
    {
      id: 2,
      icon: "fas fa-cut",
      title: "تعديل وإصلاح الملابس",
      description: "خدمات احترافية لتعديل وإصلاح الملابس الموجودة لتناسب مقاساتك بدقة وإعطائها مظهرًا جديدًا ومميزًا",
      link: "/service/create"
    },
    {
      id: 3,
      icon: "fas fa-palette",
      title: "استشارات تصميم الأزياء",
      description: "جلسات استشارية مع مصممين محترفين لاختيار الأنماط والألوان والقصات التي تناسب شكل جسمك ومناسباتك",
      link: "/service/create"
    }
  ];

  return (
    <HomeContainer>
      {/* عرض رسالة النجاح إذا كانت متاحة */}
      {showMessage && (
        <SuccessMessage>
          <FaCheckCircle />
          <span>{message}</span>
        </SuccessMessage>
      )}
      
      {/* قسم العرض الرئيسي */}
      <HeroSection>
        <HeroContent
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1>منصة ترزي للخياطة والتصاميم المخصصة</h1>
          <p>
            تصاميم عصرية وخياطة احترافية تناسب مقاساتك بدقة لتحصل على ملابس فريدة تبرز أناقتك
          </p>
          <HeroButtons
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <ButtonPrimary to="/products">
              استعرض التصاميم
            </ButtonPrimary>
            <ButtonSecondary to="/service/create">
              طلب خدمة احترافية
            </ButtonSecondary>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* قسم المنتجات المميزة */}
      <FeaturedSection>
        <SectionTitle>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            تصاميم مميزة
          </motion.h2>
        </SectionTitle>
        
        {loading ? (
          <LoadingContainer>جاري التحميل...</LoadingContainer>
        ) : (
          <FeaturedProducts
            as={motion.div}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {displayProducts.map((product, index) => (
              <FeaturedProduct
                key={product._id || index}
                variants={fadeIn}
                whileHover={{ y: -10 }}
              >
                <FeaturedImage>
                  <span>{product.category}</span>
                </FeaturedImage>
                <FeaturedInfo>
                  <h3>{product.name}</h3>
                  <p>{product.price} ريال</p>
                  <Link to={`/product/${product._id}`}>
                    عرض التفاصيل
                  </Link>
                </FeaturedInfo>
              </FeaturedProduct>
            ))}
          </FeaturedProducts>
        )}
        <ViewAll>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/products">
              عرض جميع التصاميم
            </Link>
          </motion.div>
        </ViewAll>
      </FeaturedSection>

      {/* قسم الخدمات الاحترافية */}
      <ProfessionalServicesSection>
        <ServicesContainer>
          <SectionTitle>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
            >
              خدماتنا الاحترافية
            </motion.h2>
          </SectionTitle>
          
          <ServiceCardsContainer
            as={motion.div}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {professionalServices.map(service => (
              <ServiceCard key={service.id} variants={fadeIn}>
                <ServiceImage className="service-image">
                  <i className={service.icon}></i>
                </ServiceImage>
                <ServiceContent>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ServiceButton to={service.link}>
                    طلب الخدمة
                  </ServiceButton>
                </ServiceContent>
              </ServiceCard>
            ))}
          </ServiceCardsContainer>
          
          <ViewAll>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/my-services">
                إدارة طلبات الخدمة
              </Link>
            </motion.div>
          </ViewAll>
        </ServicesContainer>
      </ProfessionalServicesSection>

      {/* قسم كيفية العمل */}
      <HowSection>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          كيف تعمل منصة ترزي؟
        </motion.h2>
        
        <StepsContainer
          as={motion.div}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Step variants={fadeIn}>
            <StepNumber>1</StepNumber>
            <h3>اختر التصميم</h3>
            <p>استعرض مجموعة متنوعة من التصاميم واختر ما يناسبك من أحدث الموديلات العصرية</p>
          </Step>
          <Step variants={fadeIn}>
            <StepNumber>2</StepNumber>
            <h3>أدخل مقاساتك</h3>
            <p>قم بإدخال مقاساتك مرة واحدة واستخدمها في جميع طلباتك لضمان ملاءمة مثالية</p>
          </Step>
          <Step variants={fadeIn}>
            <StepNumber>3</StepNumber>
            <h3>اختر القماش واللون</h3>
            <p>حدد نوع القماش واللون المناسب للتصميم الذي اخترته من مجموعة خيارات متنوعة وعالية الجودة</p>
          </Step>
          <Step variants={fadeIn}>
            <StepNumber>4</StepNumber>
            <h3>استلم طلبك</h3>
            <p>سنقوم بتنفيذ طلبك بعناية واحترافية وتوصيله إليك في الموعد المحدد بتغليف أنيق</p>
          </Step>
        </StepsContainer>
      </HowSection>

      {/* قسم المميزات */}
      <FeaturesSection>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          لماذا تختار منصة ترزي؟
        </motion.h2>
        
        <FeaturesGrid
          as={motion.div}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Feature variants={fadeIn}>
            <i className="fas fa-ruler"></i>
            <h3>مقاسات دقيقة</h3>
            <p>نصمم لك ملابس تناسب مقاساتك بدقة عالية لراحة مثالية طوال اليوم</p>
          </Feature>
          <Feature variants={fadeIn}>
            <i className="fas fa-tshirt"></i>
            <h3>تصاميم عصرية</h3>
            <p>مجموعة متنوعة من التصاميم العصرية والأنيقة تناسب مختلف الأذواق والمناسبات</p>
          </Feature>
          <Feature variants={fadeIn}>
            <i className="fas fa-hand-holding-heart"></i>
            <h3>جودة عالية</h3>
            <p>خياطة احترافية وأقمشة ذات جودة ممتازة مختارة بعناية لتدوم طويلاً</p>
          </Feature>
          <Feature variants={fadeIn}>
            <i className="fas fa-truck"></i>
            <h3>توصيل سريع</h3>
            <p>نوصل طلباتك في الموعد المحدد بكل عناية لضمان وصولها بحالة ممتازة</p>
          </Feature>
          <Feature variants={fadeIn}>
            <i className="fas fa-crown"></i>
            <h3>خدمات احترافية</h3>
            <p>نقدم خدمات تصميم وخياطة متخصصة من خبراء في مجال الأزياء والخياطة</p>
          </Feature>
          <Feature variants={fadeIn}>
            <i className="fas fa-comments"></i>
            <h3>دعم متميز</h3>
            <p>فريق دعم متخصص جاهز لمساعدتك والإجابة على استفساراتك على مدار الأسبوع</p>
          </Feature>
        </FeaturesGrid>
      </FeaturesSection>

      {/* قسم دعوة للعمل */}
      <CtaSection>
        <CtaContent
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <h2>هل أنت مستعد لتجربة خدماتنا؟</h2>
          <p>ابدأ الآن بتصميم ملابسك المخصصة بمقاساتك الدقيقة واستمتع بتجربة تسوق فريدة</p>
          <ButtonsContainer>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ButtonPrimary to="/products">
                استعرض التصاميم
              </ButtonPrimary>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ButtonSecondary to="/service/create">
                طلب خدمة احترافية
              </ButtonSecondary>
            </motion.div>
          </ButtonsContainer>
        </CtaContent>
      </CtaSection>
    </HomeContainer>
  );
};

export default Home;