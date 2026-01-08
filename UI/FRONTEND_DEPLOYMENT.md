# 프론트엔드 Render.com 배포 가이드

## 배포 전 확인 사항

### 1. 코드 수정 확인

✅ **이미 완료된 수정:**
- `UI/src/services/api.js`에서 환경 변수 `VITE_API_BASE_URL` 사용
- 기본값으로 `http://localhost:3000/api` 설정 (로컬 개발용)

### 2. 백엔드 URL 확인

배포하기 전에 백엔드 서비스의 URL을 확인하세요:
- 예시: `https://order-app-1-u8xw.onrender.com`
- API 엔드포인트: `https://order-app-1-u8xw.onrender.com/api`

---

## 배포 과정

### 1단계: Render.com에서 Static Site 생성

1. **Render.com 대시보드 접속**
   - https://dashboard.render.com 접속
   - "New +" 버튼 클릭

2. **Static Site 선택**
   - "Static Site" 선택

3. **GitHub 저장소 연결**
   - GitHub 저장소 선택
   - 또는 저장소 URL 입력

### 2단계: 서비스 설정

다음 설정을 입력하세요:

- **Name**: `coffee-order-app` (또는 원하는 이름)
- **Branch**: `main` (또는 사용하는 브랜치)
- **Root Directory**: `UI` ⚠️ **중요: 반드시 설정**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist` ⚠️ **중요: Vite 빌드 출력 디렉토리**

### 3단계: 환경 변수 설정

**Environment Variables** 섹션에서 다음 환경 변수를 추가:

```
VITE_API_BASE_URL=https://[your-backend-url]/api
```

**예시:**
```
VITE_API_BASE_URL=https://order-app-1-u8xw.onrender.com/api
```

⚠️ **주의사항:**
- `VITE_` 접두사가 필수입니다 (Vite 환경 변수 규칙)
- 백엔드 URL 끝에 `/api`를 포함해야 합니다
- `https://` 프로토콜을 사용해야 합니다

### 4단계: 서비스 생성 및 배포

1. **"Create Static Site" 클릭**
2. **배포 진행 상황 확인**
   - 빌드 로그에서 오류 확인
   - 빌드가 성공하면 자동으로 배포됩니다

### 5단계: 배포 확인

1. **배포 완료 후 URL 확인**
   - Render.com이 제공하는 URL (예: `https://coffee-order-app.onrender.com`)

2. **브라우저에서 테스트**
   - URL 접속
   - 메뉴가 정상적으로 로드되는지 확인
   - 주문하기 기능 테스트
   - 관리자 화면 테스트

3. **브라우저 개발자 도구 확인**
   - F12 → Network 탭
   - API 호출이 성공하는지 확인
   - CORS 오류가 없는지 확인

---

## 문제 해결

### 빌드 실패 시

1. **로그 확인**
   - Render.com 대시보드 → Static Site → "Logs" 탭
   - 빌드 에러 메시지 확인

2. **일반적인 문제:**
   - **Root Directory 오류**: `UI`로 설정되어 있는지 확인
   - **Build Command 오류**: `npm install && npm run build` 확인
   - **Publish Directory 오류**: `dist`로 설정되어 있는지 확인

### API 연결 실패 시

1. **환경 변수 확인**
   - `VITE_API_BASE_URL`이 올바르게 설정되었는지 확인
   - 백엔드 URL이 정확한지 확인

2. **CORS 오류 발생 시**
   - 백엔드 `server.js`에서 CORS 설정 확인
   - 프론트엔드 URL이 허용 목록에 있는지 확인

3. **브라우저 콘솔 확인**
   - F12 → Console 탭
   - 에러 메시지 확인

### 빌드는 성공하지만 페이지가 표시되지 않을 때

1. **Publish Directory 확인**
   - `dist`로 설정되어 있는지 확인

2. **index.html 확인**
   - `UI/index.html` 파일이 존재하는지 확인

---

## 로컬에서 빌드 테스트

배포 전에 로컬에서 빌드를 테스트할 수 있습니다:

```powershell
cd UI
npm install
npm run build
```

빌드가 성공하면 `UI/dist` 폴더가 생성됩니다.

---

## 환경 변수 설정 요약

### 로컬 개발
`.env` 파일 (선택사항):
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Render.com 배포
Render.com 대시보드 → Environment Variables:
```
VITE_API_BASE_URL=https://[your-backend-url]/api
```

---

## 체크리스트

배포 전 확인:
- [ ] 백엔드 서비스가 정상적으로 배포되어 있는지 확인
- [ ] 백엔드 URL 확인
- [ ] `UI/src/services/api.js`에서 환경 변수 사용 확인
- [ ] 로컬에서 빌드 테스트 (`npm run build`)

배포 설정:
- [ ] Root Directory: `UI`
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `dist`
- [ ] 환경 변수 `VITE_API_BASE_URL` 설정

배포 후 확인:
- [ ] 빌드가 성공했는지 확인
- [ ] 프론트엔드 페이지가 정상적으로 로드되는지 확인
- [ ] API 호출이 정상적으로 작동하는지 확인
- [ ] 주문하기 기능 테스트
- [ ] 관리자 화면 테스트
