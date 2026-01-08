# 커피 주문 앱

## 1. 프로젝트 개요

### 1.1 프로젝트명 
커피주문앱

### 1.2 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스택 웹 앱

### 1.3 개발범위
- 주문하기 화면(메뉴 선택 및 장바구니 기능)
- 관리자 화면(재고 관리 및 주문상태 관리)
- 데이터를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술스택
- 프런트엔드 : HTML, CSS, 리액트, 자바스크립트
- 백엔드 : Node.js, express
- 데이터베이스 : PostgreSQL

## 3. 기본사항
- 프런트엔드와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습 목적이므로 사용자 인증이나 결제 기능은 제외
- 메뉴는 커피 메뉴만 있음.

---

## 4. 주문하기 화면 PRD

### 4.1 화면 개요
사용자가 커피 메뉴를 선택하고 장바구니에 담아 주문할 수 있는 메인 화면입니다.

### 4.2 화면 구성

#### 4.2.1 헤더 영역 (Header)
**위치**: 화면 최상단, 고정 위치

**구성 요소**:
- **로고**: 왼쪽에 "COZY" 텍스트가 포함된 박스 형태
  - 스타일: 어두운 테두리 (다크 그린 계열)
  - 클릭 시: 현재 페이지 유지 (주문하기 화면)
  
- **네비게이션 버튼**: 오른쪽에 배치
  - **"주문하기" 버튼**
    - 현재 활성화된 화면임을 표시 (밝은 회색 배경, 어두운 회색 테두리)
    - 클릭 시: 현재 화면 유지
  - **"관리자" 버튼**
    - 일반 텍스트 버튼 스타일
    - 클릭 시: 관리자 화면으로 이동

#### 4.2.2 메뉴 카드 영역 (Menu Section)
**위치**: 헤더 하단, 화면 중앙 영역

**레이아웃**:
- 메뉴 카드들이 가로로 나열 (그리드 레이아웃)
- 반응형 디자인: 화면 크기에 따라 카드 개수 조정

**메뉴 카드 구성 요소** (각 카드별):

1. **이미지 영역**
   - 위치: 카드 상단
   - 크기: 카드 너비에 맞춘 큰 직사각형 영역
   - 표시: 이미지가 없을 경우 대각선 'X' 표시가 있는 플레이스홀더
   - 기능: 메뉴 이미지 표시

2. **메뉴 정보**
   - **메뉴 이름**: 이미지 하단에 표시
     - 예: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼"
   - **가격**: 메뉴 이름 하단에 표시
     - 형식: 숫자 + "원" (예: "4,000원", "5,000원")
     - 천 단위 구분 기호 포함

3. **설명 영역**
   - 위치: 가격 하단
   - 내용: "간단한 설명..." (플레이스홀더)
   - 기능: 메뉴에 대한 간단한 설명 표시

4. **옵션 선택 영역**
   - 위치: 설명 하단
   - 형식: 체크박스 형태의 옵션 목록
   - 옵션 예시:
     - "샷 추가 (+500원)" - 체크 시 추가 금액 발생
     - "시럽 추가 (+0원)" - 체크 시 추가 금액 없음
   - 기능: 
     - 여러 옵션 동시 선택 가능
     - 선택된 옵션에 따라 총 가격 실시간 업데이트

5. **담기 버튼**
   - 위치: 카드 최하단
   - 스타일: 밝은 회색 배경, 어두운 회색 테두리
   - 텍스트: "담기"
   - 기능:
     - 클릭 시 선택된 메뉴와 옵션을 장바구니에 추가
     - 옵션 미선택 시 기본 메뉴만 추가
     - 동일한 메뉴+옵션 조합이 이미 장바구니에 있으면 수량 증가

#### 4.2.3 장바구니 영역 (Shopping Cart)
**위치**: 화면 최하단, 고정 위치

**레이아웃**:
- 화면 전체 너비를 차지하는 패널 형태
- 배경: 흰색 또는 밝은 배경

**구성 요소**:

1. **장바구니 제목**
   - 텍스트: "장바구니"
   - 위치: 패널 상단

2. **장바구니 아이템 목록**
   - 형식: 세로로 나열된 아이템 리스트
   - 각 아이템 표시 정보:
     - **아이템 이름**: 메뉴 이름 + 선택된 옵션 (괄호 안에 표시)
       - 예: "아메리카노(ICE) (샷 추가)"
     - **수량**: "X 1", "X 2" 형식으로 표시
     - **가격**: 각 아이템의 총 가격 (오른쪽 정렬)
       - 예: "4,500원", "8,000원"
   - 기능:
     - 아이템 수량 조절 (증가/감소)
     - 아이템 삭제
     - 옵션이 포함된 경우 옵션 정보 표시

3. **총 금액 영역**
   - 위치: 아이템 목록 하단
   - 표시:
     - "총 금액" 레이블
     - 총 금액 숫자 (굵은 글씨)
     - 예: "12,500원"
   - 계산: 모든 장바구니 아이템의 가격 합계

4. **주문하기 버튼**
   - 위치: 총 금액 하단
   - 스타일: 밝은 회색 배경, 어두운 회색 테두리
   - 텍스트: "주문하기"
   - 기능:
     - 클릭 시 장바구니의 모든 아이템을 주문으로 전송
     - 주문 완료 후 장바구니 초기화
     - 장바구니가 비어있을 경우 비활성화

### 4.3 기능 요구사항

