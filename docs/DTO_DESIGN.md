# Readyme DTO 설계문서

PROPOSAL.md 기반 전체 도메인 DTO 정의.

- **shared/**: 프레임워크 비의존 interface (client + server 공유)
- **server/**: class-validator 데코레이터가 적용된 DTO class

---

## 공통 타입

### shared/src/types/common.ts

```typescript
/** 페이지네이션 요청 파라미터 */
export interface PaginationParams {
  page?: number;   // default: 1
  limit?: number;  // default: 20, max: 100
}

/** 페이지네이션 응답 래퍼 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/** 정렬 기준 */
export type SortOrder = 'latest' | 'popular' | 'rating';

/** 가격 유형 */
export type PricingType = 'FREE' | 'PAID';

/** 구매/리뷰 대상 유형 */
export type TargetType = 'TEMPLATE' | 'RESUME';

/** 리뷰 대상 유형 (판매자 포함) */
export type ReviewTargetType = 'SELLER' | 'TEMPLATE' | 'RESUME';

/** 템플릿 상태 */
export type TemplateStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

/** 이력서 상태 */
export type ResumeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

/** 보상 유형 */
export type RewardType = 'VIEW_REWARD' | 'PURCHASE_EARNING' | 'POINT_USAGE';

/** 알림 유형 */
export type NotificationType =
  | 'FEEDBACK_RECEIVED'
  | 'PURCHASE_RECEIVED'
  | 'REWARD_EARNED'
  | 'REVIEW_RECEIVED';
```

### shared/src/constants/common.ts

```typescript
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const PRICING = {
  PLATFORM_FEE_RATE: 0.1,   // 10%
  SELLER_RATE: 0.9,          // 90%
  VIEW_REWARD_THRESHOLD: 10, // 10회당
  VIEW_REWARD_AMOUNT: 100,   // 100P
} as const;
```

---

## 1. User

### shared/src/types/user.ts

```typescript
/** 사용자 공개 프로필 응답 */
export interface UserProfileResponse {
  id: string;
  name: string | null;
  bio: string | null;
  profileImage: string | null;
  avgRating: number;
  reviewCount: number;
  createdAt: string;
}

/** 내 프로필 응답 (비공개 필드 포함) */
export interface MyProfileResponse extends UserProfileResponse {
  email: string;
  balance: number;
}

/** 프로필 수정 요청 */
export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  profileImage?: string;
}
```

### server DTO

| DTO              | 필드                                     | 검증                               |
| ---------------- | ---------------------------------------- | ---------------------------------- |
| UpdateProfileDto | name?, bio?, profileImage?               | name: MinLength(2), bio: MaxLength(500) |

---

## 2. Template

### shared/src/types/template.ts

```typescript
/** 템플릿 요소 타입 */
export type TemplateElementType = 'rect' | 'line' | 'markdown';

/** 요소 공통 속성 */
export interface BaseElement {
  id: string;
  type: TemplateElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  locked: boolean;
}

/** 사각형 요소 */
export interface RectElement extends BaseElement {
  type: 'rect';
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius: number;
  opacity: number;
}

/** 선 요소 */
export interface LineElement extends BaseElement {
  type: 'line';
  stroke: string;
  strokeWidth: number;
  opacity: number;
}

/** 마크다운 텍스트 블록 */
export interface MarkdownElement extends BaseElement {
  type: 'markdown';
  content: Record<string, unknown>;   // tiptap JSON
  fieldKey: string;
  placeholder: string;
  editable: boolean;
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  padding: number;
}

/** 요소 유니온 타입 */
export type TemplateElement = RectElement | LineElement | MarkdownElement;

/** 캔버스 설정 */
export interface CanvasConfig {
  width: number;    // 794
  height: number;   // 1123
}

/** 템플릿 데이터 (DB JSON 컬럼에 저장) */
export interface TemplateData {
  canvasConfig: CanvasConfig;
  elements: TemplateElement[];
}

/** 템플릿 생성 요청 */
export interface CreateTemplateRequest {
  title: string;
  description?: string;
  data: TemplateData;
}

/** 템플릿 수정 요청 */
export interface UpdateTemplateRequest {
  title?: string;
  description?: string;
  data?: TemplateData;
  thumbnail?: string;
}

