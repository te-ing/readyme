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

### Infrastructure
- Docker (PostgreSQL)
- pnpm workspace (모노레포)

## 프로젝트 구조

```
readyme/
├── client/          # Next.js 15 앱
├── server/          # NestJS 앱
├── docker-compose.yml
└── pnpm-workspace.yaml
```
