# OTA_SYSTEM — JS 무선 업데이트 (expo-updates · EAS Update)

> 스토어 심사 없이 **JS 번들·에셋만** 교체하는 경로. 네이티브는 못 바꾼다.
> 설계는 LinkMemo `docs/OTA_UPDATE.md`(2026-09-01, 같은 날 같은 결정)를 승계하고, 근거·함정은 형제 앱 배구명가에서
> 두 번 데인 기록(fingerprint 드리프트 · 채널 미전달)을 그대로 받는다. **결정 2026-09-01(사용자 지시 "ota 배포 가능하게 구조 설정")** — CLAUDE §14 V.
> ~~비공개 테스트 중 OTA 금지(2026-08-18)~~는 이 결정으로 해제됐다. 단 **게시는 사용자가 지시할 때만**(§5) — 구조가 있어도 임의로 쏘지 않는다.

---

## 0. 구현 현황

| 항목 | 상태 |
|---|---|
| `expo-updates ~29.0.20` · `expo-application ~7.0.8` 설치 | ✅ 2026-09-01 |
| `app.json` `updates` 블록 | ✅ url(`u.expo.dev/6518e63b…` = `extra.eas.projectId`) · `checkAutomatically: ON_LOAD` · **`requestHeaders["expo-channel-name"]: production`** |
| `runtimeVersion` | ✅ **고정 문자열 `"1.0.0"`** — fingerprint·appVersion 정책 🚫(§2) |
| 버전 읽기 단일화 `lib/app-version.ts` | ✅ `Application.nativeApplicationVersion` — OTA 매니페스트가 덮어쓰는 `expoConfig.version`을 게이트·문의·About·백업에서 제거(§6) |
| `npm run check:ota` | ✅ `scripts/check-ota.mjs` — 채널·URL·runtimeVersion 고정·`expoConfig.version` 직접 읽기 금지 검사 |
| 빌드 스크립트 `-CleanNative` + 서명 블록 자동 복원 + 매니페스트 채널 검사 | ✅ `tools/build-aab.ps1`(BUILD §3) |
| 처리방침 EN rev.6 · KO 6차(Expo 수탁·국외 이전·수집 항목) + 웰컴 시트 문구 | ✅ 정본·page.tsx 개정 — **게시는 사용자 확인 후**(LEGAL_SYSTEM §7 #15). vc11 업로드 전 게시 필수 |
| JS 측 적용 UI(강제 재시작) | ❌ **안 만든다**(§4) — 네이티브가 받아 두고 다음 콜드 스타트에 적용 |
| EAS Update 채널·브랜치 `production` | ⏳ 첫 `eas update` 때 서버에 생성된다(미실행) |
| **실제 동작** | ⏳ **vc11 · 1.0.10부터**. expo-updates는 네이티브 모듈이라 **OTA로 OTA를 켤 수 없다** — vc10 이하 사용자는 영원히 못 받는다(스토어 업데이트만) |

---

## 1. 🔴 무엇을 못 바꾸는가

OTA는 **JS 번들과 에셋만** 바꾼다. 다음은 전부 **AAB 재빌드**가 필요하다:

- 네이티브 모듈 추가·제거·버전 변경(AdMob · RevenueCat · SQLite · SecureStore · file-system · updates 자체 …)
- `app.json`의 네이티브에 굽히는 값 — 권한·`blockedPermissions`, 플러그인 설정, AdMob 앱 ID, 패키지명, 아이콘·스플래시, `updates`·`runtimeVersion`
- `versionCode`·`version`(표시 버전 — §6)

⚠ **네이티브를 바꿨는데 runtimeVersion을 안 올리고 OTA를 쏘면**, 옛 바이너리에 신 네이티브를 전제한 JS가 배달돼 **크래시한다**.
네이티브를 건드렸으면 §3의 범프가 의무다. DB 마이그레이션(`user_version`)은 JS라 OTA로 나갈 수 있지만 **되돌릴 수 없다**(배구 MIGRATION_CAUTIONS §1.8) —
스키마를 올리는 변경은 AAB에 실어 versionCode와 함께 가는 것을 기본으로 한다.

## 2. 🔴 runtimeVersion은 고정 문자열이다 — 정책 객체를 쓰지 않는다

배구명가가 fingerprint 정책으로 **두 번** 데였다: ① 빌드 뒤 `.gitignore` 한 줄·CRLF 변경만으로 지문이 드리프트해 OTA가 고아가 됐고,
② 로컬 gradle 빌드는 `prebuild`가 `android/`를 새로 만들며 지문이 또 달라졐다. Idea Repository도 **로컬 gradle 체제**(`tools/build-aab.ps1`,
`android/`는 CNG 산출물·커밋 안 함)라 같은 함정에 그대로 들어간다. `appVersion` 정책도 쓰지 않는다 — JS만 고친 OTA를 내려면 `version`을
올리지 않아야 하는데(§6) 그 정책은 `version`이 곧 런타임이라 뒤엉킨다.

- 현재 값 **`"1.0.0"`** — 이건 **네이티브 세대 번호**이고 `version`(1.0.10)과 **무관하다.** 🚫 **둘을 맞추려고 고치지 마라** — 맞추는 순간 기존 빌드가 OTA에서 고아가 된다(`check:ota`가 같으면 실패시킨다).
- **범프 규칙**: §1의 네이티브 변경이 AAB에 실릴 때 `"1.0.0"` → `"1.1.0"`처럼 올린다. 그 뒤로 OTA는 새 런타임 기기에만 간다. 옛 런타임 기기엔 마지막 호환 OTA가 남는다(고장 아님).

## 3. 🔴 로컬 gradle 빌드는 `eas.json`의 channel을 안 받는다

`eas.json`의 `build.*.channel`은 **EAS Build 전용**이다. 우리는 로컬에서 굽기 때문에 그 값이 AAB에 들어가지 않는다.
채널은 **`app.json`의 `updates.requestHeaders`**로만 들어간다:

```jsonc
"runtimeVersion": "1.0.0",
"updates": {
  "url": "https://u.expo.dev/6518e63b-54a0-432a-b9a5-56292cf4a523",   // = extra.eas.projectId (check:ota가 대조)
  "checkAutomatically": "ON_LOAD",
  "requestHeaders": { "expo-channel-name": "production" }              // 🔴 이게 없으면 기기가 채널을 안 보낸다
}
```

⚠ 이게 빠지면 **게시는 성공으로 보이는데 아무도 못 받는다**(배구명가 vc13·14에서 이틀 잠복). **"게시 성공 ≠ 전달"** — 빌드 뒤 매니페스트에
채널이 실제로 들어갔는지 스크립트가 확인하고(BUILD §4 `expo-channel-name true`), 게시 뒤엔 기기에서 실확인한다(§5).

## 4. 언제 적용되나 — **콜드 스타트 전용**

- 네이티브가 `ON_LOAD`로 **백그라운드 다운로드**하고, **다음 앱 실행**에 적용된다. 백그라운드에서 꺼내 쓰는 것으로는 안 받는다.
  안내 문구는 *"앱을 완전히 종료했다가 다시 실행"* — *"앱을 열면 됩니다"*는 틀린 안내다. 보장선은 **콜드 2회**(네이티브 다운로드 ↔ JS 확인 경쟁).
- **JS에서 강제로 받아 재시작하는 UI는 만들지 않는다.** 부팅 순서는 이미 `웰컴 시트 → App Open 광고 → 부팅 게이트 → 소프트 업데이트 팝업`(ARCHITECTURE §5.4)으로
  차 있고, 여기에 OTA 재시작을 끼우면 작성 중 화면이 튀거나(기둥 5 위반 — 기록을 막는 것) 팝업이 두 번 뜬다. **조용히 받아 두고 다음에 적용**이 이 앱에 맞다.
- 디버그 빌드(`__DEV__`)에서는 expo-updates가 꺼져 있다 — 에뮬레이터 dev 앱으로 OTA를 검증할 수 없다. 검증은 릴리스 빌드 실기기.

## 5. 배포 절차

> 🔴 **OTA 배포는 사용자가 지시할 때만 한다.** 검증이 다 통과해도 임의로 쏘지 않는다(AAB 빌드·업로드와 같은 규율 — BUILD §3.5).
> 🔴 **첫 게시 전 선행**: 처리방침 rev.6 게시(LEGAL_SYSTEM §7 #15) · vc11이 사용자 손에 있어야 받을 기기가 있다.

```bash
npm run check:ota                                   # 채널·URL·runtimeVersion·버전 읽기 단일화
npm run typecheck && npm run lint && npm run check:i18n
npx eas-cli update --channel production --platform android --message "<무엇을 고쳤는지>"
```

- 🔴 **`--platform android` 필수.** `all`이면 web 번들에서 `react-native-google-mobile-ads` export가 실패한다(LinkMemo 실측).
- `eas-cli`는 `shs00925`로 로그인돼 있다(`eas submit`과 같은 계정, 프로젝트 `6518e63b…` owner). 무료 플랜 = **월 활성 업데이트 사용자 1,000명 · 100 GiB**(초과 시 게시가 막히는 게 아니라 전달이 제한 — Starter $19/월 3,000 MAU). 프로덕션 MAU가 1,000에 가까워지면 여기 적고 결정한다.
- 배포 후 **기기에서 실확인**한다 — exit 0은 *게시*까지만 증명한다. 콜드 2회 후 바뀐 문구가 보이는지 본다. 게시 기록은 BUILD §5 표에 `ota` 행으로 남긴다(무엇을·언제·어느 runtimeVersion).
- 코드 서명(`codeSigningCertificate`)은 **EAS Production 플랜 전용**이라 미사용 — 전송은 HTTPS. 필요해지면 여기 적고 결정.

## 6. 🔴 버전 문자열 오염 — `expoConfig.version`을 읽지 않는다

`Constants.expoConfig.version`은 **OTA 매니페스트 값으로 덮어써진다.** 이 앱은 그 값을 bootstrap `appVersion`(강제·소프트 업데이트 판정 입력, ARCHITECTURE §5.4)과
About·설정 표기·백업 파일 메타에 쓰고 있었다. `version`을 1.0.11로 올린 커밋에서 OTA를 쏘면 **네이티브가 1.0.10인 기기가 자기를 1.0.11이라고 보고**하고,
`latest = 1.0.11`로 올려도 그 기기엔 업데이트 안내가 영영 안 뜬다(LinkMemo OTA_UPDATE §6 실사례).

**해법(LinkMemo보다 한 걸음 더 — 2026-09-01)**: `lib/app-version.ts`의 `APP_VERSION = Application.nativeApplicationVersion ?? expoConfig.version`
(expo-application). 네이티브 `versionName`은 OTA가 못 바꾼다. 읽는 곳은 전부 이 상수 하나 — `features/support/server.ts`(bootstrap·문의)·`boot-gate`·`update-popup`(재export 경로 유지)·
`app/about.tsx`·`app/settings.tsx`·`features/backup/export.ts`. **`check:ota`가 `app/`·`components/`·`features/`에서 `expoConfig.version` 직접 읽기를 잡는다.**

그래도 규칙은 남는다: **`version`·`versionCode` 범프는 AAB 빌드 커밋에서만 한다.** OTA로 나갈 변경은 범프 전에 쏘거나, 빌드를 먼저 내보내고 쏜다 —
매니페스트 `version`과 네이티브가 어긋난 상태를 만들 이유가 없다.

## 7. 빌드에서 해야 할 것 (vc11 — 첫 OTA 가능 빌드)

`expo-updates`는 네이티브 모듈이라 매니페스트에 `EXPO_UPDATE_URL`·`EXPO_RUNTIME_VERSION`·채널 헤더가 들어가야 한다. 안전하게 `android/`를 새로 만든다:

```powershell
powershell -ExecutionPolicy Bypass -File tools/build-aab.ps1 -VersionCode 11 -VersionName 1.0.10 -CleanNative
```

- `-CleanNative`가 `android/`를 지우고 prebuild → **서명 블록이 사라지므로 스크립트가 BUILD §2 블록을 자동 주입**하고(BOM 없이 기록), 주입 후에도 없으면 중단한다.
- 스크립트 끝 점검에 `expo-channel-name true · EXPO_RUNTIME_VERSION true · u.expo.dev true`가 추가됐다(§3 잠복 함정 방어). 하나라도 false면 올리지 않는다.
- 이후 JS만 바뀐 빌드는 종전대로 `-CleanNative` 없이(기존 `android/` 유지).

## 8. 개인정보·정책

- 기기가 **Expo, Inc.(미국) 서버(`u.expo.dev`)**와 통신한다 — 기기 OS 종류·런타임 버전·플랫폼·채널·업데이트 수신 확인용 무작위 토큰(Expo 개인정보처리방침: "end-users' device operating system and randomized tokens used to determine if the end-user has downloaded an update"). 개인정보·아이디어 내용 없음. 그래도 §6 정직 규칙상 **기기를 떠나는 것 목록에 넣는다**: 웰컴 시트·About `welcome.point.whatLeaves` 문구 갱신(en/ko), 처리방침 EN rev.6 §3.e·§4 / KO 6차 제1·2·3·6·7·14조, DATA_SAFETY §0·§4. Play 데이터 보안 양식은 기기 ID 유형이 수집·공유·앱 기능 목적으로 기선언돼 변경 없음(사람 확인 — LEGAL §7 #15).
- Google Play 정책(Device and Network Abuse): 스토어 밖 코드 다운로드 금지의 예외가 "JavaScript 등 인터프리터/VM에서 도는 코드" — RN JS 번들 OTA는 이 예외에 해당하며 배구·my_word가 프로덕션에서 이미 쓰고 있다. 단 앱의 목적·기능을 심사 통과본과 다르게 바꾸는 OTA는 정책 위반 — **OTA는 수정·개선용**, 새 기능 대형 변경은 AAB로.
