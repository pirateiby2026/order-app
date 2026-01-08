# Render.com 배포 가이드

## 배포 순서

1. **PostgreSQL 데이터베이스 생성**
2. **백엔드 서버 배포**
3. **프론트엔드 배포**

---

## 1단계: PostgreSQL 데이터베이스 생성

### Render.com에서 데이터베이스 생성

1. **Render.com 대시보드 접속**
   - https://dashboard.render.com 접속
   - 로그인 또는 회원가입

2. **새 PostgreSQL 데이터베이스 생성**
   - "New +" 버튼 클릭
   - "PostgreSQL" 선택
   - 다음 정보 입력:
     - **Name**: `coffee-order-app-db` (또는 원하는 이름)
     - **Database**: `coffee_order_app`
     - **User**: 자동 생성됨
     - **Region**: 가장 가까운 지역 선택 (예: Singapore)
     - **PostgreSQL Version**: 최신 버전 선택
     - **Plan**: Free (또는 필요에 따라 유료 플랜)
   - "Create Database" 클릭

3. **데이터베이스 정보 확인**
   - 데이터베이스 생성 후 대시보드에서 클릭
   - **Internal Database URL** 복사 (나중에 사용)
   - **External Database URL** 복사 (로컬에서 접속 시 사용)
   - **Host, Port, Database, User, Password** 정보 확인

4. **로컬에서 스키마 및 초기 데이터 생성** (선택사항)
   ```powershell
   # External Database URL을 사용하여 로컬에서 스키마 생성
   # psql [External Database URL]
   # 또는 pgAdmin에서 External Database URL로 연결 후
   # server/config/schema.sql 실행
   ```

---

## 2단계: 백엔드 서버 배포

### GitHub 저장소 준비

1. **GitHub에 코드 푸시**
   ```powershell
   git add .
   git commit -m "배포 준비"
   git push origin main
   ```

2. **.gitignore 확인**
   - `server/.env` 파일이 제외되어 있는지 확인
   - 민감한 정보는 GitHub에 올라가지 않도록 주의

### Render.com에서 Web Service 생성

1. **새 Web Service 생성**
   - Render.com 대시보드에서 "New +" 클릭
   - "Web Service" 선택
   - GitHub 저장소 연결

2. **서비스 설정**
   - **Name**: `coffee-order-app-api` (또는 원하는 이름)
   - **Region**: 데이터베이스와 같은 지역 선택
   - **Branch**: `main` (또는 사용하는 브랜치)
   - **Root Directory**: `server` ⚠️ **중요: 반드시 설정해야 함**
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` 또는 `node server.js` ⚠️ **중요: 반드시 설정해야 함**
   - **Plan**: Free (또는 필요에 따라 유료 플랜)

   **⚠️ 주의사항:**
   - Root Directory를 `server`로 설정하지 않으면 파일을 찾을 수 없습니다.
   - Start Command를 설정하지 않으면 Render.com이 기본적으로 `node index.js`를 실행하려고 합니다.
   - `package.json`의 `start` 스크립트가 `node server.js`로 설정되어 있으므로 `npm start`를 사용해도 됩니다.

3. **환경 변수 설정**
   - "Environment" 섹션에서 "Add Environment Variable" 클릭
   
   **방법 1: DATABASE_URL 사용 (권장) ⭐**
   ```
   NODE_ENV=production
   DATABASE_URL=[Internal Database URL]
   ```
   - Render.com 대시보드 → PostgreSQL 데이터베이스 → "Info" 탭
   - **Internal Database URL** 복사하여 붙여넣기
   - 예시: `postgresql://user:password@host:port/database`
   
   **방법 2: 개별 환경 변수 사용**
   ```
   NODE_ENV=production
   DB_USER=[데이터베이스 User]
   DB_HOST=[데이터베이스 Host]  ⚠️ @ 기호 제거!
   DB_NAME=coffee_order_app  ⚠️ 공백 제거!
   DB_PASSWORD=[데이터베이스 Password]
   DB_PORT=5432
   ```
   
   **⚠️ 중요 주의사항:**
   - `DB_HOST`에서 `@` 기호를 **반드시 제거**해야 합니다
     - ❌ 잘못된 예: `@dpg-xxxxx.render.com`
     - ✅ 올바른 예: `dpg-xxxxx.render.com`
   - `DB_NAME`에서 공백을 제거하거나 `_`로 대체해야 합니다
   - Render.com은 `PORT` 환경 변수를 자동으로 설정하므로 별도 설정 불필요

4. **고급 설정 (선택사항)**
   - "Advanced" 섹션에서:
     - **Auto-Deploy**: `Yes` (GitHub 푸시 시 자동 배포)
     - **Health Check Path**: `/` (또는 `/api/orders`)

5. **서비스 생성**
   - "Create Web Service" 클릭
   - 배포 완료까지 대기 (약 2-5분)

6. **배포 확인**
   - 배포 완료 후 제공되는 URL 확인 (예: `https://coffee-order-app-api.onrender.com`)
   - 브라우저에서 `https://[your-service-url]/` 접속
   - "커피 주문 앱 API 서버가 실행 중입니다." 메시지 확인

### 데이터베이스 스키마 및 초기 데이터 생성

배포된 서버에서 스키마를 생성해야 합니다:

**방법 1: Render Shell 사용**
1. Render.com 대시보드에서 Web Service 클릭
2. "Shell" 탭 클릭
3. 다음 명령 실행:
   ```bash
   node config/init-database.js
   ```

