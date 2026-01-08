import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import './OrderStatus.css';

function OrderStatus({ orders = [], onUpdateOrderStatus, onCancelOrder }) {
  const [localOrders, setLocalOrders] = useState(orders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedDates, setExpandedDates] = useState(new Set());

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

  const canCancel = (order) => {
    // completed 상태가 아닌 주문만 취소 가능
    return order.status !== 'completed';
  };

  // 날짜별로 주문 그룹화 및 통계 계산
  const groupOrdersByDate = (ordersList) => {
    const pendingOrders = [];
    const completedOrdersByDate = {};
    const dateStatistics = {}; // 날짜별 통계 정보

    ordersList.forEach(order => {
      const orderTime = order.orderTime || order.order_time;
      const date = new Date(orderTime);
      
      if (order.status === 'completed') {
        // 완료된 주문은 날짜별로 그룹화
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        if (!completedOrdersByDate[dateKey]) {
          completedOrdersByDate[dateKey] = [];
          dateStatistics[dateKey] = {
            menuCounts: {}, // 메뉴별 수량
            totalQuantity: 0, // 총 수량
            totalAmount: 0 // 총 금액
          };
        }
        completedOrdersByDate[dateKey].push(order);
        
        // 통계 계산
        const stats = dateStatistics[dateKey];
        const totalAmount = order.totalAmount || order.total_amount || 0;
        stats.totalAmount += totalAmount;
        
        // 주문 아이템별로 수량 집계
        const items = order.items || [];
        items.forEach(item => {
          const menuName = item.menuName;
          const quantity = item.quantity || 0;
          
          if (!stats.menuCounts[menuName]) {
            stats.menuCounts[menuName] = 0;
          }
          stats.menuCounts[menuName] += quantity;
          stats.totalQuantity += quantity;
        });
      } else {
        // 완료되지 않은 주문은 별도로 관리
        pendingOrders.push(order);
      }
    });

    // 완료된 주문을 날짜별로 정렬 (최신 날짜가 먼저)
    const sortedDates = Object.keys(completedOrdersByDate).sort((a, b) => {
      return new Date(b) - new Date(a);
    });

    // 각 날짜의 주문도 시간순으로 정렬 (최신이 먼저)
    sortedDates.forEach(date => {
      completedOrdersByDate[date].sort((a, b) => {
        const dateA = new Date(a.orderTime || a.order_time);
        const dateB = new Date(b.orderTime || b.order_time);
        return dateB - dateA;
      });
    });

    return { pendingOrders, completedOrdersByDate, sortedDates, dateStatistics };
  };

  // 날짜 토글 함수
  const toggleDate = (date) => {
    setExpandedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
  };

  // 최신 주문이 상단에 오도록 정렬 (완료되지 않은 주문만)
  const sortedPendingOrders = [...localOrders]
    .filter(order => order.status !== 'completed')
    .sort((a, b) => {
      try {
        const dateA = new Date(a.orderTime || a.order_time);
        const dateB = new Date(b.orderTime || b.order_time);
        return dateB - dateA;
      } catch {
        return 0;
      }
    });

  const { completedOrdersByDate, sortedDates, dateStatistics } = groupOrdersByDate(localOrders);
  
  // 메뉴별 수량 포맷팅 함수
  const formatMenuCounts = (menuCounts) => {
    const menuList = Object.entries(menuCounts)
      .sort((a, b) => b[1] - a[1]) // 수량이 많은 순으로 정렬
      .map(([name, count]) => `${name} ${count}개`)
      .join(', ');
    return menuList || '없음';
  };

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
        {/* 완료되지 않은 주문 */}
        {sortedPendingOrders.length > 0 && (
          <div className="order-section">
            <h3 className="order-section-title">진행 중인 주문</h3>
            {sortedPendingOrders.map(order => {
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
                    {canCancel(order) && onCancelOrder && (
                      <button
                        className="status-button cancel-button"
                        onClick={() => onCancelOrder(order.id)}
                        style={{ marginLeft: '0.5rem' }}
                      >
                        주문 취소
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 완료된 주문 (날짜별 트리 구조) */}
        {sortedDates.length > 0 && (
          <div className="order-section">
            <h3 className="order-section-title">완료된 주문</h3>
            {sortedDates.map(date => {
              const isExpanded = expandedDates.has(date);
              const ordersForDate = completedOrdersByDate[date];
              const stats = dateStatistics[date] || {
                menuCounts: {},
                totalQuantity: 0,
                totalAmount: 0
              };
              
              return (
                <div key={date} className="order-date-group">
                  <div 
                    className="order-date-header"
                    onClick={() => toggleDate(date)}
                  >
                    <span className="order-date-icon">{isExpanded ? '▼' : '▶'}</span>
                    <div className="order-date-main">
                      <div className="order-date-row">
                        <span className="order-date-text">{formatDate(date)}</span>
                        <span className="order-date-count">({ordersForDate.length}건)</span>
                      </div>
                      <div className="order-date-stats">
                        <span className="order-date-menu-counts">
                          {formatMenuCounts(stats.menuCounts)}
                        </span>
                        <span className="order-date-total-info">
                          총 {stats.totalQuantity}개 · {stats.totalAmount.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="order-date-content">
                      {ordersForDate.map(order => {
                        const orderTime = order.orderTime || order.order_time;
                        const totalAmount = order.totalAmount || order.total_amount;
                        const items = order.items || [];
                        
                        return (
                          <div key={order.id} className="order-item order-item-completed">
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
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 주문이 없는 경우 */}
        {sortedPendingOrders.length === 0 && sortedDates.length === 0 && (
          <p className="order-empty">주문이 없습니다</p>
        )}
      </div>
    </div>
  );
}

export default OrderStatus;
