# STORE_LISTING — 스토어 등록정보 (Google Play · App Store)

> Google Play(우선)·App Store 등록정보의 **텍스트 정본**. 포지셔닝·문구 원칙은 [`../CLAUDE.md`](../CLAUDE.md) §1·§6(정직한 표현 규칙)·§7·§7.1,
> 사업자·연락처 값의 단일 출처는 `C:\project\common\BUSINESS_INFO.md`(커밋 금지 — 여기엔 **값만** 옮겨 적는다).
> LinkMemo `docs/PLAN.md` Phase 6.5·`docs/MONETIZATION_SYSTEM.md` §5의 등록 절차·카테고리·연락처 선례를 승계한다.
> 작성일: 2026-08-17. 앱 내 About 화면(`app/about.tsx`)·링크 상수(`lib/links.ts`)와 값이 어긋나면 안 된다.

## 구현 현황

| 영역 | 상태 | 비고 |
|---|---|---|
| 앱 이름 · 짧은 설명 · 자세한 설명(EN·KO) | ✅ 초안 | 이 문서 §2~§3. 글자 수 한도 검증(30/80/4000) — 아래 표기 |
| 캐치프레이즈 · 키워드 · 카테고리 | ✅ | §1·§4 — CLAUDE.md §14 서비스명 결정과 동일 |
| 연락처 · 웹사이트 · 처리방침/약관 URL | ✅ | §5 — URL ~~게시 예정~~ → ✅ 게시 2026-08-17(4차/5차 재게시 8/21), 라이브 200 |
| 콘텐츠 등급 · 타겟층 메모 | ✅ | §6 |
| 스크린샷 플랜 · 피처 그래픽 아이디어 | ✅ 플랜 | §7 — 실촬영은 Phase 2~3 화면 완성 후 |
| App Store 항목(subtitle·promo·keywords) | ✅ 초안 | §8 |
| 앱 내 About 화면(정보·링크·판매자 정보) | ✅ | 2026-08-17 — `app/about.tsx` · `lib/links.ts` · 설정 → 정보 |
| 아이콘 · 피처 그래픽 · 스크린샷 실제 파일 | ✅ | 2026-08-17 `tools/store/` — 콘솔 업로드 완료 |
| Play 데이터 보안 선언 · IAP 상품 · 테스터 트랙 | 🔨 | 데이터 보안 ✅ · 트랙 ✅(vc1~vc6 업로드, 테스터 제공 중) · IAP ⏸ Phase 7(AdMob 정지 해제 후) |

🚫 = 안 하기로 결정 / ⏸ = 보류 / ❌ = 미착수 / ✅ = 완료

---

## 1. 포지셔닝 · 캐치프레이즈

- 앱 이름: ~~**Idea Repository** (16자 / 30자 한도)~~ → **언어별 부제 추가**(2026-09-02 사용자 결정 — 프로덕션 첫 출시 때 검색 유입용. "아이디어 노트·메모 + 우리가 만든 발상 도구도 반영"):
  - en-US: **`Idea Repository - Idea Notes`** (28자) — 30자 한도에 brainstorm까지 안 들어가 검색량 큰 "idea notes" 우선
  - ko-KR: **`Idea Repository: 아이디어 노트·메모·발상`** (정확히 30자 — 콜론+공백. 초과 판정 시 폴백: em-dash 무공백 29자 → `아이디어 노트·발상` 28자)
- 태그라인 1: **Your ideas. Your device. Yours to build.**
- 태그라인 2: **Capture your ideas. Keep them private. Build what matters.**
- 흐름: Capture → Organize → Develop → Build
- 핵심 메시지(전 문안 공통): Only a name to start · Structured, not a memo · Search/filter/sort · Categories & tags ·
  12 themes · No account · No cloud — stored locally · Free with ads, one-time Remove Ads.

⚠ 금지 표현(CLAUDE.md §6): "절대 유출되지 않습니다" · "no data leaves the device" · "100% secure/private".
허용 문장은 **"Your ideas are stored locally on your device and are not uploaded to our servers."** 하나로 통일한다
(광고 SDK가 있으므로 "아무 데이터도 나가지 않는다"는 거짓이 될 수 있다).

---

## 2. Google Play — 영어 (기본, en-US)

### 2.1 짧은 설명 (≤ 80자)

> Capture ideas fast, structure them into projects. Local, private, no account.

(77자)

### 2.2 자세한 설명 (≤ 4,000자)

