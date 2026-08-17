# Idea Repository — 문서 색인

> 이 파일이 **문서 색인이자 구현 현황 정본**이다. 새 `*_SYSTEM.md`를 추가하면 반드시 아래 목록과
> 구현 현황표에 함께 등록한다([`DOC_DISCIPLINE.md`](./DOC_DISCIPLINE.md) 부록 체크리스트).
> 설계 원칙·기둥·MVP 범위·결정 로그는 루트 [`CLAUDE.md`](../CLAUDE.md).

---

## 1. 문서 목록

| 문서 | 범위 | 상태 |
|---|---|---|
| [`../CLAUDE.md`](../CLAUDE.md) | 설계 정본 — 기둥·MVP 범위·회원 없음/로컬 온리 정책·BM·스택·결정 로그(미결정 0건 — 2026-08-17 전부 확정) | ✅ |
| [`PLAN.md`](./PLAN.md) | MVP 구현 플랜 — Phase 0~8 착수 순서·완료 기준·진행 현황 | ✅ |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | 서버 경계 — common_server 연동(공지·문의)·전용 서버 없음·선행 작업 | ✅ |
| [`DOC_DISCIPLINE.md`](./DOC_DISCIPLINE.md) | 문서 작업 규율 (LinkMemo·조각 승계) | ✅ |
| [`PROJECT_SYSTEM.md`](./PROJECT_SYSTEM.md) | 도메인 — 프로젝트·기본/아이디어/진행 정보·카테고리·태그·노트·자료·메인·검색·필터·정렬·상세 | ✅ |
| [`DATABASE.md`](./DATABASE.md) | expo-sqlite v1 스키마(6테이블)·시드·조회 패턴·마이그레이션 규약 | ✅ |
| [`MONETIZATION_SYSTEM.md`](./MONETIZATION_SYSTEM.md) | 광고(배너·전면형·금지 순간·UMP) + Remove Ads 일회성 구매·복원 | ✅ |
| [`I18N_SYSTEM.md`](./I18N_SYSTEM.md) | 다국어 — en 기본·ko·키 규약·날짜 로케일·언어 추가 절차 | ✅ |
| `UI_GUIDE.md` | 공통 컴포넌트·여백·타이포 사용법 | ❌ 미작성(Phase 0 토큰 확정 후) |
| `CHANGELOG.md` | 릴리스 변경 이력 | ❌ 미작성(첫 빌드 시점부터) |

원본 기획서("Idea Vault 글로벌 MVP 기획서", 2026-08-17 — 서비스명은 같은 날 Idea Repository로 확정)는 이 문서 체계로 전부 옮겼다 — 기획서 §번호는 CLAUDE.md 곳곳에
출처로 인용돼 있다. 기획서 자체는 레포에 두지 않는다(정본은 CLAUDE.md).

---

## 2. 구현 현황

2026-08-17 문서 체계 수립 + **Phase 0 완료**(스캐폴드·토큰·i18n·설정 골격). 아래 표가 착수 순서의 기준이 된다.

### 앱

| 영역 | 상태 | 비고 |
|---|---|---|
| Expo 부트(SDK 54 · expo-router · TS strict · Metro 8087) | ✅ | 2026-08-17 — expo ~54.0.35 · RN 0.81.5 · React 19.1.0(LinkMemo 조합). 템플릿 예제 미채용, 단일 메인+스택(`index`·`project/new`·`settings`) |
| 테마 토큰(라이트/다크 2종 · 시스템 따르기 + 수동) | ✅ | 2026-08-17 — `theme/palettes.ts` 17토큰 · zustand persist · 설정 화면 **Select**로 전환(칩 → select, 사용자 지시) |
| expo-sqlite v1 스키마 + 카테고리 시드 | ✅ | 2026-08-17 Phase 1 — [`DATABASE.md`](./DATABASE.md) |
| 프로젝트 생성(이름만) · 카드 목록 · 삭제 | ✅ | 2026-08-17 Phase 1 — 생성 폼 Label+input(`TextField`) + Select(카테고리·상태·우선순위), 카드(상태·우선순위·진행률 바·카테고리·태그·수정일), 길게 눌러 삭제 |
| 카테고리 관리(추가·수정·삭제 시 선택지) | ✅ | 2026-08-17 Phase 1 — 설정 → 카테고리. 사용 수 표시, 중복 거부, 삭제 시 없음/이동 라디오 |
| 태그(칩 · 자동완성 · 고아 정리) | ✅ | 2026-08-17 Phase 1 — 생성 폼 TagInput(공백/쉼표/엔터 확정, prefix 자동완성), 저장 시 replaceProjectTags + 고아 정리 |
| 프로젝트 상세 · 편집(전 필드) | ❌ | Phase 2 |
| 아이디어 노트 CRUD | ❌ | Phase 2 |
| 관련 자료 CRUD + 외부 브라우저 | ❌ | Phase 2 |
| 검색 9필드 | ❌ | Phase 3 |
| 필터 3축 · 정렬 6종 · 상태 유지 | ❌ | Phase 3 |
| 다국어 en·ko + `check:i18n` + 언어 설정 | ✅ 뼈대 | 2026-08-17 — 63키 동기, 설정→언어 Select(시스템/English/한국어). 키는 Phase 1~3에서 계속 늘어난다(Phase 4 = 완성 점검) |
| 날짜 로케일 표기 | ✅ 기본 | 2026-08-17 — `lib/date.ts`(dayjs `ll`, ko/en 로케일, customParseFormat). 카드 수정일에 사용 |
| 하단 배너(메인·상세) | 🔨 자리만 | 2026-08-17 점선 플레이스홀더(메인) — 실배너는 Phase 6 |
| App Open 광고(콜드 스타트 · 쿨타임 3h) | ❌ | Phase 6 |
| UMP 동의 폼 | ❌ | Phase 6 |
| Remove Ads 구매 + Restore | ❌ | Phase 7 — RevenueCat 익명 |
| 공지·점검·강제업데이트(bootstrap) | ❌ | Phase 5 |
| 문의하기 + 기기 subject + 내역/답변/상태 | ❌ | Phase 5 |
| 데이터 손실 안내 문구 | ✅ | 2026-08-17 — 홈 빈 화면(`data.notice.*`). 설정 행은 Phase 2 |

