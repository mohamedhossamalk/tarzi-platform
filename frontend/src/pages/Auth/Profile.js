// frontend/src/pages/Auth/Profile.js
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { authService } from '../../services/auth.service';
import { AuthContext } from '../../contexts/AuthContext';
import { FaUser, FaKey, FaUserShield, FaSyncAlt, FaTachometerAlt } from 'react-icons/fa';

// تنسيق حاوية صفحة الملف الشخصي
const ProfileContainer = styled.div`
  background-color: #0A0A0A;
  color: #F1F1F1;
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: 80vh;
  
  h2 {
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
  }
`;

// تنسيق تبويبات الملف الشخصي
const ProfileTabs = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(225, 29, 72, 0.5) rgba(255, 255, 255, 0.1);
  
  &::-webkit-scrollbar {
    height: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(225, 29, 72, 0.5);
    border-radius: 20px;
  }
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  color: ${props => props.active ? '#E11D48' : 'rgba(241, 241, 241, 0.7)'};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    right: 0;
    left: 0;
    height: 3px;
    background: ${props => props.active ? 'linear-gradient(90deg, #E11D48, #BE123C)' : 'transparent'};
    border-radius: 2px 2px 0 0;
    transition: all 0.3s ease;
  }
  
  &:hover {
    color: ${props => props.active ? '#E11D48' : '#F1F1F1'};
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

// تنسيق محتوى التبويب
const TabContent = styled(motion.div)`
  background: #111111;
  border-radius: 8px;
  padding: 2rem;
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
`;

// تنسيق النموذج
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-size: 0.95rem;
    font-weight: 500;
    color: rgba(241, 241, 241, 0.8);
  }
  
  input {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: #F1F1F1;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: rgba(225, 29, 72, 0.5);
      box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.2);
    }
    
    &::placeholder {
      color: rgba(241, 241, 241, 0.3);
    }
  }
`;

// تنسيق رسائل التنبيه
const Alert = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: right;
  
  &.error {
    background-color: rgba(239, 68, 68, 0.1);
    color: #EF4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }
  
  &.success {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10B981;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }
  
  &.info {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3B82F6;
    border: 1px solid rgba(59, 130, 246, 0.2);
  }
`;

