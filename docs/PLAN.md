# Readyme 개발 기획서

## 현재 상태 분석

### 완료된 항목

| 영역 | 완료 항목 |
|------|-----------|
| 인프라 | pnpm 모노레포, Docker(PostgreSQL), shared 패키지 |
| 서버 인증 | 회원가입, 로그인, JWT 발급/검증, Passport(Local+JWT) |
| DB | User 모델 (UUID, email, password, name, timestamps) |
| 클라이언트 기반 | Next.js 15 + Tailwind v4 + shadcn/ui, Zustand, TanStack Query |
| API 클라이언트 | fetch 기반 범용 API 래퍼 (get/post/put/patch/delete) |
| 유효성 검사 | Zod 스키마 (로그인/회원가입) |
| UI | 홈페이지 히어로 섹션, Button 컴포넌트 |

### 미구현 항목

- 로그인/회원가입 페이지 UI, 소셜 로그인 (GitHub)
- 노코드 템플릿 빌더 (react-rnd + tiptap, A4 고정 캔버스)
- 템플릿 CRUD, 마켓플레이스
- 이력서 CRUD (템플릿 기반)
- 유료 구매/보상 시스템 (원화 결제 + 포인트 할인)
- 피드백 시스템 (비공개, 이력서 작성자만 열람)
- 평가(리뷰) 시스템 (판매자/템플릿/이력서, 구매 인증 뱃지)
- 탐색/검색
- 마이페이지/프로필/알림

---

## 핵심 개념: Template vs Resume

| | Template (템플릿) | Resume (이력서) |
|--|---|---|
| 정의 | react-rnd + tiptap으로 만든 이력서 레이아웃 | 템플릿에 실제 데이터를 채운 결과물 |
| 제작 방식 | react-rnd로 블록 배치, tiptap으로 텍스트 편집 | 템플릿의 편집 가능 영역에 텍스트 입력 |
| 구매 시 | **복제하여 수정 가능** | **조회만 가능 (읽기 전용)** |
| 판매 | 가능 (무료/유료) | 가능 (무료/유료) |
| 보상 | 조회/구매 기반 | 조회/구매 기반 |

```
[react-rnd + tiptap 빌더] → 템플릿 제작 → 공유/판매 (구매자: 복제 후 수정 가능)
                               ↓
                         템플릿 선택 → 데이터 입력 → 이력서 완성 → 공유/판매 (구매자: 조회만 가능)
```

---

## 개발 로드맵

### Phase 1. 인증 UI 완성

> 서버 인증 API는 이미 구현됨. 클라이언트 UI 연동 + 소셜 로그인 추가.

#### 1-1. 회원가입/로그인 페이지

- `/login` 페이지 — 이메일/비밀번호 입력, 폼 검증, API 연동
- `/register` 페이지 — 이메일/비밀번호/이름 입력, 비밀번호 확인
- React Hook Form + Zod 스키마 활용 (이미 정의됨)
- 성공 시 Zustand 스토어에 사용자 정보 저장, 홈으로 리다이렉트
- 에러 처리 (중복 이메일, 잘못된 비밀번호 등)

#### 1-2. 소셜 로그인

- GitHub OAuth 연동 (Passport GitHub Strategy)
- 로그인/회원가입 페이지에 "GitHub으로 로그인" 버튼
- 소셜 계정 연결 시 자동 회원가입 처리

#### 1-3. 인증 상태 관리

- API 클라이언트에 JWT 토큰 자동 첨부 (Authorization 헤더)
- 토큰 저장/갱신 전략 (localStorage 또는 httpOnly cookie)
- 로그아웃 기능

#### 1-4. 레이아웃 헤더

- 비로그인: 로그인/회원가입 버튼
- 로그인: 사용자 이름 + 드롭다운 메뉴 (마이페이지, 로그아웃)

#### 1-5. 라우트 보호

