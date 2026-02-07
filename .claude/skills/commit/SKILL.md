---
name: commit
description: 현재 claude 작업내역과 변경 파일을 읽고 커밋합니다.
---

## 실행 절차

1. `git status`로 변경/추가된 파일 목록 확인
2. `git diff`로 staged 및 unstaged 변경 내용 분석
3. `git log --oneline -5`로 최근 커밋 스타일 참고
4. 변경 성격 분석 후 커밋 분리 여부 판단
5. 커밋 메시지 초안 작성 후 사용자에게 확인
6. 승인 시 `git add` + `git commit` 실행

## 결과 출력

커밋 완료 후 한 줄로 요약

---

## 기본 원칙

- 하나의 커밋 = 하나의 목적
- 커밋 제목만 보고 변경 의도를 알 수 있어야 함
- 한글로 작성

---

## 커밋 메시지 포맷

type(scope): summary

- 변경 사항 1
- 변경 사항 2


- summary는 50자 이내, 마침표 사용하지 않음
- 본문은 제목과 한 줄 띄우고 bullet point로 작성

### scope 규칙

- `server/` 하위 파일만 변경: `type(server): summary`
- `client/` 하위 파일만 변경: `type(client): summary`
- 루트 파일만 변경: `type(root): summary`
- server + client 밀접하게 연결된 변경: `type(sync): summary`

### type 목록

| type     | 설명                                 |
| -------- | ------------------------------------ |
| feat     | 기능 추가                            |
| fix      | 버그 수정                            |
| refactor | 리팩토링 (기능 변경 없음)            |
| style    | 포맷/세미콜론/공백 등 로직 변경 없음 |
| chore    | 설정, 빌드, 패키지 관리              |
| docs     | 문서 수정                            |
| test     | 테스트 관련                          |
| ci       | CI/CD 설정                           |

### 본문 작성 기준

- 단순 변경 (오타, import 정리 등): 본문 생략
- 일반/복잡 변경: bullet point로 "무엇을/왜" 설명

### 커밋 메시지 예시

fix(client): WaitingLayout에서 기존 authCode 유지

- 대기 상태 페이지 진입 시 기존 authCode를 덮어씌우지 않도록 수정
- 체크인 후 대기 등록 → 뒤로가기 시 authCode 초기화 문제 해결

feat(server): 사용자 프로필 조회 API 추가

style: import 정렬 및 미사용 변수 제거

---

## 커밋 분리 기준

### 분리해야 하는 경우

- **성격이 다름**: 기능 / 버그 / 리팩토링 / 스타일 / 설정
- **영역이 다름**: UI, API, 상태관리, 라우팅, 에러처리
- **scope가 다름**: server와 client 변경이 동시에 있을 때, 각각 독립적인 변경이면 커밋을 분리
- **리뷰 단위**: 해당 커밋 하나만 봐도 의도와 동작이 이해되는가
- **되돌리기**: 해당 커밋만 revert 해도 안전한가

### 합쳐도 되는 경우

- wip, tmp, debug 같은 임시 커밋
- 오타 수정, import 정리, console.log 제거
- 리뷰 피드백 반영 커밋

---

## 복합 변경 처리

여러 성격의 변경이 섞여 있는 경우:

1. 변경 내용을 성격별(type) 및 영역별(scope: server/client)로 분류하여 사용자에게 보여줌
2. 분리 커밋 vs 단일 커밋 중 선택하도록 질문
3. 분리 시 각 커밋별로 staging 후 순차 커밋
   - server 파일과 client 파일이 독립적인 변경이면 별도 커밋으로 분리
   - server/client가 하나의 기능으로 밀접하게 연결된 변경이면 `type(sync): summary`로 단일 커밋

---

## 주의사항

- `.env`, `credentials`, API 키 등 민감 파일 커밋 금지
- 커밋 전 staged 파일 목록을 사용자에게 반드시 확인
- `git add .` 대신 명시적으로 파일 지정
- pre-commit hook 실패 시 새 커밋 생성 (amend 금지)
- push는 사용자가 명시적으로 요청할 때만 수행
