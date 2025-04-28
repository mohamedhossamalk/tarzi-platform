// frontend/src/components/layout/Header.js
import React, { useState, useContext, useEffect, useCallback, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserCircle, 
  FaShoppingCart, 
  FaSignOutAlt, 
  FaTimes,
  FaSearch,
  FaTachometerAlt,
  FaRuler,
  FaClipboardList,
  FaTshirt,
  FaUsers,
  FaCog,
  FaBoxOpen,
  FaPaperPlane,
  FaRegBell,
  FaBars,
  FaUserPlus,
  FaTag,
  FaChartBar,
  FaPlus,
  FaUserTie,
  FaUser,
  FaUserShield
} from 'react-icons/fa';
import { RiAdminLine } from 'react-icons/ri';

// ==================== المتغيرات والثوابت العامة ====================
const COLORS = {
  primary: {
    main: '#E11D48', // أحمر
    dark: '#BE123C',
    light: 'rgba(225, 29, 72, 0.1)',
  },
  background: {
    dark: '#000000',
    darker: '#111111',
    card: 'rgba(17, 17, 17, 0.8)',
    glass: 'rgba(0, 0, 0, 0.8)',
  },
  text: {
    main: '#F1F1F1', // نص أبيض فاتح
    light: 'rgba(241, 241, 241, 0.8)',
    muted: 'rgba(241, 241, 241, 0.5)',
    active: '#E11D48', // أحمر
  },
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    active: '#E11D48', // أحمر
  },
  action: {
    badge: '#E11D48', // أحمر
    hover: 'rgba(255, 255, 255, 0.05)',
    active: 'rgba(225, 29, 72, 0.2)',
  }
};

// ==================== تحريكات الواجهة ====================
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.15 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.1 }
  }
};

const menuVariants = {
  closed: {
    x: '100%',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  open: {
    x: '0%',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

const itemVariants = {
  closed: { x: 20, opacity: 0 },
  open: i => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.3
    }
  })
};

// ==================== ستايلد كومبوننتس ====================
const NavbarWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.2s ease;
  backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
  -webkit-backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
  background: ${props => props.scrolled 
    ? COLORS.background.glass 
    : COLORS.background.dark};
  border-bottom: 1px solid ${props => props.scrolled 
    ? COLORS.border.light 
    : 'transparent'};
  color: ${COLORS.text.main};
  height: 64px;
  display: flex;
  align-items: center;
  direction: rtl;
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  z-index: 100;
  gap: 8px;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${COLORS.text.main};
  letter-spacing: -0.03em;
  position: relative;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    color: ${COLORS.text.active};
  }
  
  .admin-badge {
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 4px;
    background: ${COLORS.primary.light};
    color: ${COLORS.primary.main};
    font-weight: 500;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.active 
    ? COLORS.text.active 
    : COLORS.text.light};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0 8px;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  transition: color 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    height: 2px;
    background: ${props => props.active 
      ? COLORS.border.active
      : 'transparent'};
    transition: background 0.2s ease;
  }
  
  &:hover {
    color: ${COLORS.text.active};
  }

  .link-icon {
    font-size: 0.9rem;
    margin-left: 5px;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.text.light};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    color: ${COLORS.text.active};
    background: ${COLORS.action.hover};
  }
  
  &:active {
    background: ${COLORS.action.active};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background: ${COLORS.action.badge};
  color: ${COLORS.text.main};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(225, 29, 72, 0.3);
`;

const AuthButton = styled(Link)`
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  background: transparent;
  color: ${COLORS.text.light};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    color: ${COLORS.text.active};
    background: ${COLORS.action.hover};
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ServiceButton = styled(Link)`
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  background: ${COLORS.primary.main};
  color: ${COLORS.text.main};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: ${COLORS.primary.dark};
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: none;
  align-items: center;
  justify-content: center;
  color: ${COLORS.text.light};
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${COLORS.text.active};
    background: ${COLORS.action.hover};
  }
  
  @media (max-width: 992px) {
    display: flex;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 80%;
  max-width: 320px;
  height: 100vh;
  background: ${COLORS.background.darker};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 90;
  padding: 64px 16px 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  border-right: 1px solid ${COLORS.border.light};
`;

const MobileMenuHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  height: 64px;
  border-bottom: 1px solid ${COLORS.border.light};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.text.light};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${COLORS.text.active};
    background: ${COLORS.action.hover};
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  margin-bottom: 16px;
  background: ${COLORS.action.hover};
  border-radius: 8px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${COLORS.action.active};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.text.active};
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${COLORS.text.main};
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.isAdmin ? COLORS.primary.main : COLORS.text.muted};
  
  svg {
    font-size: 0.75rem;
  }