/** 템플릿 게시 설정 변경 요청 */
export interface PublishTemplateRequest {
  status: TemplateStatus;
  pricingType?: PricingType;
  price?: number;            // pricingType이 PAID일 때 필수
}

/** 템플릿 목록 조회 파라미터 */
export interface TemplateListParams extends PaginationParams {
  sort?: SortOrder;
  pricingType?: PricingType;
  category?: string;
  search?: string;
}

/** 템플릿 요약 응답 (목록용) */
export interface TemplateSummaryResponse {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  status: TemplateStatus;
  pricingType: PricingType;
  price: number;
  viewCount: number;
  avgRating: number;
  reviewCount: number;
  user: { id: string; name: string | null; profileImage: string | null };
  createdAt: string;
}

/** 템플릿 상세 응답 */
export interface TemplateDetailResponse extends TemplateSummaryResponse {
  data: TemplateData;
  slug: string;
  forkedFromId: string | null;
  updatedAt: string;
}

/** 내 템플릿 응답 (관리용, 비공개 필드 포함) */
export interface MyTemplateResponse extends TemplateDetailResponse {
  // 목록에서 DRAFT 포함 전체 노출
}
```

### server DTO

| DTO                 | 필드                                     | 검증                                                                 |
| ------------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| CreateTemplateDto   | title, description?, data                | title: MinLength(1), MaxLength(100). data: IsObject, ValidateNested  |
| UpdateTemplateDto   | title?, description?, data?, thumbnail?  | PartialType(CreateTemplateDto) + thumbnail: IsUrl, IsOptional        |
| PublishTemplateDto  | status, pricingType?, price?             | status: IsEnum. price: Min(0), PAID일 때 조건부 필수                 |
| TemplateListDto     | page?, limit?, sort?, pricingType?, category?, search? | 각 필드 IsOptional + 타입 검증                          |

### API 엔드포인트

| Method | Endpoint                 | Auth  | 요청 DTO            | 응답                                    |
| ------ | ------------------------ | ----- | -------------------- | --------------------------------------- |
| POST   | /templates               | JWT   | CreateTemplateDto    | TemplateDetailResponse                  |
| GET    | /templates               | -     | TemplateListDto (query) | PaginatedResponse\<TemplateSummaryResponse\> |
| GET    | /templates/my            | JWT   | TemplateListDto (query) | PaginatedResponse\<MyTemplateResponse\> |
| GET    | /templates/:id           | -     | -                    | TemplateDetailResponse                  |
| PATCH  | /templates/:id           | Owner | UpdateTemplateDto    | TemplateDetailResponse                  |
| PATCH  | /templates/:id/publish   | Owner | PublishTemplateDto   | TemplateDetailResponse                  |
| DELETE | /templates/:id           | Owner | -                    | -                                       |
| POST   | /templates/:id/fork      | JWT   | -                    | TemplateDetailResponse                  |

---

## 3. Resume

### shared/src/types/resume.ts

```typescript
/**
 * 이력서 콘텐츠 (DB JSON 컬럼)
 * fieldKey → tiptap JSON 매핑
 */
export interface ResumeContent {
  [fieldKey: string]: Record<string, unknown>;
}

/** 이력서 생성 요청 */
export interface CreateResumeRequest {
  templateId: string;
  title: string;
}

/** 이력서 수정 요청 */
export interface UpdateResumeRequest {
  title?: string;
  content?: ResumeContent;
  thumbnail?: string;
}

/** 이력서 게시 설정 변경 요청 */
export interface PublishResumeRequest {
  status: ResumeStatus;
  pricingType?: PricingType;
  price?: number;
}

/** 이력서 목록 조회 파라미터 */
export interface ResumeListParams extends PaginationParams {
  sort?: SortOrder;
  pricingType?: PricingType;
  search?: string;
}

/** 이력서 요약 응답 (목록/탐색용) */
export interface ResumeSummaryResponse {
  id: string;
  title: string;
  thumbnail: string | null;
  slug: string;
  status: ResumeStatus;
  pricingType: PricingType;
  price: number;
  viewCount: number;
  avgRating: number;
  reviewCount: number;
  user: { id: string; name: string | null; profileImage: string | null };
  template: { id: string; title: string } | null;
  createdAt: string;
}

/** 이력서 상세 응답 (열람용) */
export interface ResumeDetailResponse extends ResumeSummaryResponse {
  content: ResumeContent;
  templateData: TemplateData;   // 렌더링에 필요한 템플릿 레이아웃
  updatedAt: string;
}

