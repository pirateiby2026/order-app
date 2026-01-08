# 커피 주문 앱 - 프런트엔드

## 실행 방법

### 개발 서버 실행 (권장)

1. 터미널에서 UI 폴더로 이동:
```bash
cd UI
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 접속:
- 자동으로 브라우저가 열립니다
- 또는 터미널에 표시된 URL로 접속 (보통 `http://localhost:5173`)

### 빌드 후 실행

1. 프로덕션 빌드:
```bash
cd UI
npm run build
```

2. 빌드된 파일 미리보기:
```bash
npm run preview
```

## 중요 사항

⚠️ **주의**: 이 프로젝트는 Vite를 사용하므로 정적 파일 서버(Live Server 등)로 직접 열면 작동하지 않습니다.

반드시 `npm run dev` 명령어로 Vite 개발 서버를 실행해야 합니다.

## 프로젝트 구조

```
UI/
├── src/
│   ├── components/     # React 컴포넌트
│   ├── data/           # 데이터 파일
│   ├── App.jsx         # 메인 앱 컴포넌트
│   └── main.jsx        # 진입점
├── public/             # 정적 파일
├── index.html          # HTML 템플릿
└── vite.config.js      # Vite 설정
```

## 기능

- 주문하기 화면: 메뉴 선택 및 장바구니 기능
- 관리자 화면: 재고 관리 및 주문 상태 관리
