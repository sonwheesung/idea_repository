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
| 21 | 테마 | 로컬 | ~~라이트/다크 2종~~ → **12종 팔레트** ~~+ 시스템(자동 = Light/Dark Minimal)~~(2026-08-17 사용자 시안 제공으로 정정 → **2026-08-27 시스템(자동) 항목 제거** — 설정값 = 테마 id 그대로, §14 T). 전부 무료. [`docs/THEME_SYSTEM.md`](./docs/THEME_SYSTEM.md) |
| 23 | **로컬 백업(내보내기·가져오기)** | 로컬 + OS 공유 시트 | **2026-08-21 편입·무료**(~~MVP 제외·P1 재검토~~). JSON 한 파일 — 내보내기 = 공유 시트로 사용자가 고른 곳에, 가져오기 = 파일 선택 → 병합/교체. 서버·클라우드 없음. [`docs/BACKUP_SYSTEM.md`](./docs/BACKUP_SYSTEM.md) |
| 24 | **OTA 업데이트(expo-updates)** | Expo EAS Update | **2026-09-01 편입**(사용자 지시 "ota 배포 가능하게 구조 설정"). JS 번들·에셋만, 부팅 시 조용히 받아 다음 콜드 스타트에 적용, 강제 재시작 UI 없음. `runtimeVersion` 고정 문자열·채널은 `requestHeaders`. **게시는 사용자 지시 때만.** 네이티브 변경은 여전히 AAB. vc11 · 1.0.10부터 동작. [`docs/OTA_SYSTEM.md`](./docs/OTA_SYSTEM.md) |
| 22 | **발상 도구(Idea Lab)** | 로컬 | **2026-08-18 편입**(기획서에 없음 — 사용자 요청 "아이디어를 만드는 과정에 필요한 툴"). 조합·개선·불편에서·만약에… 4종, 내장 단어·문장 풀(ko/en)에서 무작위, 결과는 한 탭에 프로젝트로(미리 채움). **단어는 DB v3 행 — 조합 헤더 단어 관리 화면에서 내장 단어 포함 전부 추가·수정·삭제**(2026-08-19). 서버·AI 없음. 광고 없음. [`docs/IDEATION_SYSTEM.md`](./docs/IDEATION_SYSTEM.md) |

하단 네비게이션: **없음 — 단일 메인 화면 + 스택**(기획서 §14 메인 화면 구성 그대로. LinkMemo와 같은 구조).
메인 상단 = 검색바 · [＋] · [⚙ 설정]. 필터(상태·카테고리·우선순위 — 전부 Select)·정렬은 메인의 필터/정렬 버튼 → 시트.
데이터 손실 안내(§6)를 앱 내에 명시한다.

### MVP에서 제외 (기획서 §19~21·§24·§31)

