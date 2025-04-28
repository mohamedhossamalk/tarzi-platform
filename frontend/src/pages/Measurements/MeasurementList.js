// frontend/src/pages/Measurements/MeasurementList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { measurementService } from '../../services/measurement.service';


const MeasurementList = () => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const data = await measurementService.getMeasurements();
        setMeasurements(data);
      } catch (err) {
        setError('حدث خطأ أثناء جلب المقاسات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقاس؟')) {
      try {
        await measurementService.deleteMeasurement(id);
        setMeasurements(measurements.filter((m) => m._id !== id));
      } catch (err) {
        setError('حدث خطأ أثناء حذف المقاس');
        console.error(err);
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const updatedMeasurement = await measurementService.setDefaultMeasurement(id);
      setMeasurements(
        measurements.map((m) => ({
          ...m,
          isDefault: m._id === id,
        }))
      );
    } catch (err) {
      setError('حدث خطأ أثناء تعيين المقاس كافتراضي');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  return (
    <div className="measurement-list-container">
      <h2>مقاساتي</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <Link to="/measurement/create" className="btn btn-primary">
        إضافة مقاس جديد
      </Link>

      {measurements.length === 0 ? (
        <div className="no-measurements">
          <p>لا يوجد مقاسات مسجلة بعد.</p>
          <p>
            قم بإضافة مقاساتك الخاصة للاستخدام في طلبات الملابس المخصصة.
          </p>
        </div>
      ) : (
        <div className="measurement-cards">
          {measurements.map((measurement) => (
            <div
              key={measurement._id}
              className={`measurement-card ${
                measurement.isDefault ? 'default' : ''
              }`}
            >
              <div className="measurement-header">
                <h3>{measurement.name}</h3>
                {measurement.isDefault && (
                  <span className="default-badge">افتراضي</span>
                )}
              </div>
              <div className="measurement-details">
                <div className="measurement-row">
                  <span>الصدر:</span>
                  <span>{measurement.chest} سم</span>
                </div>
                <div className="measurement-row">
                  <span>الخصر:</span>
                  <span>{measurement.waist} سم</span>
                </div>
                <div className="measurement-row">
                  <span>الأرداف:</span>
                  <span>{measurement.hips} سم</span>
                </div>
                <div className="measurement-row">
                  <span>عرض الكتفين:</span>
                  <span>{measurement.shoulderWidth} سم</span>
                </div>
                <div className="measurement-row">
                  <span>طول الأكمام:</span>
                  <span>{measurement.sleeveLength} سم</span>
                </div>
                {measurement.inseam && (
                  <div className="measurement-row">
                    <span>طول الساق الداخلي:</span>
                    <span>{measurement.inseam} سم</span>
                  </div>
                )}
                {measurement.neckSize && (
                  <div className="measurement-row">
                    <span>مقاس الرقبة:</span>
                    <span>{measurement.neckSize} سم</span>
                  </div>
                )}
              </div>
              {measurement.notes && (
                <div className="measurement-notes">
                  <p>{measurement.notes}</p>
                </div>
              )}
              <div className="measurement-actions">
                <Link
                  to={`/measurement/${measurement._id}/edit`}
                  className="btn btn-sm btn-primary"
                >
                  تعديل
                </Link>
                {!measurement.isDefault && (
                  <>
                    <button
                      onClick={() => handleSetDefault(measurement._id)}
                      className="btn btn-sm btn-secondary"
                    >
                      تعيين كافتراضي
                    </button>
                    <button
                      onClick={() => handleDelete(measurement._id)}
                      className="btn btn-sm btn-danger"
                    >
                      حذف
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeasurementList;