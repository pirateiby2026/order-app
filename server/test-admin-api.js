const API_BASE_URL = 'http://localhost:3000/api';

async function testAdminAPI() {
  try {
    console.log('=== 관리자 화면 API 테스트 ===\n');

    // 1. 주문 통계 조회
    console.log('1. 주문 통계 조회...');
    const statsRes = await fetch(`${API_BASE_URL}/orders/statistics`);
    const statsData = await statsRes.json();
    if (statsData.success) {
      console.log('✅ 통계:', statsData.data);
    } else {
      console.log('❌ 통계 조회 실패:', statsData.error);
    }

    // 2. 재고 조회
    console.log('\n2. 재고 조회...');
    const inventoryRes = await fetch(`${API_BASE_URL}/inventory`);
    const inventoryData = await inventoryRes.json();
    if (inventoryData.success) {
      console.log('✅ 재고 목록:', inventoryData.data.length, '개');
      inventoryData.data.forEach(item => {
        console.log(`   - ${item.menuName}: ${item.stock}개`);
      });
    } else {
      console.log('❌ 재고 조회 실패:', inventoryData.error);
    }

    // 3. 주문 목록 조회
    console.log('\n3. 주문 목록 조회...');
    const ordersRes = await fetch(`${API_BASE_URL}/orders`);
    const ordersData = await ordersRes.json();
    if (ordersData.success) {
      console.log('✅ 주문 목록:', ordersData.data.length, '개');
      ordersData.data.forEach(order => {
        console.log(`   - 주문 #${order.id}: ${order.status}, 금액: ${order.total_amount}원`);
      });
    } else {
      console.log('❌ 주문 목록 조회 실패:', ordersData.error);
    }

    console.log('\n=== 테스트 완료 ===');
  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
  }
}

testAdminAPI();
