# Render.com 배포 오류 해결 가이드

## 발생한 오류
```
Error: Cannot find module '/opt/render/project/src/server/index.js'
```

## 원인
Render.com이 기본적으로 `node index.js`를 실행하려고 하지만, 실제 진입점은 `server.js`입니다.

## 해결 방법

### 방법 1: Render.com 대시보드에서 수정 (권장)

1. **Render.com 대시보드 접속**
   - https://dashboard.render.com 접속
   - 배포 중인 Web Service 클릭

2. **Settings 탭 클릭**

3. **다음 설정 확인 및 수정:**
   - **Root Directory**: `server` (반드시 설정되어 있어야 함)
   - **Start Command**: `npm start` 또는 `node server.js` (반드시 설정되어 있어야 함)
   - **Build Command**: `npm install` (기본값)

4. **변경사항 저장**
   - "Save Changes" 클릭
   - 자동으로 재배포가 시작됩니다

### 방법 2: render.yaml 파일 사용 (자동 설정)

프로젝트 루트에 `render.yaml` 파일이 생성되었습니다. 이 파일을 사용하면:

1. **GitHub에 푸시**
   ```powershell
   git add render.yaml
   git commit -m "Render.com 배포 설정 추가"
   git push origin main
   ```

2. **Render.com에서 자동 인식**
   - Render.com이 `render.yaml` 파일을 자동으로 인식합니다
   - 설정이 자동으로 적용됩니다

3. **수동 설정이 필요한 경우**
   - Render.com 대시보드에서 "Settings" → "Apply render.yaml" 클릭

## 확인 사항

배포 전에 다음을 확인하세요:

- [ ] `server/package.json`에 `"start": "node server.js"` 스크립트가 있는지 확인
- [ ] Root Directory가 `server`로 설정되어 있는지 확인
- [ ] Start Command가 `npm start` 또는 `node server.js`로 설정되어 있는지 확인
- [ ] 환경 변수 `DATABASE_URL`이 설정되어 있는지 확인

## 배포 후 확인

배포가 완료되면:

1. **로그 확인**
   - Render.com 대시보드 → "Logs" 탭
   - "서버가 http://localhost:PORT에서 실행 중입니다." 메시지 확인

2. **API 테스트**
   - 브라우저에서 `https://[your-service-url]/` 접속
   - "커피 주문 앱 API 서버가 실행 중입니다." 메시지 확인

3. **데이터베이스 연결 확인**
   - 로그에서 "✅ 데이터베이스 연결 준비 완료" 메시지 확인

## 문제가 계속되면

1. **로그 확인**
   - Render.com 대시보드 → "Logs" 탭에서 상세한 에러 메시지 확인

2. **환경 변수 확인**
   - Settings → Environment Variables
   - `DATABASE_URL` 또는 개별 DB 설정이 올바른지 확인

3. **Root Directory 재확인**
   - Settings → Root Directory가 정확히 `server`인지 확인 (앞뒤 공백 없음)
