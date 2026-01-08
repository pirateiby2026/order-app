import './OrderStatus.css';

function OrderStatus({ orders, onUpdateOrderStatus }) {
  const formatOrderTime = (orderTime) => {
    const date = new Date(orderTime);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  const formatOrderItems = (items) => {
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
            음료 수령
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
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.orderTime) - new Date(a.orderTime)
  );

  return (
    <div className="order-status">
      <h2 className="order-title">주문 현황</h2>
      <div className="order-list">
        {sortedOrders.length === 0 ? (
          <p className="order-empty">주문이 없습니다</p>
        ) : (
          sortedOrders.map(order => (
            <div key={order.id} className="order-item">
              <div className="order-info">
                <span className="order-time">{formatOrderTime(order.orderTime)}</span>
                <span className="order-items">{formatOrderItems(order.items)}</span>
                <span className="order-amount">{order.totalAmount.toLocaleString()}원</span>
              </div>
              <div className="order-action">
                {getStatusButton(order)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrderStatus;
