// frontend/src/pages/Contact.js
import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      // في بيئة الإنتاج، سيتم إرسال النموذج إلى الخادم للمعالجة
      // هنا نقوم بمحاكاة الإرسال الناجح
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('تم إرسال رسالتك بنجاح. سنتواصل معك في أقرب وقت ممكن.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>اتصل بنا</h1>
        <p>نحن هنا للإجابة على استفساراتك ومساعدتك في كل ما تحتاج</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <i className="fas fa-map-marker-alt"></i>
            <h3>العنوان</h3>
            <p>شارع الأمير محمد بن عبدالعزيز</p>
            <p>الرياض، المملكة العربية السعودية</p>
          </div>
          <div className="info-card">
            <i className="fas fa-phone-alt"></i>
            <h3>الهاتف</h3>
            <p>+966 12 345 6789</p>
            <p>+966 98 765 4321</p>
          </div>
          <div className="info-card">
            <i className="fas fa-envelope"></i>
            <h3>البريد الإلكتروني</h3>
            <p>info@tarzi.com</p>
            <p>support@tarzi.com</p>
          </div>
          <div className="info-card">
            <i className="fas fa-clock"></i>
            <h3>ساعات العمل</h3>
            <p>الأحد - الخميس: 9:00 ص - 6:00 م</p>
            <p>السبت: 10:00 ص - 4:00 م</p>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>أرسل لنا رسالة</h2>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">الاسم</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">البريد الإلكتروني</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">الموضوع</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">الرسالة</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
            </button>
          </form>
        </div>
      </div>

      <div className="contact-map">
        <h2>موقعنا</h2>
        <div className="map-container">
          {/* هنا يمكن إضافة خريطة Google Maps في بيئة الإنتاج */}
          <div className="map-placeholder">
            <p>خريطة الموقع ستظهر هنا</p>
          </div>
        </div>
      </div>

      <div className="contact-social">
        <h2>تابعنا على وسائل التواصل الاجتماعي</h2>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;