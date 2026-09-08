# Idea Repository — 문서 색인

> 이 파일이 **문서 색인이자 구현 현황 정본**이다. 새 `*_SYSTEM.md`를 추가하면 반드시 아래 목록과
> 구현 현황표에 함께 등록한다([`DOC_DISCIPLINE.md`](./DOC_DISCIPLINE.md) 부록 체크리스트).
> 설계 원칙·기둥·MVP 범위·결정 로그는 루트 [`CLAUDE.md`](../CLAUDE.md).

---

## 1. 문서 목록

| 문서 | 범위 | 상태 |
|---|---|---|
| [`../CLAUDE.md`](../CLAUDE.md) | 설계 정본 — 기둥·MVP 범위·회원 없음/로컬 온리 정책·BM·스택·결정 로그(미결정 0건 — 2026-08-17 전부 확정) | ✅ |
| [`PLAN.md`](./PLAN.md) | MVP 구현 플랜 — Phase 0~10 착수 순서·완료 기준·진행 현황 | ✅ |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | 서버 경계 — common_server 연동(공지·문의)·전용 서버 없음·선행 작업 | ✅ |
| [`DOC_DISCIPLINE.md`](./DOC_DISCIPLINE.md) | 문서 작업 규율 (LinkMemo·조각 승계) | ✅ |
| [`PROJECT_SYSTEM.md`](./PROJECT_SYSTEM.md) | 도메인 — 프로젝트·기본/아이디어/진행 정보·카테고리·태그·노트·자료·메인·검색·필터·정렬·상세 | ✅ |
| [`DATABASE.md`](./DATABASE.md) | expo-sqlite 스키마 v1(6테이블)→v2 approach→v3 ideation_words(7테이블)·시드·조회 패턴·마이그레이션 규약 | ✅ v3 2026-08-19 |
| [`MONETIZATION_SYSTEM.md`](./MONETIZATION_SYSTEM.md) | 광고(배너·전면형·금지 순간·UMP) + Remove Ads 일회성 구매·복원 | ✅ |
| [`I18N_SYSTEM.md`](./I18N_SYSTEM.md) | 다국어 — en 기본·ko·키 규약·날짜 로케일·언어 추가 절차 | ✅ |
| [`THEME_SYSTEM.md`](./THEME_SYSTEM.md) | 테마 12종(~~+ 시스템 자동~~ 2026-08-27 제거) — 토큰·팔레트·미니어처 선택 UX·결정 이력 | ✅ |
| [`IDEATION_SYSTEM.md`](./IDEATION_SYSTEM.md) | **발상 도구(Idea Lab)** — 입구·도구 4종·단어/문장 풀·섞기 규칙·프로젝트 저장 미리 채움·`approach` 필드 | ✅ 2026-08-18 |
| [`BACKUP_SYSTEM.md`](./BACKUP_SYSTEM.md) | **로컬 백업** — JSON 내보내기(OS 공유 시트)·가져오기(병합/교체)·파일 형식 v1·무료 결정·법무 문구 | ✅ 2026-08-21 구현·에뮬 실측 |
| [`OTA_SYSTEM.md`](./OTA_SYSTEM.md) | **OTA(expo-updates · EAS Update)** — 고정 runtimeVersion·채널 헤더·콜드 스타트 적용·게시 규율·버전 오염 방지(`lib/app-version.ts`)·개인정보(Expo) | ✅ 2026-09-01 구조 · ⏳ vc11부터 동작 |
| [`BUILD.md`](./BUILD.md) | **로컬 AAB 빌드·서명** — 업로드 키스토어(재생성 금지)·비밀번호 파일·build.gradle 서명 블록·`tools/build-aab.ps1`·점검·버전 이력 | ✅ 2026-08-18 |
| [`STORE_LISTING.md`](./STORE_LISTING.md) | 스토어 등록정보 정본 — Play/App Store 문안(EN·KO)·키워드·URL·판매자 정보·등급 메모·스크린샷 플랜·제출 체크리스트 | ✅ |
| [`design/theme-mockups-12.png`](./design/theme-mockups-12.png) | **테마 12종 화면 시안 정본**(2026-08-17 사용자 제공) — 팔레트 추출 기준 | ✅ |
| [`LEGAL_SYSTEM.md`](./LEGAL_SYSTEM.md) | 법률 문서 — 처리방침(EN·KO)·약관(KO·EN)·Play 데이터 보안 답안·게시 페이지 소스(`legal/`)·정합 규칙·게시 절차 | ✅ 초안(2026-08-17) · ✅ 게시(2026-08-17) · ✅ 4차/5차 재게시(2026-08-21) · 시행 고지 발행(2026-08-23) |
| [`UI_GUIDE.md`](./UI_GUIDE.md) | **공통 컴포넌트·표면(반경 3단계)·간격·타이포 규약** — ListRow·ListGroup·EditRow·Dialog·Badge·ProgressBar | ✅ 2026-08-23(~~❌ 미작성~~ — 설정 행 규격 통일에서 출발) |
| `CHANGELOG.md` | 릴리스 변경 이력 | ❌ 미작성 — 현재는 [`BUILD.md`](./BUILD.md) §5 버전 이력 + [`STORE_LISTING.md`](./STORE_LISTING.md) §10 릴리스 노트가 그 역할(2026-08-23 정리) |

