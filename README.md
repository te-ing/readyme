# Readyme

**이력서 템플릿을 만들고, 공유하고, 보상받는 플랫폼**

Readyme는 노코드 빌더로 이력서 템플릿을 직접 제작하고, 이를 공유하거나 판매할 수 있는 플랫폼입니다. 다른 사람의 템플릿을 가져와 나만의 이력서를 완성하고, 완성된 이력서도 공유하거나 판매할 수 있습니다. 열람이 늘어날수록 작성자에게 보상이 돌아갑니다.

## 핵심 개념

### 템플릿 (Template)

react-rnd + tiptap 빌더로 제작하는 이력서 레이아웃입니다.

- A4 고정 캔버스(794 × 1123px, canvasConfig)에서 사각형(`rect`), 선(`line`), 마크다운 텍스트(`markdown`)를 자유롭게 배치
- 마크다운 블록에 `editable` 속성으로 이력서 작성 시 편집 가능 영역 지정
- 무료/유료로 공유 가능
- **구매 시 복제하여 자유롭게 수정 가능**

### 이력서 (Resume)

템플릿에 유저가 원하는 텍스트를 채워 완성한 결과물입니다.

- 템플릿의 편집 가능 영역에 tiptap 에디터로 데이터 입력
- 무료/유료로 공유 가능
- **구매 시 조회만 가능 (읽기 전용)**

```
[react-rnd + tiptap 빌더] → 템플릿 제작 → 공유/판매 (구매자: 복제 후 수정 가능)
                               ↓
                         템플릿 선택 → 데이터 입력 → 이력서 완성 → 공유/판매 (구매자: 조회만 가능)
```

## 핵심 기능

- **노코드 템플릿 빌더**: react-rnd + tiptap 기반 A4 고정 캔버스에서 사각형(`rect`), 선(`line`), 마크다운(`markdown`)으로 이력서 레이아웃 직접 제작
- **템플릿 마켓플레이스**: 템플릿 탐색/공유/판매, 구매 시 복제하여 커스터마이징
- **이력서 작성**: 템플릿의 편집 가능 영역에 tiptap 에디터로 데이터 입력, 실시간 미리보기
- **이력서 공유**: 공개 URL로 이력서 공유/판매, 구매자는 조회만 가능
- **열람 보상**: 템플릿/이력서 조회수 기반 잔액(balance) 적립, 유료 판매 수익의 90% 적립
- **피드백**: 이력서에 대한 비공개 첨삭 피드백 (작성자 본인만 열람)
- **평가(리뷰)**: 판매자/템플릿/이력서에 별점+리뷰, 구매 인증 뱃지, 평점순 탐색

## 개발 로드맵

| Phase | 기능                                                 | 상태                          |
| ----- | ---------------------------------------------------- | ----------------------------- |
| 1     | 인증 (로그인/회원가입, GitHub 소셜 로그인)           | 서버 완료 / 클라이언트 미구현 |
| 2     | 노코드 템플릿 빌더 (react-rnd + tiptap, A4 캔버스)   | 미구현                        |
| 3     | 이력서 작성 (템플릿 기반 데이터 입력, 자동 저장)     | 미구현                        |
| 4     | 공유/탐색 (템플릿 마켓, 이력서 탐색, 공개 URL)       | 미구현                        |
| 5     | 유료 구매 + 보상 (원화 결제, 잔액 할인, 보상 적립)   | 미구현                        |
| 6     | 피드백 (이력서에 비공개 첨삭 피드백)                 | 미구현                        |
| 7     | 평가/리뷰 (별점+리뷰, 구매 인증 뱃지, 평점순 탐색)   | 미구현                        |
| 8     | 프로필/마이페이지/알림                               | 미구현                        |

> MVP: Phase 1~4 완성 시 핵심 루프 동작 (가입 → 템플릿 제작/탐색 → 이력서 작성 → 공유)

## 기술 스택

| 영역   | 기술                                                                                                            |
| ------ | --------------------------------------------------------------------------------------------------------------- |
| Client | Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, React Hook Form + Zod, TanStack Query |
| Server | NestJS, TypeScript, Prisma + PostgreSQL, Passport (Local + JWT), class-validator, Swagger                       |
| Shared | client/server 간 공유 API 타입, 상수, 유틸리티                                                                  |
| Infra  | Docker (PostgreSQL), pnpm workspace (모노레포)                                                                  |

## 프로젝트 구조