#### 4.3.1 메뉴 표시 기능
- **FR-001**: 메뉴 목록을 카드 형태로 표시
- **FR-002**: 각 메뉴 카드에 이미지, 이름, 가격, 설명 표시
- **FR-003**: 메뉴 이미지가 없을 경우 플레이스홀더 표시
- **FR-004**: 메뉴 옵션이 있는 경우 옵션 선택 UI 표시

#### 4.3.2 옵션 선택 기능
- **FR-005**: 메뉴별 옵션을 체크박스 형태로 표시
- **FR-006**: 옵션 선택 시 추가 금액을 표시
- **FR-007**: 여러 옵션 동시 선택 가능
- **FR-008**: 선택된 옵션에 따라 총 가격 실시간 계산 및 표시

#### 4.3.3 장바구니 기능
- **FR-009**: "담기" 버튼 클릭 시 선택된 메뉴와 옵션을 장바구니에 추가
- **FR-010**: 동일한 메뉴+옵션 조합이 이미 장바구니에 있으면 수량 증가
- **FR-011**: 장바구니 아이템 목록 표시 (이름, 옵션, 수량, 가격)
- **FR-012**: 장바구니 아이템 수량 조절 기능 (증가/감소)
- **FR-013**: 장바구니 아이템 삭제 기능
- **FR-014**: 장바구니 총 금액 자동 계산 및 표시
- **FR-015**: 장바구니가 비어있을 경우 빈 상태 메시지 표시

#### 4.3.4 주문 기능
- **FR-016**: "주문하기" 버튼 클릭 시 주문 처리
- **FR-017**: 주문 전 재고 확인 (재고 부족 시 알림)
- **FR-018**: 주문 완료 후 장바구니 자동 초기화
- **FR-019**: 주문 완료 알림 표시

#### 4.3.5 네비게이션 기능
- **FR-020**: 헤더의 "주문하기" 버튼으로 주문하기 화면 이동
- **FR-021**: 헤더의 "관리자" 버튼으로 관리자 화면 이동
- **FR-022**: 현재 활성화된 화면을 시각적으로 표시

### 4.4 UI/UX 요구사항

#### 4.4.1 레이아웃
- **UX-001**: 헤더는 화면 상단에 고정
- **UX-002**: 장바구니는 화면 하단에 고정
- **UX-003**: 메뉴 카드는 그리드 레이아웃으로 반응형 배치
- **UX-004**: 화면 크기에 따라 카드 개수 자동 조정

#### 4.4.2 인터랙션
- **UX-005**: 버튼 호버 시 시각적 피드백 제공
- **UX-006**: 옵션 선택 시 즉시 가격 업데이트
- **UX-007**: 장바구니 아이템 추가 시 시각적 피드백 제공
- **UX-008**: 주문 완료 시 명확한 알림 표시

#### 4.4.3 접근성
- **UX-009**: 모든 버튼과 체크박스는 키보드로 접근 가능
- **UX-010**: 충분한 색상 대비 확보
- **UX-011**: 텍스트 크기와 간격이 읽기 쉬움

### 4.5 데이터 요구사항

#### 4.5.1 메뉴 데이터 구조
```javascript
{
  id: number,              // 메뉴 고유 ID
  name: string,            // 메뉴 이름 (예: "아메리카노(ICE)")
  price: number,           // 기본 가격 (예: 4000)
  description: string,     // 메뉴 설명
  image: string,           // 이미지 URL (선택사항)
  options: [               // 옵션 배열
    {
      name: string,        // 옵션 이름 (예: "샷 추가")
      price: number        // 추가 가격 (예: 500)
    }
  ]
}
```

#### 4.5.2 장바구니 아이템 데이터 구조
```javascript
{
  menuId: number,          // 메뉴 ID
  menuName: string,        // 메뉴 이름
  basePrice: number,       // 기본 가격
  selectedOptions: [       // 선택된 옵션 배열
    {
      name: string,
      price: number
    }
  ],
  quantity: number,        // 수량
  totalPrice: number       // 총 가격 (기본가격 + 옵션가격)
}
```

#### 4.5.3 주문 데이터 구조
```javascript
{
  id: number,              // 주문 고유 ID
  orderTime: string,       // 주문 시간 (ISO 형식)
  items: [                // 주문 아이템 배열
    {
      menuId: number,
      menuName: string,
      selectedOptions: [],
      quantity: number,
      totalPrice: number
    }
  ],
  totalAmount: number,     // 총 주문 금액
  status: string           // 주문 상태 ("pending", "received", "preparing", "completed")
}
```

### 4.6 예외 처리

#### 4.6.1 에러 케이스
- **ERR-001**: 메뉴 데이터 로딩 실패 시 에러 메시지 표시
- **ERR-002**: 재고 부족 시 주문 불가 알림
- **ERR-003**: 네트워크 오류 시 적절한 에러 처리

#### 4.6.2 엣지 케이스
- **EDGE-001**: 장바구니가 비어있을 때 주문하기 버튼 비활성화
- **EDGE-002**: 수량이 1일 때 감소 버튼 비활성화
- **EDGE-003**: 옵션이 없는 메뉴의 경우 옵션 영역 숨김

### 4.7 성능 요구사항
- **PERF-001**: 메뉴 목록 로딩 시간 1초 이내
- **PERF-002**: 옵션 선택 시 가격 계산 즉시 반영
- **PERF-003**: 장바구니 업데이트 시 부드러운 애니메이션

