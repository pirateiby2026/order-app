const API_BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  try {
    console.log('=== API 테스트 시작 ===\n');

    // 1. 메뉴 목록 조회
    console.log('1. 메뉴 목록 조회...');
    const menusRes = await fetch(`${API_BASE_URL}/menus`);
    const menusData = await menusRes.json();
    console.log('✅ 메뉴 목록:', menusData.data.length, '개');
    console.log('   첫 번째 메뉴:', menusData.data[0]?.name);

    // 2. 옵션 목록 조회
    console.log('\n2. 옵션 목록 조회...');
    const optionsRes = await fetch(`${API_BASE_URL}/options`);
    const optionsData = await optionsRes.json();
    console.log('✅ 옵션 목록:', optionsData.data.length, '개');

    // 3. 재고 조회
    console.log('\n3. 재고 조회...');
    const inventoryRes = await fetch(`${API_BASE_URL}/inventory`);
    const inventoryData = await inventoryRes.json();
    console.log('✅ 재고 목록:', inventoryData.data.length, '개');

    // 4. 주문 목록 조회
    console.log('\n4. 주문 목록 조회...');
    const ordersRes = await fetch(`${API_BASE_URL}/orders`);
    const ordersData = await ordersRes.json();
    console.log('✅ 주문 목록:', ordersData.data.length, '개');

    console.log('\n=== API 테스트 완료 ===');
  } catch (error) {
    console.error('❌ API 테스트 실패:', error.message);
  }
}

testAPI();