- 인증 필요 페이지 가드 (미들웨어 또는 HOC)
- 비로그인 사용자 → `/login`으로 리다이렉트

**산출물**: 이메일 또는 GitHub으로 가입/로그인, 인증된 상태에서 서비스 이용 가능

---

### Phase 2. 노코드 템플릿 빌더

> 서비스의 핵심 차별점. A4 고정 캔버스 위에 react-rnd로 블록을 배치하고, tiptap으로 리치 텍스트를 편집하여 이력서 레이아웃을 제작.

#### 2-1. DB 스키마

```
Template
├── id (UUID)
├── userId (FK → User, 제작자)
├── title (템플릿 이름)
├── description (설명)
├── elements (JSON - 블록 요소 배열)
├── thumbnail (사용자 업로드 썸네일 이미지 URL)
├── status (DRAFT | PUBLISHED | ARCHIVED)
├── pricingType (FREE | PAID)
├── price (가격, 0이면 무료)
├── slug (공유용 고유 URL)
├── viewCount (조회수)
├── avgRating (평균 별점, 기본값 0)
├── reviewCount (리뷰 수, 기본값 0)
├── forkedFromId (FK → Template, 복제 원본, nullable)
├── createdAt, updatedAt
```

#### 2-2. 템플릿 elements JSON 구조

```json
{
  "elements": [
    {
      "id": "el-1",
      "type": "shape",
      "x": 0, "y": 0,
      "width": 800, "height": 160,
      "style": { "backgroundColor": "#2563eb", "borderRadius": 0 },
      "editable": false
    },
    {
      "id": "el-2",
      "type": "divider",
      "x": 40, "y": 170,
      "width": 720, "height": 1,
      "style": { "borderColor": "#e5e7eb", "borderWidth": 1 }
    },
    {
      "id": "el-3",
      "type": "text",
      "x": 40, "y": 20,
      "width": 720, "height": 120,
      "placeholder": "이름과 직함을 입력하세요",
      "defaultContent": { "type": "doc", "content": [{ "type": "heading", "attrs": { "level": 1 }, "content": [{ "type": "text", "text": "홍길동" }] }, { "type": "paragraph", "content": [{ "type": "text", "text": "프론트엔드 개발자" }] }] },
      "fieldKey": "profile_header",
      "editable": true
    },
    {
      "id": "el-4",
      "type": "text",
      "x": 40, "y": 190,
      "width": 720, "height": 300,
      "placeholder": "경력 사항을 작성하세요",
      "defaultContent": null,
      "fieldKey": "experience",
      "editable": true
    }
  ]
}
```

요소 타입:
- `shape` — 사각형 등 도형 (배경, 구분 영역). react-rnd로 배치/리사이즈
- `divider` — 구분선
- `text` — tiptap 리치 텍스트 블록 (`editable: true`이면 이력서 작성 시 편집 가능). defaultContent는 tiptap JSON 형식
- `image` — 이미지 블록 (프로필 사진 등)

#### 2-3. 노코드 빌더 UI

- `/builder` — 새 템플릿 제작
- `/builder/[id]` — 기존 템플릿 편집
- **A4 고정 캔버스** (210mm × 297mm 비율)
- 좌측 사이드바: 요소 팔레트 (도형, 구분선, 텍스트 블록, 이미지 추가)
- 중앙 캔버스: react-rnd로 블록 배치, 드래그 이동/리사이즈
- 우측 패널: 선택된 요소의 속성 편집 (색상, 크기, tiptap 기본 콘텐츠 등)
- 상단 툴바: 저장, 미리보기, 발행, 썸네일 업로드
- 자동 저장 (debounce 방식)

#### 2-4. 서버 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /templates | 템플릿 생성 |
| GET | /templates | 내 템플릿 목록 |
| GET | /templates/:id | 템플릿 상세 조회 |
| PATCH | /templates/:id | 템플릿 수정 |
| DELETE | /templates/:id | 템플릿 삭제 |
| PATCH | /templates/:id/publish | 발행/비공개 전환 |
| POST | /templates/:id/fork | 템플릿 복제 (내 소유로 사본 생성) |

