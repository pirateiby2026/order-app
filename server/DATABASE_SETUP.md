# 데이터베이스 설정 가이드

## 1. .env 파일 생성

`server` 폴더에 `.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# 서버 포트
PORT=3000

# PostgreSQL 데이터베이스 설정
DB_USER=postgres
DB_HOST=localhost
DB_NAME=coffee_order_app
DB_PASSWORD=여기에_실제_비밀번호_입력
DB_PORT=5432
```

**중요**: `DB_PASSWORD`에 PostgreSQL 설치 시 설정한 실제 비밀번호를 입력하세요.

## 2. 데이터베이스 생성

PostgreSQL에 `coffee_order_app` 데이터베이스를 생성해야 합니다. 다음 방법 중 하나를 사용하세요:

### 방법 1: pgAdmin 사용 (GUI)

1. pgAdmin을 실행합니다
2. 서버에 연결합니다 (localhost)
3. "Databases"를 우클릭 → "Create" → "Database..."
4. Database name에 `coffee_order_app` 입력
5. "Save" 클릭

### 방법 2: psql 사용 (명령줄)

PostgreSQL 설치 경로의 `bin` 폴더에서 실행하거나, PATH에 추가한 후:

```bash
# PostgreSQL에 접속 (비밀번호 입력 필요)
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE coffee_order_app;

# 종료
\q
```

### 방법 3: SQL 스크립트 실행

pgAdmin의 Query Tool에서 다음 SQL을 실행:

```sql
CREATE DATABASE coffee_order_app;
```

## 3. 연결 테스트

데이터베이스 생성 후 다음 명령으로 연결을 테스트하세요:

```bash
cd server
node test-db-connection.js
```

성공하면 다음과 같은 메시지가 표시됩니다:
```
✅ 데이터베이스 연결 성공!
```

## 문제 해결

### 연결 실패 시 확인 사항:

1. ✅ PostgreSQL 서비스가 실행 중인지 확인
   - Windows: 서비스 관리자에서 "postgresql-x64-XX" 서비스 확인
   - 또는 pgAdmin에서 서버 연결 시도

2. ✅ .env 파일이 `server` 폴더에 올바르게 생성되었는지 확인

3. ✅ .env 파일의 `DB_PASSWORD`가 올바른지 확인

4. ✅ `coffee_order_app` 데이터베이스가 생성되었는지 확인

5. ✅ PostgreSQL 포트가 5432인지 확인 (다른 포트 사용 시 .env에서 수정)
