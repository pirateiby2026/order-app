import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import './OrderStatus.css';

function OrderStatus({ orders = [], onUpdateOrderStatus }) {
  const [localOrders, setLocalOrders] = useState(orders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // orders prop이 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  // orders가 비어있으면 API에서 로드 시도
  useEffect(() => {
    const loadOrdersIfNeeded = async () => {
      if (!orders || orders.length === 0) {
        try {
          setLoading(true);
          setError(null);
          const ordersData = await orderAPI.getAllOrders();
          setLocalOrders(ordersData);
        } catch (err) {
          console.error('주문 목록 로드 실패:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadOrdersIfNeeded();
  }, [orders]);

  const formatOrderTime = (orderTime) => {
    try {
      const date = new Date(orderTime);
      if (isNaN(date.getTime())) {
        return '시간 정보 없음';
      }
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${month}월 ${day}일 ${hours}:${minutes}`;
    } catch (err) {
      return '시간 정보 없음';
    }
  };

  const formatOrderItems = (items) => {
    if (!items || items.length === 0) return '주문 항목 없음';
    return items.map(item => `${item.menuName} x ${item.quantity}`).join(', ');
  };

  const getStatusButton = (order) => {
    switch (order.status) {
      case 'pending':
        return (
          <button
            className="status-button received-button"
            onClick={() => onUpdateOrderStatus(order.id, 'received')}
          >
            주문 접수
          </button>
        );
      case 'received':
        return (
          <button
            className="status-button preparing-button"
            onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
          >
            제조 시작
          </button>
        );
      case 'preparing':
        return (
          <button
            className="status-button completed-button"
            onClick={() => onUpdateOrderStatus(order.id, 'completed')}
          >
            제조 완료
          </button>
        );
      case 'completed':
        return (
          <span className="status-completed">완료</span>
        );
      default:
        return null;
    }
  };

  // 최신 주문이 상단에 오도록 정렬
  const sortedOrders = [...localOrders].sort((a, b) => {
    try {
      const dateA = new Date(a.orderTime || a.order_time);
      const dateB = new Date(b.orderTime || b.order_time);
      return dateB - dateA;
    } catch {
      return 0;
    }
  });

  if (loading) {
    return (
      <div className="order-status">
        <h2 className="order-title">주문 현황</h2>
        <p style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
          주문 목록을 불러오는 중...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-status">
        <h2 className="order-title">주문 현황</h2>
        <p style={{ padding: '1rem', textAlign: 'center', color: '#d32f2f' }}>
          주문 목록을 불러올 수 없습니다: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="order-status">
      <h2 className="order-title">주문 현황</h2>
      <div className="order-list">
        {sortedOrders.length === 0 ? (
          <p className="order-empty">주문이 없습니다</p>
        ) : (
          sortedOrders.map(order => {
            const orderTime = order.orderTime || order.order_time;
            const totalAmount = order.totalAmount || order.total_amount;
            const items = order.items || [];
            
            return (
              <div key={order.id} className="order-item">
                <div className="order-info">
                  <span className="order-time">{formatOrderTime(orderTime)}</span>
                  <span className="order-items">{formatOrderItems(items)}</span>
                  <span className="order-amount">{totalAmount?.toLocaleString() || 0}원</span>
                </div>
                <div className="order-action">
                  {getStatusButton(order)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default OrderStatus;