- 본인 소유 템플릿만 수정/삭제 가능 (Authorization Guard)
- fork 시 elements JSON을 복사하여 새 Template 레코드 생성, forkedFromId에 원본 ID 기록

#### 2-5. 빌더 렌더링 기술

- **react-rnd**: 블록 요소의 드래그 이동, 리사이즈 핸들
- **tiptap**: 텍스트 블록 내 리치 텍스트 편집 (서식, 링크, 리스트, 헤딩 등)
- 빌더 상태 관리: Zustand로 elements 배열 관리
- 썸네일: 사용자가 직접 이미지 업로드

**산출물**: A4 고정 캔버스에서 react-rnd + tiptap으로 이력서 템플릿 제작, 저장, 복제 가능

---

### Phase 3. 이력서 작성 (템플릿 기반)

> 템플릿을 선택하고, 편집 가능 영역에 tiptap 에디터로 자신의 데이터를 입력하여 이력서 완성.

#### 3-1. DB 스키마

```
Resume
├── id (UUID)
├── userId (FK → User)
├── templateId (FK → Template)
├── title (이력서 제목)
├── content (JSON - 편집 가능 필드에 채운 데이터)
├── status (DRAFT | PUBLISHED | ARCHIVED)
├── pricingType (FREE | PAID)
├── price (가격, 0이면 무료)
├── slug (공유용 고유 URL)
├── viewCount (조회수)
├── avgRating (평균 별점, 기본값 0)
├── reviewCount (리뷰 수, 기본값 0)
├── createdAt, updatedAt
```

Resume content JSON 구조:
```json
{
  "profile_header": { "type": "doc", "content": [{ "type": "heading", "attrs": { "level": 1 }, "content": [{ "type": "text", "text": "홍길동" }] }, { "type": "paragraph", "content": [{ "type": "text", "text": "시니어 프론트엔드 개발자 | 10년 경력" }] }] },
  "experience": { "type": "doc", "content": [{ "type": "heading", "attrs": { "level": 2 }, "content": [{ "type": "text", "text": "경력" }] }] },
  "education": { "type": "doc", "content": [] },
  "skills": { "type": "doc", "content": [] }
}
```

- key는 Template elements의 `fieldKey`에 대응
- value는 tiptap JSON (리치 텍스트)

#### 3-2. 이력서 작성 플로우

```
1. /resumes/new → 템플릿 선택 화면 (내 템플릿 + 공개 템플릿)
2. 템플릿 선택 → 이력서 에디터 진입
3. 에디터: 템플릿 레이아웃 위에 editable 영역만 tiptap 에디터로 편집 가능
4. 좌측: 편집 가능 필드 목록 (tiptap 에디터로 입력)
5. 우측: 템플릿 레이아웃에 데이터가 채워진 실시간 미리보기
6. 자동 저장
```

#### 3-3. 서버 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /resumes | 이력서 생성 (templateId 필수) |
| GET | /resumes | 내 이력서 목록 |
| GET | /resumes/:id | 이력서 상세 조회 |
| PATCH | /resumes/:id | 이력서 수정 (content, pricingType, price 등) |
| DELETE | /resumes/:id | 이력서 삭제 |
| PATCH | /resumes/:id/publish | 발행/비공개 전환 |

- 본인 소유 이력서만 수정/삭제 가능
- 이력서 조회 시 연결된 Template의 elements도 함께 반환 (렌더링용)

#### 3-4. 클라이언트 페이지

- `/resumes` — 내 이력서 목록 (카드 그리드, 썸네일, 상태 뱃지)
- `/resumes/new` — 템플릿 선택 → 이력서 작성
- `/resumes/[id]/edit` — 이력서 편집

