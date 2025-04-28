// frontend/src/pages/ProfessionalService/CreateProfessionalService.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { professionalServiceService } from '../../services/professional-service.service';

const CreateProfessionalService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceType: '',
    title: '',
    description: '',
    budget: '',
    deadline: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const { serviceType, title, description, budget, deadline, images } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // إنشاء FormData لرفع الصورة
    const formData = new FormData();
    formData.append('image', file);
    
    setUploadingImage(true);
    
    try {
      // ملحوظة: هذا يفترض وجود خدمة رفع صور في الخلفية
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, data.url]
        }));
      }
    } catch (err) {
      console.error('خطأ في رفع الصورة:', err);
      setError('حدث خطأ أثناء رفع الصورة');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const serviceData = {
        ...formData,
        budget: Number(budget),
        deadline: new Date(deadline).toISOString(),
      };

      await professionalServiceService.createProfessionalService(serviceData);
      navigate('/my-services');
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'حدث خطأ أثناء إنشاء طلب الخدمة'
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl'
    },
    heading: {
      color: '#333',
      borderBottom: '1px solid #eee',
      paddingBottom: '15px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    alert: {
      padding: '10px 15px',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontFamily: 'inherit'
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontFamily: 'inherit',
      backgroundColor: '#fff'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontFamily: 'inherit',
      minHeight: '120px',
      resize: 'vertical'
    },
    button: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      width: '100%',
      fontWeight: 'bold',
      marginTop: '10px'
    },
    buttonDisabled: {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed'
    },
    small: {
      fontSize: '14px',
      color: '#666',
      display: 'block',
      marginTop: '5px'
    },
    loadingText: {
      textAlign: 'center',
      color: '#666',
      margin: '10px 0'
    },
    imagePreviewContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '10px'
    },
    imagePreview: {
      position: 'relative',
      width: '100px',
      height: '100px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    previewImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    removeButton: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      backgroundColor: 'rgba(255, 0, 0, 0.7)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px'
    },
    terms: {
      margin: '20px 0',
      padding: '10px',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px',
      fontSize: '14px',
      color: '#666'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>طلب خدمة احترافية</h2>
      {error && <div style={styles.alert}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="serviceType" style={styles.label}>نوع الخدمة</label>
          <select
            id="serviceType"
            name="serviceType"
            value={serviceType}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">اختر نوع الخدمة</option>
            <option value="تصميم مخصص">تصميم مخصص</option>
            <option value="تعديل ملابس">تعديل ملابس</option>
            <option value="استشارة تصميم">استشارة تصميم</option>
            <option value="خدمة خياطة خاصة">خدمة خياطة خاصة</option>
            <option value="أخرى">أخرى</option>
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="title" style={styles.label}>عنوان الطلب</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleChange}
            required
            placeholder="مثال: تصميم فستان زفاف مخصص"
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>وصف تفصيلي للطلب</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleChange}
            required
            rows="5"
            placeholder="اشرح بالتفصيل ما تريد. كلما كان وصفك دقيقًا، كلما كانت النتيجة أقرب لتوقعاتك."
            style={styles.textarea}
          ></textarea>
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="budget" style={styles.label}>الميزانية المتوقعة (ريال)</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={budget}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="deadline" style={styles.label}>الموعد النهائي المطلوب</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={deadline}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="image" style={styles.label}>صور توضيحية (اختياري)</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage}
            style={styles.input}
          />
          <small style={styles.small}>يمكنك إضافة صور مرجعية أو رسومات توضيحية للمساعدة في فهم طلبك.</small>
          
          {uploadingImage && <div style={styles.loadingText}>جاري رفع الصورة...</div>}
          
          <div style={styles.imagePreviewContainer}>
            {images.map((img, index) => (
              <div key={index} style={styles.imagePreview}>
                <img src={img} alt="صورة توضيحية" style={styles.previewImage} />
                <button 
                  type="button" 
                  style={styles.removeButton}
                  onClick={() => removeImage(index)}
                >
                  &#10005;
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.terms}>
          <p>
            بإرسال هذا الطلب، أنت توافق على أنه سيتم مراجعته من قبل فريق ترزي،
            وقد يتواصلون معك لمزيد من التفاصيل قبل تحديد السعر النهائي والموعد.
          </p>
        </div>
        
        <button 
          type="submit" 
          style={{
            ...styles.button,
            ...(loading || uploadingImage ? styles.buttonDisabled : {})
          }} 
          disabled={loading || uploadingImage}
        >
          {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
        </button>
      </form>
    </div>
  );
};

export default CreateProfessionalService;