# 데이터베이스 확인 방법

## 1. 스크립트를 통한 확인

### 기본 연결 테스트
```powershell
cd server
node test-db-connection.js
```

### 상세 데이터 확인
```powershell
cd server
node check-database.js
```

이 스크립트는 다음을 확인합니다:
- 데이터베이스 연결 상태
- 테이블 목록
- 메뉴 데이터
- 옵션 데이터
- 주문 데이터 및 통계
- 재고 현황

## 2. pgAdmin을 통한 확인

1. **pgAdmin 실행**
   - Windows 시작 메뉴에서 "pgAdmin 4" 검색 및 실행

2. **서버 연결**
   - 왼쪽 트리에서 "Servers" → "PostgreSQL [버전]" 확장
   - 비밀번호 입력 (설치 시 설정한 비밀번호)

3. **데이터베이스 선택**
   - "Databases" → "coffee_order_app" 확장
   - "Schemas" → "public" → "Tables" 클릭

4. **테이블 확인**
   - `menus` - 메뉴 정보
   - `options` - 옵션 정보
   - `orders` - 주문 정보
   - `order_items` - 주문 아이템
   - `order_item_options` - 주문 아이템 옵션

5. **데이터 조회**
   - 테이블 우클릭 → "View/Edit Data" → "All Rows"
   - 또는 SQL 쿼리 실행:
     ```sql
     SELECT * FROM orders ORDER BY order_time DESC;
     ```

## 3. psql 명령줄을 통한 확인

### psql 접속
```powershell
psql -U postgres -d coffee_order_app
```

### 유용한 SQL 쿼리

```sql
-- 모든 테이블 목록
\dt

-- 메뉴 확인
SELECT * FROM menus;

-- 주문 확인
SELECT * FROM orders ORDER BY order_time DESC LIMIT 10;

-- 주문 통계
SELECT 
  status,
  COUNT(*) as count
FROM orders
GROUP BY status;

-- 재고 현황
SELECT name, stock FROM menus ORDER BY stock ASC;

-- 특정 주문의 아이템 확인
SELECT * FROM order_items WHERE order_id = 1;

-- 종료
\q
```

## 4. 환경 변수 확인

`.env` 파일이 올바르게 설정되어 있는지 확인:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=coffee_order_app
DB_PASSWORD=your_password_here
DB_PORT=5432
```

## 5. 문제 해결

### 연결 실패 시
1. PostgreSQL 서비스가 실행 중인지 확인
   ```powershell
   # Windows 서비스 확인
   Get-Service -Name postgresql*
   ```

2. 포트 확인 (기본값: 5432)
   ```powershell
   netstat -an | findstr 5432
   ```

3. 방화벽 확인
   - Windows 방화벽에서 PostgreSQL 포트 허용 확인

### 데이터베이스가 없는 경우
```powershell
# PostgreSQL에 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE coffee_order_app;

# 종료
\q

# 스키마 실행
cd server
node config/init-database.js
```

## 6. 주문 취소 기능 테스트

주문 취소 라우트가 제대로 작동하는지 테스트:

```powershell
cd server
node test-cancel-route.js
```

이 스크립트는:
- 서버 연결 확인
- 주문 목록 조회
- 주문 취소 라우트 테스트

를 수행합니다.
