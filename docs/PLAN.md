# Idea Repository — MVP 구현 플랜

> 범위 정본은 [`../CLAUDE.md`](../CLAUDE.md) §3(MVP)·§14(결정·미결정). 이 문서는 **착수 순서와 완료 기준**이다.
> 형식은 LinkMemo `docs/PLAN.md`(← common_server PLAN) 승계. 각 Phase는 완료 기준을 만족하고 실기기에서
> 눈으로 확인한 뒤 다음으로 넘어간다. 작성일: 2026-08-17.

## 진행 상황

| Phase | 내용 | 상태 |
|---|---|---|
| — | **미결정 7건 확정**(CLAUDE.md §14) — app_code·App Open 3h·기기 subject·백업 제외·기본 카테고리 편집 허용·라이트/다크·출시 계정 | ✅ 2026-08-17 사용자 승인(제안값 그대로) |
| 0 | 기반 정리 — Expo SDK 54 스캐폴드·폴더 구조·i18n 뼈대·테마 토큰·Metro 8087 | ✅ 2026-08-17 — typecheck·lint·check:i18n(29키)·콜드 번들 200(1537모듈) 통과. 템플릿 예제는 아예 가져오지 않음. ⏳ 실기기 눈확인(사용자) |
| 1 | DB + 프로젝트 CRUD(이름만 생성) + 카테고리 시드/관리 + 태그 (핵심 도메인) | ✅ 2026-08-17 — DB v1·시드 · 생성 폼(Label+input, Select) · 카드 목록 · 삭제 · **카테고리 관리(추가·이름 변경·삭제 시 없음/이동 선택지)** · **태그 입력(칩·자동완성·고아 정리)** · 배너 자리 플레이스홀더. typecheck·lint·i18n(63키)·번들 통과. ⏳ 카테고리 관리·태그 실기기 확인(사용자) |
| 2 | 상세·편집 전 필드 + 아이디어 노트 + 관련 자료 | ✅ 2026-08-17 — 상세(`app/project/[id]/index.tsx`: 전 항목 + 빈 항목 "Add …" → 편집, 헤더 ✏️/🗑, 하단 배너 자리) · 편집(공용 `components/project-form.tsx` 전 필드: 문제점·목표·핵심 아이디어·타겟·상태·우선순위·진행률 슬라이더·시작/마감일 피커) · 노트 인라인 CRUD(작성 순, 탭 → 수정/삭제) · 자료 다이얼로그(URL 필수·제목 자동 제안, 탭 = 브라우저, 길게 = 수정/삭제) · 노트/자료 변경 시 updatedAt 갱신. typecheck·lint·i18n(123키)·번들(1608모듈) 통과. ⏳ 실기기 확인(사용자) |
| 3 | 탐색 — 검색 9필드 · 필터 3축 · 정렬 6종 | ✅ 2026-08-17 — `features/projects/query.ts`(한 쿼리: 7필드 LIKE + 노트·태그 EXISTS, `#` 처리, `%_` 이스케이프, 정렬 6종 SQL + 이름은 localeCompare) · `filter-store.ts`(zustand persist, 삭제된 카테고리 자동 해제) · 홈: 검색바(250ms 디바운스, 세션 한정) · 상태 칩 · 필터 시트(카테고리·우선순위 칩, Reset) · 정렬 OptionSheet · 결과 개수 · 검색/필터 0건 문구 + 초기화 링크. typecheck·lint·i18n(140키)·번들 통과. ⏳ 실기기 확인(사용자) |
| 4 | i18n 완성 — ko + check:i18n + 날짜 로케일 | ✅ 2026-08-17 — en·ko 전 키 동기(175키), `check:i18n`에 **코드 사용 키 검사(④)** 추가(누락 1건 발견·수정), 미사용 키 정리, 날짜 로케일은 Phase 2에서 적용 |
| 5 | common_server 연동 — 등록·SDK·부팅 게이트·공지·문의 | ✅ 2026-08-17 — `idearepository` seed → **bootstrap 200 실측** · SDK 복사(2026-08-14) · `_dv_sdk` 22/22 · BootGate(점검/강제업데이트, 실패 시 통과, 출구 포함) · 공지 화면 + 설정 배지 · 문의(기기 subject: 등록→귀속→내역/답변/상태) **프로덕션 E2E 실측**(등록·문의·mine 200, 잘못된 deviceId 400). ⏸ 디스코드 웹훅 env(사용자 URL 필요) · 소프트 업데이트(latest) 안내 · pinned 홈 팝업 |
| 6 | 광고 — dev build 전환 · 배너 · App Open · UMP | 🔨 2026-08-17 — AdMob 콘솔 대행 ✅(앱·배너·App Open·GDPR 게시) · SDK 16.0.0 고정 · config plugin(앱 ID·delayAppMeasurementInit) · `features/ads/{store,ads,app-open}` + 실배너(메인·상세) · **Expo Go 종료 → dev build**(`npm run android`, 에뮬레이터 `volleyball` AVD에 설치). **에뮬레이터 실측 ✅**: 콜드 스타트 App Open 테스트 광고 노출 → 닫기 → 웰컴 시트 → 홈 하단 배너(Test Ad) · 재실행 시 App Open 미노출(3h 쿨타임)·웰컴 재노출 없음. ⚠ 함정 2건: ① 프로젝트에 expo-dev-client가 없어 `expo run:android`는 일반 RN 디버그 앱 → 기본 dev 서버 8081(다른 프로젝트 Metro)에 붙는다 → `debug_http_host` 공유 프리퍼런스를 `10.0.2.2:8087`로 지정해 해결 ② 광고 패키지 설치 **후** Metro `--clear` 재시작 필수(파일 맵 낡음 → AppOpenAd 모듈 해석 실패) |
| 6.5 | 비공개 테스트 개시(개인 계정이면 12명×14일 시계 병행) | 🔨 2026-08-17 — 콘솔 대행 완료(앱 생성·앱 콘텐츠 11/11·데이터 보안·광고 ID·스토어 설정·등록정보 EN/KO+그래픽·Alpha 트랙 국가/테스터/출시노트). AAB vc1 사용자 업로드 → **검토 전송 완료(2026-08-17, 변경사항 16개)**. 검토 통과 후 테스터 12명×14일 |
| 7 | Remove Ads — RevenueCat 익명 · 구매/복원 | ⬜ |
| 8 | 출시 준비 — 아이콘/스플래시 · 처리방침 · 데이터 보안 선언 · AAB · 스토어 | 🔨 2026-08-17 — 아이콘·그래픽·처리방침 게시·데이터 보안·스토어 등록정보·AAB 검토 전송 ✅ / ⏳ 검토 결과 확인·`play-store-launch-checklist` 최종 점검·프로덕션 신청(14일 후) |