// تنسيق الأزرار
const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  padding: 0.75rem 1.5rem;
  background: ${props => props.secondary 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'linear-gradient(90deg, #E11D48, #BE123C)'};
  color: ${props => props.secondary ? 'rgba(241, 241, 241, 0.9)' : '#FFFFFF'};
  border: ${props => props.secondary ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: ${props => props.mt || '1rem'};
  margin-left: ${props => props.ml || '0'};
  margin-right: ${props => props.mr || '0'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.secondary 
      ? 'none' 
      : '0 5px 15px rgba(225, 29, 72, 0.3)'};
    background: ${props => props.secondary 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'linear-gradient(90deg, #E11D48, #BE123C)'};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// تنسيق الروابط
const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  background: ${props => props.primary 
    ? 'linear-gradient(90deg, #E11D48, #BE123C)'
    : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.primary ? '#FFFFFF' : 'rgba(241, 241, 241, 0.9)'};
  border: ${props => props.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: ${props => props.mt || '1rem'};
  margin-left: ${props => props.ml || '0'};
  margin-right: ${props => props.mr || '0'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.primary 
      ? '0 5px 15px rgba(225, 29, 72, 0.3)'
      : 'none'};
    background: ${props => props.primary 
      ? 'linear-gradient(90deg, #E11D48, #BE123C)'
      : 'rgba(255, 255, 255, 0.1)'};
  }
`;

// تنسيق بطاقة الصلاحيات والمعلومات
const RoleCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
`;

const RoleInfo = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #F1F1F1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: #E11D48;
    }
  }
  
  p {
    color: rgba(241, 241, 241, 0.8);
    margin-bottom: 0.5rem;
  }
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${props => props.isAdmin 
    ? 'rgba(225, 29, 72, 0.15)'
    : 'rgba(59, 130, 246, 0.15)'};
  color: ${props => props.isAdmin ? '#E11D48' : '#3B82F6'};
  border: 1px solid ${props => props.isAdmin 
    ? 'rgba(225, 29, 72, 0.3)'
    : 'rgba(59, 130, 246, 0.3)'};
  margin-right: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Profile = () => {
  const { currentUser, updateUser, refreshUserInfo } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [roleError, setRoleError] = useState('');
  const [roleSuccess, setRoleSuccess] = useState('');

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const updatedUser = await authService.updateProfile(profileData);
      updateUser(updatedUser);
      setProfileSuccess('تم تحديث البيانات بنجاح');
    } catch (err) {
      setProfileError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'حدث خطأ أثناء تحديث البيانات'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('كلمات المرور الجديدة غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      await authService.changePassword(passwordData);
      setPasswordSuccess('تم تغيير كلمة المرور بنجاح');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setPasswordError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'حدث خطأ أثناء تغيير كلمة المرور'
      );
    } finally {
      setLoading(false);
    }
  };

  // وظيفة تحديث معلومات المستخدم من الخادم
  const handleRefreshUserInfo = async () => {
    setRefreshing(true);
    setRoleError('');
    setRoleSuccess('');
    
    try {
      await refreshUserInfo();
      setRoleSuccess('تم تحديث معلومات الحساب بنجاح');
      
      // تحديث بيانات النموذج بعد تحديث معلومات المستخدم
      setProfileData({
        username: currentUser?.username || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
      });
    } catch (err) {
      setRoleError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'حدث خطأ أثناء تحديث معلومات الحساب'
      );
    } finally {
      setRefreshing(false);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <ProfileContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>الملف الشخصي</h2>

        <ProfileTabs>
          <TabButton 
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> معلومات الحساب
          </TabButton>
          <TabButton 
            active={activeTab === 'password'}
            onClick={() => setActiveTab('password')}
          >
            <FaKey /> تغيير كلمة المرور
          </TabButton>
          <TabButton 
            active={activeTab === 'roles'}
            onClick={() => setActiveTab('roles')}
          >
            <FaUserShield /> الصلاحيات
          </TabButton>
        </ProfileTabs>

        {activeTab === 'profile' && (
          <TabContent
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {profileError && <Alert className="error">{profileError}</Alert>}
            {profileSuccess && <Alert className="success">{profileSuccess}</Alert>}
            
            <Form onSubmit={handleProfileUpdate}>
              <FormGroup>
                <label htmlFor="username">اسم المستخدم</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="email">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="phone">رقم الهاتف</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                />
              </FormGroup>

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </Form>
          </TabContent>
        )}

        {activeTab === 'password' && (
          <TabContent
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {passwordError && <Alert className="error">{passwordError}</Alert>}
            {passwordSuccess && <Alert className="success">{passwordSuccess}</Alert>}
            
            <Form onSubmit={handlePasswordUpdate}>
              <FormGroup>
                <label htmlFor="currentPassword">كلمة المرور الحالية</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="newPassword">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </FormGroup>

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}
              </Button>
            </Form>
          </TabContent>
        )}
        
        {activeTab === 'roles' && (
          <TabContent
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {roleError && <Alert className="error">{roleError}</Alert>}
            {roleSuccess && <Alert className="success">{roleSuccess}</Alert>}
            
            <RoleCard>
              <RoleInfo>
                <h3>
                  <FaUserShield /> صلاحيات الحساب
                </h3>
                <p>الدور الحالي: <RoleBadge isAdmin={isAdmin}>{isAdmin ? 'مسؤول' : 'مستخدم عادي'}</RoleBadge></p>
                
                {isAdmin && (
                  <Alert className="info">
                    تمتلك صلاحيات مسؤول. يمكنك الوصول إلى لوحة التحكم وإدارة المنصة.
                  </Alert>
                )}
              </RoleInfo>
              
              <ButtonGroup>
                <Button onClick={handleRefreshUserInfo} secondary disabled={refreshing}>
                  <FaSyncAlt /> {refreshing ? 'جاري التحديث...' : 'تحديث معلومات الحساب'}
                </Button>
                
                {isAdmin && (
                  <StyledLink to="/admin" primary>
                    <FaTachometerAlt /> الانتقال إلى لوحة التحكم
                  </StyledLink>
                )}
              </ButtonGroup>
            </RoleCard>
            
            <Alert className="info">
              <p>
                <strong>ملاحظة:</strong> إذا تم تعيينك كمسؤول ولم تظهر لك صلاحيات المسؤول بعد، يرجى النقر على زر "تحديث معلومات الحساب" أو تسجيل الخروج وإعادة تسجيل الدخول.
              </p>
            </Alert>
          </TabContent>
        )}
      </motion.div>
    </ProfileContainer>
  );
};

export default Profile;