### 4.8 브라우저 호환성
- Chrome 최신 버전
- Firefox 최신 버전
- Safari 최신 버전
- Edge 최신 버전

---

## 5. 관리자 화면 PRD

### 5.1 화면 개요
관리자가 주문 현황을 확인하고, 재고를 관리하며, 주문 상태를 업데이트할 수 있는 관리자 전용 화면입니다.

### 5.2 화면 구성

#### 5.2.1 헤더 영역 (Header)
**위치**: 화면 최상단, 고정 위치

**구성 요소**:
- **로고**: 왼쪽에 "COZY" 텍스트가 포함된 박스 형태
  - 스타일: 어두운 테두리
  - 클릭 시: 주문하기 화면으로 이동
  
- **네비게이션 버튼**: 오른쪽에 배치
  - **"주문하기" 버튼**
    - 일반 텍스트 버튼 스타일
    - 클릭 시: 주문하기 화면으로 이동
  - **"관리자" 버튼**
    - 현재 활성화된 화면임을 표시 (어두운 테두리)
    - 클릭 시: 현재 화면 유지

#### 5.2.2 관리자 대시보드 영역 (Admin Dashboard)
**위치**: 헤더 하단, 첫 번째 섹션

**레이아웃**:
- 섹션 제목과 통계 정보를 포함하는 박스 형태
- 배경: 밝은 회색 또는 흰색 배경
- 테두리: 둥근 모서리

**구성 요소**:

1. **섹션 제목**
   - 텍스트: "관리자 대시보드"
   - 위치: 섹션 상단

2. **주문 통계 정보**
   - 위치: 제목 하단
   - 형식: 한 줄로 표시되는 통계 정보
   - 표시 형식: "총 주문 {n} / 주문 접수 {n} / 제조 중 {n} / 제조 완료 {n}"
   - 예시: "총 주문 1 / 주문 접수 1 / 제조 중 0 / 제조 완료 0"
   - 기능:
     - 총 주문 수: 모든 주문의 총 개수
     - 주문 접수: 상태가 "received"인 주문 수
     - 제조 중: 상태가 "preparing"인 주문 수
     - 제조 완료: 상태가 "completed"인 주문 수
   - 업데이트: 주문 상태 변경 시 실시간 업데이트

#### 5.2.3 재고 현황 영역 (Inventory Status)
**위치**: 관리자 대시보드 하단, 두 번째 섹션

**레이아웃**:
- 섹션 제목과 재고 카드들을 포함하는 박스 형태
- 재고 카드들이 가로로 나열 (그리드 레이아웃)
- 반응형 디자인: 화면 크기에 따라 카드 개수 조정

**구성 요소**:

1. **섹션 제목**
   - 텍스트: "재고 현황"
   - 위치: 섹션 상단

2. **재고 카드** (각 메뉴별)
   - 레이아웃: 가로로 나열된 카드 형태
   - 각 카드 구성:
     - **메뉴 이름**: 카드 상단에 표시
       - 예: "아메리카노 (ICE)", "아메리카노 (HOT)", "카페라떼"
     - **재고 수량**: 메뉴 이름 하단에 표시
       - 형식: 숫자 + "개" (예: "10개")
     - **재고 조절 버튼**: 카드 하단에 배치
       - **"+" 버튼**: 재고 증가 버튼 (작은 정사각형 버튼)
       - **"-" 버튼**: 재고 감소 버튼 (작은 정사각형 버튼)
   - 기능:
     - 현재 재고 수량 표시
     - "+" 버튼 클릭 시 재고 1 증가
     - "-" 버튼 클릭 시 재고 1 감소 (최소 0)
     - 재고 변경 시 즉시 반영

#### 5.2.4 주문 현황 영역 (Order Status)
**위치**: 재고 현황 하단, 세 번째 섹션

**레이아웃**:
- 섹션 제목과 주문 목록을 포함하는 박스 형태
- 주문 목록은 세로로 나열 (테이블 또는 리스트 형태)

**구성 요소**:

1. **섹션 제목**
   - 텍스트: "주문 현황"
   - 위치: 섹션 상단

2. **주문 목록**
   - 형식: 세로로 나열된 주문 리스트
   - 각 주문 행 구성:
     - **주문 시간**: 왼쪽에 표시
       - 형식: "월 일 시:분" (예: "7월 31일 13:00")
     - **주문 아이템**: 시간 옆에 표시
       - 형식: "메뉴명 x 수량" (예: "아메리카노(ICE) x 1")
       - 여러 아이템인 경우 모두 표시
     - **주문 금액**: 아이템 옆에 표시
       - 형식: 숫자 + "원" (예: "4,000원")
       - 천 단위 구분 기호 포함
     - **상태 변경 버튼**: 오른쪽에 배치
       - 버튼 텍스트: 현재 상태에 따라 변경
         - "주문 접수" (pending → received)
         - "제조 시작" (received → preparing)
         - "제조 완료" (preparing → completed)
       - 기능: 클릭 시 주문 상태를 다음 단계로 변경
   - 정렬: 최신 주문이 상단에 표시
   - 필터링: 상태별로 필터링 가능 (선택사항)

### 5.3 기능 요구사항

#### 5.3.1 대시보드 통계 기능
- **FR-023**: 총 주문 수를 실시간으로 표시
- **FR-024**: 주문 접수 상태인 주문 수를 표시
- **FR-025**: 제조 중 상태인 주문 수를 표시
- **FR-026**: 제조 완료 상태인 주문 수를 표시
- **FR-027**: 주문 상태 변경 시 통계 자동 업데이트