/** 내 이력서 응답 (편집용) */
export interface MyResumeResponse extends ResumeDetailResponse {
  // DRAFT 포함 전체 노출
}
```

### server DTO

| DTO               | 필드                                    | 검증                                                     |
| ------------------ | --------------------------------------- | -------------------------------------------------------- |
| CreateResumeDto    | templateId, title                       | templateId: IsUUID. title: MinLength(1), MaxLength(100)  |
| UpdateResumeDto    | title?, content?, thumbnail?            | title: MaxLength(100). content: IsObject                 |
| PublishResumeDto   | status, pricingType?, price?            | status: IsEnum. price: Min(0)                            |
| ResumeListDto      | page?, limit?, sort?, pricingType?, search? | 각 필드 IsOptional + 타입 검증                       |

### API 엔드포인트

| Method | Endpoint                | Auth  | 요청 DTO             | 응답                                      |
| ------ | ----------------------- | ----- | --------------------- | ----------------------------------------- |
| POST   | /resumes                | JWT   | CreateResumeDto       | MyResumeResponse                          |
| GET    | /resumes/my             | JWT   | ResumeListDto (query) | PaginatedResponse\<MyResumeResponse\>     |
| GET    | /resumes/:id            | JWT/Owner | -                 | MyResumeResponse (본인) 또는 ResumeDetailResponse |
| PATCH  | /resumes/:id            | Owner | UpdateResumeDto       | MyResumeResponse                          |
| PATCH  | /resumes/:id/publish    | Owner | PublishResumeDto      | MyResumeResponse                          |
| DELETE | /resumes/:id            | Owner | -                     | -                                         |
| GET    | /explore                | -     | ResumeListDto (query) | PaginatedResponse\<ResumeSummaryResponse\> |
| GET    | /r/:slug                | -     | -                     | ResumeDetailResponse (공개 URL)           |

---

## 4. Purchase

### shared/src/types/purchase.ts

```typescript
/** 구매 요청 */
export interface CreatePurchaseRequest {
  targetType: TargetType;
  targetId: string;
  usePoints?: number;        // 포인트 할인 적용액
}

/** 구매 응답 */
export interface PurchaseResponse {
  id: string;
  targetType: TargetType;
  targetId: string;
  amount: number;            // 실결제 금액
  pointsUsed: number;        // 포인트 사용액
  createdAt: string;
}

/** 내 구매 내역 조회 파라미터 */
export interface PurchaseListParams extends PaginationParams {
  targetType?: TargetType;
}

/** 구매 내역 응답 (목록용) */
export interface PurchaseHistoryResponse extends PurchaseResponse {
  target: {
    id: string;
    title: string;
    thumbnail: string | null;
    user: { id: string; name: string | null };
  };
}
```

### server DTO

| DTO                | 필드                          | 검증                                            |
| ------------------ | ----------------------------- | ----------------------------------------------- |
| CreatePurchaseDto  | targetType, targetId, usePoints? | targetType: IsEnum. targetId: IsUUID. usePoints: Min(0) |
| PurchaseListDto    | page?, limit?, targetType?    | 각 필드 IsOptional + 타입 검증                  |

### API 엔드포인트

| Method | Endpoint                  | Auth | 요청 DTO            | 응답                                          |
| ------ | ------------------------- | ---- | -------------------- | --------------------------------------------- |
| POST   | /purchases                | JWT  | CreatePurchaseDto    | PurchaseResponse                              |
| GET    | /purchases/my             | JWT  | PurchaseListDto (query) | PaginatedResponse\<PurchaseHistoryResponse\> |
| GET    | /purchases/check/:targetType/:targetId | JWT | - | `{ purchased: boolean }`                     |

---

## 5. Feedback

### shared/src/types/feedback.ts

```typescript
/** 피드백 생성 요청 */
export interface CreateFeedbackRequest {
  resumeId: string;
  fieldKey?: string;          // 특정 섹션 지정 (없으면 전체 피드백)
  content: string;            // 최대 2,000자
  rating: number;             // 1~5
}

/** 피드백 수정 요청 */
export interface UpdateFeedbackRequest {
  content?: string;
  rating?: number;
}