```
Idea Repository is a private, local-first place for the things you want to build.

Your ideas. Your device. Yours to build.

CAPTURE WITH JUST A NAME
Had an idea? Type a name and save. That's it. Nothing else is required — no forms to fill in, no setup, no account. Add details whenever the idea grows.

STRUCTURE IDEAS INTO PROJECTS
Idea Repository is not a plain memo app. Each idea is a project you can develop over time:
• Basics — name, one-line summary, description, category, tags
• Idea — problem, goal, core idea, target user
• Progress — progress (0–100%), status (Idea · Planned · In Progress · On Hold · Cancelled · Completed), priority (High · Medium · Low · None), start date, target end date
• Idea notes — record how the idea evolves, note by note
• Resources — links to references, articles, and tools you want to keep

FIND IT AGAIN
• Search across names, summaries, descriptions, problems, goals, core ideas, target users, notes, and tags
• Filter by status, category, and priority
• Sort by recently updated, recently created, name, progress, target end date, or priority

ORGANIZE YOUR WAY
• Categories — App, Game, Web, Service, Business, Content, Other, or add your own
• Tags — free-form tags with autocomplete
• 12 themes — light, dark, and colorful palettes ~~, or follow the system setting~~ ← ~~⚠ 콘솔 반영 대기~~ → ✅ **2026-09-02 콘솔 삭제 반영**(사용자 확인 "시스템 설정 문장만 삭제" — one-time Remove Ads 문장은 유지, LEGAL §7 #12는 계속 열림)

PRIVATE BY DESIGN
• No account, no sign-up, no login. Install and start.
• No cloud sync. Your ideas are stored locally on your device and are not uploaded to our servers.
• If you delete the app or change devices, your data may be lost — please keep that in mind.

FREE, WITH ADS
All features are free. The app shows a small banner and an occasional app-open ad. A one-time Remove Ads purchase turns ads off — no subscription, no locked features.

Idea Repository is for makers, indie developers, designers, students, and anyone who keeps a list of "things I want to build someday" — and wants to turn that list into real projects.

Capture your ideas. Keep them private. Build what matters.

Contact: support@vivace-games.com
```

(약 2,050자 — 한도 4,000자 이내)

---

## 3. Google Play — 한국어 (ko-KR)

### 3.1 짧은 설명 (≤ 80자)

> 아이디어를 이름만으로 빠르게 기록하고 프로젝트로 발전시키세요. 로컬 저장, 계정 없음.

(48자)

### 3.2 자세한 설명 (≤ 4,000자)

```
Idea Repository는 "내가 만들고 싶은 것들"을 모아 두는 개인용 로컬 아이디어 보관함입니다.

내 아이디어. 내 기기. 내가 만든다.

이름만 입력하면 저장됩니다
아이디어가 떠올랐나요? 이름 하나만 적고 저장하세요. 필수 입력은 그것뿐입니다. 회원가입도, 설정도 없습니다. 나머지는 아이디어가 자라는 만큼 나중에 채우면 됩니다.

메모가 아니라 프로젝트로 관리합니다
아이디어 하나가 하나의 프로젝트가 되어 시간이 지나며 구체화됩니다.
• 기본 정보 — 이름, 한 줄 요약, 설명, 카테고리, 태그
• 아이디어 — 문제점, 목표, 핵심 아이디어, 타겟 사용자
• 진행 관리 — 진행률(0~100%), 상태(아이디어 · 계획됨 · 진행 중 · 보류 · 취소됨 · 완료), 우선순위(높음 · 보통 · 낮음 · 없음), 시작일, 마감 예정일
• 아이디어 노트 — 아이디어가 발전해 온 과정을 노트로 기록
• 관련 자료 — 참고 링크, 글, 도구를 프로젝트에 연결

다시 찾기 쉽게
• 이름 · 요약 · 설명 · 문제점 · 목표 · 핵심 아이디어 · 타겟 사용자 · 노트 · 태그를 한 번에 검색
• 상태 · 카테고리 · 우선순위로 필터
• 최근 수정 · 최근 생성 · 이름 · 진행률 · 마감일 · 우선순위로 정렬

내 방식대로 정리
• 카테고리 — App, Game, Web, Service, Business, Content, Other 기본 제공 + 직접 추가
• 태그 — 자유롭게 만들고 자동완성으로 재사용
• 테마 12종 — 라이트 · 다크 · 컬러 팔레트 ~~, 또는 시스템 설정 따르기~~ ← ~~⚠ 콘솔 반영 대기~~ → ✅ **2026-09-02 콘솔 삭제 반영**(en과 동일)

처음부터 프라이빗하게
• 회원가입 · 로그인 · 계정이 없습니다. 설치하고 바로 시작하세요.
• 클라우드 동기화가 없습니다. 아이디어는 이 기기에만 저장되며 저희 서버로 업로드되지 않습니다.
• 앱을 삭제하거나 기기를 바꾸면 데이터가 사라질 수 있으니 유의해 주세요.

무료 + 광고
모든 기능이 무료입니다. 작은 하단 배너와 가끔 표시되는 앱 시작 광고가 있습니다. 광고 제거는 일회성 구매 한 번이면 됩니다 — 구독도, 잠긴 기능도 없습니다.

인디 개발자, 디자이너, 학생, 그리고 "언젠가 만들고 싶은 것" 목록을 가진 모든 분께. 그 목록을 진짜 프로젝트로 바꿔 보세요.

Capture your ideas. Keep them private. Build what matters.

문의: support@vivace-games.com
```