#### 5.3.2 재고 관리 기능
- **FR-028**: 모든 메뉴의 현재 재고 수량을 카드 형태로 표시
- **FR-029**: 각 메뉴별 재고 수량 표시 (숫자 + "개" 형식)
- **FR-030**: "+" 버튼 클릭 시 해당 메뉴의 재고 1 증가
- **FR-031**: "-" 버튼 클릭 시 해당 메뉴의 재고 1 감소
- **FR-032**: 재고가 0일 때 "-" 버튼 비활성화 또는 최소값 0 유지
- **FR-033**: 재고 변경 시 즉시 반영 및 저장
- **FR-034**: 재고 부족 시 시각적 경고 표시 (선택사항)

#### 5.3.3 주문 현황 관리 기능
- **FR-035**: 모든 주문 목록을 시간순으로 표시 (최신순)
- **FR-036**: 각 주문의 주문 시간 표시
- **FR-037**: 각 주문의 주문 아이템 및 수량 표시
- **FR-038**: 각 주문의 총 주문 금액 표시
- **FR-039**: 주문 상태에 따른 상태 변경 버튼 표시
- **FR-040**: "주문 접수" 버튼으로 주문 상태를 "pending" → "received"로 변경
- **FR-041**: "제조 시작" 버튼으로 주문 상태를 "received" → "preparing"으로 변경
- **FR-042**: "제조 완료" 버튼으로 주문 상태를 "preparing" → "completed"로 변경
- **FR-043**: 주문 상태 변경 시 주문 목록 자동 업데이트
- **FR-044**: 주문 상태 변경 시 대시보드 통계 자동 업데이트

#### 5.3.4 네비게이션 기능
- **FR-045**: 헤더의 "주문하기" 버튼으로 주문하기 화면 이동
- **FR-046**: 헤더의 "관리자" 버튼으로 관리자 화면 이동
- **FR-047**: 현재 활성화된 화면을 시각적으로 표시

### 5.4 UI/UX 요구사항

#### 5.4.1 레이아웃
- **UX-012**: 헤더는 화면 상단에 고정
- **UX-013**: 세 개의 주요 섹션이 세로로 배치
- **UX-014**: 재고 카드는 그리드 레이아웃으로 반응형 배치
- **UX-015**: 화면 크기에 따라 카드 개수 자동 조정
- **UX-016**: 주문 목록은 스크롤 가능한 영역으로 구성

#### 5.4.2 인터랙션
- **UX-017**: 버튼 호버 시 시각적 피드백 제공
- **UX-018**: 재고 변경 시 즉시 반영 및 시각적 피드백
- **UX-019**: 주문 상태 변경 시 명확한 피드백 제공
- **UX-020**: 통계 업데이트 시 부드러운 애니메이션 (선택사항)

#### 5.4.3 접근성
- **UX-021**: 모든 버튼은 키보드로 접근 가능
- **UX-022**: 충분한 색상 대비 확보
- **UX-023**: 재고 수량과 주문 정보가 명확하게 읽힘

#### 5.4.4 상태 표시
- **UX-024**: 주문 상태별로 색상 구분 (선택사항)
- **UX-025**: 재고 부족 시 경고 색상 표시 (선택사항)

### 5.5 데이터 요구사항

#### 5.5.1 재고 데이터 구조
```javascript
{
  [menuId: number]: number  // 메뉴 ID를 키로 하는 재고 수량
}
// 예: { 1: 10, 2: 10, 3: 10 }
```

#### 5.5.2 주문 상태
- **pending**: 주문 접수 대기
- **received**: 주문 접수 완료
- **preparing**: 제조 중
- **completed**: 제조 완료

#### 5.5.3 주문 목록 데이터 구조
```javascript
[
  {
    id: number,              // 주문 고유 ID
    orderTime: string,       // 주문 시간 (ISO 형식 또는 "월 일 시:분" 형식)
    items: [                // 주문 아이템 배열
      {
        menuId: number,
        menuName: string,
        selectedOptions: [],
        quantity: number,
        totalPrice: number
      }
    ],
    totalAmount: number,     // 총 주문 금액
    status: string          // 주문 상태
  }
]
```

#### 5.5.4 대시보드 통계 데이터 구조
```javascript
{
  totalOrders: number,      // 총 주문 수
  receivedOrders: number,    // 주문 접수 수
  preparingOrders: number,  // 제조 중 수
  completedOrders: number  // 제조 완료 수
}
```

### 5.6 예외 처리

#### 5.6.1 에러 케이스
- **ERR-004**: 주문 데이터 로딩 실패 시 에러 메시지 표시
- **ERR-005**: 재고 업데이트 실패 시 에러 메시지 표시
- **ERR-006**: 주문 상태 변경 실패 시 에러 메시지 표시
- **ERR-007**: 네트워크 오류 시 적절한 에러 처리

#### 5.6.2 엣지 케이스
- **EDGE-004**: 재고가 0일 때 "-" 버튼 비활성화
- **EDGE-005**: 주문이 없을 때 빈 상태 메시지 표시
- **EDGE-006**: 주문 상태가 "completed"일 때 상태 변경 버튼 숨김 또는 비활성화
- **EDGE-007**: 주문 상태가 "pending"일 때 "제조 시작" 버튼 비활성화
- **EDGE-008**: 주문 상태가 "received"일 때 "주문 접수" 버튼 비활성화

