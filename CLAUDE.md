# Readyme 프로젝트

이력서 작성, 공유, 피드백, 거래 플랫폼

## 기술 스택

### Client (client/)

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Zustand
- React Hook Form + Zod
- TanStack Query

### Server (server/)

- NestJS
- TypeScript
- Prisma + PostgreSQL
- Passport (인증)
- class-validator, class-transformer
- Swagger

### Shared (shared/)

- client/server 간 공유 코드
- API 요청/응답 타입, 상수, 유틸리티

### Infrastructure

- Docker (PostgreSQL)
- pnpm workspace (모노레포)

## 프로젝트 구조

```
readyme/
├── client/          # Next.js 15 앱
├── server/          # NestJS 앱
├── shared/          # 공유 타입, 상수, 유틸리티
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## shared 패키지 가이드

### shared에 넣는 것

- API 요청/응답 타입 (DTO 인터페이스)
- 공통 상수 (에러 코드, 상태값 enum 등)
- 공통 유틸리티 (날짜 포맷, 정규식 패턴 등)

### shared에 넣지 않는 것

- 프레임워크 의존 코드 (React 컴포넌트, NestJS 데코레이터)
- 한쪽에서만 쓰는 코드
- Prisma 모델, DB 관련 타입

## 개발 환경 실행

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경변수 설정
cp .env.example .env
cp .env.example client/.env
cp .env.example server/.env

# 3. PostgreSQL 실행
docker compose up -d

# 4. Prisma 마이그레이션
pnpm --filter server prisma:migrate

# 5. 개발 서버 실행
pnpm dev              # client + server 동시
pnpm dev:client       # client만 (localhost:3000)
pnpm dev:server       # server만 (localhost:3001)
```

- Swagger 문서: http://localhost:3001/api-docs

## 코딩 컨벤션

### 공통

- TypeScript strict 모드
- 세미콜론 사용, 싱글 쿼트, trailing comma (es5)
- 들여쓰기 2칸
- printWidth 100

### 네이밍

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| 파일/폴더 | kebab-case | `auth-guard.ts`, `query-provider.tsx` |
| 컴포넌트 파일 | PascalCase | `QueryProvider.tsx` |
| 변수/함수 | camelCase | `getUserById` |
| 타입/인터페이스 | PascalCase | `LoginDto`, `UserResponse` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| DB 컬럼 | snake_case (Prisma `@map`) | `created_at` |
| DB 테이블 | snake_case 복수형 (Prisma `@@map`) | `users` |

### import 순서

1. 외부 라이브러리 (`@nestjs/*`, `next`, `react`)
2. 내부 모듈 (`@/`, `./`)
3. 타입 (`type` import)

## 브랜치 전략

| 브랜치 | 용도 |
| --- | --- |
| `main` | 배포 가능 상태 |
| `develop` | 개발 통합 브랜치 |
| `feat/{기능명}` | 기능 개발 |
| `fix/{버그명}` | 버그 수정 |
| `chore/{작업명}` | 설정/빌드/패키지 등 |

- `feat`, `fix`, `chore` → `develop`으로 PR
- `develop` → `main`으로 릴리스 PR

## 환경변수 관리

- 환경변수 추가/변경 시 반드시 `.env.example`도 동기화
- `.env` 파일은 git에 커밋하지 않음
- 민감 정보(API 키, 시크릿)는 절대 하드코딩 금지
- client 환경변수는 `NEXT_PUBLIC_` 접두사 필요