회원가입 · 로그인 · 계정 · 서버 저장 · 클라우드 동기화 · 여러 기기 간 동기화 · 구독 모델 · Pro 등급 ·
기능 잠금 해제형 상품 · 사용자 콘텐츠 자동 번역 · Idea Repository 전용 서버 · 웹 버전 ·
~~**로컬 백업/내보내기**(기획서 §24 "필요성이 낮다면 제외할 수 있다" → **MVP 제외 확정, 출시 후 P1 재검토** 2026-08-17)~~ → **2026-08-21 편입(§3 #23, 무료)** ·
협업/공유 · 알림/리마인더 · 위젯 · 프로젝트 평가/난이도 점수(기획서 노트 예시에만 등장 — MVP 아님).

### 출시 후 확장 후보 (기획서에서 언급된 것만)

- ~~로컬 백업/내보내기(기획서 §24)~~(→ 2026-08-21 편입 §3 #23) · 언어 추가(ja·zh·es·fr·de·pt — 기획서 §25) · 빈 항목 숨김/표시 설정.
- **앱 잠금(PIN·생체) — 미채택, 수요 확인 후**(2026-08-26 사용자 질문 "잠금 기능 있는 앱 있어? 필요 여부" → §14 S).
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
  3줄(계정 없음 · 클라우드 없음 · **기기를 떠나는 것 = 광고 SDK · ~~시작 시~~ 시작·앱 복귀 시 공지/업데이트·활성 확인(~~앱 버전만~~ → 앱 버전 + 활성 사용자 집계에만 쓰는 무작위 기기 ID, 2026-09-01 §14 U · 복귀 하트비트는 2026-09-02 ARCHITECTURE §5.7, vc11부터) · 사용자가 보낸 문의 · 앱 코드 업데이트 확인(Expo EAS Update — 기기 OS·무작위 토큰, 2026-09-01 §14 V, vc11부터)**) + 손실 안내 + 처리방침 링크.
  (2026-08-17 법무 점검: bootstrap 조회도 기기를 떠나므로 "그 외에는 없다"는 표현은 §6 정직 규칙 위반 — 세 가지로 정정.)
  같은 내용을 설정 → About "Privacy at a glance"에서 다시 볼 수 있다(`components/privacy-overview.tsx`). 온보딩 여러 장·매 실행 팝업 🚫.
- **데이터 손실 안내를 앱 내에 명시한다**(빈 화면·웰컴 시트·설정):
  > *Your ideas are stored locally on your device and are not uploaded to our servers.*
  > *If you delete the app or change devices, your data may be lost.*
- ~~**백업은 MVP에서 제외**(2026-08-17 확정 — 출시 후 P1 재검토)~~ → **2026-08-21 로컬 백업 편입**: 서버 업로드가 아니라 **사용자 기기에서 파일을 직접 관리**하는
  로컬 내보내기/가져오기 방식이다([`docs/BACKUP_SYSTEM.md`](./docs/BACKUP_SYSTEM.md)) — "사용자의 데이터를 서비스가 가지고 있지 않으며, 사용자가 자신의 데이터를
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
  설정 → 언어는 **en·ko 둘만**(~~시스템 언어 따르기 항목~~ → 2026-08-27 제거, §14 T) — 첫 실행에 기기 언어로 한 번 정해지고 그 뒤는 사용자 선택.
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
  **bootstrap 조회·문의 본문(platform·appVersion 포함)·포그라운드 복귀 하트비트(2026-09-02, vc11부터)뿐**이다 — 전부에 **무작위 기기 식별자(UUID) 세션**이 붙는다(2026-09-01 §14 U: 첫 실행 등록 + 매 부팅 동봉 + 복귀 시(쿨다운 5분) → 서버가 활성 일자만 기록, 400일 보관. `docs/ARCHITECTURE.md` §5.5·§5.7).
- **Expo(EAS Update, `u.expo.dev`)**로는 OTA 업데이트 확인 요청만 간다(기기 OS·런타임 버전·채널·무작위 업데이트 토큰 — 사용자 데이터 없음, 2026-09-01 §14 V). 우리 서버가 아니고 코드만 받아온다 — [`docs/OTA_SYSTEM.md`](./docs/OTA_SYSTEM.md) §8.
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
| 테마 | `theme/palettes.ts` 토큰 — **12종** ~~+ 시스템(자동)~~(LinkMemo 구조 승계 · 2026-08-27 자동 제거) | ✅ 2026-08-17 토큰 17종(+cardAccents) · `app/theme.tsx` 미니어처 그리드 |
| **로컬 DB** | **expo-sqlite** (+ expo-crypto UUID) — 9필드 검색·필터·정렬에 쿼리가 필요하다 | ✅ 2026-08-17 v1 6테이블 + 시드 ([`docs/DATABASE.md`](./docs/DATABASE.md)) |
| 보안 저장 | expo-secure-store — 기기 subject deviceId·세션 | ✅ 2026-08-17 Phase 5 (`features/support/server.ts`) |
| 광고 | react-native-google-mobile-ads — ⚠ **16.0.0 고정** 승계(16.4.0은 Kotlin 2.3 충돌, 조각·LinkMemo 실증) | ✅ 2026-08-17 Phase 6 |
| 개발 실행 | **dev build** (`npm run android`) — 광고 SDK가 네이티브 모듈이라 **Expo Go 불가**(2026-08-17부터) | ✅ |
| 결제 | react-native-purchases (**RevenueCat 익명 모드**) — 비소모성 1상품 | ⏸ Phase 7 — AdMob 정지 해제 후 |
| 브라우저 열기 | expo-linking (`Linking.openURL`) — 관련 자료 URL | ✅ 2026-08-17 Phase 2 |
| 다국어 | i18next · react-i18next · expo-localization + `check:i18n` | ✅ en·ko ~~29키~~ 295키(2026-08-21) · 설정→언어 수동 변경 · es-hangul 조사 |
| 날짜 | dayjs (+ locale · localizedFormat · customParseFormat) — 기기 지역 표기 | ✅ `lib/date.ts` (카드 수정일) |
| 백엔드 | **없음.** 공지·문의만 common_server SDK 복사(`lib/common-server/`) | ✅ 2026-08-17 Phase 5 |
| 배포 | ~~Expo EAS~~ → **로컬 gradle AAB**(업로드 키 `credentials/`, 절차 [`docs/BUILD.md`](./docs/BUILD.md)) + **OTA = expo-updates ~29.0.20 · EAS Update**(JS만, 2026-09-01 §14 V — [`docs/OTA_SYSTEM.md`](./docs/OTA_SYSTEM.md)) | ✅ vc1~vc10 (vc4부터 `eas submit` 업로드) · OTA 구조 vc11부터 |
| Metro 포트 | ~~**8087 고정**(LinkMemo 8086·조각 8081과 충돌 회피)~~ → **8090**(2026-08-27 — Delvewarden이 8087을 쓰고 있어 `common/DEV_ALLOCATION.md` §1이 "하나를 옮겨야 한다"고 적은 충돌 해소. 정본은 그 표) | ✅ scripts 반영 · :8090 번들 200 실측 |

- `android/`·`ios/`는 CNG 산출물 — 커밋하지 않는다.
- 커밋 규약: 정본 `C:\project\common\COMMIT_CONVENTION.md`(형식·태그·본문·푸터·금지 목록 전부 — 값을 여기 베껴 적지 않는다, 2026-09-09 정본 가리키기로 전환).
- **한국어 문장 규칙: 정본 `C:\project\common\KOREAN_WRITING.md`**(2026-09-09 사용자 지시. 값을 여기 베껴 적지 않는다. 기존 글은 소급 수정하지 않는다).

---

## 12. 프로젝트 구조 (예정 — LinkMemo 승계)

```
idea_repository/
├── app/          # expo-router 라우트 (index=메인 · project/[id] · project/new · project/[id]/edit · settings · categories · notice · inquiry)
├── features/     # projects / categories / tags / notes / resources / search / ads / purchase / support / ideation(단어 풀·섞기)
├── components/   # 공통 UI (Screen · Button · Card · ListRow/ListGroup · EditRow · Dialog · Badge · ProgressBar … — docs/UI_GUIDE.md)
├── db/           # expo-sqlite 스키마·마이그레이션 (user_version 기반)
├── theme/        # 토큰 — 12종 팔레트 (palettes.ts · store.ts · use-theme.ts) — ~~+ system~~ 2026-08-27 제거
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
| K | ~~Metro 포트 8087~~ → **8090**(2026-08-27) | 형제 앱 충돌 회피 — §11. 8087은 Delvewarden과 겹쳤다(`common/DEV_ALLOCATION.md`) |
| L | **`app_code = idearepository` · 패키지 `com.vivacegames.idearepository` · 표시명 Idea Repository** (2026-08-17 사용자 확정 — 미결정 #1 해소) | 브랜드 도메인 역순 규약(LinkMemo) 승계. 등록 후 변경 불가 |
| M | **폼 UI 규약** — 선택형 값은 `Select`(라벨 + 현재 값 행 → 옵션 모달), 텍스트는 `TextField`(Label + input) (2026-08-17 사용자 지시 — 설정 칩 → select, 프로젝트 등록 폼 = Label + input) | 프로젝트 폼(카테고리·상태·우선순위)·문의 폼·필터 시트(상태·카테고리·우선순위 — 2026-08-18)가 같은 컴포넌트를 쓴다. 설정 화면은 모든 행을 같은 `SettingRow`(라벨·값 부제·화살표)로 그리고 언어 행은 탭 시 OptionSheet를 직접 연다(2026-08-18 사용자 지적 "언어만 라벨형" → 통일). 칩은 어디에도 없다(태그 입력 칩은 TagInput 고유) |
| N | **발상 도구(Idea Lab) 편입**(2026-08-18 사용자 결정 "괜찮네 그걸로 진행해보자") — 입구 = 메인 헤더 전구 + 빈 화면 링크 · 도구 4종 · 무작위 = 내장 단어/문장 풀(서버·AI 없음) · 결과 → `/project/new` 미리 채움 · `approach` 필드 신설 | 기획서에 없던 항목 — 사용자 요청으로 Ideate 단계를 제품 범위에 추가. 화면 시안 아티팩트(2026-08-18) 승인. 상세 [`docs/IDEATION_SYSTEM.md`](./docs/IDEATION_SYSTEM.md). vc2에 포함 |
| P | **로컬 백업 = 무료, Remove Ads에 묶지 않음**(2026-08-21 사용자 결정 "무료로 가자") — JSON 한 파일 내보내기(OS 공유 시트)/가져오기(병합·교체), 평문·암호화 없음(v1), 설정 → 백업 | 기둥 6(기능 해제형 상품 없음)·포지션 "Your device. Yours"·기획서 §24와 충돌 회피. 백업은 수익원이 아니라 이탈 방지. **재검토 조건: AdMob 영구 정지로 BM을 다시 짤 때만.** 상세 [`docs/BACKUP_SYSTEM.md`](./docs/BACKUP_SYSTEM.md) §1 |
| O | **발상 단어 관리 화면**(2026-08-19 사용자 지시 "출처 선택 말고 조합 우측 상단 단어 관리 아이콘 → 내장 단어 포함 전부 추가·수정·삭제") — 단어 출처 Select 제거 · DB v3 `ideation_words`(언어별 시드) · `/idea-lab/words`(그룹별 목록·CRUD·~~내 태그/카테고리 가져오기·기본 단어 복원~~ → 2026-08-20 제거, 추가는 헤더 ＋ 아이콘) | 내장 단어 = 일반 행(기본 카테고리와 같은 원칙). 시드 데이터는 `db/ideation-pool.ts`(의존 방향). 상세 IDEATION_SYSTEM §3.5·§4, DATABASE §2.2 |
| Q | **행·카드 규격 통일 + 공통 컴포넌트 추출**(2026-08-23 사용자 지적 "설정 화면 카드 규격이 일정하지 않다 — 부제 있는 행과 없는 행" + "다른 화면도 통일, 같은 컴포넌트로 뺄 것 확인") — 한 목록 안 행은 전부 같은 규격(부제·아이콘 전부/전무, `minHeight`) · 탐색 행 `ListRow`(설정·발상 도구·About) · 관리 행 `EditRow`(카테고리·단어) · `Dialog`(다이얼로그 3벌 통합) · `Badge`·`ProgressBar` 추출 · 반경 3단계(14 컨테이너 / 12 컨트롤 / 10 입력) | 설정은 전 행에 아이콘 + 부제(현재 값·개수·힌트). ~~IdeaLabRow는 SettingRow와 별개~~(IDEATION §3) → 같은 `ListRow`. 상세 [`docs/UI_GUIDE.md`](./docs/UI_GUIDE.md). JS만 변경 — 다음 AAB(vc7) |
| R | **소프트 업데이트 안내 + 검색 매치 힌트 → vc8**(2026-08-23 사용자 결정 "내일 진행" — 후보 표에서 #1·#2 채택) — 팝업은 latest 값당 1회·닫을 수 있음·스토어 URL 없으면 미노출, 운영값은 검토 통과 후에만 / 힌트는 카드에 안 보이는 6필드만 | 문서 선행 완료(PLAN Phase 11 · ARCHITECTURE §5.4 · PROJECT_SYSTEM §9.1). 빈 항목 숨김·백업 암호화·언어 추가는 계속 보류 |
| S | **앱 잠금(PIN·생체) 미채택**(2026-08-26 사용자 질문 → 검토 결과) — 잠금은 일기·비밀 메모 카테고리(Day One·조각·Apple Notes 노트 잠금)의 기대 기능이고, 아이디어/프로젝트 도구(Milanote·Notion·Trello·Obsidian)엔 표준이 아니다. 포지션 "Your device"는 서버에 안 보낸다는 뜻이지 기기 안에서 숨긴다는 뜻이 아니며(§6 정직 규칙: 기기 공유·분실은 못 막는다), 요청 0건 | 재검토 조건: 프로덕션 후 잠금 요청 문의가 오거나 백업 암호화(BACKUP §8)를 할 때 — 그때 "보호" 설정 한 세트로. 넣게 되면 `USE_BIOMETRIC` blockedPermissions 해제·PIN 폴백·분실 시 접근 불가 고지·처리방침 문구가 딸려온다(BUILD §4) |
| U | **부팅 활성 하트비트 — SDK 2026-09-01 재복사 + 부팅 시 기기 세션 확보**(2026-09-01 사용자 승인 "동의하고 전부 다 진행" + 조건 "인터넷 연결 없이 접속했을 때 오류가 발생하면 안 된다") — common_server 활성 지표(DAU/WAU/MAU) 수집이 붙었는데 이 앱은 ①SDK가 2026-08-14판이라 bootstrap에 세션을 안 싣고 ②`ensureDeviceSession()`이 문의 화면에서만 불려 문의를 연 기기(7)만 subject였다 → `fetchOnce()`에서 `fetchBootstrap()`과 **병렬** 호출(직렬 금지), 문의 화면 호출 유지(오프라인 복구 지점). **오프라인 무오류**: SDK 무throw + try/catch, 결과는 `void`, 실패 시 다음 부팅에 재시도만 | 개인정보: 모든 사용자에게 첫 실행 UUID 발급 + 활성 일자 400일 서버 보관 → 이용 목적 "서비스 이용 통계" 추가, **처리방침 EN rev.5 · KO 5차**(9/1 게시·9/1 시행·앱 내 공지), 웰컴 시트 "앱 버전만" 정정. Play 데이터 보안 양식은 변경 없음(기기 ID 수집·공유·분석 기선언). GAID와 별개·광고 미사용. 부수: `inquiry.status.reviewing` 키(서버 기배포). `docs/ARCHITECTURE.md` §5.5. vc10 · 1.0.9 |
| T | **테마·언어의 "시스템(자동)" 항목 제거 + 입력 필드 회색 채움 제거 + 카테고리 추가 = 헤더 ＋**(2026-08-27 사용자 지시 4건 — "필터 Select·새 프로젝트 input이 비활성처럼 회색" / "테마·언어 시스템(자동) 빼고 바로 매핑" / "카테고리 추가는 우측 상단 ＋ 아이콘") — ① `TextField`·`Select`·`DateField`·`TagInput` 배경 ~~`searchBar`~~ → `card` + `border` 1px(UI_GUIDE §2) ② `ThemeSetting = ThemeId`(기본 Light Minimal), 언어 store `override(null=시스템)` → `language`(항상 en·ko) — 구 저장값은 그 순간 보이던 테마·기기 언어로 고정(마이그레이션) ③ 카테고리 관리 헤더 ＋(단어 관리와 동일), 목록 끝 추가 행 삭제 | 자동 전환이 없어져 "OS 다크인데 Warm Beige" 류 모순이 원천 소멸(LinkMemo가 자동을 뺀 이유와 같음). i18n `settings.languageSystem`·`theme.system` 2키 삭제(302키). 스토어 설명의 "or follow the system setting" 문장은 **콘솔 등록정보 수정 필요**(STORE_LISTING §3 — 사용자 확인 후). 다음 AAB vc9 |
| V | **OTA(expo-updates · EAS Update) 구조 편입 — ~~비공개 테스트 중 OTA 금지(2026-08-18)~~ 해제**(2026-09-01 사용자 지시 "ota 배포 가능하게 구조 설정해줄래" → "전부 다 완료 됐으면 커밋 및 aab 빌드까지") — LinkMemo `OTA_UPDATE.md`(같은 날) 승계: `runtimeVersion` **고정 문자열 `"1.0.0"`**(fingerprint·appVersion 정책 🚫 — 로컬 gradle 드리프트) · 채널은 `updates.requestHeaders["expo-channel-name"]`(eas.json channel은 EAS Build 전용) · `ON_LOAD` 조용히 받아 다음 콜드 스타트 적용, JS 강제 재시작 UI 없음(기둥 5) · **게시는 사용자 지시 때만** · 버전 읽기는 `lib/app-version.ts`(`nativeApplicationVersion` — OTA 매니페스트가 `expoConfig.version`을 덮어쓰는 오염 원천 차단, LinkMemo보다 한 걸음 더) · `check:ota` 스크립트 · 빌드 스크립트 `-CleanNative` + 서명 블록 자동 주입 + 매니페스트 채널 검사 | 왜: SDK `.2` 누락 같은 JS 전용 사고를 스토어 심사 없이 하루에 덮을 수 있다(같은 날 my_word가 그 경로로 구제). 첫 OTA 가능 빌드 = **vc11 · 1.0.10**(expo-updates는 네이티브 — vc10 이하는 못 받음). 개인정보: 기기가 Expo(미국)와 통신 → **처리방침 EN rev.6 · KO 6차**(정본 개정, **게시는 사용자 확인 후 · vc11 업로드 전 필수**, LEGAL_SYSTEM §7 #15) + 웰컴 문구. Play 데이터 보안 양식 변경 없음(기기 ID 기선언). 상세 [`docs/OTA_SYSTEM.md`](./docs/OTA_SYSTEM.md) |

### ✅ 원 미결정 7건 — 2026-08-17 사용자 승인으로 전부 확정 (제안값 그대로)

| # | 항목 | 확정 내용 | 근거 |
|---|---|---|---|
| 1 | `app_code` · 패키지명 | `idearepository` · `com.vivacegames.idearepository` · 표시명 Idea Repository | 확정 표 L |
| 2 | 전면 광고 | **App Open(콜드 스타트만) + 쿨타임 3시간.** 포그라운드 복귀 노출 없음 | 앱 시작 interstitial은 AdMob 정책 위반 — App Open이 그 자리 전용. LinkMemo `features/ads/app-open.ts` 재사용, 작성 흐름 방해 0. 상세→메인 복귀 interstitial 안은 🚫(기획서 "프로젝트를 열 때 광고 X" 취지와 마찰) |
| 3 | 문의 귀속 | **기기 subject**(SecureStore UUID → `POST /v1/devices` → 세션) — 문의 목록·답변·상태 화면 포함 | 완전 익명이면 답변을 볼 경로가 없다. 서버 이미 배포·LinkMemo E2E 실측. 계정이 아니다 |
| 4 | 로컬 백업/내보내기 | ~~**MVP 제외.** 출시 후 P1에서 로컬 파일 내보내기/가져오기로 재검토(서버 업로드 🚫)~~ → **2026-08-21 편입·무료**(§14 P) | 기획서 §24가 열어 둔 항목 — 비공개 테스트 중 "손실 경고만 있고 대책 없음"이 가장 큰 구멍이라 판단 |
| 5 | 기본 카테고리 수정·삭제 | **허용** — 일반 행과 동일 취급. 지운 기본값은 재생성하지 않는다 | 분기 최소화. Other를 지우고 싶은 사용자를 막을 이유 없음 |
| 6 | 테마 | ~~라이트/다크 2종 · 시스템 따르기 + 수동~~ → **12종 팔레트(시안 `docs/design/theme-mockups-12.png`)** ~~+ 시스템(자동)~~(2026-08-17 오후 사용자 시안 "다양하게 만들어줘"로 정정 → 시스템(자동)은 **2026-08-27 제거**, §14 T). 설정 → Theme 미니어처 그리드. 카드 테두리 1px + 진한 border(같은 날 "너무 희미하다" 지적) | LinkMemo 테마 10종 구조 재사용 — 팔레트 추가 = 테마 추가. 상세 [`docs/THEME_SYSTEM.md`](./docs/THEME_SYSTEM.md) |
| 7 | 출시 계정 | Vivace Games Studio(개인, `6329667596149711059`) — LinkMemo와 동일. 비공개 테스트 12명×14일 병행 | 정본 `volleyball/docs/GOOGLE_ACCOUNT_CASE.md`. Phase 6.5에서 최신 상태 재확인 |

### ⚠ 미결정

현재 없음(2026-08-17). 새 항목이 생기면 여기에 적는다.

⏸ 보류(미결정 아님): **AdMob 계정 정지 → 광고 후속·Phase 7 Remove Ads 대기**(2026-08-21, §16·MONETIZATION_SYSTEM §3.1).

---

## 15. 선행 의존 (Idea Repository 밖 작업)

| 작업 | 어디서 | 비고 |
|---|---|---|
| `apps`에 `idearepository` 등록 | common_server (`tools/seed.ts`) | 확인: `bootstrap?app=idearepository` **200** |
| 디스코드 문의 웹훅 env | common_server Vercel | `DISCORD_TICKET_WEBHOOK_URL_IDEAREPOSITORY` — **유일하게 재배포 필요한 지점** |
| SDK 복사 | `common_server/client/` → `lib/common-server/` | 복사본 상단에 SDK_VERSION 주석(~~현재 2026-08-14 — `registerDevice` 포함~~ → ~~2026-09-01~~ → ~~2026-09-01.2~~ → ~~2026-09-02~~ → **2026-09-14**(공지 영어 본문 `localizeAnnouncement`, ARCHITECTURE §5.8. 이전: 웜 스타트 하트비트 + `exp` §5.7, vc11부터, 첫 호출부 증가 `boot-gate` AppState 리스너) — bootstrap 세션 동봉, §14 U) |
| AdMob 앱·광고단위 발급 | AdMob 콘솔 | 배너 1 + **App Open** 1. GDPR 메시지(UMP) 설정. 스토어 미출시 상태에선 "게재 제한"이 정상 |
| 스토어 상품 등록 (Remove Ads) | Play/App Store 콘솔 | 비소모성 1상품 |
| RevenueCat 프로젝트 생성 | RC 대시보드 | 익명 모드 — 웹훅·서버 연동 없음. `store-iap-setup` 스킬 참조 |
| EAS Update 프로젝트·채널 | Expo 대시보드(계정 `shs00925`, projectId `6518e63b-54a0-432a-b9a5-56292cf4a523` = `updates.url`) | 프로젝트는 `eas submit` 도입 때 이미 존재. 채널·브랜치 `production`은 첫 `eas update` 때 자동 생성(2026-09-01 미실행). 무료 플랜 1K MAU |
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
- ~~⚠ **비공개 테스트 기간(2026-08-18~ 약 1~3일간 수정분 반영) 배포 규칙**(2026-08-18 사용자 지시): 수정 사항은 **AAB 재빌드·재업로드로만** 반영한다. **OTA(expo-updates) 도입·배포 금지** — 테스터가 받는 빌드와 스토어 검토 빌드가 같아야 한다.~~ → **2026-09-01 해제(§14 V)**: OTA 구조 편입. 단 게시는 사용자 지시 때만이라 "테스터 빌드 = 검토 빌드"는 게시 전까지 그대로 성립한다.
- **2026-08-18 vc2 · 1.0.1 빌드**(설정 통일·필터 Select·개인정보 옵션·웰컴 문구·blockedPermissions·발상 도구 포함) — `idearepository-vc2.aab` 로컬 gradle. Play 콘솔 Alpha 새 버전 `2 (1.0.1)` — 사용자 업로드 → 출시명·노트(en/ko) 입력 → **검토 전송 완료**("검토 중인 변경사항", 2026-08-18). vc1은 검토 통과("선택한 테스터에게 제공", 8/17 19:26). 릴리스 노트 `docs/STORE_LISTING.md` §10.
- **2026-08-19**: 발상 단어 관리 화면(§14 O — DB v3 · `/idea-lab/words` · 출처 Select 제거) · 메인 하드웨어 뒤로가기 종료 확인 Alert(PROJECT_SYSTEM §8) → **vc3 · 1.0.2 업로드·검토 통과, 테스터 제공(8/19 19:34 — 업로드·전송은 사용자)**.
- **2026-08-20**: 조합 헤더 단어 관리 = "단어 관리하기" 텍스트 버튼(아이콘 대체) · **AAB 업로드 CLI 경로 도입**(`eas submit` — BUILD.md §3.5, 정본 `common/PLAY_RELEASE_AUTOMATION.md`, 빌드는 계속 로컬 gradle) → **vc4 · 1.0.3 CLI 업로드 → 출시명·노트(en/ko) → 검토 전송 완료**("검토 중인 변경사항"). 서비스 계정 권한은 켰다 끔(API 403 복귀 확인).
- **2026-08-20 (vc4 이후)**: ⚠ 이후 수정분은 **내일 한 번에 업데이트**(사용자 지시 "올리지 말고") — 단어 관리 화면 개편(추가 = 헤더 ＋ 아이콘, 하단 내 태그·카테고리 가져오기/기본 단어 복원 제거 — IDEATION_SYSTEM §3.5) 포함, 다음 AAB vc5.
- **2026-08-21 vc5 · 1.0.4**: 전날 보류분 2건(단어 관리 헤더 ＋·하단 액션 제거 / 한국어 조사 es-hangul) — 로컬 gradle 빌드(SHA1 대조) → CLI 업로드(BUILD §3.5) → 출시명·노트(en/ko) → **검토 전송 완료**("검토 중인 변경사항") → 권한 회수(API 403). vc4는 검토 통과·테스터 제공 중(8/20 11:08).
- ⏸ **AdMob 계정 정지(2026-08-21 사용자 고지)**: 광고 지면·코드는 그대로 두고(실패 시 자리 미점유·즉시 진입 — 기존 규칙), 광고 후속 작업·**Phase 7 Remove Ads는 정지 해제 후 진행**. MONETIZATION_SYSTEM §3.1.
- **2026-08-21 로컬 백업 완료**(§3 #23 · §14 P — 무료): 문서 선행([`docs/BACKUP_SYSTEM.md`](./docs/BACKUP_SYSTEM.md)) → expo-file-system/sharing/document-picker → `features/backup` → `/backup` 화면(설정 → 백업) → 약관 5차·처리방침 4차 정본 개정(2026-08-28 시행, **재게시는 사용자 확인 후**) → 에뮬 실측(내보내기 공유 시트·병합·교체·거부). → **vc6 · 1.0.5 빌드·CLI 업로드·출시명·노트·검토 전송 완료**("검토 중인 변경사항", 권한 회수). 법무 4차/5차도 같은 날 **게시 완료**(사용자 확인 후 vercel --prod, 라이브 200). vc5는 검토 통과·테스터 제공(8/21 12:04).
- **2026-08-23 법무 4차/5차 시행 고지 ✅ 발행**: 앱 내 공지 = common_server 공지 1건(EN+KO 병기, 시행일+30일 자동 종료, id `df35b667…` — LEGAL_SYSTEM §4-4 발행 방법 확정·게시 기록에 문안 정본, bootstrap 실측 1건). 고지가 시행 5일 전(7일 규칙 2일 미달)이지만 **비공개 테스트 중 이용자는 사용자 본인뿐**(테스터 = 업체 인원, 설치·실행만 — `C:\project\common\CLOSED_TESTING.md`, 2026-08-23 작성)이라 시행일 유지 — LEGAL_SYSTEM §7 #13 해소. 앱 코드 변경 없음.
- **2026-08-23 UI 규격 통일**(§14 Q): `docs/UI_GUIDE.md` 신설 → `ListRow`·`ListGroup`·`EditRow`·`Dialog`·`Badge`·`ProgressBar` 추출, 설정(아이콘+부제 전 행)·발상 도구·About·카테고리·단어·상세·카드 적용, 반경 3단계. 에뮬 육안 확인(사용자 직접 확인 "잘 수정된 거 같네"). → **vc7 · 1.0.6 빌드·CLI 업로드·출시명·노트·검토 전송 완료**(2026-08-23, "검토 중인 변경사항", 권한 회수). vc6는 검토 통과·테스터 제공(8/21 16:25). 구 AAB(vc6) 삭제.
- **2026-08-26 Phase 11 완료**(§14 R): 소프트 업데이트 안내(`components/update-popup.tsx` = 공용 `Dialog` + `useSoftUpdateStore`, SDK `compareVersions` 재사용, 웰컴 → App Open → 팝업 순) · 검색 매치 힌트(`query.ts` m_* 플래그 6개 → `ProjectCard.matchedFields` → 카드 "일치: 설명"). 에뮬 실측(dev 임시 latest 주입 → 팝업 → 나중에 → 재진입 미노출 / 설명에만 있는 단어 검색 → 힌트). → **vc8 · 1.0.7 빌드·CLI 업로드·노트·검토 전송 완료**(권한 회수). vc7은 검토 통과·테스터 제공(8/23 16:46). AAB 실측 targetSdk 36 · 16KB 정렬 46/46 → `common/GLOBAL_DATA_COMPLIANCE.md` §12 갱신. 앱 잠금은 미채택(§14 S).
- **2026-08-27 사용자 지시 4건**(§14 T): 입력 필드 회색 채움 제거(배경 `card`) · 테마/언어 시스템(자동) 제거(마이그레이션 포함) · 카테고리 추가 헤더 ＋ · **Metro 8090으로 이동**(§14 K, DEV_ALLOCATION 충돌 해소) · **전용 AVD `idea_repository`(5572) 생성**(사도전·배구 AVD 빌려 쓰던 것 종료). 에뮬 실측 → 다음 AAB **vc9**(vc8 검토 통과 확인 후).
- **2026-08-31 vc9 · 1.0.8 출시 사이클**: vc8 검토 통과·테스터 제공 확인(8/26 12:47) → **운영값 PATCH**(`latestVersion 1.0.7` + 스토어 URL — bootstrap 실측, 업데이트 팝업 운영 개시) → vc9 빌드(§14 T 4건 + 브랜드명 `lib/links.ts` 포함, SHA1 대조·versionCode 9 확인) → CLI 업로드 → 출시명 `9 (1.0.8)`·노트 en/ko → **검토 전송 완료**("검토 중인 변경사항") → 권한 회수(리로드 4개·API 403) · 구 AAB vc8 삭제.
- **2026-09-01 부팅 활성 하트비트 완료**(§14 U): SDK 2026-09-01 재복사(→ 같은 날 저녁 **`.2` 재복사** — 토큰 슬라이딩 갱신·`isSignedIn` 만료 판정, ARCHITECTURE §5.6. vc10엔 없음, vc11부터) · `fetchOnce()`에 `ensureDeviceSession()` 병렬 · `inquiry.status.reviewing` 키 · 웰컴 문구 정정 · 처리방침 EN rev.5/KO 5차(정본·page.tsx·DATA_SAFETY) → 정적 검증·번들 200 → **에뮬 실측**(공용 `common_2`: 오프라인 첫 실행 무오류·서버 미전송 / 온라인 콜드 스타트 등록 → 서버 DAU 1·`activity_uncollected` 소멸 / 재실행 재등록 없음) → **처리방침 게시**(배구 `4559131`, 라이브 rev.5) · **시행 고지 발행**(id `13dc2524…`, 9/1 시행) → vc9 제공 확인(8/31 11:37) → **latest `1.0.8` PATCH** → **vc10 · 1.0.9** 빌드·업로드 → 검토 통과·테스터 제공(9/1 14:23) → latest `1.0.9` PATCH(BUILD §5). 전용 AVD `idea_repository` 삭제 → 공용 풀(EMULATOR_POOL §4 ✅).
- **2026-09-01 저녁 — SDK `.2` 재복사 + OTA 구조(§14 V) + vc11 빌드**: 공통 서버 세션 알림으로 `lib/common-server/` `2026-09-01.2` 재복사(`0930a4c`, 슬라이딩 갱신 — ARCHITECTURE §5.6) → 사용자 지시로 OTA 편입: `expo-updates ~29.0.20`·`expo-application ~7.0.8` · `app.json` `runtimeVersion "1.0.0"` + `updates`(url·ON_LOAD·채널 헤더) · `lib/app-version.ts`(네이티브 버전 단일화 — server·about·settings·backup) · `scripts/check-ota.mjs`(`npm run check:ota`) · 웰컴 문구 en/ko · 처리방침 **EN rev.6 · KO 6차 정본·page.tsx 개정(미게시 — 사용자 확인 후, vc11 업로드 전 필수)** · `docs/OTA_SYSTEM.md` 신설 · `tools/build-aab.ps1` `-CleanNative`(서명 블록 자동 주입·매니페스트 채널 검사) → 정적 검증 전부 통과 → **vc11 · 1.0.10 AAB 빌드**(BUILD §5 — 업로드는 하지 않음, 구 AAB vc10 삭제).
- **2026-09-02 웜 스타트 하트비트**(공통 서버 세션 통보 → SDK `2026-09-02` 재복사 + 첫 호출부 증가): `boot-gate.tsx`에 `AppState` 리스너 → `commonServer.heartbeat()`(포그라운드 복귀 시 활성 신호 — 쿨다운 5분·무reject 계약은 SDK 내장, ARCHITECTURE §5.7). 처리방침 rev.6(미게시) 문안에 "앱으로 돌아올 때" 전송 시점 반영 + 웰컴 `welcome.point.whatLeaves` en/ko 수정. vc11 AAB 재빌드(같은 versionCode 11 — 미업로드라 가능).
- **2026-09-02 오후 — vc11 = 프로덕션 첫 출시 사용자 결정**(공통 서버 세션 경유 전언, 원문 "전부 다 수정한 걸 첫 출시로 하고 싶어") + **오픈소스 라이선스 고지 신설**(그 준비 중 고지 0건 발견 — LEGAL_SYSTEM §10, 조각 이식: `licenses:build`/`check:licenses` + `app/licenses.tsx` + About 행, 패키지 43·카피레프트 0) → vc11 재빌드. UMP 보유로 **177개국 정당**(PRE_LAUNCH §1 — my_word·조각의 145개국은 UMP 부재 때문, 우리는 LinkMemo와 같음).
- **2026-09-02 오후~저녁 — 프로덕션 첫 출시 실행**(사용자 승인 "전부 다 진행"[전언] + 세션 확인 게이트 "전부 진행 — 단계적 출시"): ① **처리방침 rev.6 게시**(`vercel --prod` → 라이브 실측, 당일 시행) + 시행 고지(`9ecde8ec…`) → ② **vc11 번들 업로드**(`scripts/play-upload-bundle.sh` — LinkMemo 이식, 트랙 무변경·프로덕션 권한 불요, sha256 일치) → ③ **오픈소스 고지 신설**(고지 0건 발견 → LEGAL §10) + **앱 부제**(사용자 결정: en `Idea Repository - Idea Notes` · ko `Idea Repository: 아이디어 노트·메모·발상`, 발상 도구 반영) + 설명 "follow the system setting" 문장 삭제(§14 T 잔여 해소 — "one-time Remove Ads"는 사용자 결정으로 유지) + **첫 출시형 노트**(changelog형 초안은 사용자 지적으로 폐기) → ④ **국가/지역 177 설정 → "검토를 위해 변경사항 7개 제출" — "검토 중인 변경사항"** → 권한 회수. ⚠ 첫 릴리스라 단계적 출시 % 선택지 없음(기존 사용자 0) — "전체 출시 시작", %는 다음 릴리스부터.
- **2026-09-02 밤 — 프로덕션 검토 당일 통과·게시 시작 확인**(사용자가 스토어에서 먼저 발견 → 콘솔 실측: 트랙 "활성 · 최신 출시 버전 11 (1.0.10) · 국가/지역 177개") → **latest `1.0.10` PATCH 완료**(bootstrap 실측). ⚠ 발견: **한국어 등록정보 그래픽이 en-US 상속**(스크린샷·피처 그래픽 KO 버전을 만든 적 없음 — STORE_LISTING §7 KO 캡션은 플랜만. 제작 여부는 사용자 결정 대기).
- **2026-09-02 밤 (2) — 한국어 스토어 그래픽 제작·업로드**(사용자 지시 "에뮬레이터 켜서 영어처럼 디자인해서 만들어줘 — 다른 언어도 다"): ko 스크린샷 6장(공용 에뮬 ko 로케일 + 한국어 시드 재촬영 → Malgun 캡션 합성) + ko 피처 그래픽 → ko-KR 등록정보 폰·7"·10"·그래픽 4슬롯(순서 EN 동일) → **검토 전송 "검토 중인 변경사항"(4건)**. 등록정보 언어는 en·ko 둘뿐이라 다른 언어는 대상 없음. STORE_LISTING §7.1.
- **2026-09-02 밤 (3) — 앱 내 시행 고지 3건 전부 삭제**(사용자 지시 "공지사항 글 전부 다 제거 — 이제 게시했는데"): `DELETE /api/admin/announcements` ×3(`9ecde8ec…`·`13dc2524…`·`df35b667…`) → bootstrap `announcements` 0건 실측. 근거: 고지 대상 = 구 정책 기존 이용자(본인 + doply뿐), 프로덕션 신규 사용자는 현행 rev.6으로 시작. 문안 정본은 LEGAL_SYSTEM 게시 기록에 보존 — **다음 개정부터 7일 전 고지 규칙 준수**(LEGAL_SYSTEM 게시 기록).
- **2026-09-08 에뮬레이터 정책 전환 반영**(사용자 지시 — common_server 세션 경유 "각 프로젝트마다 문서에 작성되어있는 건 다 수정"): ~~공용 2대(common_1·common_2) 클레임~~ → **프로젝트별 AVD(`idea_repository` · 포트 5572) + 외장 `D:\emulators\idea_repository` 저장**(`ANDROID_AVD_HOME` 필수). 정본 `common/EMULATOR_POOL.md`(외장 콜드 부팅 ~259초 — 실패 아님·재시작 잦으면 켜 둔다) · 포트 `common/DEV_ALLOCATION.md` §3. 수정: `emulator-test` 스킬(**adb `-s "$SER"` 누락 9곳 전부** + 부팅 절차 + ~~끝나면 emu kill~~ → 종료 판단) · README §3(공용 풀 서술 → 취소선 체인) · STORE_LISTING §7.1 한 줄 · `seed_emulator.py` 기본 serial 5554→5572. ARCHITECTURE·PLAN·UI_GUIDE·§16의 `common_2` 언급은 과거 실측 기록이라 보존(EMULATOR_POOL §2.3 판정 기준 — "지금 무엇을 하라고 시키는가"). **같은 날 2차**(공통서버 세션 후속 통지 — 검출을 동사 열거가 아니라 **허용 목록**으로): bare adb 전수 재검출 → 살아 있는 레시피 2곳 추가 수정(ARCHITECTURE §5.5·UI_GUIDE 함정 노트의 `adb reverse`에 `-s <serial>`) + 스킬의 `-s` 근거를 정책이 아니라 **영구 사실**("adb 서버는 한 대 — 실기기가 붙어 있는 것이 기본 상태")로 명시(전용 AVD가 돼도 안 낡게).
- **2026-09-08 `check:i18n` 19일 헛돌이 수정**(공통서버 세션 발견 — 전 프로젝트 제어문자 스캔): `t()` 수집 정규식의 `\b`가 0x08(백스페이스) 바이트로 박혀(8/20 `ca47065`부터) 코드 사용 키 검사가 0건 매치로 통과만 하고 있었다 → 바이트 치환(파일 스크립트 — 셸 원라이너는 같은 계층에서 2회 연속 재오염) + **자가 검증 내장**(0x08 열화·`\b` 소실 변이 둘 다 FAIL 발화, 변이 테스트 실증) + 캐너리 확인. 그 기간 실제 누락 키 0건. **일반화**: 저장소 전수 상시 가드 `npm run check:chars` 신설(허용 ~~TAB·LF·CR~~ → 같은 날 정정 **TAB·LF·줄 끝 CR** — 9~13 통짜 허용은 VT·FF를, CR 통짜 허용은 **줄 중간 CR**을 놓친다. 판정에 위치 포함, 자가 검증 4케이스). I18N_SYSTEM §2 기록.
- **2026-09-09 R8 난독화 켬 — vc12 · 1.0.11 빌드·릴리스 E2E 통과**(사용자 지시 "플레이 콘솔 확인·수정·업로드" — 콘솔 실측: "앱 최적화 기준점 미만 · 난독화 1%" 경고, 대상 11(1.0.10)·기한 2027-02): 원인 = Expo 템플릿 기본 minify OFF. **정본 `common/R8_OBFUSCATION.md` 신설**(사용자 지시 — 왜/어떻게/함정, My Word 전례 + CNG 갈림길. 조각 세션이 같은 날 합류 편집). 적용 = **B 방식**: `app.json` expo-build-properties(minify·shrinkResources·extraProguardRules — keepattributes·`expo.modules.**`·`com.facebook.jni.**`, 🚫 react 통짜 keep 금지) + `tools/build-aab.ps1`에 optimize.txt 패치·minify 게이트·mapping.txt 확인(BUILD §2.5). runtimeVersion 1.0.0 유지. AAB 63.8MB·mapping 73.5MB. **릴리스 E2E**(새 정책 첫 AVD — D:\emulators\idea_repository·5572 생성): 오프라인 첫 실행 무오류 → sqlite 저장·홈 카드 → 온라인 콜드 스타트 SecureStore 세션 발급 → **EASSharedPreferences 생성(expo-updates 생존 — OTA 탈출구 무사)** → admob+UMP xml → 설정 1.0.11·라이선스·Idea Lab 정상 → 앱 삭제·emu kill(-s·avd name 확인). 노트는 STORE_LISTING §10 vc12(최적화만). 업로드·검토 제출은 **사용자가 직접**(서비스 계정 권한 게이트 — 분류기 차단), 출시명·노트는 세션이 콘솔에 작성("성능 및 안정성 개선, 앱 용량 축소" — 최적화만, STORE_LISTING §10). → **"출시 버전 12 (1.0.11) 검토 중 · 국가 177" 콘솔 실측(9/9)** — "주의 필요 · 앱 최적화 기준점 미만" 블록이 출시 대시보드에서 소멸(권장 조치로 강등). ~~최종 소멸 판정은 게시 후 모니터링 및 개선에서(공용 문서 §6)~~ → ✅ **당일 게시·경고 최종 소멸 확인(2026-09-09)**: 검토 당일 통과 — 트랙 "활성 · 최신 출시 버전 12 (1.0.11) · 국가 177", 게시일 9/9 11:44("Google Play에 제공됨" 콘솔 실측). **모니터링 및 개선에서 "주의 필요" 경고 소멸**(정책 문제 0건 — 남은 것은 기한 없는 권장 조치 2건: 비트맵 이미지·R8 구성 메모리). 같은 날 **latest `1.0.11` PATCH**(bootstrap 실측 — vc11 이하에 소프트 업데이트 안내 개시). R8 권장 항목 세부 실측(같은 날 오후, LinkMemo §6.1 예고 검증): 우리 세부는 **두 줄뿐** — `최적화가 사용 설정되지 않음` 줄이 없다(optimize.txt 패치에 콘솔이 반응), 남은 `최적화된 리소스 축소`·`AGP 9.0`은 **Expo SDK 상향 대기 사안이라 지금 할 것 없음**(정본 §6.1).
- **2026-09-09 오후 — 공통 정책 반영 3건**(공통서버 세션 경유 사용자 승인): ① 빌드 찌꺼기 정리 ~2.4GB(`android/app/build` 2.2G·`.cxx` 175M 외 — `gradlew clean`이 `externalNativeBuildCleanRelease` CMake 재구성 실패로 죽어 **디렉터리 직접 삭제**, 함정 포함 BUILD §3 ⑥) ② **산출물 보관 정책**: 업로드한 AAB는 `D:\builds\idea_repository\`에 영구 보관(정본 `common/BUILD_ARTIFACTS.md` — ~~구 AAB 삭제~~ 관행 폐지, vc11·vc12 이관·sha256 대조) ③ 커밋 규약을 값 복사 → **정본 포인터**로(§11 → `common/COMMIT_CONVENTION.md` — 다섯 프로젝트가 값을 베껴 적어 원본 개정이 안 따라오던 드리프트).
- **2026-09-09 저녁, 한국어 문장 규칙 편입**(공통서버 세션 경유 사용자 지시): 정본 `common/KOREAN_WRITING.md` 신설에 따라 §11에 포인터 추가. 요지 두 개: 문장 속 줄표(`—`) 금지(새 글부터, 목록 기호와 문서 제목은 예외), 사용자 노출 한국어는 ChatGPT 검수(문안은 세션이 만들고 요청은 사람이). 기존 글 소급 수정과 일괄 치환은 금지이고 가드화도 하지 않는다(기존 1,160개가 전부 걸려 가드가 꺼진다). 프로덕션 앱 화면 문구는 인지만, 다음에 그 화면을 어차피 건드릴 때 검수와 함께 정리한다. 부수: reload-docs 스킬의 커밋 규약 값 복제도 정본 포인터로 교체(같은 드리프트 자리).
- **2026-09-14 공지 영어 본문 반영**(공통서버 세션 경유 사용자 지시 "idea_repository 도 공지사항 영어 추가할 수 있게"): 서버가 공지에 `titleEn`·`bodyEn`을 붙였고(선택 값, 스위치를 켠 앱만 수신) `idearepository` 스위치가 켜졌다. 앱은 SDK `2026-09-14` 재복사(순수 추가분: `localizeAnnouncement()` + `AnnouncementItem` 선택 필드 2개, 기존 호출부 무변경) + `app/notice.tsx`가 제목·본문을 직접 읽는 대신 `localizeAnnouncement(item, i18n.language)`로 고른다(렌더 지점은 그 한 곳뿐. 설정 배지는 id 수만 센다). 고르는 규칙은 SDK 내장(한국어 기기는 항상 한국어, 그 외는 영어 제목·본문이 둘 다 있을 때만 영어). 읽음 키는 계속 공지 id. 구 설치본은 새 필드를 무시하고 한국어 유지(무오류). ~~⏳ 배포는 사용자 지시 대기~~ → **같은 날 첫 OTA 게시**(사용자 지시 "ota 배포로 하자" — 18:24 KST, 채널 production · runtimeVersion 1.0.0 · 그룹 `12347226-9aa3`. `update:list`·`channel:list` 실조회 + **기기 실측**: vc12 실물 AAB → bundletool universal APK → 프로젝트 AVD 콜드 2회, 1회차 다운로드 완료·2회차 적용 확인·JS 오류 0. 함정 기록 포함 BUILD §5 ota 행). 같은 날 **리포 공개 유지 사용자 결정**("그냥 공개로 할래, 비공개는 유료"): 9/9부터 대기하던 비공개 전환을 하지 않기로 확정, 미푸시 커밋 push 재개.
- 다음 단계: **① 첫 `eas update`는 vc11이 사용자 손에 간 뒤·사용자 지시로** → 알파 트랙 처분(유지 중 — 중단 여부는 사용자 결정, doply 계약과 연동) → ko 그래픽 검토 결과 확인 → (AdMob 해제 후) Phase 7 Remove Ads + 스토어 설명 "one-time Remove Ads" 문장 재검토(LEGAL §7 #12) · 한국 개발자 추가 정보(콘솔 확인). 전체 로드맵은 [`docs/PLAN.md`](./docs/PLAN.md) "남은 작업 로드맵". → (사용자 확인 후) 스토어 설명 "follow the system setting" 문장 삭제(STORE_LISTING §2.2·§3.2) → (AdMob 해제 후) Phase 7(Remove Ads) → ~~프로덕션 신청(콘솔에서 테스터 ≥12명·14일 확인 — 시계상 8/31 도달)~~ → ✅ **프로덕션 액세스 승인(2026-09-02 13:40 콘솔 실측 — 사용자 신청·구글 승인)**. ⚠ **권한이지 출시가 아니다** — 프로덕션 트랙은 비활성(릴리스 0), 라이브는 여전히 알파 vc10뿐(`common/PLAY_CONSOLE_STATUS.md` §0-3). vc11 트랙 선택지가 둘이 됐다(알파 유지 / 프로덕션 첫 출시 — 사용자 결정). 프로덕션 첫 출시 전 확인 2건은 그대로: 한국 개발자 추가 정보 · "one-time Remove Ads" 문장(LEGAL §7 #12). 전체 로드맵은 [`docs/PLAN.md`](./docs/PLAN.md) "남은 작업 로드맵".
