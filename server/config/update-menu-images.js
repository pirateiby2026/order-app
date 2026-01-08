import { pool } from './database.js';

async function updateMenuImages() {
  try {
    console.log('메뉴 이미지 경로 업데이트 중...');
    
    // 메뉴별 이미지 경로 매핑
    const menuImages = {
      '아메리카노(ICE)': '/americano-ice.jpg',
      '아메리카노(HOT)': '/americano-hot.jpg',
      '카페라떼': '/caffe-latte.jpg'
    };
    
    // 각 메뉴의 이미지 경로 업데이트
    for (const [menuName, imagePath] of Object.entries(menuImages)) {
      const result = await pool.query(
        'UPDATE menus SET image = $1 WHERE name = $2 RETURNING id, name, image',
        [imagePath, menuName]
      );
      
      if (result.rows.length > 0) {
        console.log(`✅ ${menuName}: ${imagePath}`);
      } else {
        console.log(`⚠️ 메뉴를 찾을 수 없음: ${menuName}`);
      }
    }
    
    console.log('\n✅ 메뉴 이미지 경로 업데이트 완료');
    
    // 업데이트된 메뉴 확인
    const menus = await pool.query('SELECT id, name, image FROM menus ORDER BY id');
    console.log('\n업데이트된 메뉴 목록:');
    menus.rows.forEach(menu => {
      console.log(`  - ${menu.name}: ${menu.image || '(이미지 없음)'}`);
    });
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ 이미지 경로 업데이트 실패:', error);
    await pool.end();
    process.exit(1);
  }
}

updateMenuImages();
