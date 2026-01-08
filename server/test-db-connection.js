import { testConnection } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('데이터베이스 연결 테스트를 시작합니다...\n');
console.log('환경 변수 확인:');
console.log(`DB_USER: ${process.env.DB_USER || 'postgres'}`);
console.log(`DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
console.log(`DB_NAME: ${process.env.DB_NAME || 'coffee_order_app'}`);
console.log(`DB_PORT: ${process.env.DB_PORT || 5432}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '***설정됨***' : '***설정되지 않음***'}\n`);

testConnection().then((connected) => {
  if (connected) {
    console.log('\n✅ 데이터베이스 연결 성공!');
    process.exit(0);
  } else {
    console.log('\n❌ 데이터베이스 연결 실패');
    console.log('\n확인 사항:');
    console.log('1. PostgreSQL이 실행 중인지 확인하세요');
    console.log('2. server/.env 파일이 존재하는지 확인하세요');
    console.log('3. .env 파일의 DB_PASSWORD가 올바른지 확인하세요');
    console.log('4. coffee_order_app 데이터베이스가 생성되었는지 확인하세요');
    console.log('   (psql에서 실행: CREATE DATABASE coffee_order_app;)');
    process.exit(1);
  }
});
