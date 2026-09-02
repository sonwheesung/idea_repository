# ARCHITECTURE — 서버 경계와 연동

> 정책 요약은 [`../CLAUDE.md`](../CLAUDE.md) §10. LinkMemo `docs/ARCHITECTURE.md`의 틀을 승계 —
> Idea Repository도 **로그인 없음·전용 서버 없음**이라 같은 두께다. 2026-08-17 작성 — ~~연동 0%~~ → §6 구현 현황 참조(Phase 5 완료).

---

## 1. 전체 그림

```
Idea Repository 앱 (Expo RN)
 │
 ├── 로컬 (expo-sqlite / AsyncStorage / SecureStore)
 │     ← 프로젝트·노트·자료·카테고리·태그·필터/정렬 상태·설정 = 전부 여기. 진실의 전부
 │
 ├── HTTPS ──▶ common_server (https://common-server.vercel.app)
 │              ├─ GET  /api/v1/bootstrap?app=idearepository   ← 부팅 1회: 점검·강제업데이트·공지 (+ 세션 있으면 동봉 → 활성 일자 1행, §5.5)
 │              ├─ POST /api/v1/devices                    ← ~~최초 문의 진입 시 1회~~ → **첫 실행 1회**(2026-09-01, §5.5): 기기 subject 등록 → 세션 토큰
 │              ├─ POST /api/v1/tickets                    ← 문의(기기 귀속 · 세션 실패 시 익명 폴백)
 │              └─ GET  /api/v1/tickets/mine               ← 내 문의 목록·답변·상태
 │
 ├── OS 기본 브라우저 ← 관련 자료 URL 열기 (Linking.openURL)
 ├── AdMob SDK ← 광고 (테스트 단위로 개발 · EEA는 UMP 동의 폼)
 ├── Expo EAS Update (u.expo.dev) ← 부팅 시 JS 번들 업데이트 확인·백그라운드 다운로드 (기기 OS·런타임 버전·채널·무작위 토큰 — 사용자 데이터 없음, vc11부터, OTA_SYSTEM §8)
 └── RevenueCat(익명) + 스토어 인앱결제 ← Remove Ads (서버 웹훅·미러 없음)

Idea Repository 전용 서버: 없음 (만들지 않는다)
```

**우리 서버(common_server)로 나가는 사용자 입력은 문의 본문뿐이다.** 프로젝트·노트·자료는 어떤 요청에도 실리지 않는다.
사용자 입력이 아닌 것으로는 **무작위 기기 식별자(UUID) 세션**이 첫 실행 등록과 매 부팅 조회에 실린다(2026-09-01 — 활성 사용자 집계, §5.5).
관련 자료 URL은 사용자가 탭할 때 **OS 브라우저가** 열 뿐, 앱이 fetch하지 않는다(favicon도 안 가져온다 — PROJECT_SYSTEM §7).
우리 서버 밖 통신은 AdMob(광고)과 **Expo EAS Update**(2026-09-01, JS 번들 OTA — 코드만 받아오고 사용자 데이터는 실리지 않는다, [`OTA_SYSTEM.md`](./OTA_SYSTEM.md)) 둘이다.

---

## 2. 왜 Idea Repository 전용 서버가 없는가 — ✅ 확정 (LinkMemo 2026-08-14 판단 승계)

**common_server 그대로, 튜닝조차 불필요.** 1배포 N앱 설계라 앱 추가 = `apps` seed 1행이며, Idea Repository가 쓰는
v1 기능(bootstrap·문의)은 이미 배포·검증 완료다(LinkMemo가 2026-08-14 같은 경로로 붙어 프로덕션 E2E까지 실측).
~~별도 서버는 Supabase 무료 티어 한도(활성 2프로젝트 — 배구 + common)를 깨고 운영만 이중이 된다.~~
→ **근거 정정 (2026-08-24 대시보드 실측)**: "무료 티어 2프로젝트 한도" 전제는 **사실이 아니었다** —
common-server·volleyball은 **Pro 조직 소속이고 Pro는 프로젝트 개수 제한이 없다**(정본
`C:\project\common\BUSINESS_INFO.md` §5.1). **결론(전용 서버 없음)은 유지**하되 근거는
**"활성 프로젝트 1개 추가 ≈ +$10/월 vs common_server 한계비용 0 + 운영 이중화"**로 바꾼다.