**산출물**: 템플릿 기반 이력서 작성, tiptap 에디터 입력 + 실시간 미리보기

---

### Phase 4. 공유 및 탐색

> 템플릿 마켓플레이스와 이력서 탐색을 함께 구현.

#### 4-1. 템플릿 마켓플레이스

- `/templates` — 공개 템플릿 탐색
- 필터: 카테고리(개발자, 디자이너, 일반 등), 무료/유료
- 정렬: 최신순, 인기순(조회수), 평점순, 사용순(이 템플릿으로 만들어진 이력서 수)
- 검색: 제목, 설명 키워드
- `/templates/[id]` — 템플릿 상세 (미리보기, 제작자 정보, 가격, 평균 별점, 리뷰 수)
- 유료 템플릿은 가격 뱃지 표시

#### 4-2. 이력서 탐색

- `/explore` — 공개 이력서 탐색
- 필터: 직군, 기술 스택, 무료/유료
- 정렬: 최신순, 인기순(조회수), 평점순
- `/r/[slug]` — 이력서 열람 (공개 URL)
  - 무료 이력서: 전체 열람
  - 유료 이력서: 미리보기만 → 구매 후 전체 열람 (조회만 가능)

#### 4-3. viewCount 어뷰징 방지

- 본인 콘텐츠 조회는 viewCount 증가 안 함
- 비로그인 조회는 viewCount만 증가, 보상 대상 제외
- 동일 사용자 동일 콘텐츠 일일 중복 조회 제한

#### 4-4. 서버 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /templates/public | 공개 템플릿 목록 (필터/정렬/페이지네이션) |
| GET | /templates/public/:slug | 공개 템플릿 상세 |
| GET | /resumes/public | 공개 이력서 목록 (필터/정렬/페이지네이션) |
| GET | /resumes/public/:slug | 공개 이력서 상세 |

**산출물**: 템플릿 마켓, 이력서 탐색, 공개 URL, 평점순 정렬, SEO 메타태그

---

### Phase 5. 유료 구매 및 보상 시스템

> 템플릿 구매(복제), 이력서 구매(조회), 열람 보상을 통합. 실제 원화 결제 + 포인트 할인.

#### 5-1. DB 스키마

```
User (기존 필드 + 추가)
├── balance (보상 잔액, 기본값 0)
├── point (포인트 잔액, 기본값 0)

Purchase (신규 - 템플릿/이력서 구매 통합)
├── id (UUID)
├── buyerId (FK → User)
├── targetType (TEMPLATE | RESUME)
├── targetId (구매 대상 ID)
├── sellerId (FK → User, 판매자)
├── amount (결제 금액, 원화)
├── pointDiscount (포인트 할인 금액)
├── createdAt

RewardLog (신규)
├── id (UUID)
├── userId (FK → User, 보상 받는 사람)
├── targetType (TEMPLATE | RESUME)
├── targetId (관련 콘텐츠 ID)
├── amount (보상 금액/포인트)
├── type (VIEW_REWARD | PURCHASE_REVENUE | WITHDRAWAL)
├── description (설명)
├── createdAt
```

#### 5-2. 결제 플로우

```
유료 콘텐츠 구매:
  1. 결제 금액 = 콘텐츠 가격 - 포인트 할인 (보유 포인트 범위 내)
  2. 원화 결제 (PG사 미정) → 결제 성공
  3. Purchase 레코드 생성
  4. 판매자 balance += 콘텐츠 가격의 90%
  5. 구매자 point -= 사용한 포인트

템플릿 구매:
  → 구매 완료 후 fork API 호출 가능 (복제하여 내 소유로 수정 가능)

이력서 구매:
  → 구매 완료 후 전체 열람 허용 (조회만, 수정 불가)

무료 ↔ 유료 전환:
  PATCH /templates/:id 또는 PATCH /resumes/:id 로 pricingType, price 변경
  기존 Purchase 기록은 유지 (이미 구매한 사람의 권한 유지)
```

