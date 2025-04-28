// frontend/src/pages/About.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';


// تنسيق الحاوية الرئيسية
const AboutContainer = styled.div`
  background-color: #0A0A0A;
  color: rgba(241, 241, 241, 0.8);
  overflow: hidden;
`;

// تنسيق قسم الهيرو
const HeroSection = styled.div`
  background: linear-gradient(to bottom, #0A0A0A, #111111);
  position: relative;
  padding: 8rem 2rem;
  text-align: center;
  
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
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.02)' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.5;
    z-index: 1;
  }
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 2;
  
  h1 {
    font-size: clamp(2.5rem, 5vw, 4rem);
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
    color: rgba(255, 255, 255, 0.8);
    max-width: 800px;
    margin: 2.5rem auto 0;
  }
`;

// تنسيق أقسام المحتوى
const Section = styled.section`
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 4rem;
  position: relative;
  
  @media (max-width: 992px) {
    flex-direction: ${props => props.reverse ? 'column-reverse' : 'column'};
    gap: 2rem;
    padding: 3rem 2rem;
  }
`;

const AlternateSection = styled(Section)`
  flex-direction: row-reverse;
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const SectionContent = styled(motion.div)`
  flex: 1;
  
  h2 {
    font-size: 2.2rem;
    color: #F1F1F1;
    margin-bottom: 1.5rem;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      right: 0;
      width: 50px;
      height: 3px;
      background: linear-gradient(90deg, #E11D48, transparent);
      border-radius: 2px;
    }
  }
  
  p {
    font-size: 1.05rem;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    color: rgba(241, 241, 241, 0.8);
  }
`;

const ImageWrapper = styled(motion.div)`
  flex: 1;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(225, 29, 72, 0.3), transparent);
    z-index: 1;
  }
  
  img {
    width: 100%;
    height: 100%;
    min-height: 350px;
    object-fit: cover;
    display: block;
    transform: scale(1.05);
    transition: transform 0.5s ease;
    
    &:hover {
      transform: scale(1);
    }
  }
`;

// تنسيق قسم القيم
const ValuesSection = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(to top, #0A0A0A, #111111);
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
  
  h2 {
    font-size: 2.2rem;
    color: #F1F1F1;
    margin-bottom: 3rem;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      right: 50%;
      transform: translateX(50%);
      width: 50px;
      height: 3px;
      background: linear-gradient(90deg, #E11D48, #BE123C);
      border-radius: 2px;
    }
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ValueCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2.5rem 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    background: rgba(225, 29, 72, 0.05);
    border-color: rgba(225, 29, 72, 0.3);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
  
  i {
    font-size: 2.5rem;
    color: #E11D48;
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #F1F1F1;
  }
  
  p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
  }
`;

// تنسيق قسم الفريق
const TeamSection = styled.section`
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  
  h2 {
    font-size: 2.2rem;
    color: #F1F1F1;
    margin-bottom: 3rem;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      right: 50%;
      transform: translateX(50%);
      width: 50px;
      height: 3px;
      background: linear-gradient(90deg, #E11D48, #BE123C);
      border-radius: 2px;
    }
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 3rem;
  margin: 0 auto;
`;

const TeamMember = styled(motion.div)`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    border-color: rgba(225, 29, 72, 0.3);
  }
`;

const MemberImage = styled.div`
  width: 100%;
  height: 300px;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(10, 10, 10, 1), transparent);
    z-index: 1;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${TeamMember}:hover & img {
    transform: scale(1.1);
  }
`;

const MemberInfo = styled.div`
  padding: 1.5rem;
  text-align: center;
  
  h3 {
    font-size: 1.3rem;
    color: #F1F1F1;
    margin-bottom: 0.5rem;
  }
  
  .team-role {
    color: #E11D48;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
  }
`;