원본 기획서("Idea Vault 글로벌 MVP 기획서", 2026-08-17 — 서비스명은 같은 날 Idea Repository로 확정)는 이 문서 체계로 전부 옮겼다 — 기획서 §번호는 CLAUDE.md 곳곳에
출처로 인용돼 있다. 기획서 자체는 레포에 두지 않는다(정본은 CLAUDE.md).

---

## 2. 구현 현황

2026-08-17 문서 체계 수립 + **Phase 0 완료**(스캐폴드·토큰·i18n·설정 골격). 아래 표가 착수 순서의 기준이 된다.

### 앱

| 영역 | 상태 | 비고 |
|---|---|---|
| Expo 부트(SDK 54 · expo-router · TS strict · Metro ~~8087~~ → **8090** 2026-08-27) | ✅ | 2026-08-17 — expo ~54.0.35 · RN 0.81.5 · React 19.1.0(LinkMemo 조합). 템플릿 예제 미채용, 단일 메인+스택(`index`·`project/new`·`settings`) |
| 발상 도구(Idea Lab) — 조합·개선·불편에서·만약에 + approach 필드 | ✅ | 2026-08-18 — 메인 헤더 전구·빈 화면 링크 → `/idea-lab` 4도구 → `/project/new` 미리 채움. 에뮬: 조합·개선 e2e [`IDEATION_SYSTEM.md`](./IDEATION_SYSTEM.md) |
| 테마 12종 ~~+ 시스템(자동)~~ | ✅ | 2026-08-17 — ~~라이트/다크 2종~~ → 시안 12종. **시스템(자동) 항목 2026-08-27 제거**(구 저장값 마이그레이션). `theme/palettes.ts` · `app/theme.tsx` 미니어처 그리드 · 설정 행에 현재 테마 표시. 카드 테두리 1px [`THEME_SYSTEM.md`](./THEME_SYSTEM.md) |
| expo-sqlite v1 스키마 + 카테고리 시드 | ✅ | 2026-08-17 Phase 1 — [`DATABASE.md`](./DATABASE.md) |
| 프로젝트 생성(이름만) · 카드 목록 · 삭제 | ✅ | 2026-08-17 Phase 1 — 생성 폼 Label+input(`TextField`) + Select(카테고리·상태·우선순위), 카드(상태·우선순위·진행률 바·카테고리·태그·수정일), 길게 눌러 삭제 |
| 카테고리 관리(추가·수정·삭제 시 선택지) | ✅ | 2026-08-17 Phase 1 — 설정 → 카테고리. 사용 수 표시, 중복 거부, 삭제 시 없음/이동 라디오 |
| 태그(칩 · 자동완성 · 고아 정리) | ✅ | 2026-08-17 Phase 1 — 생성 폼 TagInput(공백/쉼표/엔터 확정, prefix 자동완성), 저장 시 replaceProjectTags + 고아 정리 |
| 프로젝트 상세 · 편집(전 필드) | ✅ | 2026-08-17 Phase 2 — `app/project/[id]/{index,edit}.tsx`, 공용 `project-form`, 슬라이더·날짜 피커(Expo Go 포함 모듈) |
| 아이디어 노트 CRUD | ✅ | 2026-08-17 Phase 2 — 상세 인라인 |
| 관련 자료 CRUD + 외부 브라우저 | ✅ | 2026-08-17 Phase 2 — 다이얼로그(URL 필수·제목 자동 제안), 탭 = 브라우저 |
| 검색 9필드 | ✅ | 2026-08-17 Phase 3 — 한 쿼리(LIKE + EXISTS), 디바운스, 세션 한정 |
| 필터 3축 · 정렬 6종 · 상태 유지 | ✅ | 2026-08-17 Phase 3 — 필터 시트(상태·카테고리·우선순위 Select — 2026-08-18 상태 칩 이동) · 정렬 시트 · zustand persist |
| 다국어 en·ko + `check:i18n`(리소스 정합 + 코드 사용 키) + 언어 설정 | ✅ | 2026-08-17 — ~~175키~~ 295키(2026-08-21 백업 키 포함) 동기, 설정→언어 행(탭 → OptionSheet: ~~시스템/~~English/한국어 — 시스템 항목 2026-08-27 제거, 302키). Phase 4 점검 완료 |
| 날짜 로케일 표기 | ✅ 기본 | 2026-08-17 — `lib/date.ts`(dayjs `ll`, ko/en 로케일, customParseFormat). 카드 수정일에 사용 |
| 하단 배너(메인·상세) | ✅ | 2026-08-17 Phase 6 — 실 AdMob 배너(dev=테스트 단위), 미수신 시 자리 미점유 |
| App Open 광고(콜드 스타트 · 쿨타임 3h) | ✅ | 2026-08-17 Phase 6 — 복귀 노출 없음, 로드 8초 타임아웃 |
| UMP 동의 폼 | ✅ | 2026-08-17 Phase 6 — 콘솔 GDPR 메시지 게시 + AdsConsent 흐름 |
| ⚠ **Expo Go 종료** | — | 2026-08-17 — 광고 SDK(네이티브) 설치. 이후 개발은 디버그 빌드(`npx expo run:android --device <AVD명> --no-bundler`; expo-dev-client 미포함이라 일반 RN 디버그 앱). **Metro 8087에 붙이려면** 앱의 RN 개발 메뉴 → Settings → Debug server host를 `<호스트>:8087`로(에뮬레이터는 `10.0.2.2:8087`, 폰은 Tailscale `100.91.69.45:8087`) — 기본은 8081이라 다른 프로젝트 Metro에 붙는다(2026-08-17 실증). 에뮬레이터는 `run-as`로 `debug_http_host` 프리퍼런스를 직접 써도 된다 |
| Remove Ads 구매 + Restore | ⏸ | Phase 7 — RevenueCat 익명. AdMob 정지 해제 후(2026-08-21) |
| 로컬 백업(내보내기·가져오기) | ✅ | 2026-08-21 — 설정 → 백업. JSON 한 파일 · 공유 시트 · 병합/교체 한 트랜잭션. 에뮬 실측(병합·교체·거부) [`BACKUP_SYSTEM.md`](./BACKUP_SYSTEM.md). ~~vc6 예정~~ → vc6 · 1.0.5 검토 전송(2026-08-21) |
| 소프트 업데이트 안내(latest) · 검색 매치 힌트 | ✅ | Phase 11 — 2026-08-26 구현 → vc8 · 1.0.7. **운영값 latest `1.0.7` + 스토어 URL PATCH(2026-08-31, bootstrap 실측 — 팝업 운영 개시)**. 설계 [`ARCHITECTURE.md`](./ARCHITECTURE.md) §5.4 · [`PROJECT_SYSTEM.md`](./PROJECT_SYSTEM.md) §9.1 |
| OTA 업데이트(expo-updates · EAS Update) | ✅ 구조 · ⏳ vc11부터 | 2026-09-01 — `app.json` `runtimeVersion "1.0.0"` + `updates`(url = projectId · ON_LOAD · `expo-channel-name: production`) · `lib/app-version.ts`(네이티브 버전) · `npm run check:ota`. 게시는 사용자 지시 때만, 첫 게시 전 처리방침 rev.6 게시. [`OTA_SYSTEM.md`](./OTA_SYSTEM.md) |
| 공지·점검·강제업데이트(bootstrap) | ✅ | 2026-08-17 Phase 5 — `components/boot-gate.tsx`(실패 시 통과·차단 화면 출구) · `app/notice.tsx` + 설정 배지. ~~⏸ latest 소프트 안내 미구현~~ → ✅ Phase 11(vc8, 위 행) [`ARCHITECTURE.md`](./ARCHITECTURE.md) §6 |
| 문의하기 + 기기 subject + 내역/답변/상태 | ✅ | 2026-08-17 Phase 5 — `app/inquiries.tsx`·`app/inquiry.tsx`·`features/support/server.ts`(SecureStore UUID·세션). 프로덕션 E2E 실측. **2026-09-01**: 세션 확보를 부팅(`fetchOnce`)으로 앞당김 — 활성 사용자 집계(§5.5), 상태 `reviewing` 키 추가 |
| 데이터 손실 안내 문구 | ✅ | 2026-08-17 — 홈 빈 화면(`data.notice.*`) + 설정 → 정보(About) 카드 |
| 첫 실행 프라이버시 웰컴 시트 + About "Privacy at a glance" | ✅ | 2026-08-17 — `components/welcome-sheet.tsx`·`privacy-overview.tsx`, `features/onboarding/store.ts`(persist, 복원 후 표시) |
| 정보(About) 화면 — 버전·태그라인·링크(처리방침·약관·문의·웹사이트)·판매자 정보 | ✅ | 2026-08-17 — `app/about.tsx` · 상수 `lib/links.ts` · 문안 [`STORE_LISTING.md`](./STORE_LISTING.md) |
| 오픈소스 라이선스 고지 | ✅ | 2026-09-02 — About → `app/licenses.tsx`(패키지 43 — 세는 법: `npm run check:licenses`). 생성 `licenses:build` → `lib/oss-packages.ts` · 가드 `check:licenses`(변이 주입으로 이빨 확인) · 카피레프트 0(MIT 42·Apache-2.0 1). 폰트 없음(시스템 폰트). [`LEGAL_SYSTEM.md`](./LEGAL_SYSTEM.md) §10. vc11부터 |