- 기둥 2(로컬 온리)가 기획의 정체성이다 — 서버가 생기는 순간 "not uploaded to our servers" 포지셔닝이 흐려진다.
- 조각이 전용 서버를 판 이유(E2EE 백업 저장 · AI 프록시)에 해당하는 기능이 Idea Repository엔 없다.
  로컬 백업/내보내기(P1 재검토)도 서버가 필요 없다.
- 공지·문의·점검 게이트는 이미 있는 common_server에 태우면 된다 — 한계비용 0.

## 3. 무엇을 어디에 두는가

| 데이터 | 위치 | 비고 |
|---|---|---|
| 프로젝트·노트·자료·카테고리·태그 | 기기 로컬(expo-sqlite) | 유일본. 손실 안내 필수(CLAUDE.md §6) |
| 필터/정렬 상태·언어·다크 모드 설정 | 기기 로컬(AsyncStorage via zustand persist) | |
| 기기 subject deviceId · 세션 토큰 | 기기 로컬(SecureStore) | 무작위 UUID — 이름·이메일 없음. ~~최초 문의 시 생성~~ → **첫 실행 시 생성**(2026-09-01) |
| 활성 일자 `(app_code, subject_id, day)` | common_server DB | **앱은 쓰지 않는다** — 서버가 등록·부팅 조회 수신 시 1일 1행(KST) 기록, 400일 보관 후 파기(common_server `lib/retention.ts`). §5.5 |
| 광고 제거 구매 상태 | 스토어(진실) + 로컬 캐시 | 조회 실패에 캐시를 지우지 않는다 |
| 공지·점검·버전 게이트 | common_server DB | 앱은 읽기만 |
| 공지 읽음 여부 | 기기 로컬(AsyncStorage) | 서버에 읽음 테이블을 두지 않는다(common 규약) |
| 문의 | common_server DB | 기기 subject에 귀속. platform·appVersion만 동봉. IP는 레이트리밋 키로만 쓰고 버림 |

## 4. 신원 — 로그인은 없다, 기기 토큰은 있다 (2026-08-17 확정)

