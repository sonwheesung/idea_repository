# Idea Repository — 설계 정본

> 이 문서는 Claude Code가 개발을 진행하기 위한 단일 기준 문서다.
> 모호하면 이 문서의 "핵심 기둥"을 우선한다. **새 결정은 코드보다 먼저 이 문서에 반영한 뒤** 진행한다.
> 서버 경계는 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md), 색인은 [`docs/README.md`](./docs/README.md),
> 문서 규율은 [`docs/DOC_DISCIPLINE.md`](./docs/DOC_DISCIPLINE.md).
> 사업자·연락처·스토어 정보의 단일 출처는 `C:\project\common\BUSINESS_INFO.md` (커밋 금지 파일).

작성일: 2026-08-17 · 원본 기획서("Idea Vault 글로벌 MVP 기획서" — 서비스명은 ~~Idea Vault(가칭)~~ → **Idea Repository**로 2026-08-17 사용자 확정)를 프로젝트 문서 체계
(LinkMemo `C:\project\link_memo` ← 조각 `C:\project\diary` ← 배구 `C:\project\volleyball` 계보)로 옮긴 것.

---

## 1. 한 줄 요약

> **Your ideas. Your device. Yours to build.**

떠오른 아이디어를 **프로젝트 단위**로 빠르게 저장하고, 시간이 지나면서 문제점·목표·핵심 아이디어·타겟 사용자·
진행률·상태·우선순위·일정·아이디어 노트·관련 자료를 덧붙여 **구체적인 프로젝트로 발전**시키는
**개인용 로컬 아이디어 보관함**. Todo 앱이 아니라 **"내가 만들고 싶은 것들"을 관리하는 앱**이다.

**전 세계 동시 출시가 전제**다 — 한국은 여러 출시 국가 중 하나이지 기준 시장이 아니다(기본 언어 English, 기본 카테고리 영어,
스토어 가격은 국가별 현지 통화, 날짜는 기기 로케일, EEA UMP 동의 — §9·§7). 회원가입·로그인·클라우드 동기화 **없음**.

### 제품 포지션