---

## 4. 키워드 · 카테고리

| 항목 | 값 |
|---|---|
| Play 카테고리 | **앱 / 생산성 (Productivity)** — LinkMemo와 동일 |
| App Store 기본 카테고리 | Productivity · 보조: Utilities |
| 키워드(검색 최적화 참고) | idea, ideas, project, side project, indie, maker, notes, brainstorm, planner, tracker, offline, local, private, no account, productivity |
| 태그(Play 콘솔 태그) | Productivity · Notes · Planning |

---

## 5. 연락처 · URL · 판매자 정보

| 항목 | 값 | 비고 |
|---|---|---|
| 개발자명(공개) | **Vivace Games Studio** | Play 콘솔 `개발자 이름` 실측값(2026-08-26). ~~Vivace Games~~ 는 구 조직 계정 이름 |
| 이메일 | support@vivace-games.com | LinkMemo와 동일 창구 |
| 웹사이트 | https://vivace-games.com | |
| 개인정보처리방침 URL | https://vivace-games.com/idearepository/privacy | ~~게시 예정(Phase 8)~~ → ✅ 게시 2026-08-17 — 배구 서버 Vercel 정적 페이지 방식(LinkMemo 선례). 앱 내 About 링크와 동일 |
| 이용약관 URL | https://vivace-games.com/idearepository/terms | ~~게시 예정~~ → ✅ 게시 2026-08-17 — 유료 상품(Remove Ads) 있으므로 준비 |
| 계정 삭제 URL | 해당 없음 | 계정이 없다(CLAUDE.md §4) — 콘솔 "계정 생성 없음"으로 선언 |
| 법적 상호 | 휘성게임즈 / Hwiseong Games | 앱 내 About "판매자 정보"에 표시 |
| 대표자 | 손휘성 (Son Hwi-seong) | |
| 사업자등록번호 | 749-25-02260 | 한국 개발자 추가 정보(Play 계정 세부정보)에도 입력 |
| 통신판매업 신고번호 | 제2026-울산중구-0170호 (신고기관: 울산 중구청) | 유료 디지털 상품 판매자 표시 의무 |
| 사업장 주소 | 울산광역시 중구 성안 5길 22, 2층 204호(성안동), 44421 / 204, 2F, 22 Seongan 5-gil, Jung-gu, Ulsan, 44421, Republic of Korea | |
| 패키지 · app_code | `com.vivacegames.idearepository` · `idearepository` | CLAUDE.md §14 L |
| 출시 계정 | Vivace Games Studio(개인, `6329667596149711059`) | 비공개 테스트 12명×14일 |

---

## 6. 콘텐츠 등급 · 타겟층 · 앱 콘텐츠 선언 메모

| 선언 | 답 | 근거 |
|---|---|---|
| 콘텐츠 등급(IARC) | 전체 이용가 예상(ESRB E · PEGI 3) | 사용자 콘텐츠 **공유 없음**(로컬 전용) · 폭력/성인물 없음 |
| 사용자 제작 콘텐츠(UGC) 공유 | **없음** | 프로젝트·노트는 기기에만 저장, 다른 사용자에게 노출 경로 없음 |
| 광고 포함 | **예** | AdMob 배너 + App Open(CLAUDE.md §7) |
| 인앱 구매 | **예** — Remove Ads 일회성(비소모성) | ₩3,300 기준(2026-08-17 형제 앱 통일), 국가별 현지 가격 |
| 타겟층 | **13세 이상** | 아동 대상 아님. LinkMemo와 동일 선언 |
| 로그인 | 없음 → 심사용 계정 불필요 | |
| 광고 ID 사용 | 예(광고 SDK) | 데이터 보안 선언과 일치시킬 것 |
| 데이터 보안 | 사용자 프로젝트 데이터 수집 없음 · 광고 SDK 수집 항목(기기/광고 ID·대략 위치·앱 상호작용) · 문의 본문(선택, Phase 5) | **실제 트래픽 기준**(CLAUDE.md §6). 처리방침과 1:1 |
| 금융 · 건강 · 정부 앱 | 아니오 | |

---

## 7. 스크린샷 · 그래픽 플랜

