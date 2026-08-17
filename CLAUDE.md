# Idea Vault — 설계 정본

> 이 문서는 Claude Code가 개발을 진행하기 위한 단일 기준 문서다.
> 모호하면 이 문서의 "핵심 기둥"을 우선한다. **새 결정은 코드보다 먼저 이 문서에 반영한 뒤** 진행한다.
> 서버 경계는 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md), 색인은 [`docs/README.md`](./docs/README.md),
> 문서 규율은 [`docs/DOC_DISCIPLINE.md`](./docs/DOC_DISCIPLINE.md).
> 사업자·연락처·스토어 정보의 단일 출처는 `C:\project\common\BUSINESS_INFO.md` (커밋 금지 파일).

작성일: 2026-08-17 · 원본 기획서("Idea Vault 글로벌 MVP 기획서")를 프로젝트 문서 체계
(LinkMemo `C:\project\link_memo` ← 조각 `C:\project\diary` ← 배구 `C:\project\volleyball` 계보)로 옮긴 것.

---

## 1. 한 줄 요약

> **Your ideas. Your device. Your vault.**

떠오른 아이디어를 **프로젝트 단위**로 빠르게 저장하고, 시간이 지나면서 문제점·목표·핵심 아이디어·타겟 사용자·
진행률·상태·우선순위·일정·아이디어 노트·관련 자료를 덧붙여 **구체적인 프로젝트로 발전**시키는
**개인용 로컬 아이디어 보관함**. Todo 앱이 아니라 **"내가 만들고 싶은 것들"을 관리하는 앱**이다.

**출시 초기부터 글로벌**(기본 언어 English, §9). 회원가입·로그인·클라우드 동기화 **없음**.

### 제품 포지션

> **Capture your ideas. Keep them private. Build what matters.**
> Capture → Organize → Develop → Build

---

## 2. 핵심 기둥 (설계 충돌 시 판단 기준)

1. **Fast Capture — 프로젝트명만 입력하면 저장된다.** 필수 입력값은 프로젝트명 하나뿐(§5).
   처음부터 모든 정보를 채우게 강제하지 않는다. 나머지는 아이디어가 발전하면서 사용자가 원하는 만큼 추가한다.
2. **Local First · Privacy by Design — 사용자의 아이디어는 사용자의 기기에 저장한다.** 프로젝트·노트·자료
   어느 것도 서버로 보내지 않는다. 클라우드 동기화 없음. 서버가 죽어도 앱은 완전히 동작해야 한다(§6).
   서비스 운영자가 사용자의 프로젝트 데이터를 서버에서 조회하는 구조 자체를 만들지 않는다.
3. **No Account — 회원가입·로그인 없음.** 설치 → 실행 → 바로 메인 화면. 자체 회원 시스템·소셜 로그인·
   사용자 계정 서버를 **만들지 않는다**(§4).
4. **Structured, not a memo — 프로젝트에 필요한 정보를 구조적으로 관리한다.** 단순 텍스트 메모가 아니라
   문제점·목표·핵심 아이디어·타겟·진행률·상태·우선순위·일정·노트·자료가 **하나의 프로젝트에 연결**된다(§5).
5. **광고가 기록을 막지 않는다.** 프로젝트 작성·편집 중, 노트·자료 입력 중, 삭제 확인 중에는 전면 광고를
   띄우지 않는다. 배너는 입력 영역을 가리지 않는다(§7).
6. **Simple Monetization — 무료 기능을 제한하지 않는다.** 모든 기능 무료 + 광고. Remove Ads(₩1,500 일회성)는
   **기능 잠금 해제가 아니라 광고 없는 환경을 사는 것**이다. 구독 없음(§7.1).

---

## 3. MVP 범위 (2026-08-17 기획서 기준)

