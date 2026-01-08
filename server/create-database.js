import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// postgres 데이터베이스에 연결 (기본 데이터베이스)
const adminPool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // 기본 데이터베이스에 연결
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const dbName = process.env.DB_NAME || 'coffee_order_app';

async function createDatabase() {
  try {
    console.log('PostgreSQL에 연결 중...');
    
    // 데이터베이스 존재 여부 확인
    const checkResult = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );
    
    if (checkResult.rows.length > 0) {
      console.log(`✅ 데이터베이스 '${dbName}'가 이미 존재합니다.`);
      await adminPool.end();
      return true;
    }
    
    // 데이터베이스 생성
    console.log(`데이터베이스 '${dbName}' 생성 중...`);
    await adminPool.query(`CREATE DATABASE ${dbName}`);
    console.log(`✅ 데이터베이스 '${dbName}'가 성공적으로 생성되었습니다.`);
    
    await adminPool.end();
    return true;
  } catch (error) {
    console.error('❌ 데이터베이스 생성 실패:', error.message);
    console.error('\n확인 사항:');
    console.error('1. PostgreSQL 서비스가 실행 중인지 확인하세요');
    console.error('2. .env 파일의 DB_PASSWORD가 올바른지 확인하세요');
    console.error('3. PostgreSQL 사용자(postgres)에 데이터베이스 생성 권한이 있는지 확인하세요');
    await adminPool.end();
    return false;
  }
}

createDatabase().then((success) => {
  process.exit(success ? 0 : 1);
});