### 서버·외부 (Idea Repository 밖 선행 작업)

| 영역 | 상태 | 비고 |
|---|---|---|
| common_server `apps`에 `idearepository` 등록 | ✅ | 2026-08-17 seed — 프로덕션 `bootstrap?app=idearepository` 200 실측 |
| common_server SDK 복사(`lib/common-server/`) | ✅ | 2026-08-17 — ~~SDK_VERSION 2026-08-14~~ → ~~2026-09-01~~ → ~~2026-09-01.2~~ → **2026-09-02 재복사**(웜 스타트 하트비트 + `exp` — 첫 호출부 증가: `boot-gate` AppState 리스너, [`ARCHITECTURE.md`](./ARCHITECTURE.md) §5.7, vc11부터)(슬라이딩 갱신 §5.6 · bootstrap 세션 동봉 → 활성 하트비트 §5.5), `_dv_sdk` 22/22. 수정 금지·갱신은 재복사 |
| 디스코드 문의 웹훅 env + 재배포 | ✅ | 2026-08-17 — `DISCORD_TICKET_WEBHOOK_URL_IDEAREPOSITORY` Vercel production 등록 + `vercel --prod` 재배포(common_server `964bcd9`), E2E 문의 200 |
| AdMob 앱·광고단위 + GDPR 메시지 | ✅ | 2026-08-17 브라우저 대행 — ID는 [`MONETIZATION_SYSTEM.md`](./MONETIZATION_SYSTEM.md) §3.1 |
| RevenueCat 프로젝트(익명 모드) | ⏸ | 웹훅·서버 연동 없음. Phase 7 — AdMob 정지 해제 후(2026-08-21) |
| 스토어 Remove Ads 상품 등록 | ⏸ | 비소모성 1상품. Phase 7 — AdMob 정지 해제 후(2026-08-21) |
| 처리방침·약관 게시 | ✅ | 2026-08-17 — `vivace-games.com/idearepository/{privacy,terms}` 200(배구 서버 정적 페이지, 사용자 확인 후 배포). 정본 `docs/legal/`, 절차 [`LEGAL_SYSTEM.md`](./LEGAL_SYSTEM.md) |
| Play 콘솔 앱 · 비공개 테스트 | ✅ 검토 전송 | 2026-08-17 브라우저 대행 — Play 앱 `4975846571298570248` · Alpha 트랙 `4700611093824576153`. 앱 콘텐츠 11/11 · 데이터 보안 · 스토어 설정 · 등록정보 EN/KO+그래픽 · AAB vc1(사용자 업로드) → **변경사항 16개 검토 전송**(2026-08-17) → vc1 검토 통과·테스터 제공(8/17) → vc2~vc6 순차 업로드(vc4부터 `eas submit` CLI — [`BUILD.md`](./BUILD.md) §3.5·§5). ~~vc7 테스터 제공 중(8/23 16:46) · vc8 · 1.0.7 검토 중(8/26)~~ → **vc10 · 1.0.9 테스터 제공 중(9/1 14:23 — 부팅 활성 하트비트)**, vc9 게시(8/31 11:37). 테스터 = 업체 인원(`common/CLOSED_TESTING.md`), ~~프로덕션 신청 가능 ≈ 2026-08-31~~ → ✅ **프로덕션 액세스 승인(2026-09-02 — 권한이지 출시 아님, 트랙 비활성·사용자 0. 콘솔 정본 `common/PLAY_CONSOLE_STATUS.md`)** |

