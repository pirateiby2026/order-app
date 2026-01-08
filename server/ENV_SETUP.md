# 환경 변수 설정 가이드

## .env 파일 생성

`server` 폴더에 `.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# 서버 포트
PORT=3000

# PostgreSQL 데이터베이스 설정
DB_USER=postgres
DB_HOST=localhost
DB_NAME=coffee_order_app
DB_PASSWORD=sqlpwis1
DB_PORT=5432
```

## 설정 방법

1. `server` 폴더에 `.env` 파일 생성
2. 위의 템플릿을 복사하여 붙여넣기
3. 실제 데이터베이스 정보로 수정:
   - `DB_USER`: PostgreSQL 사용자 이름 (기본값: postgres)
   - `DB_HOST`: 데이터베이스 호스트 (기본값: localhost)
   - `DB_NAME`: 데이터베이스 이름 (기본값: coffee_order_app)
   - `DB_PASSWORD`: PostgreSQL 비밀번호
   - `DB_PORT`: PostgreSQL 포트 (기본값: 5432)

## 데이터베이스 생성

PostgreSQL에 접속하여 데이터베이스를 생성하세요:

```sql
CREATE DATABASE coffee_order_app;
```

## 주의사항

- `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- 실제 비밀번호를 사용하세요.
- 프로덕션 환경에서는 더 강력한 비밀번호를 사용하세요.