⚠ = 사용자 계정 작업 포함(AdMob·Play·RC 콘솔) — 해당 Phase에 명시.

---

## Phase 0 — 기반 정리 (0.5일)

- `create-expo-app` default 템플릿(expo-router·TS) — LinkMemo와 같은 조합(expo ~54.0.35 · RN 0.81.5 · React 19.1.0).
  ⚠ 이 레포는 docs가 먼저 있으므로 빈 임시 디렉터리에 스캐폴드 후 옮기거나 `--template`을 현 위치에 적용(LinkMemo 선례).
- 템플릿 예제 제거(explore 탭·hello-wave 등). **탭 없음 — 단일 메인 + 스택**(CLAUDE.md §14 C).
- 폴더 구조 확립(CLAUDE.md §12): `features/` `db/` `theme/` `locales/` `lib/` `scripts/`
- **i18n 뼈대**: i18next + expo-localization, `locales/en.json`·`ko.json`. ⚠ **화면은 처음부터 `t()` 키로** — 하드코딩 후
  걷어내는 재작업 금지(조각·LinkMemo 규약). LinkMemo `scripts/check-i18n.mjs` 이식.
- **테마 토큰** `theme/palettes.ts`: **라이트/다크 2종** + zustand persist(시스템 따르기/라이트/다크). 화면은 토큰만 참조.
- 공통 컴포넌트 시작: `Screen`(세이프에어리어 + 배너 footer 자리) · `Card` · `Button`
- ESLint `any` 금지, `package.json` scripts: `start`/`android` **`--port 8087`**, `typecheck`, `lint`, `check:i18n`
- `.gitignore`에 `credentials/` `*.jks` `*.aab` `android/` `ios/` 추가