🚫 = 안 하기로 결정 / ⏸ = 보류 / ❌ = 미착수 / ✅ = 완료

---

## 3. 검증 루틴 (2026-08-17 Phase 0 확정 — LinkMemo 승계)

```bash
npm install                    # 의존성

# 커밋 전 필수
npm run typecheck              # tsc --noEmit
npm run lint                   # expo lint
npx prettier --check .         # 포맷(.prettierrc — 조각 승계, printWidth 110)
npm run check:i18n             # en·ko 키 누락·잉여·보간 일치·비한국어 파일 한글 잔존
npm run check:ota              # OTA 설정 드리프트(채널 헤더·URL=projectId·runtimeVersion 고정·expoConfig.version 직접 읽기 금지) — 2026-09-01
npm run check:licenses         # 오픈소스 고지 드리프트(생성 파일 ⇄ 설치본 값 대조·화면·입구) — 의존성 추가 시 licenses:build 후 통과해야 함(2026-09-02, LEGAL_SYSTEM §10)
```

**번들 컴파일 확인**(구현 완료 선언 전 필수): Metro 기동 상태에서

```bash
curl -s -o /dev/null -w "%{http_code}" "http://localhost:8090/node_modules/expo-router/entry.bundle?platform=android&dev=true"
# 200이면 런타임 모듈 에러 없이 번들 생성. 패키지 설치·파일 삭제 후에는 Metro를 --clear로 재시작
```