> **Capture your ideas. Keep them private. Build what matters.**
> ~~Capture~~ → **Ideate → Capture → Organize → Develop → Build**(2026-08-18 발상 도구 편입 — §3 #22)

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
6. **Simple Monetization — 무료 기능을 제한하지 않는다.** 모든 기능 무료 + 광고. Remove Ads(₩3,300 일회성 — 2026-08-17 형제 앱 통일)는
   **기능 잠금 해제가 아니라 광고 없는 환경을 사는 것**이다. 구독 없음(§7.1).

---

## 3. MVP 범위 (2026-08-17 기획서 기준)

| # | 기능 | 저장/의존 | 비고 |
|---|---|---|---|
| 1 | 메인(홈) | 로컬 | 검색 · [＋] · 필터/정렬 버튼 · 프로젝트 카드 목록(~~상태 칩 줄~~ → 2026-08-18 필터 시트로 이동). 카드 = 이름·한 줄 요약·상태·진행률·우선순위·카테고리·태그·마지막 수정일 |
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
| 17 | 광고 | AdMob | 하단 배너 + **App Open 광고(콜드 스타트만, 쿨타임 3시간)**(2026-08-17 확정). §7 |
| 18 | 광고 제거 | 스토어 IAP | **Remove Ads ₩3,300 일회성**(스토어 현지 가격 — ~~₩1,500~~ → 2026-08-17 형제 앱 통일) + Restore Purchases. §7.1 |
| 19 | 공지·점검·강제업데이트 | common_server | bootstrap 1회 호출. 실패해도 앱을 막지 않는다 |
| 20 | 문의하기 | common_server | 로그인 없음. **기기 subject 귀속**(2026-08-17 확정 — LinkMemo 방식): 문의 목록·답변·상태 확인 가능 |
| 21 | 테마 | 로컬 | ~~라이트/다크 2종~~ → **12종 팔레트 + 시스템(자동 = Light/Dark Minimal)**(2026-08-17 사용자 시안 제공으로 정정). 전부 무료. [`docs/THEME_SYSTEM.md`](./docs/THEME_SYSTEM.md) |
| 22 | **발상 도구(Idea Lab)** | 로컬 | **2026-08-18 편입**(기획서에 없음 — 사용자 요청 "아이디어를 만드는 과정에 필요한 툴"). 조합·개선·불편에서·만약에… 4종, 내장 단어·문장 풀(ko/en)에서 무작위, 결과는 한 탭에 프로젝트로(미리 채움). **단어는 DB v3 행 — 조합 헤더 단어 관리 화면에서 내장 단어 포함 전부 추가·수정·삭제**(2026-08-19). 서버·AI 없음. 광고 없음. [`docs/IDEATION_SYSTEM.md`](./docs/IDEATION_SYSTEM.md) |

하단 네비게이션: **없음 — 단일 메인 화면 + 스택**(기획서 §14 메인 화면 구성 그대로. LinkMemo와 같은 구조).
메인 상단 = 검색바 · [＋] · [⚙ 설정]. 필터(상태·카테고리·우선순위 — 전부 Select)·정렬은 메인의 필터/정렬 버튼 → 시트.
데이터 손실 안내(§6)를 앱 내에 명시한다.

### MVP에서 제외 (기획서 §19~21·§24·§31)

회원가입 · 로그인 · 계정 · 서버 저장 · 클라우드 동기화 · 여러 기기 간 동기화 · 구독 모델 · Pro 등급 ·
기능 잠금 해제형 상품 · 사용자 콘텐츠 자동 번역 · Idea Repository 전용 서버 · 웹 버전 ·
**로컬 백업/내보내기**(기획서 §24 "필요성이 낮다면 제외할 수 있다" → **MVP 제외 확정, 출시 후 P1 재검토** 2026-08-17) ·
협업/공유 · 알림/리마인더 · 위젯 · 프로젝트 평가/난이도 점수(기획서 노트 예시에만 등장 — MVP 아님).

### 출시 후 확장 후보 (기획서에서 언급된 것만)

- 로컬 백업/내보내기(기획서 §24) · 언어 추가(ja·zh·es·fr·de·pt — 기획서 §25) · 빈 항목 숨김/표시 설정.
- 그 외(정렬 세분화·프로젝트 템플릿·태그 관리 화면 등)는 **기획서에 없다** — 필요해지면 이 문서에 먼저 적고 결정한다.
  (테마는 기획서에 없었지만 2026-08-17 MVP로 편입 — §3 #21.)

---

## 4. 회원·로그인 정책 — **없음** (기획 확정)

이메일 가입·비밀번호 로그인·소셜 로그인·사용자 계정 서버·클라우드 계정을 **전부 제공하지 않는다.**

```
Install → Launch → Main screen → Capture ideas
```

- 광고 제거 구매도 로그인 없이 스토어 인앱결제로만 처리한다(§7.1).
- 문의하기: ~~완전 익명 단방향~~ → **기기 subject 귀속으로 확정**(2026-08-17 — LinkMemo 2026-08-14 방식):
  앱이 최초 1회 UUID를 만들어 SecureStore에 보관, common_server `POST /api/v1/devices`로 익명 subject + 서명
  토큰을 발급받아 문의 목록·답변·상태를 볼 수 있다. **로그인·계정이 아니다** — 이메일도 이름도 없고, 앱을 지우면
  연결이 끊긴다(그 한계를 화면에 고지).
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
| **발상 방식 `approach`** | `combine · improve · problem · whatif · other · none`(기본 none) — 발상 도구 4종과 1:1 + 수동 other(2026-08-18). 폼 Select·상세 표시만, 카드·필터·검색 없음 |
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
├── approach    (기본 none — v2, 2026-08-18)
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

- **첫 실행 1회 프라이버시 웰컴 시트**(2026-08-17 사용자 결정 — 한 장, 버튼 하나 "Start", 다시 안 뜸): 제목 "Your ideas stay on your device." +
  3줄(계정 없음 · 클라우드 없음 · **기기를 떠나는 것 = 광고 SDK · 시작 시 공지/업데이트 확인(앱 버전만) · 사용자가 보낸 문의**) + 손실 안내 + 처리방침 링크.
  (2026-08-17 법무 점검: bootstrap 조회도 기기를 떠나므로 "그 외에는 없다"는 표현은 §6 정직 규칙 위반 — 세 가지로 정정.)
  같은 내용을 설정 → About "Privacy at a glance"에서 다시 볼 수 있다(`components/privacy-overview.tsx`). 온보딩 여러 장·매 실행 팝업 🚫.
- **데이터 손실 안내를 앱 내에 명시한다**(빈 화면·웰컴 시트·설정):
  > *Your ideas are stored locally on your device and are not uploaded to our servers.*
  > *If you delete the app or change devices, your data may be lost.*
- **백업은 MVP에서 제외**(2026-08-17 확정 — 출시 후 P1 재검토). 하게 되면 서버 업로드가 아니라 **사용자 기기에서 파일을 직접 관리**하는
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
| **App Open** | **앱 콜드 스타트**(메인 화면 진입 직전) | **쿨타임 3시간**(2026-08-17 확정). 매 실행·매 프로젝트 열기마다 X. 포그라운드 복귀 노출 없음 |

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
| 가격 | ~~₩1,500~~ → **₩3,300**(한국 기준 — 2026-08-17 사용자 결정, Vivace Games 형제 앱과 동일 가격으로 통일. LinkMemo와 같은 날 같은 결정). 글로벌은 App Store·Google Play 국가별 가격 정책으로 현지 통화 표시 — 앱 UI에 특정 통화 고정 금지 |
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
  기본 카테고리도 **수정·삭제 허용**(2026-08-17 확정 — 특별 취급 없음. 지운 기본값을 다시 만들어 주지 않는다).
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

| | common_server | Idea Repository 전용 서버 |
|---|---|---|
| 위치 | `C:\project\common_server` (배포됨: `https://common-server.vercel.app`) | **없음 — 만들지 않는다** |
| 담당 | 공지 · 점검/강제업데이트 게이트(bootstrap) · 문의(익명 또는 기기 subject) | — |
| 사용자 데이터 | **가지 않는다** (기둥 2) | — |

- 프로젝트·노트·자료는 어떤 서버에도 보내지 않는다. common_server로 가는 것은
  **bootstrap 조회와 문의 본문(platform·appVersion 포함)뿐**이다.
- 엔타이틀먼트 서버 판정은 쓰지 않는다 — 광고 제거는 스토어 구매 이력이 진실(§7.1).
- 연동 계약·확인 명령·선행 작업은 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)와
  `common_server/docs/ONBOARDING.md`("새 앱 붙이기")를 따른다.
- `app_code`는 **`idearepository` 확정**(2026-08-17 사용자 결정 — 서비스명 Idea Repository와 함께. 규격 `[a-z0-9_]{2,64}` 통과.
  등록 후 변경 사실상 불가).

### 별도 서버 vs common_server — **common_server 그대로** (LinkMemo 2026-08-14 판단 승계)

Idea Repository가 필요한 것은 v1 기능(bootstrap + 문의)뿐이고, 이건 이미 배포·검증 완료다. common_server는
**1배포 N앱** — 앱 추가 = DB `apps`에 seed 1행, 코드 수정·재배포 없이 붙는다(유일한 예외: 디스코드 알림 env).
별도 서버는 Supabase 무료 티어 한도(활성 2프로젝트)를 깨고 운영만 이중이 된다. Idea Repository는 사용자 데이터를
서버에 두지 않아 격리할 것 자체가 없다.

---

## 11. 기술 스택 (2026-08-17 — LinkMemo 승계 제안)

기준 프로젝트는 `C:\project\link_memo`(LinkMemo) — **버전 조합·구조·문서 방식·커밋 규칙을 승계**한다.
(LinkMemo는 조각을, 조각은 배구를 승계했다. 같은 계보.)

| 영역 | 선택 | 상태 |
|---|---|---|
| 앱 | Expo **SDK 54**(~54.0.35) · RN 0.81.5 · React 19.1.0 | ✅ 2026-08-17 스캐폴드(default 템플릿, 예제 미채용) |
| 언어 | TypeScript ~5.9 (`strict` · `any` 금지) | ✅ typecheck·lint(any=error) 통과 |
| 네비게이션 | expo-router ~6.0 (단일 메인 + 스택) | ✅ `index` · `project/new`(modal) · `settings` 골격 |
| 상태 | Zustand (+ AsyncStorage persist — 필터/정렬·테마·언어 설정) | ✅ 테마·언어 store가 첫 사용처 |
| 테마 | `theme/palettes.ts` 토큰 — **12종 + 시스템(자동)**(LinkMemo 구조 승계) | ✅ 2026-08-17 토큰 17종(+cardAccents) · `app/theme.tsx` 미니어처 그리드 |
| **로컬 DB** | **expo-sqlite** (+ expo-crypto UUID) — 9필드 검색·필터·정렬에 쿼리가 필요하다 | ✅ 2026-08-17 v1 6테이블 + 시드 ([`docs/DATABASE.md`](./docs/DATABASE.md)) |
| 보안 저장 | expo-secure-store — 기기 subject deviceId·세션 | ❌ |
| 광고 | react-native-google-mobile-ads — ⚠ **16.0.0 고정** 승계(16.4.0은 Kotlin 2.3 충돌, 조각·LinkMemo 실증) | ✅ 2026-08-17 Phase 6 |
| 개발 실행 | **dev build** (`npm run android`) — 광고 SDK가 네이티브 모듈이라 **Expo Go 불가**(2026-08-17부터) | ✅ |
| 결제 | react-native-purchases (**RevenueCat 익명 모드**) — 비소모성 1상품 | ❌ |
| 브라우저 열기 | expo-linking (`Linking.openURL`) — 관련 자료 URL | ❌ |
| 다국어 | i18next · react-i18next · expo-localization + `check:i18n` | ✅ en·ko 29키 · 설정→언어 수동 변경 |
| 날짜 | dayjs (+ locale · localizedFormat · customParseFormat) — 기기 지역 표기 | ✅ `lib/date.ts` (카드 수정일) |
| 백엔드 | **없음.** 공지·문의만 common_server SDK 복사(`lib/common-server/`) | ❌ |
| 배포 | ~~Expo EAS~~ → **로컬 gradle AAB**(업로드 키 `credentials/`, 절차 [`docs/BUILD.md`](./docs/BUILD.md)) | ✅ vc1·vc2 |
| Metro 포트 | **8087 고정**(LinkMemo 8086·조각 8081과 충돌 회피) | ✅ scripts 반영 · :8087 번들 200 실측 |

- `android/`·`ios/`는 CNG 산출물 — 커밋하지 않는다.
- 커밋 메시지: `YYMMDD :: [태그] 한국어 요약` (LinkMemo·조각·배구 규칙 승계).

---

## 12. 프로젝트 구조 (예정 — LinkMemo 승계)

```
idea_repository/
├── app/          # expo-router 라우트 (index=메인 · project/[id] · project/new · project/[id]/edit · settings · categories · notice · inquiry)
├── features/     # projects / categories / tags / notes / resources / search / ads / purchase / support / ideation(단어 풀·섞기)
├── components/   # 공통 UI (Screen · Button · Card · ProgressBar · StatusBadge · PriorityBadge …)
├── db/           # expo-sqlite 스키마·마이그레이션 (user_version 기반)
├── theme/        # 토큰 — 12종 팔레트 + system (palettes.ts · store.ts · use-theme.ts)
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
| **서비스명 Idea Repository** | ~~Idea Vault(가칭)~~ → **Idea Repository**(2026-08-17 사용자 결정). 폴더·app_code·패키지명과 일치. 캐치프레이즈는 "Your ideas. Your device. Yours to build." / "Capture your ideas. Keep them private. Build what matters."로 정리 |
| **전 세계 출시** | 한국은 출시 국가 중 하나. 영어 기본·현지 통화·기기 로케일·EEA UMP(2026-08-17 사용자 재확인) |
| 회원 시스템 없음 | 가입·로그인·계정 서버 전부 제외. 구매도 스토어만 |
| 로컬 온리 | 서버에 사용자 데이터 저장 없음 · 클라우드 동기화 없음 |
| 프로젝트명만 필수 | 나머지 15개 항목 전부 선택 |
| 상태 6종 · 우선순위 4종(기본 None) · 진행률 수동 | 자동 연동 없음 |
| 기본 카테고리 7종 영어 + 사용자 관리 | 삭제 시 사용 중 프로젝트 처리 선택지 |
| 검색 9필드 · 필터 3축 · 정렬 6종(기본 Recently Updated) | 우선순위 정렬 High→Medium→Low→None |
| BM = 무료+광고 / Remove Ads ~~₩1,500~~ → **₩3,300** 일회성(형제 앱 통일) | 구독·Pro 없음. 광고 제거 = 기능 아님 |
| 글로벌 우선 | 기본 영어 + 한국어. 날짜는 기기 로케일. 사용자 콘텐츠 자동 번역 없음 |
| 정직한 보안 문구 | "stored locally … not uploaded to our servers" — 절대 보장 표현 금지 |
| 문서·스택 계보 | LinkMemo(← 조각 ← 배구) 승계 (2026-08-17, 이 문서 작성 시) |

### 확정 (2026-08-17 — 문서화 시 위임 판단, 이의 없으면 유지)

| # | 결정 | 내용·근거 |
|---|---|---|
| A | 공지·문의는 common_server, 전용 서버 없음 | LinkMemo와 동일 조건 — §10 |
| B | 결제 = RevenueCat 익명 모드 | LinkMemo 2026-08-14 판단과 조건 동일(비회원·비소모성 1상품). RC 무료 구간(MTR $2.5k/월)이면 ₩3,300 기준 월 ~1,000건까지 무료. `store-iap-setup` 스킬 재사용 |
| C | 단일 메인 화면 + 스택, 하단 네비 없음 | 기획서 §14 메인 구성에 탭이 없다. LinkMemo와 같은 구조라 컴포넌트 재사용 |
| D | 날짜는 `YYYY-MM-DD` 문자열 저장 | 시간대 하루 밀림 방지 — §5 |
| E | 노트·자료 변경도 프로젝트 `updatedAt` 갱신 | Recently Updated가 "최근에 손댄 아이디어"를 뜻해야 한다 — §5 |
| F | 관련 자료 URL만 필수, 제목 자동 제안 | LinkMemo 도메인 파싱 제안 재사용 |
| G | 태그 사용처 0 → 자동 정리 · 대소문자 무시 유일 | 자동완성 목록 위생 — §8 |
| H | 배너 = 메인·상세만, 작성/편집 화면 없음 | 기획서 §27.1 "작성 화면에서 광고 최소화·입력 영역 가리지 않음" |
| I | 생성 화면 = 이름 1칸 + "Add details" 펼침, 저장 후 목록 복귀 | 빠른 기록(기둥 1) 우선. 상세는 카드 탭으로 |
| J | 필터·정렬 상태 로컬 유지 | 매번 재설정 마찰 제거 |
| K | Metro 포트 8087 | 형제 앱 충돌 회피 — §11 |
| L | **`app_code = idearepository` · 패키지 `com.vivacegames.idearepository` · 표시명 Idea Repository** (2026-08-17 사용자 확정 — 미결정 #1 해소) | 브랜드 도메인 역순 규약(LinkMemo) 승계. 등록 후 변경 불가 |
| M | **폼 UI 규약** — 선택형 값은 `Select`(라벨 + 현재 값 행 → 옵션 모달), 텍스트는 `TextField`(Label + input) (2026-08-17 사용자 지시 — 설정 칩 → select, 프로젝트 등록 폼 = Label + input) | 프로젝트 폼(카테고리·상태·우선순위)·문의 폼·필터 시트(상태·카테고리·우선순위 — 2026-08-18)가 같은 컴포넌트를 쓴다. 설정 화면은 모든 행을 같은 `SettingRow`(라벨·값 부제·화살표)로 그리고 언어 행은 탭 시 OptionSheet를 직접 연다(2026-08-18 사용자 지적 "언어만 라벨형" → 통일). 칩은 어디에도 없다(태그 입력 칩은 TagInput 고유) |
| N | **발상 도구(Idea Lab) 편입**(2026-08-18 사용자 결정 "괜찮네 그걸로 진행해보자") — 입구 = 메인 헤더 전구 + 빈 화면 링크 · 도구 4종 · 무작위 = 내장 단어/문장 풀(서버·AI 없음) · 결과 → `/project/new` 미리 채움 · `approach` 필드 신설 | 기획서에 없던 항목 — 사용자 요청으로 Ideate 단계를 제품 범위에 추가. 화면 시안 아티팩트(2026-08-18) 승인. 상세 [`docs/IDEATION_SYSTEM.md`](./docs/IDEATION_SYSTEM.md). vc2에 포함 |
| O | **발상 단어 관리 화면**(2026-08-19 사용자 지시 "출처 선택 말고 조합 우측 상단 단어 관리 아이콘 → 내장 단어 포함 전부 추가·수정·삭제") — 단어 출처 Select 제거 · DB v3 `ideation_words`(언어별 시드) · `/idea-lab/words`(그룹별 목록·CRUD·~~내 태그/카테고리 가져오기·기본 단어 복원~~ → 2026-08-20 제거, 추가는 헤더 ＋ 아이콘) | 내장 단어 = 일반 행(기본 카테고리와 같은 원칙). 시드 데이터는 `db/ideation-pool.ts`(의존 방향). 상세 IDEATION_SYSTEM §3.5·§4, DATABASE §2.2 |

### ✅ 원 미결정 7건 — 2026-08-17 사용자 승인으로 전부 확정 (제안값 그대로)

| # | 항목 | 확정 내용 | 근거 |
|---|---|---|---|
| 1 | `app_code` · 패키지명 | `idearepository` · `com.vivacegames.idearepository` · 표시명 Idea Repository | 확정 표 L |
| 2 | 전면 광고 | **App Open(콜드 스타트만) + 쿨타임 3시간.** 포그라운드 복귀 노출 없음 | 앱 시작 interstitial은 AdMob 정책 위반 — App Open이 그 자리 전용. LinkMemo `features/ads/app-open.ts` 재사용, 작성 흐름 방해 0. 상세→메인 복귀 interstitial 안은 🚫(기획서 "프로젝트를 열 때 광고 X" 취지와 마찰) |
| 3 | 문의 귀속 | **기기 subject**(SecureStore UUID → `POST /v1/devices` → 세션) — 문의 목록·답변·상태 화면 포함 | 완전 익명이면 답변을 볼 경로가 없다. 서버 이미 배포·LinkMemo E2E 실측. 계정이 아니다 |
| 4 | 로컬 백업/내보내기 | **MVP 제외.** 출시 후 P1에서 로컬 파일 내보내기/가져오기로 재검토(서버 업로드 🚫) | 기획서 §24가 열어 둔 항목 — 필요성 확인 후 |
| 5 | 기본 카테고리 수정·삭제 | **허용** — 일반 행과 동일 취급. 지운 기본값은 재생성하지 않는다 | 분기 최소화. Other를 지우고 싶은 사용자를 막을 이유 없음 |
| 6 | 테마 | ~~라이트/다크 2종 · 시스템 따르기 + 수동~~ → **12종 팔레트(시안 `docs/design/theme-mockups-12.png`) + 시스템(자동)**(2026-08-17 오후 사용자 시안 "다양하게 만들어줘"로 정정). 설정 → Theme 미니어처 그리드. 카드 테두리 1px + 진한 border(같은 날 "너무 희미하다" 지적) | LinkMemo 테마 10종 구조 재사용 — 팔레트 추가 = 테마 추가. 상세 [`docs/THEME_SYSTEM.md`](./docs/THEME_SYSTEM.md) |
| 7 | 출시 계정 | Vivace Games Studio(개인, `6329667596149711059`) — LinkMemo와 동일. 비공개 테스트 12명×14일 병행 | 정본 `volleyball/docs/GOOGLE_ACCOUNT_CASE.md`. Phase 6.5에서 최신 상태 재확인 |

### ⚠ 미결정

현재 없음(2026-08-17). 새 항목이 생기면 여기에 적는다.

---

## 15. 선행 의존 (Idea Repository 밖 작업)

| 작업 | 어디서 | 비고 |
|---|---|---|
| `apps`에 `idearepository` 등록 | common_server (`tools/seed.ts`) | 확인: `bootstrap?app=idearepository` **200** |
| 디스코드 문의 웹훅 env | common_server Vercel | `DISCORD_TICKET_WEBHOOK_URL_IDEAREPOSITORY` — **유일하게 재배포 필요한 지점** |
| SDK 복사 | `common_server/client/` → `lib/common-server/` | 복사본 상단에 SDK_VERSION 주석(현재 2026-08-14 — `registerDevice` 포함) |
| AdMob 앱·광고단위 발급 | AdMob 콘솔 | 배너 1 + **App Open** 1. GDPR 메시지(UMP) 설정. 스토어 미출시 상태에선 "게재 제한"이 정상 |
| 스토어 상품 등록 (Remove Ads) | Play/App Store 콘솔 | 비소모성 1상품 |
| RevenueCat 프로젝트 생성 | RC 대시보드 | 익명 모드 — 웹훅·서버 연동 없음. `store-iap-setup` 스킬 참조 |
| 처리방침·약관 게시 URL | `vivace-games.com/idearepository/{privacy,terms}` | ✅ 2026-08-17 게시(배구 서버 Vercel 정적 페이지, LinkMemo 방식). 정본은 `docs/legal/`, 절차는 `docs/LEGAL_SYSTEM.md` |

---

## 16. 현재 상태 (2026-08-17)

- 문서 체계 수립(이 문서 + `docs/` 8종). ~~코드 0줄~~ → **Phase 0 완료**(2026-08-17): Expo SDK 54 스캐폴드·단일 메인+스택 골격·
  라이트/다크 토큰·i18n(en·ko)·설정(화면 모드·언어)·`check:i18n`·Metro 8087. typecheck·lint·i18n·번들(1537모듈) 통과.
  서버 등록 0 · 스토어 등록 0.
- **미결정 7건 전부 해소**(2026-08-17 사용자 승인) — 현재 미결정 없음.
- **Phase 1 완료**(2026-08-17): DB v1 + 카테고리 시드 · 프로젝트 생성(이름만 + Add details: 요약·설명·카테고리·태그·상태·우선순위) ·
  카드 목록(Recently Updated) · 길게 눌러 삭제 · 카테고리 관리(설정) · 태그 입력 · 배너 자리 플레이스홀더.
- **Phase 2 완료**(2026-08-17): 상세(빈 항목 "Add …" → 편집) · 편집(공용 폼 전 필드, 슬라이더·날짜 피커) · 노트 인라인 CRUD · 자료 CRUD(브라우저) · 설정 → About(처리방침·약관 링크·사업자 정보) · STORE_LISTING.md.
- **Phase 3 완료**(2026-08-17): 검색(9필드)·상태 칩·필터 시트·정렬 6종·상태 유지. 법무 문서 초안(`docs/legal/`)·STORE_LISTING 작성(미게시).
- 첫 실행 프라이버시 웰컴 시트 ✅(2026-08-17). 법무 문서 게시는 아래 LEGAL_SYSTEM 참조.
- **Phase 4·5 완료**(2026-08-17): i18n 코드 키 검사 추가 · common_server 연동(등록·SDK·BootGate·공지·문의 기기 subject, 프로덕션 E2E). 디스코드 웹훅 env ✅(2026-08-17 등록·재배포).
- **Phase 6 완료**(2026-08-17): AdMob 콘솔 대행(앱·배너·App Open·GDPR) · SDK 16.0.0 · 실배너·App Open(3h)·UMP · **Expo Go 종료 → 디버그 빌드**(에뮬레이터 실측: 테스트 광고 노출·쿨타임 동작).
- **Phase 6.5·8 대행**(2026-08-17): 스토어 자산·키스토어·AAB vc1 · Play 콘솔(Play 앱 `4975846571298570248` · Alpha 트랙 `4700611093824576153`) 앱 콘텐츠 11/11·데이터 보안·스토어 설정·등록정보 EN/KO·Alpha 트랙 → AAB vc1(사용자 업로드) → **검토 전송 완료**(변경사항 16개).
- **2026-08-18**: 설정 행 통일 · 상태 칩 → 필터 시트 Select · **발상 도구(Idea Lab) 완료**(문서 → DB v2 → 단어 풀 → 화면 4종 → 에뮬 조합·개선 e2e, [`docs/IDEATION_SYSTEM.md`](./docs/IDEATION_SYSTEM.md)).
- ⚠ **비공개 테스트 기간(2026-08-18~ 약 1~3일간 수정분 반영) 배포 규칙**(2026-08-18 사용자 지시): 수정 사항은 **AAB 재빌드·재업로드로만** 반영한다. **OTA(expo-updates) 도입·배포 금지** — 테스터가 받는 빌드와 스토어 검토 빌드가 같아야 한다.
- **2026-08-18 vc2 · 1.0.1 빌드**(설정 통일·필터 Select·개인정보 옵션·웰컴 문구·blockedPermissions·발상 도구 포함) — `idearepository-vc2.aab` 로컬 gradle. Play 콘솔 Alpha 새 버전 `2 (1.0.1)` — 사용자 업로드 → 출시명·노트(en/ko) 입력 → **검토 전송 완료**("검토 중인 변경사항", 2026-08-18). vc1은 검토 통과("선택한 테스터에게 제공", 8/17 19:26). 릴리스 노트 `docs/STORE_LISTING.md` §10.
- **2026-08-19**: 발상 단어 관리 화면(§14 O — DB v3 · `/idea-lab/words` · 출처 Select 제거) · 메인 하드웨어 뒤로가기 종료 확인 Alert(PROJECT_SYSTEM §8) → **vc3 · 1.0.2 업로드·검토 통과, 테스터 제공(8/19 19:34 — 업로드·전송은 사용자)**.
- **2026-08-20**: 조합 헤더 단어 관리 = "단어 관리하기" 텍스트 버튼(아이콘 대체) · **AAB 업로드 CLI 경로 도입**(`eas submit` — BUILD.md §3.5, 정본 `common/PLAY_RELEASE_AUTOMATION.md`, 빌드는 계속 로컬 gradle) → **vc4 · 1.0.3 CLI 업로드 → 출시명·노트(en/ko) → 검토 전송 완료**("검토 중인 변경사항"). 서비스 계정 권한은 켰다 끔(API 403 복귀 확인).
- **2026-08-20 (vc4 이후)**: ⚠ 이후 수정분은 **내일 한 번에 업데이트**(사용자 지시 "올리지 말고") — 단어 관리 화면 개편(추가 = 헤더 ＋ 아이콘, 하단 내 태그·카테고리 가져오기/기본 단어 복원 제거 — IDEATION_SYSTEM §3.5) 포함, 다음 AAB vc5.
- **2026-08-21 vc5 · 1.0.4**: 전날 보류분 2건(단어 관리 헤더 ＋·하단 액션 제거 / 한국어 조사 es-hangul) — 로컬 gradle 빌드(SHA1 대조) → CLI 업로드(BUILD §3.5) → 출시명·노트(en/ko) → **검토 전송 완료**("검토 중인 변경사항") → 권한 회수(API 403). vc4는 검토 통과·테스터 제공 중(8/20 11:08).
- 다음 단계: vc5 검토 결과 대기 → Phase 7(Remove Ads: Play 상품 등록·RC 익명·구매/복원, 데이터 보안에 구매 내역 추가) → 프로덕션 신청(14일 후). 순서는 [`docs/PLAN.md`](./docs/PLAN.md).