**완료 기준**: typecheck·lint·check:i18n 통과 + 콜드 번들 200 + 실기기(또는 에뮬레이터)에서 빈 메인 화면 확인.

## Phase 1 — DB + 프로젝트 CRUD + 카테고리·태그 (2일) — 핵심

- `db/` — [`DATABASE.md`](./DATABASE.md) v1 스키마 6테이블 + `user_version` 러너 + **카테고리 7종 시드**
- 프로젝트 생성: **이름 1칸 + "Add details" 펼침**, 저장 후 목록 복귀(PROJECT_SYSTEM §2)
- 메인 목록: 카드(이름·요약·상태·진행률·우선순위·카테고리·태그·수정일) + 첫 실행 빈 화면(**데이터 손실 안내** + 추가 유도)
- 프로젝트 삭제(노트·자료 수 명시 확인) — 상세는 Phase 2지만 카드 길게 누르기/⋮로 삭제 경로 먼저
- 카테고리 관리 화면(Settings → Categories): 추가·수정·삭제(사용 중이면 선택지 — PROJECT_SYSTEM §4.3)
- 태그 입력(칩 + 자동완성) + 고아 태그 정리

**완료 기준**: 이름만으로 프로젝트 생성 → 카드 표시 → 카테고리 추가/이동 삭제 → 태그 2개 부여 → 삭제 왕복.

## Phase 2 — 상세·편집 + 노트 + 자료 (1.5일)

- 상세 화면(PROJECT_SYSTEM §12): 전 항목 + 빈 항목 "Add …" 플레이스홀더 + [Edit] + [⋮ 삭제]
- 편집 화면: 전 필드 폼 — 요약·설명·카테고리·태그·문제점·목표·핵심 아이디어·타겟·진행률 슬라이더·상태·우선순위·
  시작일/마감일(날짜 피커, `YYYY-MM-DD` 저장)
- 아이디어 노트: 상세 안 인라인 추가·수정·삭제, 작성순 정렬, 날짜 표기
- 관련 자료: URL 필수 + 제목 자동 제안 + 설명, 탭 → 외부 브라우저(실패 알림)
- 노트·자료 변경 → 프로젝트 `updated_at` 갱신 확인

**완료 기준**: 상세에서 문제점·목표 채우기 → 노트 3개 → 자료 2개(브라우저 열기) → 카드 "Updated" 갱신 확인.

## Phase 3 — 탐색 (1일)

- 검색: 메인 상단 검색바, 250ms 디바운스, 9필드 LIKE(노트·태그 EXISTS), `#태그` 처리, `%`·`_` 이스케이프
- ~~상태 칩(All + 6) · 필터 시트(카테고리·우선순위)~~ → 필터 시트(상태·카테고리·우선순위 Select — 2026-08-18) · 정렬 시트(6종) — AND 결합, 상태 zustand persist, Reset
- 우선순위 정렬 CASE · 마감일 NULL 맨 뒤 · Name 로케일 정렬 확인

**완료 기준**: 검색어가 노트에만 있는 프로젝트가 나온다 · 상태+카테고리+우선순위 동시 필터 · 6종 정렬 각각 순서 확인.

## Phase 4 — i18n 완성 (0.5일)

