import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/database.js';

// 환경 변수 로드
dotenv.config();

const app = express();
// Render.com은 PORT 환경 변수를 자동으로 설정하므로 이를 사용
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // CORS 허용 (프런트엔드와 통신을 위해)
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '커피 주문 앱 API 서버가 실행 중입니다.',
    version: '1.0.0'
  });
});

// API 라우트
import menuRoutes from './routes/menuRoutes.js';
import optionRoutes from './routes/optionRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

app.use('/api/menus', menuRoutes);
app.use('/api/options', optionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

// 404 핸들러 (모든 라우트 이후에 위치)
app.use((req, res) => {
  console.log(`[404 핸들러] 요청한 경로를 찾을 수 없음: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: '요청한 리소스를 찾을 수 없습니다.'
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('에러 발생:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || '서버 내부 오류가 발생했습니다.'
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

// 데이터베이스 연결 테스트
import { testConnection } from './config/database.js';

testConnection().then((connected) => {
  if (connected) {
    console.log('✅ 데이터베이스 연결 준비 완료');
  } else {
    console.log('⚠️ 데이터베이스 연결 실패 - .env 파일을 확인하세요');
  }
});

export default app;
