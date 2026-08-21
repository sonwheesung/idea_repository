---
name: reload-docs
description: Re-read the project's design docs (CLAUDE.md spine + docs/ system documents) to restore design context — especially after a context compaction, when the detailed docs/ content read earlier is gone from context. Invoke when the user asks to "문서 다시 읽어", "문서 리로드", "설계 문서 읽어", "컴팩트 후 문서", "reload docs", or right after a /compact. A SessionStart(compact) hook reminds the assistant to run this automatically after compaction.
---

# reload-docs — 설계 문서 재적재 (Idea Repository)

> **왜**: 이 프로젝트는 단일 기준 문서(`CLAUDE.md`) + 시스템별 `docs/` 문서에 모든 설계 결정·
> 제외 결정·출시 절차가 박혀 있다(DOC_DISCIPLINE — 새 결정은 코드보다 먼저 문서에). **컴팩트가
> 일어나면 앞서 읽어둔 docs/ 본문이 컨텍스트에서 사라져** 설계 근거 없이 결정하게 될 위험이 생긴다.
> 이 스킬은 그 docs/ 컨텍스트를 다시 채운다.
>
> 참고: `CLAUDE.md`와 메모리(`MEMORY.md`)는 매 세션 자동 주입돼 컴팩트 후에도 남는다 →
> **실제 공백은 `docs/`**. 그래서 README 색인 + 시스템 문서를 다시 읽는 게 핵심이다.

## 실행 순서

1. **척추 먼저 (필수)** — 한 번에 전체 지형을 잡는다:
   - `docs/README.md` — 색인. 문서 목록 + 역할. "무엇이 어디 적혀 있나"가 잡힌다.
   - `CLAUDE.md` — 핵심 기둥 6개(§2)·MVP 범위(§3)·도메인 규칙(§5)·서버 경계(§10)·
     표준 작업 순서(§13)·결정 로그(§14)·현재 상태(§16). 자동 주입돼 있더라도 결정 직전이면 한 번 더 짚는다.

1.5. **★ 공용 문서 재적재 (`C:\project\common`) — 항상** — 이 프로젝트 문서만이 아니라 **여러 프로젝트가
   공유하는 기준 문서**를 함께 다시 읽는다. `Glob "C:/project/common/*.md"`로 목록 확인 후 전부 Read. **수정 시각도 본다**(`ls -la --time-style=long-iso C:/project/common/*.md`) — 형제 프로젝트가 같은 날 저녁에 갱신하는 일이 잦다(2026-08-20 19:17 PLAY_RELEASE_AUTOMATION §5.10~5.12 추가를 놓친 채 vc5를 올린 전례). 부분 발췌(sed 구간)로 대신하지 않는다:
   - `C:\project\common\BUSINESS_INFO.md` — 사업자·서비스 정보 단일 출처(법적 상호·사업자번호·주소·
     스토어 계정·연락처·결제/광고 ID). **커밋 금지 파일 — 내용을 리포 안 어디에도 복사하지 않는다.**
   - `C:\project\common\PLAY_RELEASE_AUTOMATION.md` — Play 출시 자동화 절차.
   - 그 폴더에 새 문서가 생기면 함께. `.claude/`(스킬 정의)는 도구라 제외 — 호출 시 로드된다.
   > 왜: 한 프로젝트 세션이 **크로스-프로젝트 사실**(계정 상태·법적 정보·릴리스 절차)을 낡은 기억으로
   > 오보하기 쉽다. 공용 문서가 정본이니 재적재 때 같이 읽는다.

2. **규율·경계 문서 (작업이 코드/문서/출시에 닿으면)**:
   - `docs/DOC_DISCIPLINE.md` — 문서 작업법(결정 先문서·취소선 정정·색인 유지·날짜 절대화).
   - `docs/ARCHITECTURE.md` — 서버 경계(common_server만·전용 서버 없음·사용자 데이터는 기기만).

3. **건드리는 시스템의 문서** — 작업 영역에 해당하는 것을 골라 읽는다:

   | 작업 영역 | 문서 |
   |---|---|
   | 프로젝트 도메인·화면·검색/필터/정렬 | `docs/PROJECT_SYSTEM.md` |
   | DB 스키마·마이그레이션(user_version) | `docs/DATABASE.md` |
   | 발상 도구(Idea Lab)·단어 관리 | `docs/IDEATION_SYSTEM.md` |
   | 다국어(en·ko, check:i18n) | `docs/I18N_SYSTEM.md` |
   | 테마 12종+시스템 | `docs/THEME_SYSTEM.md` |
   | 광고(배너·App Open)·Remove Ads IAP | `docs/MONETIZATION_SYSTEM.md` |
   | 법무(처리방침·약관·데이터 보안) | `docs/LEGAL_SYSTEM.md` + `docs/legal/*.md` |
   | AAB 빌드·서명·업로드 | `docs/BUILD.md` |
   | 스토어 등록정보·릴리스 노트 | `docs/STORE_LISTING.md` |
   | 단계 계획·다음 할 일 | `docs/PLAN.md` |