휴대전화 9:16(1080×1920) 5~6장. 촬영은 Phase 2~3(상세·검색·필터) 완료 후, 에뮬레이터 + 릴리스 빌드에서
(LinkMemo 방식: 실화면 캡처 → 마케팅 프레임 합성). 캡션은 상단 짧은 문장, EN 정본 + KO.

| # | 화면 | 캡션 EN | 캡션 KO |
|---|---|---|---|
| 1 | 메인 — 프로젝트 카드 목록(상태·진행률·우선순위·태그) | Your ideas, as projects | 아이디어를 프로젝트로 |
| 2 | 새 프로젝트 — 이름 1칸 + "Add details" 접힘 | Capture with just a name | 이름만 적으면 저장 |
| 3 | 프로젝트 상세 — 문제점·목표·핵심 아이디어·타겟·진행률 | Structure it as it grows | 자라는 만큼 구조화 |
| 4 | 아이디어 노트 + 관련 자료 | Track how the idea evolves | 발전 과정을 기록 |
| 5 | 검색 · 필터 · 정렬 시트 | Find it again, fast | 빠르게 다시 찾기 |
| 6 | 테마 선택 그리드(12종) | 12 themes. No account. Local only. | 테마 12종. 계정 없음. 로컬 저장. |

- **피처 그래픽(1024×500)**: 왼쪽에 앱 아이콘 + "Idea Repository", 오른쪽에 카드 3장이 겹친 목업(Idea → In Progress → Completed
  상태 배지로 발전 흐름 암시). 하단 태그라인 "Your ideas. Your device. Yours to build." 배경은 Light Minimal 토큰
  (`#2563EB` 포인트). 텍스트는 이미지 밖 캡션이 아니라 그래픽 안에 최소로.
- **아이콘(512)**: 전구/스파크가 아니라 **"보관함 + 아이디어"** — 서랍/저장소 형태에 작은 점(아이디어) 여러 개. 형제 앱(LinkMemo 체인 링크)과
  같은 투톤 스타일. PIL 제작 스크립트는 LinkMemo `tools/` 재사용.
- 7인치·10인치 태블릿 슬롯은 같은 장면을 태블릿 프레임으로(Play 요구사항 충족용).

### 7.1 한국어 그래픽 (2026-09-02 사용자 지시 "에뮬레이터 켜서 영어처럼 디자인해서 만들어줘 — 다른 언어도 있으면 다")

프로덕션 게시 후 ko-KR 등록정보가 en-US 그래픽을 상속 중인 것을 발견(§9) → **한국어 한 벌 제작**.
등록정보 언어는 en-US·ko-KR 둘뿐(콘솔 실측)이라 다른 언어는 대상 없음. 디자인·구도는 영어판과 동일(같은 스크립트).

- **앱 화면**: 에뮬레이터(~~공용 2대~~ → 2026-09-08부터 프로젝트별 AVD — 정본 `common/EMULATOR_POOL.md`)에서 기기 로케일 ko-KR + 한국어 시드 데이터(`seed_emulator.py` ko 데이터)로 재촬영 →
  `tools/store/shots/shot_*_ko.png`. 캡션 폰트는 Malgun Gothic(`malgunbd/malgun.ttf` — Segoe UI엔 한글 없음).
- **캡션(실제 사용본 — 위 §7 표는 초기 플랜)**:

| # | 장면 | EN(게시본) | KO |
|---|---|---|---|
| 1 | 홈 | All your ideas, one place | 모든 아이디어를 한곳에 / 상태·진행률·우선순위·태그를 한눈에 |
| 2 | 상세 | Turn ideas into projects | 아이디어를 프로젝트로 / 문제점·목표·핵심 아이디어·노트·자료까지 |
| 3 | 새 프로젝트 | Capture in seconds | 몇 초면 기록됩니다 / 이름만 입력하면 저장 — 세부 정보는 나중에 |
| 4 | 검색 | Find it instantly | 바로 다시 찾기 / 노트와 #태그 검색, 필터·정렬 |
| 5 | 테마 | 12 themes, all free | 테마 12종, 전부 무료 / 라이트·다크·파스텔 — 취향대로 |
| 6 | 프라이버시 | Your ideas stay on your device | 아이디어는 기기에만 저장 / 계정 없음 · 클라우드 없음 — 서버로 보내지 않아요 |

- **피처 그래픽 KO**(`feature-ko-1024x500.png`): 구도 동일, 제목 "Idea Repository"(브랜드 라틴 유지) +
  태그라인만 한국어 "내 아이디어. 내 기기. 내가 만든다."(§3.2 설명 도입부와 동일 문구). 생성은 `tools/make_store_assets_ko.py`
  (make_store_assets.py에서 피처 블록만 분리 복제 — 원본 재실행은 앱 아이콘 assets까지 다시 쓰므로 피함).
- **업로드**: ko-KR 등록정보의 폰·7"·10" 슬롯 + 그래픽 이미지. en-US는 손대지 않는다. 등록정보 변경이라 다시 검토를 거친다(앱 게시 상태 무관).
- ✅ **2026-09-02 밤 제작·업로드·검토 전송 완료** — 공용 에뮬 `common_2`(클레임→반납) · 디버그 빌드 + Metro 8090 ·
  기기 로케일 ko(`settings put system system_locales ko-KR` + zygote 재시작 — `persist.sys.locale`만으론 안 먹음, 단 앱 표기는
  결국 **앱 언어 설정**을 따름: 날짜 포함 `lib/date.ts`가 i18n.language 기준) · ko 시드 5프로젝트 · 한글 입력은 adb 불가(NPE) →
  **새 프로젝트 = 딥링크 프리필**(`idearepository://project/new?name=…`) · **검색어 = `app/index.tsx` useState 임시 주입 후 원복**(vc8 기법) ·
  합성 `make_screenshots.py ko`(Malgun · fit_font 자동 축소) → 콘솔 ko-KR 4슬롯(폰 순서 = EN과 동일: 홈→새→상세→검색→프라이버시→테마,
  드래그 2회로 정렬) → 저장 → **"검토를 위해 변경사항 4개 제출" → "검토 중인 변경사항"**. 콘솔 함정: ①애셋 추가 → 사이드 패널
  → 업로드 버튼이 `input.click()` — `HTMLInputElement.prototype.click` 패치로 네이티브 창 억제 후 file_upload ②라이브러리 행 선택은
  **호버 → 썸네일 원형 체크 클릭**(줄 클릭·JS click 무효) ③적용 순서는 선택 순서 무관 — 슬롯 드래그로 정렬.

---

## 8. App Store (후속 — 값만 미리 확정)

| 항목 | 한도 | 값 |
|---|---|---|
| Name | 30 | Idea Repository |
| Subtitle | 30 | Capture. Structure. Build. (26자) |
| Promotional Text | 170 | Turn "someday I'll build this" into real projects. Save an idea with just a name, then add problem, goal, progress, notes and resources as it grows. Local & private. (165자) |
| Keywords | 100 | idea,ideas,project,side project,indie,maker,notes,brainstorm,planner,tracker,offline,private,local (98자) |
| Description | 4,000 | §2.2 영어 본문 그대로(Google 고유 표현 없음) |
| Category | — | Productivity / Utilities |
| Privacy — Data | — | "Data Not Linked to You": Identifiers·Usage Data·Diagnostics(광고 SDK). 사용자 콘텐츠 수집 없음 |
| Age Rating | — | 4+ 예상(광고 포함 선언) |
| Support URL | — | https://vivace-games.com |
| Privacy Policy URL | — | https://vivace-games.com/idearepository/privacy |

---

## 9. 제출 전 체크리스트

| 항목 | 상태 | 비고 |
|---|---|---|
| 앱 아이콘 512×512 + 앱 내 아이콘 6종 교체(현재 템플릿) | ✅ | 2026-08-17 `tools/make_store_assets.py`(전구 심볼) → `assets/images/*` · `tools/store/icon-512.png` 콘솔 업로드 |
| 피처 그래픽 1024×500 | ✅ | 2026-08-17 `tools/store/feature-1024x500.png` 콘솔 업로드 |
| 스크린샷 휴대전화 5~6장 + 7"/10" 태블릿 | ✅ | 2026-08-17 `tools/make_screenshots.py` → `tools/store/shots/store_shot_1..6.png`(1080×1920). 폰·7"·10" 슬롯 모두 같은 6장(순서: 홈→새 프로젝트→상세→검색→로컬 저장→테마) |
| 처리방침 실게시(`/idearepository/privacy`) | ✅ | 2026-08-17 배구 서버 Vercel — 200 |
| 이용약관 실게시(`/idearepository/terms`) | ✅ | 2026-08-17 — 200 |
| Play 데이터 보안 선언(광고 SDK 수집 항목 = 처리방침 1:1) | ✅ | 2026-08-17 콘솔 제출 — `legal/DATA_SAFETY.md` §2 |
| 앱 콘텐츠 선언 10종(등급·광고·타겟층·로그인 없음·광고 ID…) | ✅ | 2026-08-17 콘솔 11/11 완료(§6 답안 그대로) |
| 한국 개발자 추가 정보(사업자번호·통신판매업 신고번호·신고기관) | ❓ | **계정 단위 항목**(앱별 아님) — LinkMemo가 2026-08-14 계정 세부정보에 입력. 같은 계정(Vivace Games Studio)이면 완료 — 프로덕션 신청 전 콘솔에서 확인 |
| IAP 상품 `remove_ads`(비소모성) 등록 + RevenueCat attach | ⏸ | Phase 7 — AdMob 정지 해제 후(2026-08-21). `store-iap-setup` 스킬 |
| 스토어 설정(카테고리 생산성 · 이메일 · 웹사이트) | ✅ | 2026-08-17 — 앱/생산성 · support@vivace-games.com · https://vivace-games.com |
| 비공개 테스트 트랙(Alpha) + 테스터 12명 × 14일 | ✅ 진행 중 | 2026-08-17 트랙 `4700611093824576153` → vc1 검토 통과·테스터 제공(8/17)부터 14일 시계, 프로덕션 신청 가능 ≈ 8/31. 테스터 = 업체 인원(`common/CLOSED_TESTING.md`) |
| AAB(EAS 또는 로컬 gradle) · versionCode 동기화(CNG 주의) | 🔨 | 2026-08-17 로컬 gradle `bundleRelease` → vc1(65MB, 업로드·검토 전송 완료) · **2026-08-18 vc2 · 1.0.1** — `app.json` version/versionCode → `expo prebuild --platform android`(서명 설정 유지 확인) → `gradlew bundleRelease` → `idearepository-vc2.aab` → 사용자 업로드 → 출시명 `2 (1.0.1)`·노트 입력 → **검토 전송 완료**(2026-08-18) · 이후 vc3~vc6은 `tools/build-aab.ps1` + `eas submit`([`BUILD.md`](./BUILD.md) §3·§3.5·§5). 릴리스 노트 §10 |
| `play-store-launch-checklist` 스킬 전체 점검 | ❌ | 제출 직전 |
| 앱 내 About(정보) — 링크·판매자 정보 | ✅ | 2026-08-17 `app/about.tsx` |

