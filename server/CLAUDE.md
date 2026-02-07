# Server 가이드

## 디렉토리 구조

```
src/
├── main.ts
├── app.module.ts
├── prisma/           # Prisma 서비스/모듈
└── {domain}/         # 도메인별 모듈 (auth, users, resumes ...)
    ├── {domain}.module.ts
    ├── {domain}.controller.ts
    ├── {domain}.service.ts
    ├── dto/          # 요청/응답 DTO
    ├── guards/       # 인증/인가 가드
    ├── decorators/   # 커스텀 데코레이터
    ├── strategies/   # Passport 전략
    └── index.ts      # barrel export
```

## API 설계 규칙

### 엔드포인트

- RESTful: `/{리소스 복수형}` (예: `/resumes`, `/users`)
- 중첩 리소스: `/{부모}/{id}/{자식}` (예: `/resumes/:id/feedbacks`)

### 응답 형식

```json
// 성공 (단건)
{ "id": "...", "email": "...", ... }

// 성공 (목록)
{ "data": [...], "total": 100, "page": 1, "limit": 20 }

// 에러
{ "statusCode": 400, "message": "...", "error": "Bad Request" }
```

### 규칙

- 모든 컨트롤러에 `@ApiTags`, `@ApiOperation`, `@ApiResponse` 명시
- DTO에 class-validator 데코레이터로 입력 검증
- 인증 필요 엔드포인트는 `@UseGuards(JwtAuthGuard)` + `@ApiBearerAuth()`

## Prisma 컨벤션

- DB 테이블: snake_case 복수형 (`@@map("users")`)
- DB 컬럼: snake_case (`@map("created_at")`)
- 모델 필드: camelCase (`createdAt`)

## import 순서

1. `@nestjs/*` 등 외부 라이브러리
2. `./` 내부 모듈
3. `type` import