### 5.7 성능 요구사항
- **PERF-004**: 주문 목록 로딩 시간 1초 이내
- **PERF-005**: 재고 업데이트 즉시 반영
- **PERF-006**: 주문 상태 변경 즉시 반영
- **PERF-007**: 통계 업데이트 즉시 반영

### 5.8 브라우저 호환성
- Chrome 최신 버전
- Firefox 최신 버전
- Safari 최신 버전
- Edge 최신 버전

### 5.9 추가 기능 (선택사항)
- **OPT-001**: 주문 상태별 필터링 기능
- **OPT-002**: 주문 검색 기능
- **OPT-003**: 재고 부족 알림 기능
- **OPT-004**: 주문 통계 차트 표시
- **OPT-005**: 주문 내역 엑셀 다운로드 기능

---

## 6. 백엔드 개발 PRD

### 6.1 개요
백엔드는 Node.js와 Express를 사용하여 RESTful API를 제공하며, PostgreSQL 데이터베이스와 연동하여 데이터를 관리합니다.

### 6.2 데이터 모델

#### 6.2.1 Menus 테이블
메뉴 정보를 저장하는 테이블입니다.

**필드 구조**:
- `id` (INTEGER, PRIMARY KEY, AUTO INCREMENT): 메뉴 고유 ID
- `name` (VARCHAR, NOT NULL): 커피 이름 (예: "Ice 아메리카노 (S)", "Hot 라떼 (L)")
- `description` (TEXT): 메뉴 설명
- `price` (INTEGER, NOT NULL): 기본 가격 (원 단위)
- `image` (VARCHAR): 이미지 URL (NULL 허용)
- `stock` (INTEGER, NOT NULL, DEFAULT 0): 재고 수량

**제약 조건**:
- `name`은 중복될 수 있음 (같은 이름의 다른 사이즈 메뉴 가능)
- `price`는 0 이상의 정수
- `stock`은 0 이상의 정수

**예시 데이터**:
```sql
INSERT INTO menus (name, description, price, image, stock) VALUES
('Ice 아메리카노 (S)', '시원한 아이스 아메리카노', 3500, 'https://...', 10),
('Hot 아메리카노 (S)', '따뜻한 핫 아메리카노', 3000, 'https://...', 10);
```

#### 6.2.2 Options 테이블
메뉴 옵션 정보를 저장하는 테이블입니다.

**필드 구조**:
- `id` (INTEGER, PRIMARY KEY, AUTO INCREMENT): 옵션 고유 ID
- `name` (VARCHAR, NOT NULL): 옵션 이름 (예: "샷 추가", "시럽 추가")
- `price` (INTEGER, NOT NULL, DEFAULT 0): 옵션 추가 가격 (원 단위)
- `menu_id` (INTEGER, FOREIGN KEY): 연결할 메뉴 ID (NULL 허용 - 모든 메뉴에 적용 가능)

**제약 조건**:
- `menu_id`가 NULL이면 모든 메뉴에 적용 가능한 옵션
- `menu_id`가 지정되면 해당 메뉴에만 적용되는 옵션
- `price`는 0 이상의 정수 (0원 옵션 가능)

**관계**:
- `menu_id` → `menus.id` (FOREIGN KEY, ON DELETE CASCADE)

**예시 데이터**:
```sql
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, NULL),  -- 모든 메뉴에 적용 가능
('시럽 추가', 0, NULL);  -- 모든 메뉴에 적용 가능
```

#### 6.2.3 Orders 테이블
주문 정보를 저장하는 테이블입니다.

**필드 구조**:
- `id` (INTEGER, PRIMARY KEY, AUTO INCREMENT): 주문 고유 ID
- `order_time` (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP): 주문 일시
- `total_amount` (INTEGER, NOT NULL): 총 주문 금액 (원 단위)
- `status` (VARCHAR, NOT NULL, DEFAULT 'pending'): 주문 상태
  - 가능한 값: 'pending', 'received', 'preparing', 'completed'

**제약 조건**:
- `total_amount`는 0 이상의 정수
- `status`는 지정된 값만 허용

**예시 데이터**:
```sql
INSERT INTO orders (order_time, total_amount, status) VALUES
('2024-01-15 13:00:00', 12500, 'pending');
```

#### 6.2.4 Order_Items 테이블
주문 상세 내역(주문한 메뉴, 수량, 옵션, 금액)을 저장하는 테이블입니다.

**필드 구조**:
- `id` (INTEGER, PRIMARY KEY, AUTO INCREMENT): 주문 아이템 고유 ID
- `order_id` (INTEGER, FOREIGN KEY, NOT NULL): 주문 ID
- `menu_id` (INTEGER, FOREIGN KEY, NOT NULL): 메뉴 ID
- `menu_name` (VARCHAR, NOT NULL): 메뉴 이름 (주문 시점의 이름 저장)
- `quantity` (INTEGER, NOT NULL): 수량
- `item_price` (INTEGER, NOT NULL): 아이템 단가 (기본가격 + 옵션가격)
- `total_price` (INTEGER, NOT NULL): 아이템 총 가격 (단가 × 수량)

**관계**:
- `order_id` → `orders.id` (FOREIGN KEY, ON DELETE CASCADE)
- `menu_id` → `menus.id` (FOREIGN KEY, ON DELETE SET NULL)