- ko 리소스 전 키 + `check:i18n` 통과(키 누락·잉여·보간)
- 설정 → 언어(시스템 따르기 / English / 한국어)
- dayjs locale 연동: 카드·노트·일정 날짜가 기기 지역 표기(`2026.08.14` / `08/14/2026`)

**완료 기준**: `npm run check:i18n` 통과, 기기 언어 전환 시 UI·날짜 표기 변경, 사용자 데이터는 불변.

## Phase 5 — common_server 연동 (0.5일)

절차 정본: [`ARCHITECTURE.md`](./ARCHITECTURE.md) §5 · `common_server/docs/ONBOARDING.md`.

- 서버 쪽: `seed.ts idearepository` 등록 → `bootstrap?app=idearepository` **200 출력 확보**
- 앱 쪽: SDK 복사(`lib/common-server/`, SDK_VERSION 주석) → 부팅 게이트(실패해도 앱 진행, 차단 화면 출구) →
  공지 화면(읽음은 로컬) → 문의(기기 subject `registerDevice` + 작성 폼 + 내역/답변/상태 화면)
- 디스코드 웹훅 env `DISCORD_TICKET_WEBHOOK_URL_IDEAREPOSITORY` + 재배포(유일한 재배포 지점, env 파일 끝 개행 확인)

**완료 기준**: 실기기에서 공지 노출 + 문의 전송 → 관리자 콘솔·디스코드 도착 + 내역 화면에 상태 표시.

## Phase 6 — 광고 (1일) ⚠ 사용자 작업 포함

- ⚠ AdMob 콘솔: 앱 · 배너 단위 · App Open 단위 · GDPR 메시지 — LinkMemo는 브라우저 대행으로 처리했다
- `react-native-google-mobile-ads` **16.0.0 고정** 설치 → **Expo Go 탈출, dev build 전환**(`npm run android`)
- 배너: `Screen` footer(메인·상세만), 미수신 시 자리 미점유
- App Open: 콜드 스타트 + 쿨타임 3시간(로컬 저장) + 로드 8초 타임아웃 + 금지 순간 가드, 복귀 노출 없음
- UMP: `AdsConsent` 흐름 + `delay_app_measurement_init: true`
- `adsEnabled()` 단일 게이트(dev는 테스트 단위 고정)

**완료 기준**: dev build에서 테스트 배너·App Open 노출, 3시간 쿨타임 동작(시간 조작 테스트), 금지 순간 미노출, 편집 화면 배너 없음.

## Phase 6.5 — 비공개 테스트 개시 ⚠ 사용자 작업 포함

- ⚠ 출시 계정 = Vivace Games Studio(개인, 2026-08-17 확정) — **12명×14일**이 크리티컬 패스라 개발과 병행 시작. `GOOGLE_ACCOUNT_CASE.md` 최신 상태 재확인
- Play 콘솔 앱 생성 · 트랙 · 첫 AAB · 앱 콘텐츠 선언(처리방침 URL·광고·데이터 보안·콘텐츠 등급) · 등록정보 · 그래픽 —
  LinkMemo PLAN Phase 6.5의 순서·함정 그대로(처리방침 404·한국 개발자 추가 정보 등)