/** 피드백 응답 */
export interface FeedbackResponse {
  id: string;
  resumeId: string;
  fieldKey: string | null;
  content: string;
  rating: number;
  user: { id: string; name: string | null; profileImage: string | null };
  createdAt: string;
  updatedAt: string;
}

/** 피드백 목록 조회 파라미터 */
export interface FeedbackListParams extends PaginationParams {
  fieldKey?: string;
}
```

### server DTO

| DTO                | 필드                                | 검증                                                          |
| ------------------ | ----------------------------------- | ------------------------------------------------------------- |
| CreateFeedbackDto  | resumeId, fieldKey?, content, rating | resumeId: IsUUID. content: MaxLength(2000). rating: Min(1), Max(5) |
| UpdateFeedbackDto  | content?, rating?                   | content: MaxLength(2000). rating: Min(1), Max(5)              |
| FeedbackListDto    | page?, limit?, fieldKey?            | 각 필드 IsOptional                                            |

### API 엔드포인트

| Method | Endpoint                        | Auth      | 요청 DTO            | 응답                                       |
| ------ | ------------------------------- | --------- | -------------------- | ------------------------------------------ |
| POST   | /resumes/:id/feedbacks          | JWT       | CreateFeedbackDto    | FeedbackResponse                           |
| GET    | /resumes/:id/feedbacks          | Owner     | FeedbackListDto (query) | PaginatedResponse\<FeedbackResponse\>   |
| PATCH  | /feedbacks/:id                  | 작성자    | UpdateFeedbackDto    | FeedbackResponse                           |
| DELETE | /feedbacks/:id                  | 작성자    | -                    | -                                          |

> 피드백은 이력서 작성자(본인)만 열람 가능 (비공개)

---

## 6. Review

### shared/src/types/review.ts

```typescript
/** 리뷰 생성 요청 */
export interface CreateReviewRequest {
  targetType: ReviewTargetType;
  targetId: string;
  rating: number;              // 1~5
  content: string;             // SELLER: 최대 200자, TEMPLATE/RESUME: 최대 500자
}

/** 리뷰 수정 요청 */
export interface UpdateReviewRequest {
  rating?: number;
  content?: string;
}

/** 리뷰 응답 */
export interface ReviewResponse {
  id: string;
  targetType: ReviewTargetType;
  targetId: string;
  rating: number;
  content: string;
  isPurchased: boolean;        // 구매 인증 뱃지 여부
  user: { id: string; name: string | null; profileImage: string | null };
  createdAt: string;
  updatedAt: string;
}

/** 리뷰 목록 조회 파라미터 */
export interface ReviewListParams extends PaginationParams {
  targetType?: ReviewTargetType;
  sort?: 'latest' | 'rating_high' | 'rating_low';
}

/** 평점 요약 */
export interface RatingSummary {
  avgRating: number;
  reviewCount: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;  // 별점별 개수
}
```

### server DTO

| DTO              | 필드                                | 검증                                                                     |
| ---------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| CreateReviewDto  | targetType, targetId, rating, content | targetType: IsEnum. targetId: IsUUID. rating: Min(1), Max(5). content: MaxLength(500) |
| UpdateReviewDto  | rating?, content?                   | rating: Min(1), Max(5). content: MaxLength(500)                          |
| ReviewListDto    | page?, limit?, targetType?, sort?   | 각 필드 IsOptional + 타입 검증                                           |

### API 엔드포인트

| Method | Endpoint                     | Auth   | 요청 DTO          | 응답                                     |
| ------ | ---------------------------- | ------ | ------------------ | ---------------------------------------- |
| POST   | /reviews                     | JWT    | CreateReviewDto    | ReviewResponse                           |
| GET    | /reviews                     | -      | ReviewListDto (query) | PaginatedResponse\<ReviewResponse\>   |
| GET    | /reviews/summary/:targetType/:targetId | - | -            | RatingSummary                            |
| PATCH  | /reviews/:id                 | 작성자 | UpdateReviewDto    | ReviewResponse                           |

> 1인 1리뷰 (동일 대상 중복 작성 불가), 삭제 불가 (수정만 가능)

---

## 7. RewardLog

### shared/src/types/reward.ts

```typescript
/** 보상 내역 응답 */
export interface RewardLogResponse {
  id: string;
  type: RewardType;
  amount: number;              // 양수: 적립, 음수: 차감
  balance: number;             // 거래 후 잔액
  description: string;
  referenceType: TargetType | null;
  referenceId: string | null;
  createdAt: string;
}

