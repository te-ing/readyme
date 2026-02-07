# Readyme

이력서 작성, 공유, 피드백 플랫폼

## 서비스 소개

Readyme는 개발자와 구직자를 위한 이력서 관리 플랫폼입니다.

### 핵심 기능

- **이력서 작성**: 직관적인 에디터로 이력서 작성
- **템플릿**: 다양한 이력서 템플릿 제공 및 커스터마이징
- **공유 & 피드백**: 이력서 공유 링크 생성, 피드백 요청/제공
- **거래 시스템**: 이력서 첨삭, 피드백 서비스 거래

## 기술 스택

### Client

- Next.js 15
- TypeScript
- Tailwind CSS
- Zustand (상태 관리)
- React Hook Form + Zod (폼 검증)
- TanStack Query (서버 상태 관리)

### Server

- NestJS
- TypeScript
- Prisma (ORM)
- PostgreSQL
- Passport (인증)
- class-validator, class-transformer (DTO 검증)
- Swagger (API 문서화)

### Infrastructure

- Docker
- pnpm

## 프로젝트 구조

```
readyme/
├── client/          # Next.js 15 앱
│   ├── src/
│   │   ├── app/           # App Router
│   │   ├── components/    # UI 컴포넌트
│   │   ├── hooks/         # 커스텀 훅
│   │   ├── stores/        # Zustand 스토어
│   │   ├── lib/           # 유틸리티
│   │   └── types/         # 타입 정의
│   └── ...
├── server/          # NestJS 앱
│   ├── src/
│   │   ├── modules/       # 기능별 모듈
│   │   ├── common/        # 공통 코드
│   │   └── prisma/        # Prisma 설정
│   └── ...
├── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md
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
cp client/.env.example client/.env.local
cp server/.env.example server/.env

# Docker로 PostgreSQL 실행
docker-compose up -d

# DB 마이그레이션
pnpm --filter server prisma migrate dev

# 개발 서버 실행
pnpm dev
```

## 개발 가이드

### 브랜치 전략

- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정

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
