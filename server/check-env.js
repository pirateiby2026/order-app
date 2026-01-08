// .env 파일의 DATABASE_URL 형식 확인 스크립트
import dotenv from 'dotenv';

dotenv.config();

console.log('=== 환경 변수 확인 ===\n');

if (process.env.DATABASE_URL) {
  console.log('✅ DATABASE_URL이 설정되어 있습니다.');
  console.log('\nDATABASE_URL (일부만 표시):');
  
  // 보안을 위해 일부만 표시
  const url = process.env.DATABASE_URL;
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    console.log('✅ 올바른 형식입니다 (postgres:// 또는 postgresql://로 시작)');
    
    // URL 파싱
    try {
      const urlObj = new URL(url);
      console.log(`   프로토콜: ${urlObj.protocol}`);
      console.log(`   호스트: ${urlObj.hostname}`);
      console.log(`   포트: ${urlObj.port || '5432 (기본값)'}`);
      console.log(`   데이터베이스: ${urlObj.pathname.substring(1)}`);
      console.log(`   사용자: ${urlObj.username || '(없음)'}`);
      console.log(`   비밀번호: ${urlObj.password ? '***' : '(없음)'}`);
    } catch (error) {
      console.log('❌ URL 파싱 실패:', error.message);
      console.log('\n⚠️ DATABASE_URL 형식이 올바르지 않을 수 있습니다.');
      console.log('올바른 형식: postgresql://user:password@host:port/database');
    }
  } else {
    console.log('❌ 잘못된 형식입니다.');
    console.log('올바른 형식: postgresql://user:password@host:port/database');
    console.log('\n현재 값 (처음 50자만 표시):');
    console.log(url.substring(0, 50) + '...');
  }
} else {
  console.log('❌ DATABASE_URL이 설정되어 있지 않습니다.');
  console.log('\n개별 환경 변수 확인:');
  console.log(`   DB_USER: ${process.env.DB_USER || '(설정 안됨)'}`);
  console.log(`   DB_HOST: ${process.env.DB_HOST || '(설정 안됨)'}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME || '(설정 안됨)'}`);
  console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***' : '(설정 안됨)'}`);
  console.log(`   DB_PORT: ${process.env.DB_PORT || '(설정 안됨)'}`);
}

console.log('\n=== 확인 완료 ===');