/** 보상 내역 조회 파라미터 */
export interface RewardListParams extends PaginationParams {
  type?: RewardType;
}

/** 보상 요약 */
export interface RewardSummaryResponse {
  balance: number;
  totalEarned: number;
  totalUsed: number;
}
```

### server DTO

| DTO            | 필드                  | 검증                            |
| -------------- | --------------------- | ------------------------------- |
| RewardListDto  | page?, limit?, type?  | 각 필드 IsOptional + 타입 검증  |

### API 엔드포인트

| Method | Endpoint            | Auth | 요청 DTO              | 응답                                       |
| ------ | ------------------- | ---- | ---------------------- | ------------------------------------------ |
| GET    | /rewards            | JWT  | RewardListDto (query)  | PaginatedResponse\<RewardLogResponse\>     |
| GET    | /rewards/summary    | JWT  | -                      | RewardSummaryResponse                      |

> RewardLog는 시스템이 자동 생성 (구매/열람 시). 사용자 직접 생성 API 없음.

---

## 8. Notification

### shared/src/types/notification.ts

```typescript
/** 알림 응답 */
export interface NotificationResponse {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  referenceType: TargetType | ReviewTargetType | null;
  referenceId: string | null;
  createdAt: string;
}

/** 알림 목록 조회 파라미터 */
export interface NotificationListParams extends PaginationParams {
  isRead?: boolean;
}

/** 읽지 않은 알림 수 응답 */
export interface UnreadCountResponse {
  count: number;
}
```

### server DTO

| DTO                  | 필드                   | 검증                           |
| -------------------- | ---------------------- | ------------------------------ |
| NotificationListDto  | page?, limit?, isRead? | 각 필드 IsOptional + 타입 검증 |

### API 엔드포인트

| Method | Endpoint                   | Auth | 요청 DTO                  | 응답                                          |
| ------ | -------------------------- | ---- | -------------------------- | --------------------------------------------- |
| GET    | /notifications             | JWT  | NotificationListDto (query) | PaginatedResponse\<NotificationResponse\>    |
| GET    | /notifications/unread-count | JWT | -                          | UnreadCountResponse                           |
| PATCH  | /notifications/:id/read    | JWT  | -                          | NotificationResponse                          |
| PATCH  | /notifications/read-all    | JWT  | -                          | `{ count: number }` (처리 건수)               |

> Notification은 시스템이 자동 생성. 사용자는 읽음 처리만 가능.

---

## 파일 배치 요약

### shared/src/types/

| 파일               | 내용                                         |
| ------------------ | -------------------------------------------- |
| common.ts          | PaginationParams, PaginatedResponse, enum 타입 |
| auth.ts            | LoginRequest, RegisterRequest, AuthResponse (기존) |
| user.ts            | UserProfileResponse, UpdateProfileRequest    |
| template.ts        | TemplateElement, TemplateData, CRUD 요청/응답 |
| resume.ts          | ResumeContent, CRUD 요청/응답                |
| purchase.ts        | CreatePurchaseRequest, PurchaseResponse       |
| feedback.ts        | CreateFeedbackRequest, FeedbackResponse       |
| review.ts          | CreateReviewRequest, ReviewResponse, RatingSummary |
| reward.ts          | RewardLogResponse, RewardSummaryResponse      |
| notification.ts    | NotificationResponse, UnreadCountResponse     |

### shared/src/constants/

| 파일               | 내용                                         |
| ------------------ | -------------------------------------------- |
| index.ts           | AUTH (기존)                                   |
| common.ts          | PAGINATION, PRICING                          |
| template.ts        | CANVAS, ELEMENT                              |

### server DTO 위치

```
server/src/
  auth/dto/           # 기존
  users/dto/           # UpdateProfileDto
  templates/dto/       # CreateTemplateDto, UpdateTemplateDto, PublishTemplateDto
  resumes/dto/         # CreateResumeDto, UpdateResumeDto, PublishResumeDto
  purchases/dto/       # CreatePurchaseDto
  feedbacks/dto/       # CreateFeedbackDto, UpdateFeedbackDto
  reviews/dto/         # CreateReviewDto, UpdateReviewDto
  rewards/dto/         # RewardListDto
  notifications/dto/   # NotificationListDto
```