**예시 데이터**:
```sql
INSERT INTO order_items (order_id, menu_id, menu_name, quantity, item_price, total_price) VALUES
(1, 1, 'Ice 아메리카노 (S)', 1, 4000, 4000),
(1, 2, 'Hot 아메리카노 (S)', 2, 3000, 6000);
```

#### 6.2.5 Order_Item_Options 테이블
주문 아이템에 선택된 옵션 정보를 저장하는 테이블입니다.

**필드 구조**:
- `id` (INTEGER, PRIMARY KEY, AUTO INCREMENT): 고유 ID
- `order_item_id` (INTEGER, FOREIGN KEY, NOT NULL): 주문 아이템 ID
- `option_id` (INTEGER, FOREIGN KEY, NOT NULL): 옵션 ID
- `option_name` (VARCHAR, NOT NULL): 옵션 이름 (주문 시점의 이름 저장)
- `option_price` (INTEGER, NOT NULL): 옵션 가격 (주문 시점의 가격 저장)

**관계**:
- `order_item_id` → `order_items.id` (FOREIGN KEY, ON DELETE CASCADE)
- `option_id` → `options.id` (FOREIGN KEY, ON DELETE SET NULL)

**예시 데이터**:
```sql
INSERT INTO order_item_options (order_item_id, option_id, option_name, option_price) VALUES
(1, 1, '샷 추가', 500);
```

### 6.3 데이터 스키마를 위한 사용자 흐름

#### 6.3.1 메뉴 목록 조회 흐름
1. **프런트엔드**: 주문하기 화면 진입 시 메뉴 목록 요청
2. **백엔드**: `menus` 테이블에서 모든 메뉴 정보 조회
   - 메뉴 ID, 이름, 설명, 가격, 이미지 URL 반환
   - 재고 수량(`stock`)은 관리자 화면에서만 사용하므로 일반 조회 시 제외 가능
3. **프런트엔드**: 받은 메뉴 정보를 카드 형태로 화면에 표시
4. **프런트엔드**: 관리자 화면에서는 재고 수량도 함께 조회하여 표시

#### 6.3.2 옵션 조회 흐름
1. **프런트엔드**: 메뉴 카드 표시 시 해당 메뉴의 옵션 정보 요청
2. **백엔드**: `options` 테이블에서 조회
   - `menu_id`가 NULL인 옵션 (모든 메뉴 공통 옵션)
   - `menu_id`가 해당 메뉴 ID인 옵션
3. **프런트엔드**: 받은 옵션 정보를 체크박스 형태로 표시

#### 6.3.3 장바구니 관리 흐름
1. **프런트엔드**: 사용자가 메뉴 선택 및 옵션 선택
2. **프런트엔드**: 선택 정보를 로컬 상태(장바구니)에 저장
   - 메뉴 ID, 선택된 옵션 ID 배열, 수량
3. **프런트엔드**: 장바구니 화면에 선택 정보 표시
   - 메뉴 이름, 옵션 이름, 수량, 가격 계산하여 표시

#### 6.3.4 주문 생성 흐름
1. **프런트엔드**: 사용자가 "주문하기" 버튼 클릭
2. **프런트엔드**: 주문 데이터 준비
   - 주문 아이템 배열 (메뉴 ID, 수량, 선택된 옵션 ID 배열)
   - 총 금액 계산
3. **백엔드**: 주문 생성 API 호출
   - 재고 확인: 각 메뉴의 `stock`이 주문 수량 이상인지 확인
   - 재고 부족 시 에러 반환
   - 재고 충분 시:
     a. `orders` 테이블에 주문 정보 저장 (주문 시간, 총 금액, 상태='pending')
     b. `order_items` 테이블에 주문 아이템 저장
     c. `order_item_options` 테이블에 선택된 옵션 저장
     d. `menus` 테이블의 재고 수량 차감 (`stock` 감소)
4. **백엔드**: 생성된 주문 ID 반환
5. **프런트엔드**: 주문 완료 알림 표시 및 장바구니 초기화

#### 6.3.5 주문 상태 변경 흐름
1. **프런트엔드**: 관리자가 주문 현황 화면에서 주문 확인
2. **프런트엔드**: 상태 변경 버튼 클릭
   - "주문 접수": `pending` → `received`
   - "제조 시작": `received` → `preparing`
   - "음료 수령": `preparing` → `completed`
   - "완료": 최종 상태 (변경 불가)
3. **백엔드**: 주문 상태 업데이트 API 호출
   - `orders` 테이블의 `status` 필드 업데이트
4. **프런트엔드**: 주문 목록 및 대시보드 통계 자동 업데이트

### 6.4 API 설계

#### 6.4.1 메뉴 관련 API

##### GET /api/menus
**설명**: 커피 메뉴 목록을 조회합니다.

**요청**:
- Method: GET
- Headers: 없음
- Query Parameters: 없음