```
readyme/
├── client/          # Next.js 15 앱
│   ├── src/
│   │   ├── app/           # App Router
│   │   ├── components/    # UI 컴포넌트
│   │   ├── features/      # 기능별 컴포넌트/훅 (builder 등)
│   │   ├── hooks/         # 커스텀 훅
│   │   ├── stores/        # Zustand 스토어
│   │   ├── lib/           # 유틸리티
│   │   └── types/         # 타입 정의
│   └── ...
├── server/          # NestJS 앱
│   ├── src/
│   │   ├── {domain}/      # 도메인별 모듈 (auth, users, templates, resumes ...)
│   │   └── prisma/        # Prisma 설정
│   └── ...
├── shared/          # 공유 타입, 상수, 유틸리티
├── docs/            # 설계 문서 (기획안, 개발 계획, DTO 설계)
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## 시작하기

### 사전 요구사항

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose

### 설치

```bash
# 의존성 설치
pnpm install

# 환경변수 설정
cp .env.example .env
cp .env.example client/.env
cp .env.example server/.env

# Docker로 PostgreSQL 실행
docker compose up -d

# DB 마이그레이션
pnpm --filter server prisma:migrate

# 개발 서버 실행
pnpm dev              # client + server 동시
pnpm dev:client       # client만 (localhost:3000)
pnpm dev:server       # server만 (localhost:3001)
```

- Swagger 문서: http://localhost:3001/api-docs

## 페이지 구조

```
/                              홈 (서비스 소개)
├── /login                     로그인 (이메일 + GitHub)
├── /register                  회원가입
├── /templates                 템플릿 마켓플레이스
│   └── /templates/[id]        템플릿 상세/미리보기
├── /builder                   노코드 템플릿 빌더 (새 템플릿)
│   └── /builder/[id]          기존 템플릿 편집
├── /explore                   이력서 탐색
├── /r/[slug]                  이력서 열람 (공개 URL, 읽기 전용)
├── /resumes                   내 이력서 목록
│   ├── /resumes/new           새 이력서 작성 (템플릿 선택)
│   └── /resumes/[id]/edit     이력서 편집
├── /mypage                    마이페이지
│   ├── /mypage/templates      내 템플릿 관리
│   ├── /mypage/feedbacks      피드백 대시보드
│   ├── /mypage/reviews        내 리뷰 관리 (작성한/받은 리뷰)
│   └── /mypage/rewards        보상 내역
└── /users/[id]                공개 프로필 (판매자 평점, 리뷰 목록 포함)
```

## 데이터 모델

```
User ──────────< Template
  │                 │
  │                 └── forkedFromId → Template (복제 원본)
  │
  ├─────────── < Resume
  │                 │
  │                 └── templateId → Template (사용한 템플릿)
  │
  ├──< Purchase (targetType: TEMPLATE | RESUME)
  │
  ├──< Feedback (→ Resume)
  │
  ├──< Review (targetType: SELLER | TEMPLATE | RESUME)
  │
  ├──< RewardLog
  │
  └──< Notification
```

| 모델         | 역할                                                             |
| ------------ | ---------------------------------------------------------------- |
| User         | 사용자 (balance, bio, profileImage, avgRating, reviewCount)      |
| Template     | 이력서 템플릿 (data JSON: canvasConfig + elements, pricingType, viewCount, avgRating) |
| Resume       | 완성된 이력서 (content JSON, templateId, pricingType, viewCount) |
| Purchase     | 구매 기록 — 템플릿(복제 권한) / 이력서(열람 권한) 통합           |
| Feedback     | 이력서에 대한 비공개 피드백                                      |
| Review       | 공개 평가 — 판매자/템플릿/이력서 대상, 별점 + 리뷰 텍스트        |
| RewardLog    | 보상 적립/차감 내역                                              |
| Notification | 인앱 알림                                                        |

## 설계 문서

- [서비스 기획안 (PROPOSAL.md)](docs/PROPOSAL.md)
- [개발 기획서 (PLAN.md)](docs/PLAN.md)
- [DTO 설계문서 (DTO_DESIGN.md)](docs/DTO_DESIGN.md)

## 개발 가이드

### 브랜치 전략

| 브랜치           | 용도                |
| ---------------- | ------------------- |
| `main`           | 배포 가능 상태      |
| `develop`        | 개발 통합 브랜치    |
| `feat/{기능명}`  | 기능 개발           |
| `fix/{버그명}`   | 버그 수정           |
| `chore/{작업명}` | 설정/빌드/패키지 등 |

### 커밋 컨벤션

```
feat: 새로운 기능
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드, 설정 변경
```

## 라이선스

MIT License
