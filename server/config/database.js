import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// PostgreSQL 연결 풀 생성
export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'coffee_order_app',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// 연결 풀 이벤트 리스너
pool.on('connect', () => {
  console.log('PostgreSQL 데이터베이스에 연결되었습니다.');
});

pool.on('error', (err) => {
  console.error('예상치 못한 데이터베이스 연결 오류:', err);
  process.exit(-1);
});

// 연결 테스트 함수
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('데이터베이스 연결 테스트 성공:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('데이터베이스 연결 테스트 실패:', error);
    return false;
  }
};

export default pool;
