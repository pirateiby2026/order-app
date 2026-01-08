# 커피 주문 앱 - 백엔드 서버

## 프로젝트 개요
Express.js를 사용한 RESTful API 서버입니다.

## 기술 스택
- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL 클라이언트)

## 설치 및 실행

### 1. 의존성 설치
```bash
cd server
npm install
```

### 2. 환경 변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 데이터베이스 정보를 입력하세요:

```bash
cp .env.example .env
```

`.env` 파일을 열어서 데이터베이스 설정을 수정:
```
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=coffee_order_app
DB_PASSWORD=your_db_password
DB_PORT=5432
```

### 3. 데이터베이스 생성
PostgreSQL에서 데이터베이스를 생성하세요:

```sql
CREATE DATABASE coffee_order_app;
```

### 4. 서버 실행

**개발 모드** (자동 재시작):
```bash
npm run dev
```

**프로덕션 모드**:
```bash
npm start
```

서버가 실행되면 `http://localhost:3000`에서 접속할 수 있습니다.

## API 엔드포인트

### 메뉴 관련
- `GET /api/menus` - 메뉴 목록 조회
- `GET /api/menus/:id` - 특정 메뉴 조회
- `GET /api/menus/with-stock` - 관리자용 메뉴 목록 (재고 포함)

### 주문 관련
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:id` - 특정 주문 조회
- `PATCH /api/orders/:id/status` - 주문 상태 변경

### 재고 관련
- `GET /api/inventory` - 재고 현황 조회
- `PATCH /api/inventory/:menuId` - 재고 수정

### 옵션 관련
- `GET /api/options` - 옵션 목록 조회
- `GET /api/options/menu/:menuId` - 특정 메뉴의 옵션 조회

## 프로젝트 구조

```
server/
├── config/          # 설정 파일
│   └── database.js  # 데이터베이스 연결 설정
├── routes/          # API 라우트
├── controllers/     # 컨트롤러
├── models/          # 데이터 모델
├── middleware/      # 미들웨어
├── utils/          # 유틸리티 함수
├── server.js       # 서버 진입점
├── package.json    # 패키지 정보
└── .env           # 환경 변수 (생성 필요)
```

## 데이터베이스 마이그레이션

데이터베이스 스키마는 `docs/PRD.md`의 6.5.2 섹션에 정의된 SQL을 사용하여 생성할 수 있습니다.