| # | 기능 | 저장/의존 | 비고 |
|---|---|---|---|
| 1 | 메인(홈) | 로컬 | 검색 · [＋] · 상태 칩 필터 · 프로젝트 카드 목록. 카드 = 이름·한 줄 요약·상태·진행률·우선순위·카테고리·태그·마지막 수정일 |
| 2 | 프로젝트 생성 | 로컬 | **프로젝트명만 필수.** 그 외 전 항목 선택 |
| 3 | 프로젝트 상세 | 로컬 | 전 항목 표시. 빈 항목은 비어 있는 상태로 표시하거나 숨긴다 |
| 4 | 프로젝트 수정·삭제 | 로컬 | 전 필드 편집. 삭제는 노트·자료 연쇄 삭제 + 확인 |
| 5 | 기본 정보 | 로컬 | 프로젝트명 · 한 줄 요약 · 설명 · 카테고리 · 태그 |
| 6 | 아이디어 정보 | 로컬 | 문제점 · 목표 · 핵심 아이디어 · 타겟 사용자 |
| 7 | 진행 관리 | 로컬 | 진행률(0~100%, 수동) · 상태 6종 · 우선순위 4종(기본 None) · 시작일 · 마감 예정일 |
| 8 | 카테고리 관리 | 로컬 | 기본 7종(App·Game·Web·Service·Business·Content·Other, 영어) 시드 + 사용자 추가·수정·삭제. **삭제 시 사용 중 프로젝트 처리 선택지 제공** |
| 9 | 태그 | 로컬 | 사용자가 자유 생성(`#AI` `#Mobile` …). 기존 태그 자동완성 |
| 10 | 아이디어 노트 | 로컬 | 프로젝트당 N개. 내용·작성일·수정일. 추가·수정·삭제 — 아이디어의 **발전 과정 기록** |
| 11 | 관련 자료 | 로컬 | 프로젝트당 N개. 제목·URL·설명. 추가·수정·삭제. 탭하면 외부 브라우저 |
| 12 | 검색 | 로컬 | 프로젝트명·한 줄 요약·설명·문제점·목표·핵심 아이디어·타겟 사용자·아이디어 노트·태그 |
| 13 | 필터 | 로컬 | 상태(All + 6종) · 카테고리 · 우선순위 |
| 14 | 정렬 | 로컬 | Recently Updated(기본) · Recently Created · Name · Progress · Target End Date · Priority(High→Medium→Low→None) |
| 15 | 다국어 | 로컬 | **en(기본)·ko.** Localization 구조로 확장 가능([`docs/I18N_SYSTEM.md`](./docs/I18N_SYSTEM.md)) |
| 16 | 날짜 표기 | 로컬 | 기기 지역 설정 기준(`2026.08.14` / `08/14/2026` / `2026/08/14`) |
| 17 | 광고 | AdMob | 하단 배너 + **메인 화면 간헐적 전면(빈도 제한)**. 포맷은 §14 미결정 #2. §7 |
| 18 | 광고 제거 | 스토어 IAP | **Remove Ads ₩1,500 일회성**(스토어 현지 가격) + Restore Purchases. §7.1 |
| 19 | 공지·점검·강제업데이트 | common_server | bootstrap 1회 호출. 실패해도 앱을 막지 않는다 |
| 20 | 문의하기 | common_server | 로그인 없음. 귀속 방식은 §14 미결정 #3(제안: 기기 subject — LinkMemo 방식) |

하단 네비게이션: **없음 — 단일 메인 화면 + 스택**(기획서 §14 메인 화면 구성 그대로. LinkMemo와 같은 구조).
메인 상단 = 검색바 · [＋] · [⚙ 설정]. 필터(카테고리·우선순위)·정렬은 메인의 필터/정렬 버튼 → 시트.
데이터 손실 안내(§6)를 앱 내에 명시한다.

### MVP에서 제외 (기획서 §19~21·§24·§31)

