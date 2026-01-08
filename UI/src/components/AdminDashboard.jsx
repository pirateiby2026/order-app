import './AdminDashboard.css';

function AdminDashboard({ orders }) {
  // 통계 계산
  const totalOrders = orders.length;
  // pending 상태도 주문 접수로 카운트 (와이어프레임 기준)
  const receivedOrders = orders.filter(order => order.status === 'received' || order.status === 'pending').length;
  const preparingOrders = orders.filter(order => order.status === 'preparing').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        총 주문 <strong>{totalOrders}</strong> / 주문 접수 <strong>{receivedOrders}</strong> / 제조 중 <strong>{preparingOrders}</strong> / 제조 완료 <strong>{completedOrders}</strong>
      </div>
    </div>
  );
}

export default AdminDashboard;