- ⚠ **Metro 재시작은 PowerShell `Stop-Process`로**(LinkMemo 실증) — git-bash `kill`은 Windows 프로세스에 조용히 실패한다.
  재시작 검증은 ① 포트 소유 PID 변경(`netstat -ano`) ② 콜드 번들이 전체 모듈 수로 도는지("1 module"은 캐시 리셋 실패 신호).
- **Metro 포트 ~~8087~~ → 8090 고정**(2026-08-27 — Delvewarden과 8087 충돌, `common/DEV_ALLOCATION.md` §1이 정본. `package.json` scripts): `npm start` = `expo start --port 8090`, `npm run android` = `expo run:android --port 8090`. 에뮬레이터 `debug_http_host`도 `10.0.2.2:8090`.
- ~~**전용 AVD `idea_repository`(포트 5572)** — 2026-08-27 생성~~ → ~~**2026-09-01 삭제, 공용 풀로 전환**(공용 2대 `common_1`·`common_2` 클레임 선점)~~ → **2026-09-08 공용 풀 폐지(사용자 결정 — common_server 세션 경유), 프로젝트별 AVD로 복귀**: AVD `idea_repository` · **포트 5572** · 저장은 **외장 `D:\emulators\idea_repository`**(`ANDROID_AVD_HOME` 필수 — 빼먹으면 C:에 생긴다). 절차·주의(외장 콜드 부팅 ~259초·모든 adb에 `-s`·`emu kill`에도 `-s`)는 정본 `C:\project\common\EMULATOR_POOL.md`, 포트 배정은 `common/DEV_ALLOCATION.md` §3. 클레임·선점 절차는 폐지됐다.
  접속: `adb -s emulator-55xx reverse tcp:8081 tcp:8090` + `debug_http_host=localhost:8081`(run-as로 `shared_prefs/<pkg>_preferences.xml` 기록 — git-bash에선 `MSYS_NO_PATHCONV=1`). RN 기본값 `10.0.2.2:8081`은 오프라인 테스트에서 번들을 못 받는다(ARCHITECTURE §5.5). 형제 Metro가 떠 있을 때 `--clear` 금지(공유 metro-cache ENOTEMPTY). 디버그 APK는 `android/`에서 `ANDROID_HOME` 지정 후 `./gradlew assembleDebug`.
  2026-08-17 실측: `CI=1 npx expo start --port 8087` → 콜드 번들 200 · 1537 모듈 · 45초. sqlite·crypto 추가 후 `--clear` 재시작 1566 모듈.