### 서버·외부 (Idea Repository 밖 선행 작업)

| 영역 | 상태 | 비고 |
|---|---|---|
| common_server `apps`에 `idearepository` 등록 | ❌ | app_code 확정(2026-08-17). 확인: `bootstrap?app=idearepository` 200 |
| common_server SDK 복사(`lib/common-server/`) | ❌ | SDK_VERSION 2026-08-14 |
| 디스코드 문의 웹훅 env + 재배포 | ❌ | `DISCORD_TICKET_WEBHOOK_URL_IDEAREPOSITORY` |
| AdMob 앱·광고단위 + GDPR 메시지 | ❌ | 배너 1 + App Open 1 |
| RevenueCat 프로젝트(익명 모드) | ❌ | 웹훅·서버 연동 없음 |
| 스토어 Remove Ads 상품 등록 | ❌ | 비소모성 1상품 |
| 처리방침 게시 | ❌ | 사업자 값은 `C:\project\common\BUSINESS_INFO.md` |
| Play 콘솔 앱 · 비공개 테스트 | ❌ | Vivace Games Studio(개인) — 12명×14일 |

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
```

**번들 컴파일 확인**(구현 완료 선언 전 필수): Metro 기동 상태에서

```bash
curl -s -o /dev/null -w "%{http_code}" "http://localhost:8087/node_modules/expo-router/entry.bundle?platform=android&dev=true"
# 200이면 런타임 모듈 에러 없이 번들 생성. 패키지 설치·파일 삭제 후에는 Metro를 --clear로 재시작
```

- ⚠ **Metro 재시작은 PowerShell `Stop-Process`로**(LinkMemo 실증) — git-bash `kill`은 Windows 프로세스에 조용히 실패한다.
  재시작 검증은 ① 포트 소유 PID 변경(`netstat -ano`) ② 콜드 번들이 전체 모듈 수로 도는지("1 module"은 캐시 리셋 실패 신호).
- **Metro 포트 8087 고정**(`package.json` scripts): `npm start` = `expo start --port 8087`, `npm run android` = `expo run:android --port 8087`.
  2026-08-17 실측: `CI=1 npx expo start --port 8087` → 콜드 번들 200 · 1537 모듈 · 45초. sqlite·crypto 추가 후 `--clear` 재시작 1566 모듈.
- **외부 실기기(Tailscale)**: `REACT_NATIVE_PACKAGER_HOSTNAME=100.91.69.45 npx expo start --port 8087` → 폰 Expo Go에서 `exp://100.91.69.45:8087`.
  2026-08-17 실측: manifest launchAsset이 Tailscale IP로 광고됨, 사용자 실기기 확인 완료. 폰 `s24`에 Tailscale이 켜져 있어야 붙는다.
- 외부에서 실기기 접속은 LinkMemo README §3의 Tailscale 절차(`REACT_NATIVE_PACKAGER_HOSTNAME=<Tailscale IP>`) 그대로.
- 광고 SDK가 들어가는 Phase 6부터 **Expo Go 불가 → dev build**. 그 전까지는 Expo Go로 개발 가능.

---

## 4. 아키텍처 원칙

- 의존 방향: `app/`(라우트) → `features/` → `db/`·`lib/`·`theme/`. 역방향 import 금지.
- **사용자 데이터의 진실은 기기 로컬**이다. 서버가 죽어도 앱은 완전히 동작해야 한다.
- **어떤 서버에도 프로젝트·노트·자료를 보내지 않는다.** 나가는 것은 bootstrap 조회와 문의 본문뿐.
- **공통 기능(공지·문의)은 common_server, Idea Repository 전용 서버는 없다.** 상세는 [`ARCHITECTURE.md`](./ARCHITECTURE.md).
- 로그인이 없으므로 엔타이틀먼트 서버 판정도 없다. 광고 제거는 스토어 구매 이력이 진실.
- 프로젝트명만 필수 — 나머지 필드에 필수 검증을 추가하지 않는다(기둥 1). 공통 UI는 `components/`에만. `any` 금지, `strict` 유지.
