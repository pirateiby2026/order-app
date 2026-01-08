// 데이터베이스 상태 및 데이터 확인 스크립트
import { pool } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  console.log('=== 데이터베이스 확인 ===\n');
  
  try {
    // 1. 연결 테스트
    console.log('1. 데이터베이스 연결 테스트...');
    const connectionTest = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ 데이터베이스 연결 성공');
    console.log(`   현재 시간: ${connectionTest.rows[0].current_time}`);
    console.log(`   PostgreSQL 버전: ${connectionTest.rows[0].pg_version.split(',')[0]}\n`);

    // 2. 테이블 목록 확인
    console.log('2. 테이블 목록 확인...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log(`✅ 테이블 개수: ${tables.rows.length}`);
    tables.rows.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });
    console.log('');

    // 3. 메뉴 데이터 확인
    console.log('3. 메뉴 데이터 확인...');
    const menus = await pool.query('SELECT id, name, price, stock FROM menus ORDER BY id');
    console.log(`✅ 메뉴 개수: ${menus.rows.length}`);
    if (menus.rows.length > 0) {
      menus.rows.forEach(menu => {
        console.log(`   [${menu.id}] ${menu.name} - ${menu.price.toLocaleString()}원 (재고: ${menu.stock}개)`);
      });
    }
    console.log('');

    // 4. 옵션 데이터 확인
    console.log('4. 옵션 데이터 확인...');
    const options = await pool.query('SELECT id, name, price, menu_id FROM options ORDER BY id');
    console.log(`✅ 옵션 개수: ${options.rows.length}`);
    if (options.rows.length > 0) {
      options.rows.forEach(option => {
        console.log(`   [${option.id}] ${option.name} - ${option.price.toLocaleString()}원 (메뉴 ID: ${option.menu_id || '전체'})`);
      });
    }
    console.log('');

    // 5. 주문 데이터 확인
    console.log('5. 주문 데이터 확인...');
    const orders = await pool.query(`
      SELECT 
        id, 
        order_time, 
        total_amount, 
        status,
        created_at
      FROM orders 
      ORDER BY order_time DESC 
      LIMIT 10
    `);
    console.log(`✅ 최근 주문 개수: ${orders.rows.length} (최대 10개)`);
    if (orders.rows.length > 0) {
      orders.rows.forEach(order => {
        const orderTime = new Date(order.order_time).toLocaleString('ko-KR');
        console.log(`   [${order.id}] ${orderTime} - ${order.total_amount.toLocaleString()}원 (${order.status})`);
      });
    } else {
      console.log('   주문이 없습니다.');
    }
    console.log('');

    // 6. 주문 통계
    console.log('6. 주문 통계...');
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'received') as received,
        COUNT(*) FILTER (WHERE status = 'preparing') as preparing,
        COUNT(*) FILTER (WHERE status = 'completed') as completed
      FROM orders
    `);
    const stat = stats.rows[0];
    console.log(`   총 주문: ${stat.total}건`);
    console.log(`   - 대기 중: ${stat.pending}건`);
    console.log(`   - 접수됨: ${stat.received}건`);
    console.log(`   - 제조 중: ${stat.preparing}건`);
    console.log(`   - 완료: ${stat.completed}건`);
    console.log('');

    // 7. 주문 아이템 확인 (최근 주문)
    if (orders.rows.length > 0) {
      console.log('7. 최근 주문의 아이템 확인...');
      const firstOrderId = orders.rows[0].id;
      const orderItems = await pool.query(`
        SELECT 
          oi.id,
          oi.menu_name,
          oi.quantity,
          oi.item_price,
          oi.total_price
        FROM order_items oi
        WHERE oi.order_id = $1
        ORDER BY oi.id
      `, [firstOrderId]);
      
      console.log(`   주문 ID ${firstOrderId}의 아이템:`);
      orderItems.rows.forEach(item => {
        console.log(`   - ${item.menu_name} x ${item.quantity} = ${item.total_price.toLocaleString()}원`);
      });
      console.log('');
    }

    // 8. 재고 현황
    console.log('8. 재고 현황...');
    const inventory = await pool.query(`
      SELECT 
        name,
        stock,
        CASE 
          WHEN stock = 0 THEN '품절'
          WHEN stock < 5 THEN '주의'
          ELSE '정상'
        END as status
      FROM menus
      ORDER BY stock ASC, name
    `);
    inventory.rows.forEach(item => {
      const statusIcon = item.status === '품절' ? '🔴' : item.status === '주의' ? '🟡' : '🟢';
      console.log(`   ${statusIcon} ${item.name}: ${item.stock}개 (${item.status})`);
    });

    console.log('\n=== 확인 완료 ===');
    
  } catch (error) {
    console.error('❌ 데이터베이스 확인 중 오류 발생:', error.message);
    console.error('   상세:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n⚠️ PostgreSQL 서버에 연결할 수 없습니다.');
      console.log('   → PostgreSQL이 실행 중인지 확인하세요.');
    } else if (error.code === '3D000') {
      console.log('\n⚠️ 데이터베이스가 존재하지 않습니다.');
      console.log('   → DATABASE_SETUP.md 파일을 참조하여 데이터베이스를 생성하세요.');
    } else if (error.code === '28P01') {
      console.log('\n⚠️ 인증 실패입니다.');
      console.log('   → .env 파일의 DB_USER와 DB_PASSWORD를 확인하세요.');
    }
  } finally {
    await pool.end();
    process.exit(0);
  }
}

checkDatabase();
