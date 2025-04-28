// frontend/src/pages/Measurements/MeasurementEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { measurementService } from '../../services/measurement.service';
// 

const MeasurementEdit = () => {
  const [formData, setFormData] = useState({
    name: '',
    chest: '',
    waist: '',
    hips: '',
    shoulderWidth: '',
    sleeveLength: '',
    inseam: '',
    neckSize: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchMeasurement = async () => {
      try {
        const data = await measurementService.getMeasurementById(id);
        setFormData({
          name: data.name,
          chest: data.chest,
          waist: data.waist,
          hips: data.hips,
          shoulderWidth: data.shoulderWidth,
          sleeveLength: data.sleeveLength,
          inseam: data.inseam || '',
          neckSize: data.neckSize || '',
          notes: data.notes || '',
        });
      } catch (err) {
        setError('حدث خطأ أثناء جلب بيانات المقاس');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurement();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await measurementService.updateMeasurement(id, {
        name: formData.name,
        chest: parseFloat(formData.chest),
        waist: parseFloat(formData.waist),
        hips: parseFloat(formData.hips),
        shoulderWidth: parseFloat(formData.shoulderWidth),
        sleeveLength: parseFloat(formData.sleeveLength),
        inseam: formData.inseam ? parseFloat(formData.inseam) : undefined,
        neckSize: formData.neckSize ? parseFloat(formData.neckSize) : undefined,
        notes: formData.notes,
      });

      navigate('/measurements');
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'حدث خطأ أثناء تحديث المقاس'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  return (
    <div className="measurement-form-container">
      <h2>تعديل المقاس</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="measurement-form">
        <div className="form-group">
          <label htmlFor="name">اسم مجموعة المقاسات</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="chest">الصدر (سم)</label>
            <input
              type="number"
              id="chest"
              name="chest"
              value={formData.chest}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="waist">الخصر (سم)</label>
            <input
              type="number"
              id="waist"
              name="waist"
              value={formData.waist}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="hips">الأرداف (سم)</label>
            <input
              type="number"
              id="hips"
              name="hips"
              value={formData.hips}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="shoulderWidth">عرض الكتفين (سم)</label>
            <input
              type="number"
              id="shoulderWidth"
              name="shoulderWidth"
              value={formData.shoulderWidth}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="sleeveLength">طول الأكمام (سم)</label>
            <input
              type="number"
              id="sleeveLength"
              name="sleeveLength"
              value={formData.sleeveLength}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="inseam">طول الساق الداخلي (سم)</label>
            <input
              type="number"
              id="inseam"
              name="inseam"
              value={formData.inseam}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="neckSize">مقاس الرقبة (سم)</label>
            <input
              type="number"
              id="neckSize"
              name="neckSize"
              value={formData.neckSize}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">ملاحظات إضافية</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/measurements')}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeasurementEdit;