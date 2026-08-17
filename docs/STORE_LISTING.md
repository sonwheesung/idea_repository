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
| 연락처 · 웹사이트 · 처리방침/약관 URL | ✅ 값 확정 | §5 — URL은 **게시 예정**(vivace-games.com 하위 경로). 게시 자체는 Phase 8 |
| 콘텐츠 등급 · 타겟층 메모 | ✅ | §6 |
| 스크린샷 플랜 · 피처 그래픽 아이디어 | ✅ 플랜 | §7 — 실촬영은 Phase 2~3 화면 완성 후 |
| App Store 항목(subtitle·promo·keywords) | ✅ 초안 | §8 |
| 앱 내 About 화면(정보·링크·판매자 정보) | ✅ | 2026-08-17 — `app/about.tsx` · `lib/links.ts` · 설정 → 정보 |
| 아이콘 · 피처 그래픽 · 스크린샷 실제 파일 | ✅ | 2026-08-17 `tools/store/` — 콘솔 업로드 완료 |
| Play 데이터 보안 선언 · IAP 상품 · 테스터 트랙 | 🔨 | 데이터 보안 ✅ · 트랙 준비 ✅(AAB 대기) · IAP는 Phase 7 |

🚫 = 안 하기로 결정 / ⏸ = 보류 / ❌ = 미착수 / ✅ = 완료

---

## 1. 포지셔닝 · 캐치프레이즈

- 앱 이름: **Idea Repository** (16자 / 30자 한도)
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
• 12 themes — light, dark, and colorful palettes, or follow the system setting

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
• 테마 12종 — 라이트 · 다크 · 컬러 팔레트, 또는 시스템 설정 따르기

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
| 개발자명(공개) | Vivace Games | 브랜드. 법적 상호는 아래 |
| 이메일 | support@vivace-games.com | LinkMemo와 동일 창구 |
| 웹사이트 | https://vivace-games.com | |
| 개인정보처리방침 URL | https://vivace-games.com/idearepository/privacy | **게시 예정**(Phase 8) — 배구 서버 Vercel 정적 페이지 방식(LinkMemo 선례). 앱 내 About 링크와 동일 |
| 이용약관 URL | https://vivace-games.com/idearepository/terms | **게시 예정** — 유료 상품(Remove Ads) 있으므로 준비 |
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
| 한국 개발자 추가 정보(사업자번호·통신판매업 신고번호·신고기관) | ❌ | 계정 세부정보 — LinkMemo 선례 |
| IAP 상품 `remove_ads`(비소모성) 등록 + RevenueCat attach | ❌ | Phase 7 — `store-iap-setup` 스킬 |
| 스토어 설정(카테고리 생산성 · 이메일 · 웹사이트) | ✅ | 2026-08-17 — 앱/생산성 · support@vivace-games.com · https://vivace-games.com |
| 비공개 테스트 트랙(Alpha) + 테스터 12명 × 14일 | 🔨 | 2026-08-17 트랙 `4700611093824576153` 국가·테스터·출시노트 준비. ⏳ AAB 업로드(사용자) → 검토 전송 → 14일 시계 |
| AAB(EAS 또는 로컬 gradle) · versionCode 동기화(CNG 주의) | 🔨 | 2026-08-17 로컬 gradle `bundleRelease` → `idearepository-vc1.aab`(65MB, gitignored). ⏳ 콘솔 업로드는 사용자(브라우저 도구 10MB 제한) |
| `play-store-launch-checklist` 스킬 전체 점검 | ❌ | 제출 직전 |
| 앱 내 About(정보) — 링크·판매자 정보 | ✅ | 2026-08-17 `app/about.tsx` |
