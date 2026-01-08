# Render.com 환경 변수 설정 가이드

## 문제 상황

배포 시 다음과 같은 오류가 발생할 수 있습니다:
```
Error: getaddrinfo ENOTFOUND @dpg-xxxxx.render.com
```

이는 환경 변수의 호스트명에 `@` 기호가 포함되어 있기 때문입니다.

## 해결 방법

### 방법 1: DATABASE_URL 사용 (권장) ⭐

Render.com의 **Internal Database URL**을 사용하는 것이 가장 간단하고 안전합니다.

1. **Render.com 대시보드 접속**
   - PostgreSQL 데이터베이스 클릭
   - "Info" 탭에서 **Internal Database URL** 복사

2. **Web Service 환경 변수 설정**
   - Web Service → Settings → Environment Variables
   - 다음 환경 변수 추가:
     ```
     DATABASE_URL = [Internal Database URL]
     ```
   - 예시:
     ```
     DATABASE_URL = postgresql://user:password@dpg-xxxxx.render.com:5432/database_name
     ```

3. **주의사항**
   - Internal Database URL은 Render.com 내부 네트워크에서만 접근 가능합니다
   - 같은 Render.com 계정의 서비스 간에만 사용 가능합니다
   - 외부에서 접근하려면 External Database URL을 사용해야 합니다

### 방법 2: 개별 환경 변수 사용

개별 환경 변수를 사용하는 경우:

1. **Render.com 대시보드에서 정보 확인**
   - PostgreSQL 데이터베이스 → "Info" 탭
   - 다음 정보 확인:
     - Host
     - Port
     - Database
     - User
     - Password

2. **Web Service 환경 변수 설정**
   - Web Service → Settings → Environment Variables
   - 다음 환경 변수 추가:
     ```
     DB_USER = [User]
     DB_HOST = [Host]  ⚠️ @ 기호 제거!
     DB_NAME = [Database]  ⚠️ 공백 제거!
     DB_PASSWORD = [Password]
     DB_PORT = [Port]
     ```

3. **주의사항**
   - `DB_HOST`에서 `@` 기호를 **반드시 제거**해야 합니다
     - ❌ 잘못된 예: `@dpg-xxxxx.render.com`
     - ✅ 올바른 예: `dpg-xxxxx.render.com`
   - `DB_NAME`에서 공백을 제거하거나 `_`로 대체해야 합니다
     - ❌ 잘못된 예: `order-app db`
     - ✅ 올바른 예: `order_app` 또는 `orderapp`

## 환경 변수 확인 방법

배포 후 로그에서 다음 메시지를 확인하세요:

✅ 성공:
```
✅ 데이터베이스 연결 준비 완료
```

❌ 실패:
```
⚠️ 데이터베이스 연결 실패 - .env 파일을 확인하세요
```

## 자동 수정 기능

코드에서 자동으로 다음을 처리합니다:
- `DATABASE_URL`의 호스트명에서 `@` 기호 제거
- `DB_HOST`에서 `@` 기호 제거
- `DB_NAME`의 공백을 `_`로 변환
- Render.com 호스트에 대한 SSL 자동 설정

하지만 **가장 좋은 방법은 올바른 형식으로 환경 변수를 설정하는 것**입니다.

## 추천 설정

### Render.com 배포 시 (권장)
```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
```

### 로컬 개발 시
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=coffee_order_app
DB_PASSWORD=your_password
DB_PORT=5432
```

## 문제 해결 체크리스트

- [ ] `DATABASE_URL`이 올바른 형식인지 확인 (postgresql://로 시작)
- [ ] `DB_HOST`에 `@` 기호가 없는지 확인
- [ ] `DB_NAME`에 공백이 없는지 확인
- [ ] 환경 변수가 Web Service에 올바르게 설정되었는지 확인
- [ ] PostgreSQL 데이터베이스가 실행 중인지 확인
- [ ] Internal Database URL을 사용하는 경우 같은 Render.com 계정인지 확인
