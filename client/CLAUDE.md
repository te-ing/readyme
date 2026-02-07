# Client 가이드

## 디렉토리 구조

```
src/
├── app/              # Next.js App Router 페이지
├── components/       # 공통 UI 컴포넌트
│   └── ui/           # 버튼, 인풋 등 기본 UI
├── features/         # 도메인별 기능 (컴포넌트, 훅, API)
│   └── auth/
│       ├── components/
│       ├── hooks/
│       └── api.ts
├── hooks/            # 공통 커스텀 훅
├── lib/              # 유틸리티, API 클라이언트, 설정
├── providers/        # Context/Provider 컴포넌트
├── stores/           # Zustand 스토어
└── types/            # 클라이언트 전용 타입
```

## 컨벤션

- 컴포넌트 파일: PascalCase (`QueryProvider.tsx`)
- 그 외 파일: kebab-case (`auth-guard.ts`)
- `@/` 경로 별칭 사용 (`@/components/...`)
- 환경변수는 `NEXT_PUBLIC_` 접두사 필요

## 상태 관리

- 서버 상태: TanStack Query
- 클라이언트 상태: Zustand
- 폼 상태: React Hook Form + Zod

## import 순서

1. `react`, `next` 등 외부 라이브러리
2. `@/` 내부 모듈
3. `type` import