**응답**:
- Status Code: 200 OK
- Response Body:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ice 아메리카노 (S)",
      "description": "시원한 아이스 아메리카노",
      "price": 3500,
      "image": "https://images.unsplash.com/...",
      "stock": 10
    },
    {
      "id": 2,
      "name": "Hot 아메리카노 (S)",
      "description": "따뜻한 핫 아메리카노",
      "price": 3000,
      "image": "https://images.unsplash.com/...",
      "stock": 10
    }
  ]
}
```

**에러 응답**:
- Status Code: 500 Internal Server Error
- Response Body:
```json
{
  "success": false,
  "error": "메뉴 목록을 불러오는데 실패했습니다."
}
```

##### GET /api/menus/:id
**설명**: 특정 메뉴의 상세 정보를 조회합니다.

**요청**:
- Method: GET
- Path Parameters:
  - `id` (INTEGER): 메뉴 ID

**응답**:
- Status Code: 200 OK
- Response Body:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ice 아메리카노 (S)",
    "description": "시원한 아이스 아메리카노",
    "price": 3500,
    "image": "https://images.unsplash.com/...",
    "stock": 10,
    "options": [
      {
        "id": 1,
        "name": "샷 추가",
        "price": 500
      }
    ]
  }
}
```

**에러 응답**:
- Status Code: 404 Not Found
- Response Body:
```json
{
  "success": false,
  "error": "메뉴를 찾을 수 없습니다."
}
```

##### GET /api/menus/with-stock
**설명**: 관리자 화면용 메뉴 목록을 조회합니다 (재고 정보 포함).

**요청**:
- Method: GET
- Headers: 없음

**응답**:
- Status Code: 200 OK
- Response Body: GET /api/menus와 동일 (재고 정보 포함)

#### 6.4.2 옵션 관련 API

##### GET /api/options
**설명**: 모든 옵션 목록을 조회합니다.

**요청**:
- Method: GET

**응답**:
- Status Code: 200 OK
- Response Body:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "샷 추가",
      "price": 500,
      "menu_id": null
    },
    {
      "id": 2,
      "name": "시럽 추가",
      "price": 0,
      "menu_id": null
    }
  ]
}
```

##### GET /api/options/menu/:menuId
**설명**: 특정 메뉴에 적용 가능한 옵션 목록을 조회합니다.

**요청**:
- Method: GET
- Path Parameters:
  - `menuId` (INTEGER): 메뉴 ID

**응답**:
- Status Code: 200 OK
- Response Body:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "샷 추가",
      "price": 500
    }
  ]
}
```

#### 6.4.3 주문 관련 API

##### POST /api/orders
**설명**: 새로운 주문을 생성합니다.

**요청**:
- Method: POST
- Headers:
  - Content-Type: application/json
- Request Body:
```json
{
  "items": [
    {
      "menuId": 1,
      "quantity": 1,
      "selectedOptionIds": [1]
    },
    {
      "menuId": 2,
      "quantity": 2,
      "selectedOptionIds": []
    }
  ]
}
```

**처리 로직**:
1. 각 아이템의 재고 확인 (`menus.stock >= quantity`)
2. 재고 부족 시 에러 반환
3. 주문 총 금액 계산
4. 트랜잭션 시작
5. `orders` 테이블에 주문 정보 저장
6. `order_items` 테이블에 주문 아이템 저장
7. `order_item_options` 테이블에 옵션 정보 저장
8. `menus` 테이블의 재고 수량 차감
9. 트랜잭션 커밋

**응답**:
- Status Code: 201 Created
- Response Body:
```json
{
  "success": true,
  "data": {
    "orderId": 1,
    "orderTime": "2024-01-15T13:00:00.000Z",
    "totalAmount": 12500,
    "status": "pending"
  }
}
```

**에러 응답**:
- Status Code: 400 Bad Request (재고 부족)
- Response Body:
```json
{
  "success": false,
  "error": "재고가 부족합니다.",
  "details": [
    {
      "menuId": 1,
      "menuName": "Ice 아메리카노 (S)",
      "requested": 5,
      "available": 3
    }
  ]
}
```

##### GET /api/orders
**설명**: 모든 주문 목록을 조회합니다.

**요청**:
- Method: GET
- Query Parameters (선택사항):
  - `status` (STRING): 주문 상태 필터 ('pending', 'received', 'preparing', 'completed')

**응답**:
- Status Code: 200 OK
- Response Body:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderTime": "2024-01-15T13:00:00.000Z",
      "totalAmount": 12500,
      "status": "pending",
      "items": [
        {
          "menuId": 1,
          "menuName": "Ice 아메리카노 (S)",
          "quantity": 1,
          "itemPrice": 4000,
          "totalPrice": 4000,
          "options": [
            {
              "optionId": 1,
              "optionName": "샷 추가",
              "optionPrice": 500
            }
          ]
        }
      ]
    }
  ]
}
```

##### GET /api/orders/:id
**설명**: 주문 ID를 전달하면 해당 주문 정보를 조회합니다.

**요청**:
- Method: GET
- Path Parameters:
  - `id` (INTEGER): 주문 ID

**응답**:
- Status Code: 200 OK
- Response Body:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderTime": "2024-01-15T13:00:00.000Z",
    "totalAmount": 12500,
    "status": "pending",
    "items": [
      {
        "menuId": 1,
        "menuName": "Ice 아메리카노 (S)",
        "quantity": 1,
        "itemPrice": 4000,
        "totalPrice": 4000,
        "options": [
          {
            "optionId": 1,
            "optionName": "샷 추가",
            "optionPrice": 500
          }
        ]
      }
    ]
  }
}
```

**에러 응답**:
- Status Code: 404 Not Found
- Response Body:
```json
{
  "success": false,
  "error": "주문을 찾을 수 없습니다."
}
```

##### PATCH /api/orders/:id/status
**설명**: 주문 상태를 변경합니다.

**요청**:
- Method: PATCH
- Path Parameters:
  - `id` (INTEGER): 주문 ID
