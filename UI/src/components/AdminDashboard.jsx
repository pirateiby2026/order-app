import { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import './AdminDashboard.css';

function AdminDashboard({ orders = [] }) {
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    receivedOrders: 0,
    preparingOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const stats = await orderAPI.getOrderStatistics();
        // PRD에 따르면 주문 접수는 "received" 상태만 카운트
        setStatistics({
          totalOrders: stats.totalOrders,
          receivedOrders: stats.receivedOrders,
          preparingOrders: stats.preparingOrders,
          completedOrders: stats.completedOrders
        });
      } catch (err) {
        console.error('통계 로드 실패:', err);
        setError(err.message);
        // 폴백: 로컬 orders로 계산
        const totalOrders = orders.length;
        const receivedOrders = orders.filter(order => order.status === 'received').length;
        const preparingOrders = orders.filter(order => order.status === 'preparing').length;
        const completedOrders = orders.filter(order => order.status === 'completed').length;
        setStatistics({ totalOrders, receivedOrders, preparingOrders, completedOrders });
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [orders]);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h2 className="dashboard-title">관리자 대시보드</h2>
        <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
          통계를 불러오는 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <h2 className="dashboard-title">관리자 대시보드</h2>
        <div style={{ padding: '1rem', textAlign: 'center', color: '#d32f2f' }}>
          통계 로드 실패: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        총 주문 <strong>{statistics.totalOrders}</strong> / 주문 접수 <strong>{statistics.receivedOrders}</strong> / 제조 중 <strong>{statistics.preparingOrders}</strong> / 제조 완료 <strong>{statistics.completedOrders}</strong>
      </div>
    </div>
  );
}

export default AdminDashboard;