회원가입 · 로그인 · 계정 · 서버 저장 · 클라우드 동기화 · 여러 기기 간 동기화 · 구독 모델 · Pro 등급 ·
기능 잠금 해제형 상품 · 사용자 콘텐츠 자동 번역 · Idea Vault 전용 서버 · 웹 버전 ·
**로컬 백업/내보내기**(기획서 §24 "필요성이 낮다면 제외할 수 있다" → §14 미결정 #4) ·
협업/공유 · 알림/리마인더 · 위젯 · 프로젝트 평가/난이도 점수(기획서 노트 예시에만 등장 — MVP 아님).

### 출시 후 확장 후보 (기획서에서 언급된 것만)

- 로컬 백업/내보내기(기획서 §24) · 언어 추가(ja·zh·es·fr·de·pt — 기획서 §25) · 빈 항목 숨김/표시 설정.
- 그 외(다크 모드·정렬 세분화·프로젝트 템플릿 등)는 **기획서에 없다** — 필요해지면 이 문서에 먼저 적고 결정한다.

---

## 4. 회원·로그인 정책 — **없음** (기획 확정)

이메일 가입·비밀번호 로그인·소셜 로그인·사용자 계정 서버·클라우드 계정을 **전부 제공하지 않는다.**

```
Install → Launch → Main screen → Capture ideas
```

- 광고 제거 구매도 로그인 없이 스토어 인앱결제로만 처리한다(§7.1).
- 문의하기: 로그인이 없으므로 (a) 완전 익명 단방향 또는 (b) **기기 subject 귀속**(LinkMemo 2026-08-14 방식 —
  앱이 최초 1회 UUID를 만들어 SecureStore에 보관, common_server `POST /api/v1/devices`로 익명 subject + 서명
  토큰을 발급받아 문의 목록·답변·상태를 볼 수 있다. **로그인·계정이 아니다** — 이메일도 이름도 없고, 앱을 지우면
  연결이 끊긴다). §14 미결정 #3 — 제안은 (b).
- ⚠ 계정을 만들지 않으므로 Play의 "계정 삭제 URL" 요건이 **해당 없음**이다. 로그인을 나중에 붙이는 순간
  탈퇴 경로·웹 삭제 URL이 세트로 필요해진다(조각 §4 참고).

---

## 5. 도메인 규칙 — 프로젝트 (핵심)

상세는 [`docs/PROJECT_SYSTEM.md`](./docs/PROJECT_SYSTEM.md). 여기엔 어기면 안 되는 것만.

| 규칙 | 내용 |
|---|---|
| **프로젝트명만 필수** | 한 줄 요약·설명·카테고리·태그·문제점·목표·핵심 아이디어·타겟·진행률·상태·우선순위·시작일·마감일·노트·자료 전부 선택(기둥 1·4) |
| 기본값 | 진행률 `0` · 상태 `Idea` · 우선순위 `None` · 카테고리 없음 |
| 상태 6종 | `Idea` · `Planned` · `In Progress` · `On Hold` · `Cancelled` · `Completed` — 순서 고정, 사용자 정의 없음 |
| 우선순위 4종 | `High` · `Medium` · `Low` · `None` — 정렬 순서 High→Medium→Low→None |
| 진행률 | 0~100 정수, **사용자가 직접 설정**. 상태와 자동 연동 없음(예: Completed로 바꿔도 100%로 강제하지 않는다) |
| 1 프로젝트 : N 노트 · N 자료 · N 태그 | 프로젝트 삭제 시 노트·자료 연쇄 삭제, 태그 연결만 해제 |
| 카테고리 | 프로젝트당 0 또는 1개. 삭제 시 사용 중 프로젝트는 "없음으로 변경 / 다른 카테고리로 이동 / 취소" 선택지 |
| 마지막 수정일 | 프로젝트 필드 변경뿐 아니라 **노트·자료 추가/수정/삭제도 프로젝트 `updatedAt`을 갱신**한다 — "아이디어 발전 = 활동"이므로 Recently Updated 정렬에 반영돼야 한다(2026-08-17 위임 판단) |

### 데이터 구조 (기획 확정 → 2026-08-17 정리)

```
Project                        IdeaNote               Resource              Category        Tag
├── id                         ├── id                 ├── id                ├── id          ├── id
├── name        (필수)          ├── projectId          ├── projectId         ├── name        └── name
├── summary                    ├── content            ├── title             └── sortOrder
├── description                ├── createdAt          ├── url   (필수)
├── categoryId  (nullable)     └── updatedAt          ├── description       ProjectTag
├── problem                                           ├── createdAt         ├── projectId
├── goal                                              └── updatedAt         └── tagId
├── coreIdea
├── targetUser
├── progress    (0~100, 기본 0)
├── status      (기본 idea)
├── priority    (기본 none)
├── startDate   ('YYYY-MM-DD', nullable)
├── targetEndDate
├── createdAt
└── updatedAt
```

- 날짜(시작일·마감일)는 **시각 없는 날짜 문자열 `YYYY-MM-DD`**로 저장한다 — epoch로 저장하면 시간대 경계에서
  하루가 밀리는 고전적 버그가 생긴다. 표기는 기기 로케일(dayjs)로 현지화(2026-08-17 위임 판단).
- 관련 자료는 **URL만 필수**, 제목 미입력 시 도메인으로 자동 제안(LinkMemo 이름 제안 승계). 스키마는
  [`docs/DATABASE.md`](./docs/DATABASE.md).

---

## 6. 데이터 저장 정책 (기획 확정)

**사용자 데이터는 기기에만 저장한다.** 서버에는 프로젝트·노트·자료·사용자 계정 어느 것도 저장하지 않고,
클라우드 동기화도 없다.

- **데이터 손실 안내를 앱 내에 명시한다**(빈 화면·설정):
  > *Your ideas are stored locally on your device and are not uploaded to our servers.*
  > *If you delete the app or change devices, your data may be lost.*
- **백업은 MVP에서 제외**(§14 미결정 #4). 하게 되면 서버 업로드가 아니라 **사용자 기기에서 파일을 직접 관리**하는
  로컬 내보내기/가져오기 방식이다 — "사용자의 데이터를 서비스가 가지고 있지 않으며, 사용자가 자신의 데이터를
  직접 관리한다"(기획서 §24)는 원칙이 기준.
- 광고 SDK 등 서드파티가 수집하는 정보는 별도로 확인해 개인정보처리방침과 Play 데이터 보안 선언에 정확히 반영한다.

### ⚠ 정직한 표현 규칙 (기획서 §23 + 조각 §5.1 승계)

- "**Your ideas are stored locally on your device and are not uploaded to our servers.**"(O) — 이것이 정확한 진술이다.
- "**아이디어 유출이 절대 발생하지 않습니다**"(X) — 기기 공유·악성코드·분실·OS 취약점·백업 파일 노출까지 막을 수 없다.
- "**아무 데이터도 나가지 않습니다**"(X) — 광고 SDK가 있는 한 거짓이 될 수 있다. 스토어 데이터 보안 선언과
  처리방침은 **실제 트래픽 기준**으로 작성한다.

---

## 7. 광고 정책 (기획 확정)

**무료 + 광고**가 기본 수익 구조. 모든 핵심 기능은 무료(기능 제한 없음).
상세는 [`docs/MONETIZATION_SYSTEM.md`](./docs/MONETIZATION_SYSTEM.md).

| 지면 | 어디에 | 언제 |
|---|---|---|
| **하단 배너** | 메인 화면 최하단(세이프에어리어 위) · 프로젝트 상세 하단 | 상시. **작성/편집·노트·자료 입력 화면에는 없음**(입력 영역·키보드 간섭 회피) |
| **전면형** | 메인 화면 진입 | **간헐적 — 빈도 제한 필수.** 매 실행·매 프로젝트 열기마다 X. 포맷·쿨타임은 §14 미결정 #2 |

### 전면 광고를 띄우지 않는 순간 (기둥 5 — 기획 확정)

프로젝트 작성 중 · 편집 중 · 아이디어 노트 작성 중 · 관련 자료 입력 중 · 삭제 확인 중 · 카테고리 관리 중.
**작성이나 편집 흐름 안에서는 어떤 전면 광고도 없다**(기획서 §28).

### 지켜야 할 것 (LinkMemo·조각 승계)

- 광고 SDK 초기화·로드 실패가 앱 사용을 막지 않는다.
- 구매자(광고 제거)는 노출 0회 — 게이트는 `adsEnabled()` **한 곳**을 거친다.
- 개발 빌드는 Google **테스트 광고 단위**만 쓴다(실단위 개발 = 무효 트래픽 → 계정 정지 위험).
- 배너를 못 받으면 자리를 차지하지 않는다(빈 회색 띠 금지).
- 앱 시작 지점의 interstitial은 AdMob 정책 위반(Disallowed interstitial implementations — LinkMemo에서 확인) —
  앱 실행 시 전면을 원하면 **App Open 포맷**이 그 자리 전용이다.
- 배포 지역에 EEA·영국·스위스가 포함되면 UMP 동의 폼을 구현한다(LinkMemo §9.1 승계 — 글로벌 출시 전제).

## 7.1 광고 제거 BM (기획 확정)

| 항목 | 값 |
|---|---|
| 상품 | **Remove Ads** — 비소모성 **일회성 구매** 단 하나 |
| 가격 | **₩1,500**(한국 기준). 글로벌은 App Store·Google Play 국가별 가격 정책으로 현지 통화 표시 — 앱 UI에 특정 통화 고정 금지 |
| 제공 | 하단 배너 제거 + 메인 화면 전면 광고 제거. **그 외 차이 없음** — 무료 = 모든 기능 + 광고, 구매 = 모든 기능 + 광고 없음 |
| 구독 / Pro 등급 / 기능 해제 | 전부 **없음** |
| 복원 | **Restore Purchases** 필수(재설치·기기 변경 대비). 스토어 구매 이력 기반, 서버 로그인 불필요 |
| 로그인 | **불요.** Apple/Google 인앱결제 시스템만 사용 |

구매 흐름: `Settings → Remove Ads → Store Purchase → Ads Removed`.
결제 경로는 **RevenueCat 익명 모드**(LinkMemo 2026-08-14 판단 승계 — 조건이 동일: 비회원·비소모성 1상품·서버 개입 없음).

---

## 8. 카테고리·태그·탐색 (기획 확정)

- **기본 카테고리 7종은 영어**(App·Game·Web·Service·Business·Content·Other) — 글로벌 사용자 대상이라 번역 리소스가
  아니라 **일반 데이터 행으로 시드**한다. 사용자가 추가한 카테고리와 같은 테이블·같은 취급.
  기본 카테고리의 수정·삭제 허용 여부는 §14 미결정 #5.
- 태그는 사용자가 자유 생성. `#` 없이 저장하고 표시할 때 `#`을 붙인다. 대소문자 무시 유일. **사용처가 0이 되면
  태그 행을 자동 정리**한다(자동완성 목록에 유령 태그가 남지 않게 — 2026-08-17 위임 판단).
- 검색은 9개 필드(§3 #12) 전체 대상 LIKE. 태그 검색은 `#AI` 입력 시 `#`을 벗겨 비교.
- 필터는 상태·카테고리·우선순위 **AND 결합**. 정렬 6종. 필터·정렬 상태는 로컬에 유지(매번 재설정하지 않게).

---

## 9. 다국어 (기획 확정 — 글로벌 우선)

- **기본 언어 English.** 초기 UI 언어: **en · ko**. 향후 후보 ja·zh·es·fr·de·pt(기획서 §25).
- UI 코드에 문장을 직접 쓰지 않는다 — 처음부터 번역 리소스(`common.*` `project.*` `note.*` `resource.*`
  `category.*` `settings.*` 키)로. 상세 규약은 [`docs/I18N_SYSTEM.md`](./docs/I18N_SYSTEM.md).
- **사용자가 작성하는 프로젝트 내용은 자동 번역하지 않는다**(기획서 §25).
- 날짜·시간은 기기 지역 설정 기준(기획서 §26). 서버 동기화가 없으므로 기기 환경만 따른다.
- LinkMemo의 `check:i18n` 키 검사 스크립트를 승계한다.

---

## 10. 서버 경계 (핵심 — 어기면 되돌리기 비싸다)

| | common_server | Idea Vault 전용 서버 |
|---|---|---|
| 위치 | `C:\project\common_server` (배포됨: `https://common-server.vercel.app`) | **없음 — 만들지 않는다** |
| 담당 | 공지 · 점검/강제업데이트 게이트(bootstrap) · 문의(익명 또는 기기 subject) | — |
| 사용자 데이터 | **가지 않는다** (기둥 2) | — |

- 프로젝트·노트·자료는 어떤 서버에도 보내지 않는다. common_server로 가는 것은
  **bootstrap 조회와 문의 본문(platform·appVersion 포함)뿐**이다.
- 엔타이틀먼트 서버 판정은 쓰지 않는다 — 광고 제거는 스토어 구매 이력이 진실(§7.1).
- 연동 계약·확인 명령·선행 작업은 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)와
  `common_server/docs/ONBOARDING.md`("새 앱 붙이기")를 따른다.
- `app_code`는 **`ideavault` 제안**(규격 `[a-z0-9_]{2,64}` 통과. 등록 후 변경 사실상 불가 — §14 미결정 #1).

### 별도 서버 vs common_server — **common_server 그대로** (LinkMemo 2026-08-14 판단 승계)

Idea Vault가 필요한 것은 v1 기능(bootstrap + 문의)뿐이고, 이건 이미 배포·검증 완료다. common_server는
**1배포 N앱** — 앱 추가 = DB `apps`에 seed 1행, 코드 수정·재배포 없이 붙는다(유일한 예외: 디스코드 알림 env).
별도 서버는 Supabase 무료 티어 한도(활성 2프로젝트)를 깨고 운영만 이중이 된다. Idea Vault는 사용자 데이터를
서버에 두지 않아 격리할 것 자체가 없다.

---

## 11. 기술 스택 (2026-08-17 — LinkMemo 승계 제안)

기준 프로젝트는 `C:\project\link_memo`(LinkMemo) — **버전 조합·구조·문서 방식·커밋 규칙을 승계**한다.
(LinkMemo는 조각을, 조각은 배구를 승계했다. 같은 계보.)

| 영역 | 선택 | 상태 |
|---|---|---|
| 앱 | Expo **SDK 54**(~54.0.35) · RN 0.81.5 · React 19.1.0 | ❌ 스캐폴드 전 |
| 언어 | TypeScript ~5.9 (`strict` · `any` 금지) | ❌ |
| 네비게이션 | expo-router ~6.0 (단일 메인 + 스택) | ❌ |
| 상태 | Zustand (+ AsyncStorage persist — 필터/정렬·설정) | ❌ |
| **로컬 DB** | **expo-sqlite** (+ expo-crypto UUID) — 9필드 검색·필터·정렬에 쿼리가 필요하다 | ❌ ([`docs/DATABASE.md`](./docs/DATABASE.md)) |
| 보안 저장 | expo-secure-store — 기기 subject deviceId(§14 #3 채택 시) | ❌ |
| 광고 | react-native-google-mobile-ads — ⚠ **16.0.0 고정** 승계(16.4.0은 Kotlin 2.3 충돌, 조각·LinkMemo 실증) | ❌ |
| 개발 실행 | **dev build** (`npx expo run:android`) — 광고 SDK가 네이티브 모듈이라 **Expo Go 불가**. 광고 전까지는 Expo Go 가능 | ❌ |
| 결제 | react-native-purchases (**RevenueCat 익명 모드**) — 비소모성 1상품 | ❌ |
| 브라우저 열기 | expo-linking (`Linking.openURL`) — 관련 자료 URL | ❌ |
| 다국어 | i18next · react-i18next · expo-localization + `check:i18n` | ❌ |
| 날짜 | dayjs (+ locale) — 기기 지역 표기 | ❌ |
| 백엔드 | **없음.** 공지·문의만 common_server SDK 복사(`lib/common-server/`) | ❌ |
| 배포 | Expo EAS | ❌ |
| Metro 포트 | **8087 제안**(LinkMemo 8086·조각 8081과 충돌 회피 — 형제 앱 동시 개발 대비) | ❌ |

- `android/`·`ios/`는 CNG 산출물 — 커밋하지 않는다.
- 커밋 메시지: `YYMMDD :: [태그] 한국어 요약` (LinkMemo·조각·배구 규칙 승계).

---

## 12. 프로젝트 구조 (예정 — LinkMemo 승계)

```
idea_repository/
├── app/          # expo-router 라우트 (index=메인 · project/[id] · project/new · project/[id]/edit · settings · categories · notice · inquiry)
├── features/     # projects / categories / tags / notes / resources / search / ads / purchase / support
├── components/   # 공통 UI (Screen · Button · Card · ProgressBar · StatusBadge · PriorityBadge …)
├── db/           # expo-sqlite 스키마·마이그레이션 (user_version 기반)
├── theme/        # 토큰 (라이트/다크 여부는 §14 미결정 #6)
├── locales/      # en · ko
├── lib/          # common-server SDK 복사본 · i18n · date
├── scripts/      # check-i18n.mjs 등
└── docs/         # 이 문서 체계
```

의존 방향: `app/` → `features/` → `db/`·`lib/`·`theme/`. 역방향 import 금지. `any` 금지, `strict` 유지.

---

## 13. 표준 작업 순서 (LinkMemo·조각 승계)

① 플랜 → ② **문서(코드보다 먼저)** → ③ 개발 → ④ 검증(typecheck · lint · i18n 키 검사 · 번들 컴파일) → ⑤ 커밋(문서 포함).

---

## 14. 결정 로그 · 미결정

### 확정 (2026-08-17 기획서)

| 결정 | 내용 |
|---|---|
| 회원 시스템 없음 | 가입·로그인·계정 서버 전부 제외. 구매도 스토어만 |
| 로컬 온리 | 서버에 사용자 데이터 저장 없음 · 클라우드 동기화 없음 |
| 프로젝트명만 필수 | 나머지 15개 항목 전부 선택 |
| 상태 6종 · 우선순위 4종(기본 None) · 진행률 수동 | 자동 연동 없음 |
| 기본 카테고리 7종 영어 + 사용자 관리 | 삭제 시 사용 중 프로젝트 처리 선택지 |
| 검색 9필드 · 필터 3축 · 정렬 6종(기본 Recently Updated) | 우선순위 정렬 High→Medium→Low→None |
| BM = 무료+광고 / Remove Ads ₩1,500 일회성 | 구독·Pro 없음. 광고 제거 = 기능 아님 |
| 글로벌 우선 | 기본 영어 + 한국어. 날짜는 기기 로케일. 사용자 콘텐츠 자동 번역 없음 |
| 정직한 보안 문구 | "stored locally … not uploaded to our servers" — 절대 보장 표현 금지 |
| 문서·스택 계보 | LinkMemo(← 조각 ← 배구) 승계 (2026-08-17, 이 문서 작성 시) |

### 확정 (2026-08-17 — 문서화 시 위임 판단, 이의 없으면 유지)

| # | 결정 | 내용·근거 |
|---|---|---|
| A | 공지·문의는 common_server, 전용 서버 없음 | LinkMemo와 동일 조건 — §10 |
| B | 결제 = RevenueCat 익명 모드 | LinkMemo 2026-08-14 판단과 조건 동일(비회원·비소모성 1상품). RC 무료 구간(MTR $2.5k/월)이면 ₩1,500 기준 월 ~2,000건까지 무료. `store-iap-setup` 스킬 재사용 |
| C | 단일 메인 화면 + 스택, 하단 네비 없음 | 기획서 §14 메인 구성에 탭이 없다. LinkMemo와 같은 구조라 컴포넌트 재사용 |
| D | 날짜는 `YYYY-MM-DD` 문자열 저장 | 시간대 하루 밀림 방지 — §5 |
| E | 노트·자료 변경도 프로젝트 `updatedAt` 갱신 | Recently Updated가 "최근에 손댄 아이디어"를 뜻해야 한다 — §5 |
| F | 관련 자료 URL만 필수, 제목 자동 제안 | LinkMemo 도메인 파싱 제안 재사용 |
| G | 태그 사용처 0 → 자동 정리 · 대소문자 무시 유일 | 자동완성 목록 위생 — §8 |
| H | 배너 = 메인·상세만, 작성/편집 화면 없음 | 기획서 §27.1 "작성 화면에서 광고 최소화·입력 영역 가리지 않음" |
| I | 생성 화면 = 이름 1칸 + "Add details" 펼침, 저장 후 목록 복귀 | 빠른 기록(기둥 1) 우선. 상세는 카드 탭으로 |
| J | 필터·정렬 상태 로컬 유지 | 매번 재설정 마찰 제거 |
| K | Metro 포트 8087 | 형제 앱 충돌 회피 — §11 |

### ⚠ 미결정 (착수 전에 매듭 — 사용자 확인 필요)

| # | 항목 | 제안 | 왜 사용자 확인이 필요한가 |
|---|---|---|---|
| 1 | **`app_code` · 패키지명** | `ideavault` · `com.vivacegames.ideavault`(LinkMemo 브랜드 도메인 역순 규약 승계). 앱 표시명 "Idea Vault"(가칭) | 등록 후 **변경 불가**(서버·번들·RC에 박힌다). 서비스명이 가칭이라 최종명 확정과 함께 |
| 2 | **전면 광고 포맷·쿨타임** | **App Open(콜드 스타트만) + 쿨타임 3시간** — LinkMemo `features/ads/app-open.ts` 그대로 재사용, 정책 안전, 작성 흐름 방해 0. 대안: 상세→메인 복귀 시 interstitial(빈도 캡) — 정책상 가능하나 "프로젝트를 열 때 광고 X" 취지와 마찰 | 기획서 §28은 "메인 화면 간헐적 전면"만 정했고 포맷·빈도가 비어 있다. 수익·UX 트레이드오프 |
| 3 | **문의 귀속 방식** | **기기 subject**(LinkMemo 방식 — 문의 목록·답변·상태 확인 가능, 서버 이미 구현·E2E 검증) | 완전 익명이면 답변을 볼 경로가 없다. LinkMemo에서 사용자가 "답변이 보여야 한다"고 요구해 바꾼 이력 |
| 4 | **로컬 백업/내보내기** | **MVP 제외**, 출시 후 P1 재검토. LinkMemo는 영구 제외했지만(파일이 생기면 유출 경로) Idea Vault 기획서 §24는 "사용자가 자기 데이터를 직접 관리"를 원칙으로 열어 뒀다 | 기획서가 열어 둔 항목 |
| 5 | **기본 카테고리 수정·삭제 허용** | **허용**(일반 행과 동일 취급 — 특별 취급하면 분기만 늘고, Other를 지우고 싶은 사용자를 막을 이유 없음) | 기획서 §6.3이 "사용자가 직접 만든 카테고리"만 수정 대상으로 읽힐 여지 |
| 6 | **다크 모드** | **라이트/다크 2종 · 시스템 따르기 + 수동 선택** — LinkMemo `theme/palettes.ts` 구조를 2종만 재사용(테마 10종 시스템은 안 만든다) | 기획서에 언급 없음 — 범위 추가라 확인 필요. 토큰을 처음부터 잡으면 비용이 낮다 |
| 7 | **출시 계정** | Vivace Games Studio(개인, `6329667596149711059`) — LinkMemo와 동일. 개인 계정 → 비공개 테스트 12명×14일 | 정본 `volleyball/docs/GOOGLE_ACCOUNT_CASE.md` 최신 상태 확인 후 |

---

## 15. 선행 의존 (Idea Vault 밖 작업)

| 작업 | 어디서 | 비고 |
|---|---|---|
| `apps`에 `ideavault` 등록 | common_server (`tools/seed.ts`) | 확인: `bootstrap?app=ideavault` **200** |
| 디스코드 문의 웹훅 env | common_server Vercel | `DISCORD_TICKET_WEBHOOK_URL_IDEAVAULT` — **유일하게 재배포 필요한 지점** |
| SDK 복사 | `common_server/client/` → `lib/common-server/` | 복사본 상단에 SDK_VERSION 주석(현재 2026-08-14 — `registerDevice` 포함) |
| AdMob 앱·광고단위 발급 | AdMob 콘솔 | 배너 1 + 전면형 1(포맷은 §14 #2). GDPR 메시지(UMP) 설정. 스토어 미출시 상태에선 "게재 제한"이 정상 |
| 스토어 상품 등록 (Remove Ads) | Play/App Store 콘솔 | 비소모성 1상품 |
| RevenueCat 프로젝트 생성 | RC 대시보드 | 익명 모드 — 웹훅·서버 연동 없음. `store-iap-setup` 스킬 참조 |
| 처리방침 게시 URL | `vivace-games.com` 계열 | LinkMemo는 배구 서버 Vercel 정적 페이지로 게시했다(`server/app/linkmemo/privacy/page.tsx`) — 같은 방식 가능. 값은 `common/BUSINESS_INFO.md` |

---

## 16. 현재 상태 (2026-08-17)

- 문서 체계 수립(이 문서 + `docs/` 8종). **코드 0줄.** 서버 등록 0 · 스토어 등록 0.
- §14 미결정 7건 — 사용자 확인 대기. 확인되면 이 표를 확정 표로 옮기고 착수.
- 다음 단계: 미결정 확정 → Expo SDK 54 스캐폴드(Phase 0) → DB 스키마 + 프로젝트 CRUD(Phase 1). 순서는 [`docs/PLAN.md`](./docs/PLAN.md).