**방법 2: 로컬에서 External Database URL 사용**
1. `server/.env` 파일에 External Database URL 정보 입력
2. 로컬에서 실행:
   ```powershell
   cd server
   node config/init-database.js
   ```

---

## 3단계: 프론트엔드 배포

### 코드 수정 확인

✅ **이미 완료된 수정:**
- `UI/src/services/api.js`에서 환경 변수 `VITE_API_BASE_URL` 사용
- 기본값으로 `http://localhost:3000/api` 설정 (로컬 개발용)

### Render.com에서 Static Site 생성

1. **새 Static Site 생성**
   - Render.com 대시보드에서 "New +" 클릭
   - "Static Site" 선택
   - GitHub 저장소 연결

2. **서비스 설정**
   - **Name**: `coffee-order-app` (또는 원하는 이름)
   - **Branch**: `main` (또는 사용하는 브랜치)
   - **Root Directory**: `UI` ⚠️ **중요: 반드시 설정**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` ⚠️ **중요: Vite 빌드 출력 디렉토리**
   - **Environment**: `Production`

3. **환경 변수 설정**
   - "Environment" 섹션에서 "Add Environment Variable" 클릭
   - 다음 환경 변수 추가:
   ```
   VITE_API_BASE_URL=https://[your-backend-url]/api
   ```
   예시:
   ```
   VITE_API_BASE_URL=https://order-app-1-u8xw.onrender.com/api
   ```
   
   **⚠️ 중요 주의사항:**
   - `VITE_` 접두사가 필수입니다 (Vite 환경 변수 규칙)
   - 백엔드 URL 끝에 `/api`를 포함해야 합니다
   - `https://` 프로토콜을 사용해야 합니다

4. **서비스 생성**
   - "Create Static Site" 클릭
   - 배포 완료까지 대기 (약 2-5분)

5. **배포 확인**
   - 배포 완료 후 제공되는 URL 확인
   - 브라우저에서 접속하여 앱이 정상 작동하는지 확인
   - 브라우저 개발자 도구(F12) → Network 탭에서 API 호출 확인

---

## 프론트엔드 API 설정 수정

배포된 백엔드 URL을 사용하도록 프론트엔드 코드를 수정해야 합니다.

### UI/src/services/api.js 수정

```javascript
// 환경 변수 사용
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
```

---

## 배포 후 확인 사항

### 백엔드 확인
- [ ] API 서버가 정상적으로 실행되는지 확인
- [ ] 데이터베이스 연결이 정상인지 확인
- [ ] API 엔드포인트가 정상 작동하는지 확인
  - `GET /api/menus`
  - `GET /api/orders`
  - `POST /api/orders`

### 프론트엔드 확인
- [ ] 프론트엔드가 정상적으로 로드되는지 확인
- [ ] 백엔드 API와 통신이 정상인지 확인
- [ ] 주문하기 기능이 작동하는지 확인
- [ ] 관리자 화면이 작동하는지 확인

### 데이터베이스 확인
- [ ] 테이블이 생성되었는지 확인
- [ ] 초기 데이터가 입력되었는지 확인
- [ ] 주문 생성 시 데이터가 저장되는지 확인

---

## 문제 해결

### 백엔드 배포 실패 시
1. **로그 확인**
   - Render.com 대시보드 → Web Service → "Logs" 탭
   - 에러 메시지 확인

2. **환경 변수 확인**
   - 모든 환경 변수가 올바르게 설정되었는지 확인
   - 데이터베이스 연결 정보 확인

3. **포트 확인**
   - Render.com은 `PORT` 환경 변수를 자동으로 설정
   - 코드에서 `process.env.PORT`를 사용하는지 확인

### 프론트엔드 배포 실패 시
1. **빌드 로그 확인**
   - Render.com 대시보드 → Static Site → "Logs" 탭
   - 빌드 에러 확인

2. **환경 변수 확인**
   - `VITE_API_BASE_URL`이 올바르게 설정되었는지 확인

3. **API 연결 확인**
   - 브라우저 개발자 도구 → Network 탭
   - API 호출이 성공하는지 확인

### CORS 에러 발생 시
- 백엔드 `server.js`에서 CORS 설정 확인
- 프론트엔드 URL을 허용 목록에 추가

---

## 무료 플랜 제한사항

Render.com 무료 플랜의 제한사항:
- **서비스가 15분간 비활성화되면 자동으로 sleep 모드로 전환**
- **첫 요청 시 약 30초 정도 지연될 수 있음**
- **월 750시간 제한** (약 31일)

이를 해결하려면:
- **유료 플랜 사용** (항상 실행)
- **외부 모니터링 서비스 사용** (UptimeRobot 등)

---

## 추가 최적화

### 백엔드 최적화
- 환경 변수로 로깅 레벨 제어
- 프로덕션 환경에서 디버깅 로그 제거
- 에러 핸들링 개선

### 프론트엔드 최적화
- 빌드 최적화
- 이미지 최적화
- 코드 스플리팅

---

## 배포 체크리스트

- [ ] GitHub에 코드 푸시 완료
- [ ] PostgreSQL 데이터베이스 생성 완료
- [ ] 백엔드 환경 변수 설정 완료
- [ ] 백엔드 배포 완료
- [ ] 데이터베이스 스키마 생성 완료
- [ ] 프론트엔드 환경 변수 설정 완료
- [ ] 프론트엔드 API URL 수정 완료
- [ ] 프론트엔드 배포 완료
- [ ] 전체 기능 테스트 완료
