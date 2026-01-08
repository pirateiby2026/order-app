# Render.com 데이터베이스 이름 확인 가이드

## 문제 상황
현재 `.env` 파일의 `DB_NAME`이 `order-app db`로 설정되어 있어 공백이 포함되어 있습니다.
PostgreSQL 데이터베이스 이름에는 공백을 사용할 수 없습니다.

## 해결 방법

### 방법 1: Render.com 대시보드에서 확인
1. Render.com 대시보드 접속
2. PostgreSQL 데이터베이스 클릭
3. "Info" 탭에서 데이터베이스 이름 확인
   - 보통 `coffee_order_app` 또는 사용자가 설정한 이름

### 방법 2: Internal Database URL에서 확인
Render.com의 Internal Database URL 형식:
```
postgresql://user:password@host:port/database_name
```

URL의 마지막 부분이 데이터베이스 이름입니다.

예시:
- `postgresql://user:pass@host:5432/coffee_order_app` → 데이터베이스 이름: `coffee_order_app`

## .env 파일 수정

### 옵션 1: DATABASE_URL 사용 (권장)
Render.com의 Internal Database URL을 사용하는 것이 가장 간단합니다:

```env
DATABASE_URL=postgresql://user:password@host:port/database_name
```

### 옵션 2: 개별 환경 변수 사용
개별 환경 변수를 사용하는 경우:

```env
DB_USER=coffee_6kig_user
DB_HOST=dpg-d5fkg595pdvs73fd2phg-a.virginia-postgres.render.com
DB_NAME=coffee_order_app
DB_PASSWORD=your_password
DB_PORT=5432
```

**주의사항:**
- `DB_HOST`에서 `@` 기호 제거
- `DB_NAME`에서 공백 제거 (공백은 `_`로 대체)
- Render.com 호스트를 사용하는 경우 SSL 연결 필요 (자동 처리됨)

## 데이터베이스 이름 확인 후
`.env` 파일을 수정한 후 다시 스키마 생성 스크립트를 실행하세요:
```powershell
cd server
node config/init-database.js
```