- **2026-08-17 브라우저 대행 실적** — Play 앱 `4975846571298570248` · Alpha 트랙 `4700611093824576153`. 앱 콘텐츠 11/11(처리방침 URL·광고 예·콘텐츠 등급·타겟층 13+·로그인 없음·데이터 보안·광고 ID 예(분석·광고·사기방지)·정부/금융/건강 아니오) ·
  데이터 보안 = [`legal/DATA_SAFETY.md`](./legal/DATA_SAFETY.md) §2 그대로(위치·앱 상호작용·진단·기기 ID = 수집+공유·필수 / 기타 사용자 제작 콘텐츠 = 수집·선택) · 스토어 설정(앱/생산성 · support@vivace-games.com · https://vivace-games.com) ·
  등록정보 en-US 기본 + ko-KR(문안 [`STORE_LISTING.md`](./STORE_LISTING.md) §2·§3, 아이콘 512·피처 1024×500·폰/7"/10" 스크린샷 6장 = `tools/store/`) · Alpha 트랙(국가 177·테스터 목록·출시명 `1 (1.0.0)`·출시 노트 en/ko).
  ⚠ **AAB(65MB)는 브라우저 도구 10MB 제한으로 업로드 불가** → 사용자가 `idearepository-vc1.aab`를 드롭(2026-08-17) → 다음(경고 1: R8 가독화 파일 없음 — 무시 가능) → 저장 → 게시 개요 **변경사항 16개 검토 전송 완료**. 신규 설치 22.6MB · targetSdk 36 · minSdk 24.
  함정: Play 콘솔 체크박스는 `form_input`로 DOM만 바뀌고 Angular 상태는 안 바뀜 → 실제 click 필요 / 파일 input은 "애셋 추가" 클릭 후 동적 생성 / 스크린샷 순서는 라이브러리에서 하나씩 → 추가.

## Phase 7 — Remove Ads (1일) ⚠ 사용자 작업 포함

- ⚠ Play 콘솔 비소모성 상품 등록(선행: 첫 AAB), RC 대시보드 프로젝트·상품 attach — `store-iap-setup` 스킬
- `react-native-purchases` **익명 모드**(`logIn` 안 함), entitlement `remove_ads`
- Settings → Remove Ads: 구매(스토어 가격 표시)·**Restore Purchases**
- 캐시 규칙: 로컬 캐시 + 조회 실패에 캐시 유지, 환불 회수는 온라인 확인 시 갱신
- `payment-security-compliance` 스킬로 한국 규제 점검

**완료 기준**: 라이선스 테스터 샌드박스 구매 → 광고 0 · 재설치 후 복원 동작.

## Phase 8 — 출시 준비 ⚠ 사용자 작업 포함

- 앱 아이콘·스플래시·스토어 그래픽(LinkMemo `tools/` PIL 방식 참고)
- 처리방침 게시(실제 트래픽 기준: 로컬 저장·광고 SDK·문의) — LinkMemo처럼 배구 서버 Vercel 정적 페이지 가능. 값은 `common/BUSINESS_INFO.md`
- Play 데이터 보안 선언 = 처리방침과 1:1
- EAS 빌드(eas.json) → AAB, `play-store-launch-checklist` 스킬 전체 점검

**완료 기준**: 비공개 테스트 트랙 게시 + 실기기 설치 확인 → (개인 계정) 14일 후 프로덕션 신청.

---

## 순서에 대한 근거

- **토큰·i18n 뼈대(0)를 도메인(1) 앞에**: 화면 전부가 토큰과 `t()`를 참조해야 하므로, 없이 시작하면 전 화면 재작업.
- **DB·CRUD(1)를 상세·편집(2)보다 먼저**: "이름만 저장"(기둥 1)이 제품의 핵심 동선이라 가장 먼저 실기기에서 손에 잡혀야 한다.
- **광고(6)를 도메인(1~3) 뒤로**: 광고 SDK가 dev build를 강제한다 — Expo Go의 빠른 반복이 유효한 동안 핵심 도메인을 끝낸다.
- **common_server(5)를 광고(6)보다 먼저**: 서버 등록·문의는 순수 JS라 Expo Go에서 검증 가능.
- **결제(7)가 마지막 기능**: Play 상품 등록이 AAB 업로드에 묶인다.

## 일정 감각

Phase 0~4(코어, 순수 JS) ≈ 5.5일 · Phase 5~7(연동·수익화) ≈ 2.5일 + 사용자 콘솔 작업 · Phase 8은 심사·테스트 트랙
대기가 지배한다. 개인 계정 경로면 **12명×14일**이 크리티컬 패스 — LinkMemo는 코드 이틀째에 비공개 테스트를 걸었다.