#### 5-3. 보상 정책

- **무료 콘텐츠 열람**: viewCount 일정 단위(예: 10회)마다 소액 포인트 적립
- **유료 콘텐츠 구매**: 구매 금액의 90%가 판매자 balance에 즉시 적립
- viewCount 기반 단순 계산 (별도 열람 로그 테이블 없음)
- 템플릿과 이력서 모두 동일한 보상 정책 적용

#### 5-4. 서버 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /purchases | 구매 (targetType + targetId, 포인트 할인 포함) |
| GET | /purchases/access | 열람 권한 확인 (targetType + targetId) |
| GET | /users/me/balance | 현재 잔액 조회 (balance + point) |
| GET | /users/me/rewards | 보상 내역 (RewardLog 목록) |

**산출물**: 원화 결제 + 포인트 할인, 템플릿 구매→복제, 이력서 구매→조회, 보상 적립, 잔액/내역 확인

---

### Phase 6. 피드백 시스템

> 이력서에 대한 비공개 첨삭 피드백. 이력서 작성자(본인)만 열람 가능.

#### 6-1. DB 스키마

```
Feedback
├── id (UUID)
├── resumeId (FK → Resume)
├── reviewerId (FK → User, 피드백 작성자)
├── content (피드백 내용, 최대 2,000자)
├── rating (1~5 점수, 선택)
├── sectionKey (특정 필드에 대한 피드백, 선택 — Template의 fieldKey 대응)
├── createdAt, updatedAt
```

> 피드백 요청 게시판은 초기에 도입하지 않음. 사용자 수 증가 후 검토.

#### 6-2. 서버 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /feedbacks | 피드백 작성 |
| GET | /feedbacks/resume/:resumeId | 이력서별 피드백 목록 (이력서 소유자만 조회 가능) |
| GET | /feedbacks/my | 내가 받은/작성한 피드백 |
| DELETE | /feedbacks/:id | 본인 피드백 삭제 |

- 피드백은 **비공개** — 이력서 작성자(본인)만 열람 가능
- 피드백 작성자 본인도 자신이 작성한 피드백은 열람 가능

#### 6-3. 클라이언트 페이지

- 이력서 열람 페이지(`/r/[slug]`)에 피드백 작성 폼 (로그인 사용자)
- 이력서 편집/상세 페이지에서 본인만 받은 피드백 열람
- `/mypage/feedbacks` — 피드백 대시보드 (받은 피드백, 작성한 피드백)

**산출물**: 이력서에 비공개 첨삭 피드백 작성, 이력서 작성자만 열람

---

### Phase 7. 평가 (리뷰) 시스템

> 판매자, 템플릿, 이력서에 대해 누구나(로그인 사용자) 별점 + 리뷰를 남길 수 있는 공개 평가 시스템.

#### 7-1. DB 스키마

```
Review
├── id (UUID)
├── authorId (FK → User, 리뷰 작성자)
├── targetType (SELLER | TEMPLATE | RESUME)
├── targetId (대상 ID — User ID 또는 Template/Resume ID)
├── rating (1~5 별점, 필수)
├── content (리뷰 텍스트 — 판매자: 최대 200자, 템플릿/이력서: 최대 500자)
├── isPurchased (구매 인증 여부, Purchase 기록 기반 자동 설정)
├── createdAt, updatedAt
```

- UNIQUE 제약: (authorId, targetType, targetId) — 1인 1리뷰
- isPurchased는 리뷰 생성 시 서버에서 Purchase 기록 유무를 확인하여 자동 설정

#### 7-2. 평가 정책