`;

const MobileNavLinks = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 24px;
`;

const StyledMobileNavLink = styled(Link)`
  color: ${props => props.active ? COLORS.text.active : COLORS.text.light};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: ${props => props.active ? COLORS.action.active : 'transparent'};
  display: flex;
  align-items: center;
  gap: 10px;
  
  .link-icon {
    font-size: 1.1rem;
    opacity: 0.9;
    width: 20px;
  }
  
  &:hover {
    background: ${COLORS.action.hover};
    color: ${props => props.active ? COLORS.text.active : COLORS.text.main};
  }
`;

const MobileAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid ${COLORS.border.light};
`;

const MobileAuthButton = styled(Link)`
  padding: 12px 16px;
  border-radius: 6px;
  text-align: center;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &.login {
    background: ${COLORS.action.hover};
    color: ${COLORS.text.main};
    
    &:hover {
      background: ${COLORS.action.active};
    }
  }
  
  &.register {
    background: ${COLORS.primary.main};
    color: ${COLORS.text.main};
    
    &:hover {
      background: ${COLORS.primary.dark};
    }
  }
  
  &.admin {
    background: ${COLORS.primary.light};
    color: ${COLORS.primary.main};
    
    &:hover {
      background: ${COLORS.action.active};
    }
  }
`;

const MobileLogoutButton = styled.button`
  padding: 12px 16px;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
  transition: all 0.2s ease;
  background: ${COLORS.action.hover};
  color: ${COLORS.text.main};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background: ${COLORS.action.active};
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  z-index: 80;
`;

const SectionDivider = styled.div`
  margin: 8px 0;
  padding: 8px 16px;
  background: ${COLORS.action.hover};
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${COLORS.text.muted};
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    font-size: 0.8rem;
    color: ${COLORS.primary.main};
  }
`;

const ModeBadge = styled.div`
  padding: 3px 8px;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 4px;
  margin-right: auto;
  background: ${COLORS.primary.light};
  color: ${COLORS.primary.main};