// تنسيق قسم الدعوة للعمل
const CtaSection = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(45deg, #0A0A0A, #111111);
  position: relative;
  overflow: hidden;
  margin-top: 3rem;
  
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
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 2.5rem;
  }
`;

const CtaButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

const PrimaryButton = styled(motion(Link))`
  display: inline-block;
  padding: 0.75rem 2rem;
  background: linear-gradient(90deg, #E11D48, #BE123C);
  color: #FFFFFF;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3);
  
  &:hover {
    box-shadow: 0 10px 25px rgba(225, 29, 72, 0.4);
  }
`;

const SecondaryButton = styled(motion(Link))`
  display: inline-block;
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const About = () => {
  // متغيرات التحريك
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
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
  
  const imageVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <AboutContainer>
      {/* قسم البداية */}
      <HeroSection>
        <HeroContent
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1>عن منصة ترزي</h1>
          <p>منصة متخصصة في مجال الخياطة والتصاميم المخصصة، نربط بين الإبداع والتقنية لنقدم لك تجربة فريدة</p>
        </HeroContent>
      </HeroSection>

      {/* قسم القصة */}
      <Section>
        <SectionContent
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <h2>قصتنا</h2>
          <p>
            انطلقت منصة "ترزي" بهدف إحياء فن الخياطة التقليدية ودمجها مع التقنيات الحديثة، لنقدم للعملاء تجربة فريدة في الحصول على ملابس مخصصة تناسب أذواقهم ومقاساتهم بدقة.
          </p>
          <p>
            بدأت الفكرة من ملاحظة بسيطة: الكثير منا يواجه صعوبة في إيجاد ملابس تناسب مقاساته تماماً، أو يرغب في الحصول على تصاميم فريدة تعكس شخصيته.
          </p>
          <p>
            اليوم، تفخر منصة "ترزي" بشبكة واسعة من الخياطين والمصممين المحترفين الذين يعملون بشغف لتقديم أفضل المنتجات وفقاً لأعلى معايير الجودة، مع الاهتمام بأدق التفاصيل لضمان رضا العملاء.
          </p>
        </SectionContent>
        <ImageWrapper
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={imageVariant}
        >
          <img src="/images/about-story.jpg" alt="قصة ترزي" />
        </ImageWrapper>
      </Section>

      {/* قسم المهمة */}
      <AlternateSection>
        <SectionContent
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <h2>مهمتنا</h2>
          <p>
            نسعى في "ترزي" إلى إعادة تعريف مفهوم الخياطة المخصصة وجعلها متاحة للجميع بطريقة سهلة وميسرة عبر الإنترنت، مع الحفاظ على الجودة العالية والتفرد في التصاميم.
          </p>
          <p>
            نؤمن بأن الملابس ليست مجرد قطع نرتديها، بل هي تعبير عن هويتنا وأسلوبنا الشخصي. لذلك نعمل جاهدين على توفير منصة تتيح لكل شخص فرصة ارتداء ملابس تعكس شخصيته وتناسب جسمه بشكل مثالي.
          </p>
          <p>
            هدفنا هو تمكين العملاء من الحصول على ملابس تعكس شخصيتهم وتناسب مقاساتهم بدقة، بعيداً عن قيود المقاسات المحددة في المتاجر التقليدية، وذلك من خلال توفير منصة متكاملة تجمع بين سهولة الاستخدام والاحترافية في التنفيذ.
          </p>
        </SectionContent>
        <ImageWrapper
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={imageVariant}
        >
          <img src="/images/about-mission.jpg" alt="مهمتنا" />
        </ImageWrapper>
      </AlternateSection>

      {/* قسم القيم */}
      <ValuesSection>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          قيمنا
        </motion.h2>
        
        <ValuesGrid
          as={motion.div}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <ValueCard variants={fadeIn}>
            <i className="fas fa-gem"></i>
            <h3>الجودة</h3>
            <p>نلتزم بتقديم منتجات عالية الجودة من خلال اختيار أفضل الأقمشة وتطبيق أعلى معايير الخياطة، ليس فقط لتلبية توقعات العملاء، بل لتجاوزها.</p>
          </ValueCard>
          <ValueCard variants={fadeIn}>
            <i className="fas fa-fingerprint"></i>
            <h3>التفرد</h3>
            <p>نؤمن بأن لكل شخص أسلوبه الخاص، لذا نحرص على توفير خيارات متنوعة تلبي جميع الأذواق مع إمكانية التخصيص الكامل للحصول على قطع فريدة.</p>
          </ValueCard>
          <ValueCard variants={fadeIn}>
            <i className="fas fa-user-check"></i>
            <h3>التخصيص</h3>
            <p>نركز على توفير تجربة مخصصة لكل عميل تراعي مقاساته واحتياجاته الخاصة، مع الاهتمام بأدق التفاصيل لضمان الراحة والملاءمة المثالية.</p>
          </ValueCard>
          <ValueCard variants={fadeIn}>
            <i className="fas fa-clock"></i>
            <h3>الالتزام</h3>
            <p>نلتزم بمواعيد التسليم ونسعى دائمًا إلى تجاوز توقعات العملاء في كل جانب من جوانب خدماتنا، مع تقديم تجربة عملاء استثنائية من البداية إلى النهاية.</p>
          </ValueCard>
        </ValuesGrid>
      </ValuesSection>

      {/* قسم الفريق */}
      <TeamSection>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          فريق العمل
        </motion.h2>
        
        <TeamGrid
          as={motion.div}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <TeamMember variants={fadeIn}>
            <MemberImage>
              <img src="/images/team-member1.jpg" alt="أحمد الخياط" />
            </MemberImage>
            <MemberInfo>
              <h3>أحمد الخياط</h3>
              <p className="team-role">المدير التنفيذي</p>
              <p>خبرة أكثر من 15 عامًا في مجال الخياطة والأزياء، مع شغف كبير بدمج التقنية في صناعة الملابس وتطوير تجربة العملاء.</p>
            </MemberInfo>
          </TeamMember>
          
          <TeamMember variants={fadeIn}>
            <MemberImage>
              <img src="/images/team-member2.jpg" alt="سارة المصممة" />
            </MemberImage>
            <MemberInfo>
              <h3>سارة المصممة</h3>
              <p className="team-role">مديرة التصميم</p>
              <p>مصممة أزياء حائزة على العديد من الجوائز، متخصصة في الأزياء العصرية مع لمسة تراثية مميزة تجمع بين الأصالة والحداثة.</p>
            </MemberInfo>
          </TeamMember>
          
          <TeamMember variants={fadeIn}>
            <MemberImage>
              <img src="/images/team-member3.jpg" alt="خالد التقني" />
            </MemberImage>
            <MemberInfo>
              <h3>خالد التقني</h3>
              <p className="team-role">مدير التكنولوجيا</p>
              <p>خبير في تطوير المنصات الإلكترونية وتحسين تجربة المستخدم، مع تركيز خاص على التجارة الإلكترونية والتقنيات الحديثة.</p>
            </MemberInfo>
          </TeamMember>
        </TeamGrid>
      </TeamSection>

      {/* قسم دعوة للعمل */}
      <CtaSection>
        <CtaContent
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <h2>انضم إلينا اليوم</h2>
          <p>ابدأ رحلتك مع ترزي واستمتع بتجربة خياطة مخصصة فريدة من نوعها تناسب ذوقك ومقاساتك بدقة</p>
          <CtaButtons>
            <PrimaryButton 
              to="/register"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              إنشاء حساب
            </PrimaryButton>
            <SecondaryButton 
              to="/products"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              استعراض التصاميم
            </SecondaryButton>
          </CtaButtons>
        </CtaContent>
      </CtaSection>
    </AboutContainer>
  );
};

export default About;