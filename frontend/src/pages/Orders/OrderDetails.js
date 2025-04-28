// frontend/src/pages/Orders/OrderDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { orderService } from '../../services/order.service';
import './Orders.css';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError('حدث خطأ أثناء جلب تفاصيل الطلب');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleCancel = async () => {
    if (window.confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
      try {
        await orderService.cancelOrder(id);
        setOrder({ ...order, status: 'ملغي' });
      } catch (err) {
        setError('حدث خطأ أثناء إلغاء الطلب');
        console.error(err);
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'جديد':
        return 'status-new';
      case 'قيد المعالجة':
        return 'status-processing';
      case 'قيد التنفيذ':
        return 'status-in-progress';
      case 'جاهز للتسليم':
        return 'status-ready';
      case 'تم التسليم':
        return 'status-delivered';
      case 'ملغي':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  if (!order) {
    return (
      <div className="error-container">
        <h2>خطأ</h2>
        <p>{error || 'الطلب غير موجود'}</p>
        <Link to="/orders" className="btn btn-primary">
          العودة للطلبات
        </Link>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      {location.state?.newOrder && (
        <div className="alert alert-success">
          تم إنشاء طلبك بنجاح! سنقوم بمراجعته والبدء في تنفيذه في أقرب وقت.
        </div>
      )}

      <div className="order-details-header">
        <h2>
          تفاصيل الطلب #{order._id.substring(0, 8)}
        </h2>
        <span className={`order-status ${getStatusClass(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="order-details-card">
        <h3>معلومات المنتج</h3>
        <div className="product-details">
          <img
            src={order.productId.imageUrl}
            alt={order.productId.name}
            className="product-image"
          />
          <div className="product-info">
            <h4>{order.productId.name}</h4>
            <p className="price">{order.totalPrice} ريال</p>
            <div className="product-specs">
              <div className="spec">
                <span>القماش:</span>
                <span>{order.fabricChoice}</span>
              </div>
              <div className="spec">
                <span>اللون:</span>
                <span>{order.colorChoice}</span>
              </div>
              <div className="spec">
                <span>الفئة:</span>
                <span>{order.productId.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="order-details-card">
        <h3>معلومات المقاسات</h3>
        <div className="measurement-details">
          <h4>{order.measurementId.name}</h4>
          <div className="measurements-grid">
            <div className="measurement-item">
              <span>الصدر:</span>
              <span>{order.measurementId.chest} سم</span>
            </div>
            <div className="measurement-item">
              <span>الخصر:</span>
              <span>{order.measurementId.waist} سم</span>
            </div>
            <div className="measurement-item">
              <span>الأرداف:</span>
              <span>{order.measurementId.hips} سم</span>
            </div>
            <div className="measurement-item">
              <span>عرض الكتفين:</span>
              <span>{order.measurementId.shoulderWidth} سم</span>
            </div>
            <div className="measurement-item">
              <span>طول الأكمام:</span>
              <span>{order.measurementId.sleeveLength} سم</span>
            </div>
            {order.measurementId.inseam && (
              <div className="measurement-item">
                <span>طول الساق الداخلي:</span>
                <span>{order.measurementId.inseam} سم</span>
              </div>
            )}
            {order.measurementId.neckSize && (
              <div className="measurement-item">
                <span>مقاس الرقبة:</span>
                <span>{order.measurementId.neckSize} سم</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {order.additionalRequests && (
        <div className="order-details-card">
          <h3>طلبات إضافية</h3>
          <p>{order.additionalRequests}</p>
        </div>
      )}

      <div className="order-details-card">
        <h3>معلومات الطلب</h3>
        <div className="order-info-grid">
          <div className="info-item">
            <span>تاريخ الطلب:</span>
            <span>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
          </div>
          <div className="info-item">
            <span>حالة الدفع:</span>
            <span className={order.paymentStatus === 'مدفوع' ? 'paid' : 'unpaid'}>
              {order.paymentStatus}
            </span>
          </div>
          {order.expectedDeliveryDate && (
            <div className="info-item">
              <span>تاريخ التسليم المتوقع:</span>
              <span>{new Date(order.expectedDeliveryDate).toLocaleDateString('ar-SA')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="order-details-actions">
        <Link to="/orders" className="btn btn-secondary">
          العودة للطلبات
        </Link>
        {(order.status === 'جديد' || order.status === 'قيد المعالجة') && (
          <button onClick={handleCancel} className="btn btn-danger">
            إلغاء الطلب
          </button>
        )}
        {order.status !== 'ملغي' && order.paymentStatus === 'غير مدفوع' && (
          <button className="btn btn-primary">
            الدفع الآن
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;