- 구글/애플 로그인·계정 없음(CLAUDE.md §4). Play "계정 삭제 URL" 요건 해당 없음.
- 문의 귀속 방식 — **(b) 기기 subject로 확정**(2026-08-17 사용자 승인, CLAUDE.md §14 #3). 비교표는 근거 보존용:

| | (a) 완전 익명 단방향 — 🚫 | (b) 기기 subject — **✅ 확정** |
|---|---|---|
| 흐름 | `sendInquiry()`만 | 최초 문의 진입 시 UUID 생성(SecureStore) → `registerDevice()` → 세션 → 이후 문의 자동 귀속 → `fetchMyInquiries()` |
| 사용자가 보는 것 | 보냈다는 확인만 | 문의 목록·상태(접수됨/답변 완료/해결됨)·답변 본문 |
| 서버가 아는 것 | platform·appVersion | + 무작위 UUID(이메일·이름 없음) |
| 한계 | 답변을 볼 길이 없다 | 앱 삭제·기기 변경 시 연결 끊김(화면에 고지) |
| 서버 준비 | 완료 | 완료(2026-08-14 `POST /v1/devices` 배포·LinkMemo E2E 실측, SDK 2026-08-14) |

  (b)여도 **계정이 아니다** — 사용자는 아무것도 입력하지 않는다. LinkMemo가 사용자 요구("답변이 보여야 한다")로
  (a)→(b)로 바꾼 이력이 있어 처음부터 (b)로 간다.

```
설정 → 문의하기(= 내역 화면) → [문의 등록하기]
 → deviceId 없으면 UUID 생성(SecureStore) → registerDevice() → 세션 저장   ← 2026-09-01부터는 보통 부팅 때 이미 끝나 있다(§5.5). 여기 호출은 오프라인 부팅의 복구 지점
 → sendInquiry() 자동 귀속 → 내역 화면에서 fetchMyInquiries()로 상태·답변
 (등록 실패 시 익명으로 전송 — 문의 자체를 막지 않는다)
```

---

## 5. common_server 연동 계약

절차 정본은 `common_server/docs/ONBOARDING.md`("새 앱 붙이기") — **위에서 아래로, 확인 명령 출력을 증거로.**

### 5.1 시작 전 확정값

| 항목 | 값 | 변경 가능? |
|---|---|---|
| `app_code` | **`idearepository` 확정**(2026-08-17 사용자 결정, CLAUDE.md §14 L) | ❌ 등록 후 사실상 불가 |
| 표시 이름 | Idea Repository | ✅ 콘솔에서 |
| 로그인 | **없음** | ✅ 나중에 추가 가능(subject는 덧붙이는 구조) |
| 구독 | **없음** (일회성 IAP뿐 · 서버 무관) | ✅ |

### 5.2 연동 순서 (ONBOARDING 승계 — 로그인·구독 절 건너뜀)

1. **앱 등록(서버)**: `node --env-file=.env.local tools/seed.ts idearepository "Idea Repository"` →
   확인: `curl "https://common-server.vercel.app/api/v1/bootstrap?app=idearepository&platform=android&appVersion=0.1.0"` **200**
   (404 = 미등록/비활성. "했다"가 아니라 출력을 남긴다)
2. **SDK 복사(앱)**: `common_server/client/{index,types}.ts` → `lib/common-server/`. 복사본 상단에 `SDK_VERSION` 주석
   (~~현재 `2026-08-14`~~ → ~~`2026-09-01`~~ → **`2026-09-01.2`** 2026-09-01 두 번 재복사 — §5.5·§5.6). **수정 금지, 갱신은 재복사.** 확인: `BASE_URL=... APP=idearepository node tools/_dv_sdk.ts`
3. **부팅 게이트(앱)**: `fetchBootstrap()` 1회. **실패해도 앱을 막지 않는다** — 로컬 앱이 서버 때문에 못 열리면
   기둥 2 위반. 성공 시에만: 점검 화면 / min 미만 강제 업데이트 / latest 미만 소프트 안내 / 공지 배지.
   ⚠ **차단 화면에 반드시 출구를 둔다** — 스토어 URL이 비어 있으면 안내문이라도(my_word 실제 사고).
4. **문의(앱)**: `sendInquiry(category, content)`. 본문 5~2000자, 24h 앱별 캡(기본 30) 초과 시 `rate-limited`.
   전송 전 `registerDevice(uuid)`로 세션 확보(실패하면 익명 폴백 — LinkMemo 방식). 내역은 `fetchMyInquiries()`.
5. **디스코드 알림(서버·선택)**: `DISCORD_TICKET_WEBHOOK_URL_IDEAREPOSITORY` env + **재배포** —
   연동 전 과정에서 유일하게 재배포가 필요한 지점. 없으면 "문의는 들어오는데 알림만 없는" 상태다(고장 아님).
   ⚠ LinkMemo 등록 때 `.env.local` 마지막 줄 무개행 + append로 `SESSION_JWT_SECRET`이 오염된 사고가 있었다 —
   env 추가 전 파일 끝 개행을 확인한다.
6. **공지 발행(운영, 앱 변경 없음)**: `POST /api/admin/announcements`(Bearer `ADMIN_TOKEN`) — 절차·제약(단일 언어 필드 → EN+KO 병기,
   앱은 평문 렌더, `endsAt` 자동 종료)은 [`LEGAL_SYSTEM.md`](./LEGAL_SYSTEM.md) §4-4. 첫 사용 2026-08-23(법무 4차/5차 시행 고지).
   관리자 콘솔(`ops-4b7e21`)에 토큰을 타이핑하는 대신 API + `--env-file` 주입으로 — 토큰이 화면·로그에 남지 않게.

### 5.4 소프트 업데이트 안내 — Phase 11 (2026-08-23 설계, ~~2026-08-24~~ 2026-08-26 구현)

bootstrap `version.latest`(서버 `app_settings.latestVersion`)를 쓰는 **앱 쪽 규칙**. 서버 변경 없음.

```
부팅 성공 → App Open 종료 → 홈 포커스
 → min ≤ 내 버전(Constants.expoConfig.version) < latest && androidUrl 있음 && 이 latest에 "나중에" 안 누름
 → 모달 1회: "새 버전이 있습니다 (1.0.7)" [스토어 열기 → Linking.openURL(androidUrl)] [나중에 → 이 latest는 다시 안 묻는다]
```

- 차단하지 않는다(닫을 수 있다) — 강제는 `min`(BootGate)만. 스토어 URL이 비면 팝업을 띄우지 않는다(my_word 데드엔드 교훈의 반대 방향: 갈 곳 없는 안내는 소음).
- 저장: AsyncStorage `idearepository-soft-update` = 마지막으로 "나중에"를 누른 latest 문자열. 서버에 읽음 테이블 없음(공지 읽음과 같은 원칙).
- 버전 비교는 ~~`lib/version.ts`~~ → SDK `compareVersions`(BootGate와 동일, 2026-08-26 정정): `'1.0.10' > '1.0.9'`가 맞게 세그먼트 숫자 비교, 숫자 아닌 세그먼트는 0(throw 없음).
- 노출 순서: 웰컴 시트(첫 실행) → App Open 광고 → 업데이트 팝업. 앞의 둘이 끝나야 뜬다(`welcomeSeen`·`startupAdSettled`).
- 운영값 설정은 `PATCH /api/admin/settings`(ADMIN_TOKEN — LEGAL_SYSTEM §4-4 방식). **검토 통과·테스터 제공을 콘솔에서 확인한 뒤에만** latest를 올린다. LinkMemo 2026-08-18 동일 구현(`components/update-popup.tsx`) 이식.
  → ✅ **운영 개시(2026-08-31)**: vc8 제공 확인(8/26 12:47) 후 `latestVersion '1.0.7'` + `androidStoreUrl`(Play 상세 페이지) PATCH — `bootstrap.version {latest:'1.0.7', androidUrl:…}` 실측. 다음 갱신은 vc9(1.0.8) 제공 확인 후 같은 방식.
- Idea Repository는 pinned 공지 홈 팝업이 없으므로 팝업 순서 충돌 없음(LinkMemo는 공지 팝업이 먼저).

### 5.5 부팅 활성 하트비트 — SDK 2026-09-01 (2026-09-01 결정 · 구현)

common_server가 2026-09-01 활성 지표(DAU/WAU/MAU, `subject_active_day`)를 붙였다(common_server `8167c23`, PLAN Phase 12). 서버는 **`POST /v1/devices` · `bootstrap`(토큰 있을 때)** 수신 시
`(app_code, subject_id, KST day)` 1행을 넣는다 — PK가 멱등키라 하루에 몇 번 와도 1행. 앱이 해야 할 일은 둘뿐이다:

1. **SDK 재복사** — `fetchBootstrap()`이 저장된 세션 토큰을 동봉한다(2026-09-01판부터). **bootstrap에서만 토큰이 선택**이다: 무효·만료 토큰을 서버가 401이 아니라 조용히 무시한다(진입 게이트라 세션 문제가 점검·강제업데이트 판정을 막으면 안 된다).
2. **부팅 시 세션 확보** — `useBootStore.fetchOnce()`(앱 실행당 1회 게이트)에서 `ensureDeviceSession()`을 `fetchBootstrap()`과 **병렬**로 호출. 직렬로 만들지 않는다 — 서버가 양쪽에서 기록하고 멱등이라 순서를 맞춰 얻는 게 없고 부팅만 느려진다. 첫 실행엔 bootstrap에 토큰이 없어도 devices가 그날을 기록한다.

```
부팅 → fetchOnce()
 ├─ ensureDeviceSession()   isSignedIn()이면 즉시 반환(SecureStore 세션 복원) · 없으면 UUID 생성 → registerDevice → 세션 저장
 └─ fetchBootstrap()        토큰 있으면 Authorization 동봉 → 서버가 활성 일자 기록
```

- **문의 화면의 `ensureDeviceSession()` 호출은 그대로 둔다**(`app/inquiry.tsx`·`app/inquiries.tsx`) — 부팅이 오프라인이었을 때의 복구 지점. 멱등이라 중복 호출 무해.
- **오프라인·서버 다운에서 오류가 나면 안 된다**(2026-09-01 사용자 조건, 기둥 2): SDK는 throw 하지 않고 `ensureDeviceSession`은 try/catch로 `false`만 돌려준다. 결과를 UI에 쓰지 않는다 — `void`로 버린다. 실패하면 다음 부팅(또는 문의 진입)에 다시 시도할 뿐, 알림·토스트·재시도 루프 없음.
- **재등록 폭주 금지**: `isSignedIn()` 가드가 SecureStore 세션을 복원하면 `registerDevice`를 부르지 않는다. 서버 `device` 레이트리밋은 IP당 10회/600초 — 정상 앱은 설치당 1회.
- 왜: 이전엔 `ensureDeviceSession()`이 문의 화면에서만 불려 **문의를 열어본 기기만** subject가 됐다(2026-09-01 서버 실측: subjects 7 · DAU 0 · `activity_uncollected`). 활성 지표는 전체 사용자여야 의미가 있다.
- 개인정보 영향(LEGAL_SYSTEM §2 정합 규칙): 모든 사용자가 첫 실행에 UUID를 발급받고 매 부팅에 보내며, 서버에 **활성 일자가 400일 저장**된다 → 이용 목적에 "서비스 이용 통계(활성 사용자 집계)" 추가 — 처리방침 **EN rev. 5 · KO 5차**(2026-09-01 게시, 2026-09-01 시행). 웰컴 시트 "앱 버전만" 문구 정정. Play 데이터 보안 양식은 변경 없음(기기 ID = 수집·공유·분석 목적으로 이미 선언 — `legal/DATA_SAFETY.md` §2). 광고 ID(GAID)와 별개 — 광고·추적에 쓰지 않는다.
- SDK 부수 변경: `MyInquiry.status`에 `'reviewing'` 추가(관리자 "확인 중") → i18n `inquiry.status.reviewing` en/ko 추가. **서버는 이미 배포돼 있어** 구 앱(≤ vc9)은 관리자가 확인 중으로 바꾸면 키 이름이 그대로 보인다(`check:i18n`이 템플릿 키를 못 잡는 사각 — 값 4종을 스크립트가 알 수 없어 리뷰로 잡는다). `fetchEntitlements({fresh?})` 선택 인자는 미사용.
- 확인: 관리자 `GET /api/admin/stats?app=idearepository`(ADMIN_TOKEN `--env-file` 주입) → `activity.dau ≥ 1` · `alerts`에 `activity_uncollected` 없음. 재부팅 시 `POST /v1/devices` 재호출 없음(에뮬 로그).
  → ✅ **에뮬 실측(2026-09-01, 공용 `common_2` 디버그 빌드 + Metro `adb reverse`)**: ① **오프라인**(`svc wifi/data disable`, ping 실패 확인) 첫 실행 → 웰컴 시트(새 문구) → Start → 홈 정상, ReactNativeJS 오류 0, 서버 subjects 7 그대로(아무것도 안 나감) ② 네트워크 켜고 콜드 스타트 → 로그 "no session → registerDevice" → 서버 **subjects 8 · DAU 1 · WAU 1 · coverageDays 1 · `activity_uncollected` 소멸** ③ 재실행 → 로그 "signed-in → skip register"(SecureStore 세션 복원), subjects 8 유지. 임시 `console.log`는 검증 후 제거(커밋 미포함).
  ⚠ 디버그 빌드 함정: RN 에뮬레이터 기본 dev 호스트가 `10.0.2.2:8081`이라 오프라인에선 번들 자체를 못 받는다("Unable to load script" — 앱 문제 아님). `debug_http_host=localhost:8081` 프리퍼런스(run-as) + `adb reverse tcp:8081 tcp:8090`으로 adb 소켓 경로를 쓰면 네트워크를 꺼도 번들이 온다.

### 5.6 세션 토큰 만료·슬라이딩 갱신 — SDK 2026-09-01.2 (2026-09-01 저녁 재복사)

같은 날 오후 재복사(§5.5) 뒤 원본에 common_server `060aaa1`("세션 토큰 슬라이딩 갱신")이 한 번 더 들어왔다 — **vc10에는 이 판이 빠진 채로 나갔다.**

- **무엇이 문제였나**: 토큰 발급 경로가 로그인·기기등록 둘뿐이라 `iat + 180일`(`TOKEN_TTL_MS`)이 **고정 카운트다운**이었다. 만료 후 bootstrap은 무효 토큰을 401 없이 조용히 무시하므로(진입 게이트) 그 기기는 **DAU에서 영구히 사라지고**, 구 SDK의 `isSignedIn()`은 "저장소에 문자열이 있나"만 봐서 `ensureDeviceSession()`이 재등록을 영원히 건너뛴다. 문의를 보내야만(401 → 세션 폐기) 되살아난다.
- **서버(배포 완료)**: bootstrap이 발급 30일 지난 유효 토큰을 재발급해 `session.token`으로 응답에 싣는다(`TOKEN_RENEW_AFTER_MS` = TTL의 1/6, 갱신 때만 subject 생존 DB 확인).
- **SDK `.2`**: `fetchBootstrap()`이 `session.token`을 `replaceToken()`으로 조용히 교체(호출부에 노출 없음) · `isSignedIn()` = `tokenAlive()`(payload `iat` + `SESSION_TTL_DAYS = 180`, 파싱 실패 = 죽은 것으로 fail-closed). **`SESSION_TTL_DAYS`는 서버 `TOKEN_TTL_MS`의 사본 — 손대지 않는다**(서버 TTL 상향안은 공통 서버 세션이 검토 후 철회: 앱 상수와 갈라지는 부채 > 잔여 리스크 "OTA도 못 받고 180일간 문의 0건인 사용자의 DAU 한 줄").
- **서버만으로는 안 된다** — 구 SDK는 `session` 필드를 버린다. 앱 재복사가 필수. 호출부(`features/support/server.ts`·`store.ts`) 변경 없음, `tsc` 통과. 우리 앱의 가장 이른 subject는 2026-08-17(봇·에뮬) → 만료 2027-02-13. 실사용자 노출은 프로덕션 출시 + 180일. 만료돼도 손실은 없다 — deviceId가 SecureStore에 남아 재등록하면 같은 subject.
- ⏳ **사용자에게 닿는 것은 다음 AAB(vc11)부터.** 교훈: 재복사 직후에도 `git -C C:/project/common_server log --oneline -3 -- client/`로 원본이 더 앞서지 않았는지 본다(my_word는 같은 날 오전 빌드에 구판이 실려 심사 중 — 우리는 빌드 전에 잡았다).
- ⏳ **SDK `.3` 예고(2026-09-02, 공통 서버 세션 통보)**: `exp` 클레임 이관 + **웜 스타트 하트비트**(`AppState → active`에서 `POST /v1/heartbeat`)를 한 판으로 묶어 낼 예정. ⚠ 후자는 **재복사만으로 안 끝난다** — 지금까지의 SDK 갱신과 달리 앱 쪽 호출부(`AppState` 리스너 1곳)가 처음으로 늘어난다. **확정 통보가 오기 전에는 재복사하지 않는다**(그쪽 지시). 통보가 오면: 재복사 → 리스너 배선 → 오프라인 무오류(§5.5 조건) 재검증 → 개인정보 영향 검토(부팅 외 포그라운드 복귀에도 하트비트가 나가면 처리방침 서술과 대조).

### 5.3 반드시 지킬 것 (common 핸드오프 규약 승계)

- bootstrap 게이트는 **서버 응답으로만** 판정 — 앱 로컬 신뢰 금지.
- SDK 모듈은 **throw 하지 않는다** — 실패를 타입으로 반환.
- 고정(pinned) 공지 홈 팝업은 LinkMemo가 2026-08-17 추가한 앱 쪽 규칙(서버 변경 없음) — Idea Repository도 같은 규칙으로
  가려면 "전면 광고 종료 후·메인 포커스 중·안 읽은 pinned만 1회". 기획서엔 없으므로 채택 여부는 구현 시 결정.
- 서버 세션에 상태를 넘길 때는 확인 명령의 **출력을 붙여넣는다**(ONBOARDING §9 표).

---

## 6. 구현 현황

| 항목 | 상태 |
|---|---|
| `apps`에 `idearepository` 등록 | ✅ 2026-08-17 — seed 실행, **프로덕션 `bootstrap?app=idearepository` → 200 실측** |
| SDK 복사 | ✅ 2026-08-17 — `lib/common-server/{index,types}.ts`, ~~SDK_VERSION 2026-08-14~~ → ~~2026-09-01~~ → **2026-09-01.2 재복사**(§5.6 슬라이딩 갱신 · vc11부터)(bootstrap 토큰 동봉 · `reviewing` · `fresh`). 수정 금지(prettierignore), 갱신은 재복사. `_dv_sdk` 22/22 |
| 부팅 게이트 | ✅ 2026-08-17 — `components/boot-gate.tsx`. 실패 시 통과, 점검·강제업데이트 차단(출구 포함). ~~⏸ latest 소프트 안내 미구현~~ → ✅ 2026-08-26 `components/update-popup.tsx` + `useSoftUpdateStore`(설계 §5.4, vc8) |
| 부팅 활성 하트비트 | ✅ 2026-09-01 — `useBootStore.fetchOnce()`에서 `ensureDeviceSession()` 병렬 호출(§5.5). 처리방침 rev.5/5차 · 웰컴 문구 · `inquiry.status.reviewing` 동반. vc10 |
| 공지 화면 + 읽음 배지 | ✅ 2026-08-17 — `app/notice.tsx`, 읽음은 로컬(AsyncStorage). 배지는 설정 행 점 하나. ⏸ pinned 홈 팝업(LinkMemo 방식)은 미채택 — 필요 시 |
| 문의 화면 + 기기 subject + 내역/답변/상태 화면 | ✅ 2026-08-17 — 설정 → 문의하기 = 내역(`app/inquiries.tsx`) + 우상단 [문의 등록하기] → 폼(`app/inquiry.tsx`, 분류 Select). `features/support/server.ts`(SecureStore UUID·세션). **프로덕션 E2E**: 등록→토큰→문의 귀속→mine 200, 잘못된 deviceId 400 |
| 디스코드 웹훅 env | ✅ 2026-08-17 — `DISCORD_TICKET_WEBHOOK_URL_IDEAREPOSITORY` production 등록 + 재배포(common_server `964bcd9`). 문의 E2E 200 |

## 7. 열린 질문

- ~~app_code(#1) · 문의 귀속 방식(#3)~~ → 전부 해소(2026-08-17). 현재 열린 질문 없음.
