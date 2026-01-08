import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// PostgreSQL 연결 풀 생성
// Render.com의 DATABASE_URL을 우선 사용, 없으면 개별 환경 변수 사용
let poolConfig;

// DATABASE_URL 정리 함수 (호스트명의 @ 기호 제거)
function cleanDatabaseUrl(url) {
  if (!url) return url;
  
  // URL 형식: postgresql://user:password@host:port/database
  // 호스트명에 @ 기호가 포함된 경우 제거
  try {
    const urlObj = new URL(url);
    // 호스트명에서 @ 제거
    if (urlObj.hostname && urlObj.hostname.startsWith('@')) {
      urlObj.hostname = urlObj.hostname.replace(/^@+/, '');
      return urlObj.toString();
    }
    return url;
  } catch (error) {
    // URL 파싱 실패 시 문자열 치환으로 처리
    return url.replace(/@([^:]+)/g, '$1');
  }
}

if (process.env.DATABASE_URL) {
  // Render.com의 Internal Database URL 사용
  // 호스트명의 @ 기호 제거 및 SSL 설정
  const cleanedUrl = cleanDatabaseUrl(process.env.DATABASE_URL);
  poolConfig = {
    connectionString: cleanedUrl,
    ssl: { rejectUnauthorized: false }
  };
} else {
  // 개별 환경 변수 사용 (로컬 개발)
  // DB_HOST에서 @ 제거 (Render.com 호스트명에 @가 포함될 수 있음)
  const host = process.env.DB_HOST ? process.env.DB_HOST.replace(/^@+/, '') : 'localhost';
  // DB_NAME에서 공백 제거 및 정리
  const database = process.env.DB_NAME ? process.env.DB_NAME.replace(/\s+/g, '_') : 'coffee_order_app';
  
  poolConfig = {
    user: process.env.DB_USER || 'postgres',
    host: host,
    database: database,
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
    ssl: host.includes('render.com') ? { rejectUnauthorized: false } : false
  };
}

export const pool = new Pool(poolConfig);

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