- **누구나 작성 가능**: 로그인한 사용자라면 리뷰 작성 가능
- **구매 인증 뱃지**: 유료 구매 이력이 있는 사용자의 리뷰에 "구매 인증" 뱃지 표시
- **1인 1리뷰**: 동일 대상에 대해 한 번만 작성 가능 (수정은 가능)
- **삭제 불가**: 작성자가 수정만 가능, 삭제는 신고 후 관리자 처리
- **평균 별점 노출**: 상세 페이지 및 목록에 avgRating, reviewCount 표시
- **판매자 평점**: 해당 판매자가 받은 모든 리뷰(판매자/템플릿/이력서) 별점의 평균으로 자동 산출

#### 7-3. 서버 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /reviews | 리뷰 작성 (targetType + targetId + rating + content) |
| PATCH | /reviews/:id | 리뷰 수정 (본인만, rating + content) |
| GET | /reviews | 대상별 리뷰 목록 (targetType + targetId, 페이지네이션) |
| GET | /reviews/my | 내가 작성한/받은 리뷰 |

- 리뷰 생성 시 대상의 avgRating, reviewCount 자동 갱신
- 판매자(SELLER) 리뷰의 targetId는 User ID
- 판매자 평점은 해당 판매자의 모든 콘텐츠 리뷰 + 직접 판매자 리뷰를 합산하여 산출

#### 7-4. 클라이언트 페이지

- `/templates/[id]` — 템플릿 상세 페이지에 리뷰 섹션 (리뷰 목록 + 작성 폼)
- `/r/[slug]` — 이력서 열람 페이지에 리뷰 섹션
- `/users/[id]` — 공개 프로필에 판매자 평점 + 리뷰 목록
- `/mypage/reviews` — 내 리뷰 관리 (작성한 리뷰, 받은 리뷰)

**산출물**: 판매자/템플릿/이력서 리뷰 작성/수정, 구매 인증 뱃지, 평점순 정렬

---

### Phase 8. 프로필, 마이페이지, 알림

> 사용자 정보 관리, 활동 내역, 알림.

#### 8-1. DB 스키마 확장

```
User (기존 필드 + 추가)
├── bio (자기소개)
├── profileImage (프로필 이미지 URL)
├── avgRating (판매자 평균 별점, 기본값 0)
├── reviewCount (받은 리뷰 수, 기본값 0)

Notification (신규)
├── id (UUID)
├── userId (FK → User, 알림 받는 사람)
├── type (FEEDBACK_RECEIVED | TEMPLATE_PURCHASED | RESUME_PURCHASED | REWARD_EARNED | REVIEW_RECEIVED)
├── message (알림 메시지)
├── referenceId (관련 엔티티 ID, 선택)
├── isRead (읽음 여부, 기본값 false)
├── createdAt
```

#### 8-2. 알림 시스템

인앱 알림(DB 기반)으로 시작. 이메일/푸시는 추후 확장.

알림 발생 이벤트:
- "내 이력서에 피드백이 달렸습니다"
- "내 템플릿이 구매되었습니다"
- "내 이력서가 구매되었습니다"
- "보상 N포인트가 적립되었습니다"
- "내 템플릿/이력서에 리뷰가 등록되었습니다"

#### 8-3. 페이지

- `/mypage` — 마이페이지
  - 프로필 정보 수정 (이름, 자기소개, 프로필 이미지)
  - 내 템플릿 목록 / 내 이력서 목록
  - 보상 잔액/내역
  - 피드백 활동 내역
  - 리뷰 관리 (작성한/받은 리뷰)
  - 계정 설정 (비밀번호 변경, 회원 탈퇴)
- `/users/[id]` — 공개 프로필 (공개 템플릿 + 공개 이력서 목록, 판매자 평점, 리뷰 목록)

#### 8-4. 서버 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /users/me | 내 프로필 조회 (balance, point 포함) |
| PATCH | /users/me | 프로필 수정 |
| GET | /users/:id | 공개 프로필 조회 (avgRating, reviewCount 포함) |
| PATCH | /users/me/password | 비밀번호 변경 |
| DELETE | /users/me | 회원 탈퇴 |
| GET | /notifications | 내 알림 목록 |
| PATCH | /notifications/:id/read | 알림 읽음 처리 |
| PATCH | /notifications/read-all | 전체 읽음 처리 |

