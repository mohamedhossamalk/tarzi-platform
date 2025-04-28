// frontend/src/pages/Measurements/MeasurementCreate.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { measurementService } from '../../services/measurement.service';


const MeasurementCreate = () => {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, chest, waist, hips, shoulderWidth, sleeveLength, inseam, neckSize, notes } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await measurementService.createMeasurement({
        name,
        chest: parseFloat(chest),
        waist: parseFloat(waist),
        hips: parseFloat(hips),
        shoulderWidth: parseFloat(shoulderWidth),
        sleeveLength: parseFloat(sleeveLength),
        inseam: inseam ? parseFloat(inseam) : undefined,
        neckSize: neckSize ? parseFloat(neckSize) : undefined,
        notes,
      });

      navigate('/measurements');
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'حدث خطأ أثناء إنشاء المقاس'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="measurement-form-container">
      <h2>إضافة مقاس جديد</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="measurement-form">
        <div className="form-group">
          <label htmlFor="name">اسم مجموعة المقاسات</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            required
            placeholder="مثال: مقاسات الصيف، مقاسات رسمية، مقاسات العمل"
          />
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="chest">الصدر (سم)</label>
            <input
              type="number"
              id="chest"
              name="chest"
              value={chest}
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
              value={waist}
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
              value={hips}
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
              value={shoulderWidth}
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
              value={sleeveLength}
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
              value={inseam}
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
              value={neckSize}
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
            value={notes}
            onChange={handleChange}
            rows="3"
            placeholder="أي تفاصيل أخرى تريد إضافتها عن المقاسات"
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ المقاس'}
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

export default MeasurementCreate;