- **외부 실기기(Tailscale)**: `REACT_NATIVE_PACKAGER_HOSTNAME=100.91.69.45 npx expo start --port 8087` → 폰 Expo Go에서 `exp://100.91.69.45:8087`.
  2026-08-17 실측: manifest launchAsset이 Tailscale IP로 광고됨, 사용자 실기기 확인 완료. 폰 `s24`에 Tailscale이 켜져 있어야 붙는다.
- 외부에서 실기기 접속은 LinkMemo README §3의 Tailscale 절차(`REACT_NATIVE_PACKAGER_HOSTNAME=<Tailscale IP>`) 그대로.
- ~~광고 SDK가 들어가는 Phase 6부터 **Expo Go 불가 → dev build**~~ → **2026-08-17 Phase 6 진입: Expo Go 불가.** `npm run android`(에뮬레이터/USB 기기) 또는 `cd android && ./gradlew assembleDebug`로 APK를 만들어 폰에 설치. dev client는 Metro(8087, Tailscale IP)에 붙는다.

---

## 4. 아키텍처 원칙

- 의존 방향: `app/`(라우트) → `features/` → `db/`·`lib/`·`theme/`. 역방향 import 금지.
- **모든 화면은 `components/Screen`으로 감싼다** — 화면에서 SafeAreaView·(폼의) ScrollView를 직접 쓰지 않는다.
  Screen이 세이프에어리어(하단은 항상, 헤더 화면은 `hasHeader`로 상단만 제외)와 키보드 가림(`scroll` 화면:
  겹침만큼 스크롤 영역 축소 + 포커스 입력창 자동 스크롤, `hooks/use-keyboard.ts`)을 한 곳에서 처리한다
  (조각 승계 — 2026-08-17 실기기: 하단 인셋 누락·태그 입력 키보드 가림 지적으로 도입). 배너 footer는 키보드가 뜨면 숨긴다.
- 폼의 저장 버튼은 스크롤 콘텐츠 마지막에 둔다(고정 footer는 키보드에 가리거나 숨겨야 한다 — LinkMemo 방식).
- **사용자 데이터의 진실은 기기 로컬**이다. 서버가 죽어도 앱은 완전히 동작해야 한다.
- **어떤 서버에도 프로젝트·노트·자료를 보내지 않는다.** 나가는 것은 bootstrap 조회와 문의 본문뿐(둘 다 무작위 기기 식별자 세션이 붙는다 — 활성 집계, 2026-09-01 [`ARCHITECTURE.md`](./ARCHITECTURE.md) §5.5). 우리 서버 밖으로는 AdMob과 **Expo EAS Update(OTA 확인 — 기기 OS·무작위 토큰, 사용자 데이터 없음, [`OTA_SYSTEM.md`](./OTA_SYSTEM.md) §8)**.
- **공통 기능(공지·문의)은 common_server, Idea Repository 전용 서버는 없다.** 상세는 [`ARCHITECTURE.md`](./ARCHITECTURE.md).
- 로그인이 없으므로 엔타이틀먼트 서버 판정도 없다. 광고 제거는 스토어 구매 이력이 진실.
- 프로젝트명만 필수 — 나머지 필드에 필수 검증을 추가하지 않는다(기둥 1). 공통 UI는 `components/`에만 — 탐색 행은 `ListRow`, 관리 행은 `EditRow`, 가운데 다이얼로그는 `Dialog`(2026-08-23, [`UI_GUIDE.md`](./UI_GUIDE.md)). `any` 금지, `strict` 유지.
