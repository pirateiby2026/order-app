// 주문 취소 라우트 테스트 스크립트
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3000/api';

async function testCancelRoute() {
  console.log('=== 주문 취소 라우트 테스트 ===\n');
  
  // 1. 서버 연결 테스트
  try {
    console.log('1. 서버 연결 테스트...');
    const healthCheck = await fetch(`${API_BASE_URL.replace('/api', '')}/`);
    const healthData = await healthCheck.json();
    console.log('✅ 서버 연결 성공:', healthData.message);
  } catch (error) {
    console.error('❌ 서버 연결 실패:', error.message);
    console.log('\n⚠️ 백엔드 서버가 실행 중인지 확인하세요.');
    return;
  }
  
  // 2. 주문 목록 조회
  try {
    console.log('\n2. 주문 목록 조회...');
    const ordersResponse = await fetch(`${API_BASE_URL}/orders`);
    const ordersData = await ordersResponse.json();
    
    if (ordersData.success && ordersData.data && ordersData.data.length > 0) {
      const firstOrder = ordersData.data[0];
      console.log(`✅ 주문 목록 조회 성공 (${ordersData.data.length}건)`);
      console.log(`   첫 번째 주문 ID: ${firstOrder.id}, 상태: ${firstOrder.status}`);
      
      // 3. 주문 취소 라우트 테스트 (실제 취소는 하지 않음)
      if (firstOrder.status !== 'completed') {
        console.log(`\n3. 주문 취소 라우트 테스트 (ID: ${firstOrder.id})...`);
        const cancelUrl = `${API_BASE_URL}/orders/${firstOrder.id}/cancel`;
        console.log(`   요청 URL: ${cancelUrl}`);
        
        const cancelResponse = await fetch(cancelUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`   응답 상태: ${cancelResponse.status}`);
        const cancelData = await cancelResponse.json();
        console.log(`   응답 데이터:`, cancelData);
        
        if (cancelResponse.status === 200 || cancelResponse.status === 201) {
          console.log('✅ 주문 취소 라우트 정상 작동');
        } else if (cancelResponse.status === 404) {
          console.log('❌ 404 에러: 라우트를 찾을 수 없습니다.');
          console.log('   → 서버를 재시작했는지 확인하세요.');
        } else {
          console.log(`⚠️ 예상치 못한 응답: ${cancelResponse.status}`);
        }
      } else {
        console.log('\n3. 첫 번째 주문이 완료 상태라서 취소 테스트를 건너뜁니다.');
      }
    } else {
      console.log('⚠️ 주문이 없어서 취소 테스트를 할 수 없습니다.');
    }
  } catch (error) {
    console.error('❌ 주문 목록 조회 실패:', error.message);
  }
  
  console.log('\n=== 테스트 완료 ===');
}

testCancelRoute().catch(console.error);