> **컴팩트 직후 사용자 지시가 "전부 다 읽어"라면** → 위 1·1.5·2 + `docs/**/*.md` 전체(`legal/` 포함)를
> 5~6개씩 묶어 **병렬 배치 Read**(한 메시지에 여러 Read). 특정 작업을 이어가는 중이면 →
> 1·2 + 그 작업 영역 문서만으로 충분(컨텍스트 절약).

## ⚠ 컴팩트 후 절대 잊으면 안 되는 프로젝트 규칙 (재확인)

컴팩트 요약에서 자주 탈락하지만 어기면 되돌릴 수 없는 것들:

- **비공개 테스트 중 OTA(expo-updates) 절대 금지** — 수정분은 **AAB 재빌드·재업로드로만** 반영
  (CLAUDE §16, 2026-08-18 사용자 지시). 테스터 빌드 = 스토어 검토 빌드여야 한다.
- **새 키스토어 생성 절대 금지** — 업로드 키는 `credentials/idearepository-upload.jks`(백업
  `C:\private_key\`) 재사용. 잃으면 앱을 다시 못 올린다(`docs/BUILD.md`). `credentials/` 커밋 금지,
  키스토어 비밀번호를 대화·리포 파일에 쓰지 않는다.
- **사용자 데이터는 기기에만** — 프로젝트·노트·자료를 어떤 서버에도 보내지 않는다(기둥 2).
  common_server로 가는 것은 bootstrap 조회와 문의뿐(§10).
- **정직한 프라이버시 문구** — "stored locally … not uploaded to our servers"(O),
  절대 보장·"아무 데이터도 안 나감" 표현(X) (CLAUDE §6).
- **커밋 형식** — `YYMMDD :: [태그] 한국어 요약` + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

## 모든 작업은 문서부터 — 그다음 개발 (착수 전 항상)

표준 작업 순서(CLAUDE §13): **① 플랜 → ② 문서(코드보다 먼저) → ③ 개발 → ④ 검증 → ⑤ 커밋(문서 포함)**.
컴팩트로 직전 맥락이 날아가면 "코드부터 고치고 문서는 나중에"로 흐르기 쉽다 — 순서를 뒤집지 않는다.

0. **기존·상충 결정부터 읽는다 (선행 — 가장 자주 빼먹는 단계)** — 내 계획을 적기 **전에**, 그 영역의
   docs 문서와 CLAUDE §14 결정 로그에서 **그 주제에 이미 내려진 결정**을 확인한다. "이미 정해진 게
   있나? 내 변경이 그걸 뒤집나?" 작은 UI 한 줄도 문서화된 동작(폼 UI 규약 §14 M·광고 금지 순간 §7 등)을
   바꾸면 시스템 변경 → 먼저 검색.
1. **설계/결정을 해당 문서에 먼저 적는다** — 새 결정은 해당 `docs/` 문서(+ CLAUDE §14)에 **먼저**
   반영. 기존 결정을 뒤집으면 취소선 정정으로 보존(DOC_DISCIPLINE).
2. **그다음 개발** — 문서에 적힌 계획·기준을 코드가 구현한다.
3. **검증 루틴** — `npm run typecheck` · `npm run lint` · `npm run check:i18n` · 번들 컴파일
   (+ 화면 변경이면 에뮬레이터 실측 — `emulator-test` 스킬).
4. **커밋에 문서 변경을 함께** 싣고, CLAUDE §16 현재 상태를 진실과 일치시킨다.

## 버그를 발견하면 — 고침만으로 끝내지 마라 (컴팩트 후 특히 잊기 쉬움)

버그를 찾거나 고쳤다면, 고치고 끝내지 말고 **함께** 남긴다:

1. **현재 발견** — 증상/원인/수정/재검증을 해당 시스템 문서의 구현 현황(또는 적절한 절)에 기록.
2. **사각 분석** — 왜 기존 검증(typecheck·lint·check:i18n·에뮬 실측)이 못 잡았나 한 줄.
3. **사각 닫기** — 같은 구멍을 메우는 검사·케이스를 추가해야 수정이 완료. 같은 클래스의
   형제 오류가 다른 화면·언어(en/ko)·테마에 또 없는지 훑는다.

## 끝나면

- 무엇을 다시 읽었는지 한 줄로 보고하고, 중단됐던 작업을 이어간다(요약 재설명은 생략).
- 읽은 내용 중 **현재 작업과 충돌하는 설계 결정/제외 결정**(MVP 제외 목록 §3 포함)이 있으면
  먼저 짚는다 — 추정으로 덮어쓰지 않는다.
- 문서가 코드와 어긋나면 코드를 확인한다 — 문서는 작성 시점 스냅샷.

## 자동 트리거 (훅)

`.claude/settings.json`의 `SessionStart`(matcher `compact`) 훅이 컴팩트 완료 후
"reload-docs 스킬을 실행하라"는 안내를 컨텍스트에 주입한다 → 그걸 보면 이 스킬을 호출한다.
훅을 끄려면 그 항목을 지우면 되고, 이 스킬은 수동(`/reload-docs`)으로도 언제든 실행 가능하다.
