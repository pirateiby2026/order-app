import { pool } from './database.js';

async function removeOptions() {
  try {
    console.log('옵션 삭제 중...');
    
    // "샷 추가"와 "시럽 추가" 옵션 삭제
    const result = await pool.query(
      `DELETE FROM options 
       WHERE name IN ('샷 추가', '시럽 추가')`
    );
    
    console.log(`✅ ${result.rowCount}개의 옵션이 삭제되었습니다.`);
    
    // 남은 옵션 확인
    const remainingOptions = await pool.query('SELECT * FROM options');
    console.log(`\n남은 옵션: ${remainingOptions.rows.length}개`);
    remainingOptions.rows.forEach(opt => {
      console.log(`  - ${opt.name} (ID: ${opt.id})`);
    });
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ 옵션 삭제 실패:', error);
    await pool.end();
    process.exit(1);
  }
}

removeOptions();