`;

// ==================== المكون الرئيسي للهيدر ====================
const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // تحديد ما إذا كان المستخدم في وضع الإدارة
  const isAdminSection = location.pathname.startsWith('/admin');
  const isAdmin = currentUser && currentUser.role === 'admin';

  // روابط التنقل الرئيسية
  const navItems = [
    { name: 'الرئيسية', path: '/', icon: <FaBoxOpen className="link-icon" /> },
    { name: 'التصاميم', path: '/products', icon: <FaTshirt className="link-icon" /> },
    { name: 'المقاسات', path: '/sizes', icon: <FaRuler className="link-icon" /> },
    { name: 'طلب خدمة احترافية', path: '/service/create', icon: <FaClipboardList className="link-icon" /> },
  ];

  // روابط خاصة بالمستخدم المسجل
  const userNavItems = [
    { name: 'مقاساتي', path: '/measurements', icon: <FaRuler className="link-icon" /> },
    { name: 'طلباتي', path: '/orders', icon: <FaShoppingCart className="link-icon" /> },
    { name: 'خدماتي الاحترافية', path: '/my-services', icon: <FaClipboardList className="link-icon" /> },
  ];

  // روابط خاصة بالمسؤول
  const adminNavItems = [
    { name: 'لوحة التحكم', path: '/admin/dashboard', icon: <FaTachometerAlt className="link-icon" /> },
    { name: 'المنتجات', path: '/admin/products', icon: <FaTshirt className="link-icon" /> },
    { name: 'الطلبات', path: '/admin/orders', icon: <FaShoppingCart className="link-icon" /> },
    { name: 'المستخدمين', path: '/admin/users', icon: <FaUsers className="link-icon" /> },
    { name: 'الخدمات الاحترافية', path: '/admin/professional-services', icon: <FaUserTie className="link-icon" /> },
  ];
  
  const adminQuickLinks = [
    { name: 'إضافة منتج', path: '/admin/products/create', icon: <FaPlus /> },
    { name: 'الإحصائيات', path: '/admin/statistics', icon: <FaChartBar /> },
    { name: 'إعدادات الموقع', path: '/admin/settings', icon: <FaCog /> },
  ];

  // تتبع التمرير لتغيير مظهر شريط التنقل
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // إغلاق القائمة عند تغيير المسار
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);
  
  // منع التمرير عند فتح القائمة
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  // معالج تسجيل الخروج - استخدام useCallback لتحسين الأداء
  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    setMenuOpen(false);
  }, [logout, navigate]);

  // تحقق مما إذا كان الرابط نشطًا
  const isActive = useCallback((path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }, [location.pathname]);

  // معالج النقر على أيقونة المستخدم
  const handleUserIconClick = useCallback((e) => {
    e.preventDefault();
    navigate(isAdmin ? '/admin/dashboard' : '/profile');
  }, [isAdmin, navigate]);

  // اختصار لتحويل المستخدم إلى لوحة الإدارة أو العكس
  const toggleAdminMode = useCallback(() => {
    navigate(isAdminSection ? '/' : '/admin/dashboard');
    setMenuOpen(false);
  }, [isAdminSection, navigate]);
  
  // معرفة سبب وجود المستخدم في وضع الإدارة
  const getAdminNavLinks = useCallback(() => {
    // إذا كان المسار الحالي يبدأ بـ /admin، نعرض روابط الإدارة
    if (isAdminSection) {
      return adminNavItems;
    }
    // وإلا، نعرض الروابط العادية
    return navItems;
  }, [isAdminSection]);

  return (
    <NavbarWrapper scrolled={scrolled} role="navigation" aria-label="القائمة الرئيسية">
      <NavContainer>
        <Logo to={isAdminSection ? '/admin/dashboard' : '/'} aria-label="الصفحة الرئيسية">
          <LogoText>
            {isAdminSection ? (
              <>
                <RiAdminLine /> ترزي <span className="admin-badge">لوحة التحكم</span>
              </>
            ) : (
              'ترزي'
            )}
          </LogoText>
        </Logo>
        
        <NavLinks role="menubar">
          {getAdminNavLinks().map(item => (
            <NavLink 
              key={item.path}
              to={item.path}
              active={isActive(item.path) ? 1 : 0}
              role="menuitem"
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              {item.name}
            </NavLink>
          ))}
          
          {!isAdminSection && currentUser && !isAdmin && userNavItems.map(item => (
            <NavLink 
              key={item.path}
              to={item.path}
              active={isActive(item.path) ? 1 : 0}
              role="menuitem"
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              {item.name}
            </NavLink>
          ))}
          
          {!isAdminSection && isAdmin && (
            <NavLink 
              to="/admin/dashboard"
              active={isActive('/admin/dashboard') ? 1 : 0}
              role="menuitem"
            >
              <RiAdminLine className="link-icon" /> لوحة التحكم
            </NavLink>
          )}
        </NavLinks>
        
        <NavActions>
          {!isAdminSection && (
            <IconButton 
              onClick={() => navigate('/search')}
              aria-label="البحث"
              title="البحث"
            >
              <FaSearch />
            </IconButton>
          )}
          
          {isAdminSection && isAdmin && (
            <IconButton 
              onClick={() => navigate('/admin/notifications')}
              aria-label="الإشعارات"
              title="الإشعارات"
            >
              <FaRegBell />
              <Badge>3</Badge>
            </IconButton>
          )}
          
          {currentUser ? (
            <>
              <IconButton
                onClick={handleUserIconClick}
                aria-label="الملف الشخصي"
                title={isAdmin ? "لوحة التحكم" : "الملف الشخصي"}
              >
                <FaUserCircle />
              </IconButton>
              
              {isAdmin && (
                <ServiceButton to={isAdminSection ? '/' : '/admin/dashboard'}>
                  {isAdminSection ? (
                    <>
                      <FaBoxOpen /> العودة للموقع
                    </>
                  ) : (
                    <>
                      <RiAdminLine /> لوحة التحكم
                    </>
                  )}
                </ServiceButton>
              )}
              
              {!isAdminSection && (
                <ServiceButton to="/service/create">
                  <FaPaperPlane /> طلب خدمة
                </ServiceButton>
              )}
              
              <IconButton 
                onClick={handleLogout}
                aria-label="تسجيل الخروج"
                title="تسجيل الخروج"
              >
                <FaSignOutAlt />
              </IconButton>
            </>
          ) : (
            <>
              <AuthButton to="/login">
                <FaUserCircle />
                تسجيل الدخول
              </AuthButton>
              
              <ServiceButton to="/service/create">
                <FaPaperPlane /> طلب خدمة
              </ServiceButton>
            </>
          )}
          
          <MenuButton 
            onClick={() => setMenuOpen(true)}
            aria-label="فتح القائمة"
            aria-expanded={menuOpen}
          >
            <FaBars />
          </MenuButton>
        </NavActions>
      </NavContainer>
      
      {/* قائمة الجوال */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <Overlay 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />
            
            <MobileMenu
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              role="dialog"
              aria-modal="true"
              aria-label="القائمة الرئيسية"
            >
              <MobileMenuHeader>
                <LogoText>
                  {isAdminSection ? (
                    <>
                      <RiAdminLine /> لوحة التحكم
                    </>
                  ) : (
                    'ترزي'
                  )}
                </LogoText>
                <CloseButton 
                  onClick={() => setMenuOpen(false)}
                  aria-label="إغلاق القائمة"
                >
                  <FaTimes />
                </CloseButton>
              </MobileMenuHeader>
              
              {currentUser && (
                <UserProfile>
                  <UserAvatar>
                    <FaUserCircle />
                  </UserAvatar>
                  <UserInfo>
                    <UserName>{currentUser.username || 'مستخدم'}</UserName>
                    <UserRole isAdmin={isAdmin}>
                      {isAdmin ? (
                        <>
                          <FaUserShield /> مدير النظام
                        </>
                      ) : (
                        <>
                          <FaUser /> مستخدم
                        </>
                      )}
                    </UserRole>
                  </UserInfo>
                  {isAdmin && (
                    <ModeBadge>
                      {isAdminSection ? 'وضع الإدارة' : 'وضع المستخدم'}
                    </ModeBadge>
                  )}
                </UserProfile>
              )}
              
              <MobileNavLinks role="menu">
                {/* روابط القائمة الرئيسية */}
                {!isAdminSection && (
                  <>
                    <SectionDivider>
                      <FaBoxOpen /> التسوق
                    </SectionDivider>
                    
                    {navItems.map((item, i) => (
                      <motion.div
                        key={item.path}
                        custom={i}
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                      >
                        <StyledMobileNavLink
                          to={item.path}
                          active={isActive(item.path) ? 1 : 0}
                          role="menuitem"
                          aria-current={isActive(item.path) ? 'page' : undefined}
                        >
                          {item.icon}
                          {item.name}
                          </StyledMobileNavLink>
                      </motion.div>
                    ))}
                  </>
                )}
                {/* رابط تبديل الوضع للمسؤول */}
                {isAdmin && (
                  <motion.div
                    custom={10}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <SectionDivider>
                      <FaUserShield /> خيارات المسؤول
                    </SectionDivider>
                    
                    <StyledMobileNavLink
                      to={isAdminSection ? '/' : '/admin/dashboard'}
                      role="menuitem"
                    >
                      {isAdminSection ? (
                        <>
                          <FaBoxOpen />
                          العودة للموقع
                        </>
                      ) : (
                        <>
                          <RiAdminLine />
                          الانتقال للوحة التحكم
                        </>
                      )}
                    </StyledMobileNavLink>
                  </motion.div>
                )}
              </MobileNavLinks>
              
              <MobileAuthButtons>
                {currentUser ? (
                  <motion.div
                    variants={itemVariants}
                    custom={20}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <MobileLogoutButton onClick={handleLogout}>
                      <FaSignOutAlt /> تسجيل الخروج
                    </MobileLogoutButton>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      variants={itemVariants}
                      custom={navItems.length}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <MobileAuthButton to="/login" className="login">
                        <FaUserCircle /> تسجيل الدخول
                      </MobileAuthButton>
                    </motion.div>
                    
                    <motion.div
                      variants={itemVariants}
                      custom={navItems.length + 1}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <MobileAuthButton to="/register" className="register">
                        <FaUserPlus /> إنشاء حساب
                      </MobileAuthButton>
                    </motion.div>
                  </>
                )}
              </MobileAuthButtons>
            </MobileMenu>
          </>
        )}
      </AnimatePresence>
    </NavbarWrapper>
  );
};

export default Header;