## 10. 릴리스 노트 (Play "이번 버전의 새로운 기능" — 언어별 500자 이내)

> 규칙: ~~비공개 테스트 기간의 수정분은 **AAB 재업로드로만** 반영(OTA 절대 금지 — CLAUDE.md §16).~~ → 2026-09-01 OTA 도입(vc11부터, [`OTA_SYSTEM.md`](./OTA_SYSTEM.md)) — 네이티브 변경은 AAB, JS 수정은 OTA 가능(게시는 사용자 지시). versionCode는 업로드마다 +1, versionName은 사용자 보이는 변경이 있으면 patch +1.

### vc12 · 1.0.11 (2026-09-09) — R8 난독화·코드 축소 (Play "앱 최적화 기준점 미만 · 난독화 1%" 경고 해소, 기한 2027-02)

> 기능 변경 없음 — 최적화 단독 릴리스라 노트도 최적화만 적는다(`common/R8_OBFUSCATION.md` §4 노트 규칙).
> 설정 정본 `app.json` expo-build-properties(BUILD §2.5) · runtimeVersion 1.0.0 유지.

```
<en-US>
Performance and stability improvements. Smaller app size.
</en-US>
<ko-KR>
성능 및 안정성 개선, 앱 용량 축소.
</ko-KR>
```

### vc11 · 1.0.10 (2026-09-01 → 2026-09-02 프로덕션 첫 출시) — ✅ **검토 전송 완료**("검토 중인 변경사항" 7개: 릴리스 · 국가 177 · 부제/설명 en+ko)