**산출물**: 프로필 관리, 공개 프로필 (판매자 평점 포함), 인앱 알림

---

## 개발 우선순위 요약

```
Phase 1 (인증 + 소셜 로그인)      ██████████ 기반 — 모든 기능의 전제
Phase 2 (노코드 템플릿 빌더)      ██████████ 핵심 — 서비스의 핵심 차별점
Phase 3 (이력서 작성)             ████████── 핵심 — 템플릿 기반 이력서 완성
Phase 4 (공유/탐색)               ██████──── 성장 — 템플릿 마켓, 이력서 탐색
Phase 5 (유료 구매 + 보상)        ██████──── 수익 — 원화 결제, 보상 시스템
Phase 6 (피드백)                  ████────── 소셜 — 비공개 첨삭 피드백
Phase 7 (평가/리뷰)               ████────── 신뢰 — 공개 리뷰, 구매 인증 뱃지
Phase 8 (프로필/마이페이지/알림)  ████────── 보완 — 사용자 관리, 재방문 유도
```

## 기술적 고려사항

### 전 Phase 공통

- **shared 패키지 활용**: 각 Phase에서 추가되는 API 요청/응답 타입은 shared에 정의
- **에러 핸들링 통일**: 서버 에러 응답 형식 표준화, 클라이언트 에러 바운더리
- **TanStack Query 패턴**: API 호출은 커스텀 훅으로 추상화
- **낙관적 업데이트**: 삭제/수정 시 즉각적인 UI 반영

### 소셜 로그인 (Phase 1)

- Passport GitHub Strategy (passport-github2)
- OAuth callback 처리, 기존 계정 연결/신규 생성 분기

### 빌더 렌더링 (Phase 2)

- **react-rnd**: 블록 요소의 드래그 이동, 리사이즈 핸들, A4 고정 캔버스 내 배치
- **tiptap**: 텍스트 블록 내 리치 텍스트 편집 (서식, 링크, 리스트, 헤딩 등)
- 빌더 상태 관리: Zustand로 elements 배열 관리
- 썸네일: 사용자가 직접 이미지 업로드

### 파일 업로드 (Phase 2, 8)

- 템플릿 썸네일, 프로필 이미지
- S3 또는 Cloudflare R2 + presigned URL 방식 권장
- NestJS Multer 모듈 사용

### 검색/필터 (Phase 4)

- PostgreSQL full-text search 또는 LIKE 쿼리로 시작
- 필요 시 Elasticsearch 도입 검토

### 어뷰징 방지 (Phase 4)

- 본인 콘텐츠 조회 시 viewCount 증가 안 함
- 비로그인 조회는 보상 대상 제외
- 동일 사용자 동일 콘텐츠 일일 중복 조회 제한

### 결제 연동 (Phase 5)

- 실제 원화 결제 (PG사 미정)
- 구매 금액의 90%를 판매자 balance에 즉시 적립
- 포인트 할인: 보유 포인트로 원화 결제 금액 차감 가능
- 출금 기능은 추후 구현

### 보상 계산 (Phase 5)

- viewCount 기반 단순 계산 (별도 열람 로그 테이블 없이 경량 운영)
- 무료 콘텐츠: 일정 조회 단위마다 소액 포인트
- 유료 콘텐츠: 구매 금액의 수수료 제외분 적립
- Purchase 테이블로 구매자 식별 (열람/복제 권한 판단용)

### 리뷰 시스템 (Phase 7)

- avgRating, reviewCount는 비정규화 필드 — 리뷰 생성/수정 시 트리거로 갱신
- 판매자 평점은 해당 판매자의 모든 리뷰(직접 + 콘텐츠) 합산 평균
- 최소 리뷰 수 필터: 평점순 정렬 시 리뷰 5개 이상인 콘텐츠만 노출
