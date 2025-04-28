// frontend/src/pages/Orders/OrderList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/order.service';
import './Orders.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (err) {
        setError('حدث خطأ أثناء جلب الطلبات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  return (
    <div className="orders-container">
      <h2>طلباتي</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>لا توجد طلبات حتى الآن.</p>
          <Link to="/products" className="btn btn-primary">
            استعرض التصاميم
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>طلب #{order._id.substring(0, 8)}</h3>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-details">
                <div className="order-product">
                  <img
                    src={order.productId.imageUrl}
                    alt={order.productId.name}
                    className="order-product-image"
                  />
                  <div className="order-product-info">
                    <h4>{order.productId.name}</h4>
                    <p>القماش: {order.fabricChoice}</p>
                    <p>اللون: {order.colorChoice}</p>
                  </div>
                </div>
                <div className="order-info">
                  <div className="order-info-row">
                    <span>تاريخ الطلب:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="order-info-row">
                    <span>الإجمالي:</span>
                    <span>{order.totalPrice} ريال</span>
                  </div>
                  {order.expectedDeliveryDate && (
                    <div className="order-info-row">
                      <span>تاريخ التسليم المتوقع:</span>
                      <span>{new Date(order.expectedDeliveryDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="order-actions">
                <Link to={`/order/${order._id}`} className="btn btn-primary">
                  عرض التفاصيل
                </Link>
                {(order.status === 'جديد' || order.status === 'قيد المعالجة') && (
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
                        orderService.cancelOrder(order._id)
                          .then(() => {
                            setOrders(orders.map(o => 
                              o._id === order._id ? { ...o, status: 'ملغي' } : o
                            ));
                          })
                          .catch(err => {
                            setError('حدث خطأ أثناء إلغاء الطلب');
                            console.error(err);
                          });
                      }
                    }}
                  >
                    إلغاء الطلب
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;