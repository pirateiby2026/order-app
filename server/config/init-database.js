import { pool } from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  try {
    console.log('데이터베이스 스키마 생성 중...');
    
    // SQL 파일 읽기
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );
    
    // 스키마 실행
    await pool.query(schemaSQL);
    console.log('✅ 데이터베이스 스키마 생성 완료');
    
    // 초기 데이터 삽입
    console.log('초기 데이터 삽입 중...');
    
    // 메뉴 데이터 삽입
    const menuResult = await pool.query(`
      INSERT INTO menus (name, description, price, image, stock)
      VALUES 
        ('아메리카노(ICE)', '시원한 아이스 아메리카노', 4000, NULL, 10),
        ('아메리카노(HOT)', '따뜻한 핫 아메리카노', 4000, NULL, 10),
        ('카페라떼', '부드러운 카페라떼', 5000, NULL, 10)
      ON CONFLICT DO NOTHING
      RETURNING id, name
    `);
    
    console.log('✅ 메뉴 데이터 삽입 완료');
    
    // 옵션 데이터 삽입 (모든 메뉴에 적용 가능한 옵션)
    await pool.query(`
      INSERT INTO options (name, price, menu_id)
      VALUES 
        ('샷 추가', 500, NULL),
        ('시럽 추가', 0, NULL)
      ON CONFLICT DO NOTHING
    `);
    
    console.log('✅ 옵션 데이터 삽입 완료');
    
    console.log('\n✅ 데이터베이스 초기화 완료!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error);
    await pool.end();
    process.exit(1);
  }
}

initDatabase();