- Request Body:
```json
{
  "status": "received"
}
```

**유효한 상태 전환**:
- `pending` → `received` (주문 접수)
- `received` → `preparing` (제조 시작)
- `preparing` → `completed` (음료 수령/완료)

**응답**:
- Status Code: 200 OK
- Response Body:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "received",
    "updatedAt": "2024-01-15T13:05:00.000Z"
  }
}
```

**에러 응답**:
- Status Code: 400 Bad Request (잘못된 상태 전환)
- Response Body:
```json
{
  "success": false,
  "error": "잘못된 상태 전환입니다. 현재 상태: pending, 요청 상태: preparing"
}
```

#### 6.4.4 재고 관련 API

##### GET /api/inventory
**설명**: 모든 메뉴의 재고 현황을 조회합니다.

**요청**:
- Method: GET

**응답**:
- Status Code: 200 OK
- Response Body:
```json
{
  "success": true,
  "data": [
    {
      "menuId": 1,
      "menuName": "Ice 아메리카노 (S)",
      "stock": 10
    },
    {
      "menuId": 2,
      "menuName": "Hot 아메리카노 (S)",
      "stock": 10
    }
  ]
}
```

##### PATCH /api/inventory/:menuId
**설명**: 특정 메뉴의 재고를 수정합니다.

**요청**:
- Method: PATCH
- Path Parameters:
  - `menuId` (INTEGER): 메뉴 ID
- Request Body:
```json
{
  "stock": 15
}
```

**응답**:
- Status Code: 200 OK
- Response Body:
```json
{
  "success": true,
  "data": {
    "menuId": 1,
    "menuName": "Ice 아메리카노 (S)",
    "stock": 15
  }
}
```

**에러 응답**:
- Status Code: 400 Bad Request (재고가 0 미만)
- Response Body:
```json
{
  "success": false,
  "error": "재고는 0 이상이어야 합니다."
}
```

### 6.5 데이터베이스 스키마 설계

#### 6.5.1 ERD (Entity Relationship Diagram)
```
Menus (1) ────< (N) Options
  │
  │ (1)
  │
  │ (N)
Order_Items (N) ────< (1) Orders
  │
  │ (1)
  │
  │ (N)
Order_Item_Options (N) ────< (1) Options
```

#### 6.5.2 테이블 생성 SQL

```sql
-- Menus 테이블
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  image VARCHAR(500),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Options 테이블
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),
  menu_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);

-- Orders 테이블
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'received', 'preparing', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order_Items 테이블
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  menu_id INTEGER NOT NULL,
  menu_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  item_price INTEGER NOT NULL CHECK (item_price >= 0),
  total_price INTEGER NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE SET NULL
);

-- Order_Item_Options 테이블
CREATE TABLE order_item_options (
  id SERIAL PRIMARY KEY,
  order_item_id INTEGER NOT NULL,
  option_id INTEGER NOT NULL,
  option_name VARCHAR(255) NOT NULL,
  option_price INTEGER NOT NULL CHECK (option_price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
  FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE SET NULL
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_time ON orders(order_time DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_id ON order_items(menu_id);
CREATE INDEX idx_options_menu_id ON options(menu_id);
```

### 6.6 API 에러 처리

#### 6.6.1 공통 에러 응답 형식
```json
{
  "success": false,
  "error": "에러 메시지",
  "code": "ERROR_CODE",
  "details": {}
}
```

#### 6.6.2 주요 에러 코드
- `MENU_NOT_FOUND`: 메뉴를 찾을 수 없음
- `ORDER_NOT_FOUND`: 주문을 찾을 수 없음
- `INSUFFICIENT_STOCK`: 재고 부족
- `INVALID_STATUS_TRANSITION`: 잘못된 상태 전환
- `INVALID_REQUEST`: 잘못된 요청 데이터
- `DATABASE_ERROR`: 데이터베이스 오류
- `INTERNAL_SERVER_ERROR`: 서버 내부 오류

### 6.7 보안 고려사항

#### 6.7.1 입력 검증
- 모든 입력값에 대한 유효성 검사
- SQL Injection 방지 (파라미터화된 쿼리 사용)
- XSS 방지 (입력값 이스케이프 처리)

#### 6.7.2 트랜잭션 처리
- 주문 생성 시 트랜잭션 사용 (재고 차감과 주문 생성의 원자성 보장)
- 트랜잭션 실패 시 롤백 처리

### 6.8 성능 최적화

#### 6.8.1 데이터베이스 최적화
- 인덱스 생성 (주문 상태, 주문 시간, 메뉴 ID 등)
- 쿼리 최적화 (JOIN 최소화, 필요한 컬럼만 조회)

#### 6.8.2 API 최적화
- 페이지네이션 (주문 목록이 많을 경우)
- 캐싱 (메뉴 목록 등 변경 빈도가 낮은 데이터)

### 6.9 개발 우선순위

#### 높은 우선순위
1. 데이터베이스 스키마 생성
2. GET /api/menus API 구현
3. POST /api/orders API 구현
4. GET /api/orders API 구현
5. GET /api/orders/:id API 구현

#### 중간 우선순위
6. PATCH /api/orders/:id/status API 구현
7. GET /api/inventory API 구현
8. PATCH /api/inventory/:menuId API 구현
9. GET /api/options API 구현

#### 낮은 우선순위
10. 에러 처리 강화
11. 입력 검증 강화
12. 성능 최적화
13. 로깅 및 모니터링