> 첫 OTA 가능 빌드(expo-updates) + SDK `2026-09-02`(웜 스타트 하트비트·슬라이딩 갱신) + 오픈소스 고지 + 웰컴 문구. ~~트랙은 사용자 결정~~ → **프로덕션 첫 릴리스**(2026-09-02 사용자 승인 "전부 진행 — 단계적 출시"). ~~아래 changelog형 초안~~ → **폐기(2026-09-02 사용자 지적 "첫 출시인데 그렇게 작성 안 했으면")** — 프로덕션 첫 사용자는 이전 버전을 본 적 없으니 소개 한 줄로. vc10 알파 노트의 "effective 2026-09-08" 오기 정정(§7 #14)은 노트 대신 **처리방침 개정 이력·앱 내 공지가 정본으로 이미 수행**(알파 노트는 테스터만 봤다).

**최종 입력(첫 출시 소개형)**:

```
<en-US>
Welcome to Idea Repository — capture your ideas as projects and grow them over time. Everything is stored on your device.
</en-US>
<ko-KR>
Idea Repository 첫 출시입니다 — 아이디어를 프로젝트로 기록하고 발전시켜 보세요. 모든 데이터는 기기에만 저장됩니다.
</ko-KR>
```

<details><summary>폐기된 changelog형 초안(이력)</summary>

```
<en-US>
• In-app updates: small fixes can now reach you without a store update (applied the next time you fully restart the app).
• Reliability: fixed a session-renewal issue that could quietly stop a device from being counted as active.
• Privacy Policy updated — rev. 5 (device identifier at first launch, effective 2026-09-01) and rev. 6 (in-app update checks go to Expo, effective YYYY-MM-DD). See Settings › About.
</en-US>
<ko-KR>
• 앱 내 업데이트: 작은 수정은 스토어 업데이트 없이도 반영됩니다(앱을 완전히 종료한 뒤 다시 실행하면 적용).
• 안정성: 세션 갱신 문제로 기기가 활성 집계에서 조용히 빠질 수 있던 점을 고쳤습니다.
• 개인정보처리방침 개정 — 5차(첫 실행 시 기기 식별자, 2026-09-01 시행)·6차(앱 업데이트 확인이 Expo 서버로 감, YYYY-MM-DD 시행). 설정 › 정보 참고.
</ko-KR>
```

</details>

### vc10 · 1.0.9 (2026-09-01) — ✅ 검토 통과 · 테스터 제공(9/1 14:23)

> ⚠ 노트의 "effective 2026-09-08 / 2026-09-08 시행"은 콘솔에 **입력된 그대로**다. 전송 직후 처리방침 시행일이 2026-09-01(당일)로 정정됐지만(LEGAL_SYSTEM §7 #14), 사용자가 "다시 올리자"고 한 시점(9/1 오후)엔 이미 검토 통과·게시돼 취소할 변경사항이 없었다. 게시된 릴리스의 노트는 콘솔에서 수정 불가. **2026-09-01 사용자 결정: vc11을 만들지 않고 프로덕션 출시 노트에서 정정** — 알파 노트는 테스터에게만 보이고, 프로덕션 릴리스는 자기 노트를 새로 쓴다(승급이든 새 AAB든).

**en-US**
```
• Support: an inquiry now shows "Reviewing" while we are looking into it.
• Under the hood: the app registers an anonymous device ID at first launch so we can count active users. No name, email or advertising ID is involved — see the updated Privacy Policy (effective 2026-09-08).
• Welcome screen wording updated to match.
```

**ko-KR**
```
• 문의: 확인 중인 문의에 "확인 중" 상태가 표시됩니다.
• 내부 개선: 활성 사용자 수를 집계할 수 있도록 첫 실행 시 익명 기기 ID를 등록합니다. 이름·이메일·광고 ID는 쓰지 않습니다 — 개정된 개인정보처리방침(2026-09-08 시행)을 참고하세요.
• 시작 화면 문구를 이에 맞게 고쳤습니다.
```

### vc9 · 1.0.8 (2026-08-31) — ✅ 검토 통과 · 테스터 제공(8/31 11:37)

**en-US**
```
• Clearer forms: text fields and selectors in the filter sheet and the new-project form now use a white background with a border — the gray fill made them look disabled.
• Theme & language: removed the "System (auto)" option — pick your theme and language directly. Your current setting carries over.
• Categories: adding a category moved to the + button at the top right of the Manage categories screen.
```

**ko-KR**
```
• 입력 필드 개선: 필터 시트·새 프로젝트 화면의 입력 칸과 선택 칸이 회색 채움 탓에 비활성처럼 보이던 것을 흰 배경 + 테두리로 바꿨습니다.
• 테마·언어: "시스템(자동)" 항목을 제거하고 바로 선택하도록 했습니다. 기존 설정은 그대로 유지됩니다.
• 카테고리: 카테고리 추가를 관리 화면 우측 상단 ＋ 버튼으로 옮겼습니다.
```

### vc8 · 1.0.7 (2026-08-26) — ✅ 검토 통과 · 테스터 제공(8/26 12:47)

**en-US**
```
• Update notice: when a newer version is on the store, the home screen shows a one-time prompt with "Open Store" / "Later". Never blocks the app.
• Search: results now show where the match was found ("Found in: Notes · Goal") when the term is in a field the card doesn't display — description, problem, goal, core idea, target user or idea notes.
```

**ko-KR**
```
• 업데이트 안내: 스토어에 새 버전이 있으면 홈 화면에서 한 번 안내합니다("스토어로 이동" / "나중에"). 앱 사용을 막지 않습니다.
• 검색: 검색어가 카드에 안 보이는 항목(설명·문제점·목표·핵심 아이디어·타겟 사용자·아이디어 노트)에서 걸리면 카드 아래에 "일치: 노트 · 목표"처럼 어디서 찾았는지 표시합니다.
```

### vc7 · 1.0.6 (2026-08-23) — ✅ 검토 통과 · 테스터 제공(8/23 16:46)

**en-US**
```
• Consistent layout: Settings, Idea Lab and About now share the same row style — every settings row shows an icon and a one-line description, and all rows are the same height. Cards and dialogs use unified corners and spacing.
```

**ko-KR**
```
• 화면 규격 통일: 설정·발상 도구·정보 화면의 행 모양을 맞췄습니다 — 설정의 모든 행에 아이콘과 한 줄 설명이 붙고 높이가 같아졌습니다. 카드·다이얼로그의 모서리와 간격도 통일했습니다.
```

### vc6 · 1.0.5 (2026-08-21) — ✅ 검토 통과 · 테스터 제공(8/21 16:25)

**en-US**
```
• New: Backup — Settings → Backup exports all your ideas to a single file on your device (via the share sheet) and imports it back later (merge or replace). No cloud, no account; the file never reaches our servers.
```

**ko-KR**
```
• 새 기능: 백업 — 설정 → 백업에서 모든 아이디어를 기기 안의 파일 하나로 내보내고(공유 시트), 나중에 다시 가져올 수 있습니다(병합/교체). 클라우드·계정 없음, 파일은 회사 서버로 가지 않습니다.
```

### vc5 · 1.0.4 (2026-08-21) — ✅ 검토 통과 · 테스터 제공(8/21 12:04)

**en-US**
```
• Idea Lab: the "+" to add a word now sits at the top-right of the Manage words screen. Removed the bottom actions (import tags & categories / restore defaults) to keep the list clean.
• Korean: particles (은/는, 이/가, 을/를) now match the word automatically in What if… cards, Improve questions and delete prompts.
```

**ko-KR**
```
• 발상 도구: 단어 관리 화면의 단어 추가를 우측 상단 ＋ 버튼으로 옮겼습니다. 하단의 내 태그·카테고리 가져오기 / 기본 단어 복원은 제거했습니다.
• 한국어: 만약에… 카드, 개선 질문, 삭제 확인 문구의 조사(은/는·이/가·을/를)가 단어에 맞게 자동으로 붙습니다.
```

### vc4 · 1.0.3 (2026-08-20) — ✅ 검토 통과 · 테스터 제공(8/20 11:08)

**en-US**
```
• Idea Lab: the word-list entry on Combine is now a clear "Manage words" text button instead of an icon.
```

**ko-KR**
```
• 발상 도구: 조합 화면의 단어 목록 진입을 아이콘 대신 "단어 관리하기" 텍스트 버튼으로 바꿨습니다.
```

### vc3 · 1.0.2 (2026-08-19) — ✅ 검토 통과 · 테스터 제공(8/19 19:34, 업로드·전송은 사용자)

**en-US**
```
• Idea Lab: manage your own word list — tap the library icon on Combine to add, edit or delete any word (built-in ones too), import your tags & categories, or restore the defaults. Combine and What if… draw from this list.
• Pressing the back button on the home screen now asks before closing the app.
```

**ko-KR**
```
• 발상 도구: 단어 목록을 직접 관리 — 조합 화면 우측 상단 아이콘에서 단어 추가·수정·삭제(내장 단어 포함), 내 태그·카테고리 가져오기, 기본 단어 복원. 조합·만약에… 도구가 이 목록에서 뽑습니다.
• 메인 화면에서 뒤로가기를 누르면 바로 닫히지 않고 종료 여부를 묻습니다.
```

### vc2 · 1.0.1 (2026-08-18)

**en-US**
```
• New: Idea Lab — four ways to spark ideas (Combine, Improve, From a problem, What if…) and save any of them as a project in one tap. Everything stays on your device.
• New: "Approach" field on projects.
• Filter: status filter moved into the filter sheet, alongside category and priority.
• Settings: unified rows; new Privacy options (EEA/UK/Switzerland) to change your ad consent any time.
• Fixes: sheet buttons hidden behind the navigation bar; welcome text now lists exactly what leaves your device.
```

**ko-KR**
```
• 새 기능: 발상 도구 — 조합·개선·불편에서·만약에… 네 가지 방법으로 아이디어를 떠올리고, 마음에 들면 한 번에 프로젝트로 저장합니다. 전부 기기 안에서 처리됩니다.
• 새 항목: 프로젝트 "발상 방식".
• 필터: 상태 필터를 카테고리·우선순위와 함께 필터 시트로 옮겼습니다.
• 설정: 행 모양 통일 · 개인정보 옵션(EEA·영국·스위스) 추가 — 광고 동의를 언제든 변경.
• 수정: 시트 버튼이 내비게이션 바에 가리던 문제, 웰컴 문구(기기를 떠나는 정보 3가지 명시).
```

### vc1 · 1.0.0 (2026-08-17)

첫 비공개 테스트 빌드 — 콘솔에 입력한 출시 노트: "Initial closed test build." / "첫 비공개 테스트 빌드입니다."

