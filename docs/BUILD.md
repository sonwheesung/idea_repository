# BUILD — 로컬 AAB 빌드·서명 (EAS 미사용)

> 작성 2026-08-18. vc1·vc2 모두 이 절차로 만들었다. EAS 무료 플랜 소진과 무관하게 **처음부터 로컬 gradle**이다.
> 스크립트: [`../tools/build-aab.ps1`](../tools/build-aab.ps1). 릴리스 노트·업로드 기록: [`STORE_LISTING.md`](./STORE_LISTING.md) §9·§10.
> ~~⚠ 비공개 테스트 기간 수정분은 **AAB 재업로드로만** — OTA(expo-updates) 절대 금지(CLAUDE.md §16).~~ → **2026-09-01 OTA 도입**(CLAUDE §14 V, [`OTA_SYSTEM.md`](./OTA_SYSTEM.md)): 네이티브 변경은 여전히 AAB, JS만 바뀐 수정은 OTA 가능(vc11부터). **OTA 게시도 사용자 지시 때만.**

## 1. 키스토어 — 이미 있다. 다시 만들지 말 것

| 항목 | 값 |
|---|---|
| 파일 | `credentials/idearepository-upload.jks` (gitignore: `credentials/`, `*.jks`) |
| alias | `upload` |
| 비밀번호 | `credentials/keystore.pass` — 한 줄, storepass = keypass. **커밋 금지** |
| 백업 | `C:\private_key\idearepository-upload.jks` + `idearepository-README.txt`(alias·비밀번호 기재) |
| 역할 | Play App Signing **업로드 키**. 앱 서명 키는 Google이 보관. 분실 시 Play 콘솔 → 앱 서명 → 업로드 키 재설정 |

- **새 키스토어를 만들면 다음 AAB가 "업로드 키가 다릅니다"로 거부된다.** 아래 생성 명령은 **참고용**(새 앱을 만들 때만):
  ```powershell
  # 새 앱용 — Idea Repository에는 실행하지 말 것
  keytool -genkeypair -v -storetype JKS -keystore <app>-upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
  Set-Content credentials/keystore.pass '<비밀번호>' -NoNewline -Encoding ascii
  ```
- 백업이 없어졌으면 `credentials/`를 `C:\private_key\`로 다시 복사(형제 앱 규약).

## 2. 서명 설정 (android/app/build.gradle — CNG 산출물, gitignore)

`expo prebuild --platform android`(--clean 없이)는 기존 `android/`를 유지하고 버전·매니페스트만 갱신한다 — 2026-08-18 실측: 아래 블록 보존됨.
`--clean`이나 `android/` 삭제 후에는 **이 블록을 다시 넣어야** 한다 — ~~스크립트가 없으면 중단시킨다~~ → **2026-09-01부터 `tools/build-aab.ps1 -CleanNative`가 `android/`를 지우고 prebuild한 뒤 아래 블록을 자동 주입**한다(BOM 없이 기록, 주입 뒤에도 없으면 중단). 네이티브 모듈을 추가·변경한 빌드(vc11 expo-updates)에서 쓴다:

```groovy
signingConfigs {
    debug { ... 기본 ... }
    // 업로드 키(Play App Signing) — credentials/는 커밋 금지, 백업 C:\private_key
    release {
        storeFile file('../../credentials/idearepository-upload.jks')
        storePassword file('../../credentials/keystore.pass').text.trim()
        keyAlias 'upload'
        keyPassword file('../../credentials/keystore.pass').text.trim()
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        ...
    }
}
```

## 2.5 R8 (난독화·코드 축소) — vc12부터 (2026-09-09)

> 정본·근거·함정: **`C:\project\common\R8_OBFUSCATION.md`** (Play "앱 최적화 기준점 미만 · 난독화 1%" 경고
> 대응 — vc11 대상, 기한 2027-02, 2026-09-09 콘솔 실측. My Word가 같은 경고를 vc20으로 해소한 전례 승계).

- **설정의 정본은 `app.json`의 `expo-build-properties` 플러그인이다** — CNG 프로젝트라 `android/` 직접 수정은
  `-CleanNative`가 지운다(공용 문서 §2 갈림길 B). `enableMinifyInReleaseBuilds` · `enableShrinkResourcesInReleaseBuilds` ·
  `extraProguardRules`(keepattributes · `expo.modules.**` · `com.facebook.jni.**` — My Word 검증 최소 세트, 🚫 `com.facebook.react.**` 통짜 keep 금지).
- `proguard-android-optimize.txt` 전환은 플러그인이 못 해서 **`tools/build-aab.ps1`이 prebuild 직후 패치**한다
  (서명 블록 주입과 같은 자리). 스크립트가 gradle.properties의 minify=true도 **게이트로 확인**한다 —
  플러그인이 빠지면 경고가 조용히 되살아나므로 빌드를 중단시킨다.
- 🔴 **릴리스 빌드 E2E를 통과하기 전에는 R8 빌드를 올리지 않는다**(공용 문서 §4·§5 — 파손은 조용한 기능
  실종으로 나타나고 디버그 빌드는 R8을 안 탄다. 특히 `expo-updates` 생존은 OTA로 못 고치므로 필수 재측정).
- `runtimeVersion`은 `1.0.0` 유지(모듈 추가·제거 아님). `mapping.txt`는 gradle이 AAB에 동봉 — 별도 업로드 없음.

## 3. 빌드 절차

> 🔴 `.env`·`.env*.local`이 있으면 `tools/build-aab.ps1`이 **빌드를 거부**한다(common §5.5 — prebuild가 env를 읽어 번들에 문자열로 박고, 올린 뒤엔 못 고친다). 이 프로젝트는 env 파일을 쓰지 않는다(`EXPO_PUBLIC_SERVER_URL`만 코드 기본값). 2026-08-21 게이트 추가.

```powershell
# 다음 버전 예: versionCode 3, 1.0.2 (versionCode는 업로드마다 +1 필수)
powershell -ExecutionPolicy Bypass -File tools/build-aab.ps1 -VersionCode 3 -VersionName 1.0.2
# 네이티브 모듈 추가·변경 빌드(예: vc11 expo-updates) — android/ 재생성 + 서명 블록 자동 주입(§2)
powershell -ExecutionPolicy Bypass -File tools/build-aab.ps1 -VersionCode 11 -VersionName 1.0.10 -CleanNative
```

수동으로 하면: ① `app.json` `expo.version` / `expo.android.versionCode` 수정 → ② `npx expo prebuild --platform android --no-install`
→ ③ `cd android; .\gradlew bundleRelease` (`ANDROID_HOME`=`%LOCALAPPDATA%\Android\Sdk`, `JAVA_HOME`=jdk-19 — 없으면 "SDK location not found")
→ ④ `android/app/build/outputs/bundle/release/app-release.aab` → 루트 `idearepository-vc{N}.aab`(gitignore `*.aab`)
→ ⑤ 업로드는 §3.5 CLI 경로(기본) 또는 사용자 수동 드롭(브라우저 도구 10MB 제한). 출시명 `{N} ({version})`, 노트는 STORE_LISTING §10.

> ⚠ **형제 프로젝트 빌드와 동시 실행 주의(2026-09-01 실측)**: gradle 데몬 레지스트리는 사용자·gradle 버전 단위로 **공용**이라, 다른 세션이 `gradlew --stop`이나 `taskkill //IM java.exe`를 부르면 우리 `--no-daemon`(single-use 데몬) 빌드도 "daemon has been stopped: stop command received"로 죽는다. 원인 불명의 `gradle 실패`가 나면 `-q`를 빼고 `cd android; ./gradlew bundleRelease --console=plain`으로 실제 메시지를 본 뒤 재시도. 우리 스크립트는 `--stop`을 부르지 않는다 — `taskkill //IM java.exe`는 어떤 상황에서도 금지(`common/DEV_ALLOCATION.md` §0.1, 2026-09-01 사고 기록).

## 3.5 업로드 — CLI 경로 (`eas submit`, 2026-08-20 도입)

> 정본 절차·함정: `C:\project\common\PLAY_RELEASE_AUTOMATION.md` (조각 2026-08-19 실전 검증).
> **빌드는 계속 로컬 gradle**(§3) — EAS는 업로드(Play Developer API 호출)만 한다. CLAUDE §11과 충돌 없음.

| 준비물 | 값 |
|---|---|
| 서비스 계정 키 | `C:\project\secrets\play-service-account.json` (저장소 밖 — 형제 앱 공용) |
| submit 프로필 | `eas.json` → `submit.closed`(track `alpha` · releaseStatus `draft`) |
| Play 권한 | 콘솔 → 사용자 및 권한 → 서비스 계정 → 이 앱에 **"앱을 테스트 트랙으로 출시"만** 필요할 때 켠다 |

```powershell
npx eas-cli submit --platform android --profile closed --path idearepository-vc{N}.aab --non-interactive
```

> **번들만 올리는 경로(2026-09-02 신설 — 프로덕션 릴리스용)**: `bash scripts/play-upload-bundle.sh idearepository-vc{N}.aab` —
> LinkMemo `play-upload-bundle.sh` 이식(Play Developer API edits.insert → bundles.upload → commit, **트랙 무변경**).
> eas submit과 달리 알파 draft를 안 만들고 번들 라이브러리에만 넣는다 → 콘솔에서 "라이브러리에서 추가"로 릴리스 생성.
> 프로덕션 권한 없이 "앱을 테스트 트랙으로 출시" 권한만으로 동작(켰다 끄기 동일). 업로드 후 sha256을 응답과 대조.

- 🔴 **권한은 켰다 끈다** — 업로드 끝나면 즉시 회수, 리로드로 개수 확인. "프로덕션으로 출시"는 절대 켜지 않는다.
- ⚠ 콘솔 저장은 2단계("변경사항 저장" → "예") — 저장 후 리로드해서 남았는지 확인.
- `releaseStatus: draft`인 이유: eas submit은 출시 노트를 못 넣는다 → 초안으로 올린 뒤 콘솔에서 출시명·노트(en/ko) 입력 → 검토 전송. 이 마무리는 브라우저로 가능(업로드만 CLI).
- ⚠ 트랙 식별자 `alpha`는 기본값 가정 — 첫 제출에서 오류가 나면 콘솔의 실제 트랙 식별자로 맞춘다(기억으로 단정 금지).
- 업로드 전 서명 지문 대조(§4)는 CLI 경로에서도 동일하게 한다.
- `releaseStatus: draft`의 근거 하나 더(common §5.11·§5.12, 2026-08-20 조각 실측): `completed`는 **스토어 등록정보가 완성돼야** 통과하고, 등록정보는 비공개 테스트부터 필수다. 우리는 vc1부터 충족 — 하지만 draft면 이 검사와 무관하게 번들이 먼저 올라간다.
- 권한 진단: `npm run check:play-access`(`scripts/check-play-access.mjs` — 키·토큰 미출력, HTTP 상태만. **403 = 앱 권한 없음(회수 성공)** · 204/200 = 부여됨 · 401 = 계정 권한). ⚠ 회수 직후 수십 초는 204가 남는다(전파 지연) — 콘솔 리로드로 먼저 확인.
- 콘솔 웹 업로드는 **이미지는 된다**(`input[type=file]` 직접 주입 — common §5.10). 스크린샷·그래픽 교체 때 쓴다. AAB는 계속 `eas submit`.

## 4. 점검

- 스크립트 마지막 출력: `versionName true · READ_EXTERNAL_STORAGE false · USE_BIOMETRIC false · AD_ID true` (blockedPermissions 반영 확인) **· `expo-channel-name true · EXPO_RUNTIME_VERSION true · u.expo.dev true`**(2026-09-01 OTA — 채널 미전달 잠복 함정 방어, [`OTA_SYSTEM.md`](./OTA_SYSTEM.md) §3. 하나라도 false면 올리지 않는다).
- 서명 확인: `keytool -printcert -jarfile idearepository-vc{N}.aab` — Play 콘솔 앱 서명 페이지의 **업로드 키 인증서 SHA-1**과 일치해야 한다.
- 콘솔 검토 페이지의 "R8 가독화 파일 없음" 경고는 비차단(vc1·vc2 동일).

## 5. 이력

| 버전 | 날짜 | 비고 |
|---|---|---|
| vc1 · 1.0.0 | 2026-08-17 | 첫 비공개 테스트 — 검토 통과(테스터 제공) |
| vc2 · 1.0.1 | 2026-08-18 | 설정 통일·필터 Select·개인정보 옵션·발상 도구·blockedPermissions — 검토 전송 |
| vc3 · 1.0.2 | 2026-08-19 | 발상 단어 관리 화면(DB v3)·뒤로가기 종료 확인 — 검토 통과·테스터 제공(8/19 19:34, 콘솔 수동 업로드) |
| vc4 · 1.0.3 | 2026-08-20 | 조합 헤더 "단어 관리하기" 텍스트 버튼 — **§3.5 CLI 경로 첫 실전**(eas submit draft → 콘솔 노트 → 검토 전송, 권한 켰다 끔·API 403 복귀 확인) — 검토 통과·테스터 제공(8/20 11:08) |
| **vc11 · 1.0.10** | 2026-09-01 · **재빌드 2026-09-02 ×2 · 프로덕션 검토 전송·당일 통과·게시 2026-09-02** | ⭐ **프로덕션 첫 릴리스 — 검토 통과·게시**(전송 당일 통과 — 트랙 "활성 · 최신 출시 버전 11 (1.0.10) · 국가 177" 콘솔 실측, 같은 날 latest `1.0.10` PATCH·bootstrap 실측)(2026-09-02 사용자 승인 "전부 진행", 세션 확인 게이트 통과 후 실행): rev.6 게시(라이브 실측) → **번들만 업로드**(`scripts/play-upload-bundle.sh` — LinkMemo `play-upload-bundle.sh` 이식, edits.insert→bundles.upload→commit, 트랙 무변경·프로덕션 권한 불요. sha256 `377c3041…` 로컬 일치) → 콘솔 릴리스 `11 (1.0.10)`·첫 출시형 노트 en/ko·**국가/지역 177**(전체 선택) → "검토를 위해 변경사항 7개 제출"(릴리스 + 국가 + 등록정보 4건 — 부제·설명 정리) → **"검토 중인 변경사항"** → 권한 회수(리로드 4개·API 403). ⚠ **첫 릴리스에는 단계적 출시 %가 안 나온다**(기존 사용자 0 — staged rollout은 업데이트 분배 장치) → "전체 출시 시작"으로 전송, %는 다음 릴리스부터. **첫 출시의 되돌릴 수단은 rollout이 아니라 출시 중단(halt) + OTA(JS 한정)다**(공통 서버 세션과 교차 확인 — `common/PLAY_CONSOLE_STATUS.md` §5. 네이티브 문제는 OTA로 못 덮는다). 경고 1건(R8 가독화 파일 없음)은 vc1부터 동일·비차단. **2026-09-02 재빌드 2회**: ① SDK `2026-09-02`(웜 스타트 하트비트 · ARCHITECTURE §5.7) + `boot-gate` AppState 리스너 + 웰컴 문구 ② **오픈소스 라이선스 고지**(`app/licenses.tsx` + About 행 — LEGAL_SYSTEM §10) — 미업로드라 같은 versionCode 11로 교체(`-CleanNative` 없이, 매번 점검 전부 True·SHA1 동일 재확인, 65.9MB). 이하 9-01 최초 빌드 기록 → · **첫 OTA 가능 빌드**(expo-updates ~29.0.20 · expo-application, `runtimeVersion "1.0.0"` · 채널 `production`) + SDK `2026-09-01.2`(세션 슬라이딩 갱신) + 웰컴 문구 — 네이티브 모듈 추가라 `-CleanNative` 첫 실전: `android/` 재생성 → **서명 블록 자동 주입 동작 확인** → 점검 `1.0.10 · AD_ID · expo-channel-name · EXPO_RUNTIME_VERSION · u.expo.dev` 전부 True, `READ_EXTERNAL_STORAGE · USE_BIOMETRIC` False. SHA1 `26:A5:…:A8:0E` 업로드 키 일치, 65.9MB(+3.3MB — expo-updates). 구 AAB vc10 삭제. ⚠ 함정 2건: ① 스크립트 첫 실행은 내가 넣은 서명 검사(`split Count -lt 3`)가 정상 주입을 실패로 판정 — `-notmatch`로 수정 ② **gradle 빌드가 두 번 "Gradle build daemon has been stopped: stop command received"로 죽었다** — 같은 시각 LinkMemo 세션 빌드가 돌고 있었고 그 세션이 `android/` 잠금을 풀려고 `gradlew --stop` + `taskkill //F //IM java.exe`를 불러 **공용 데몬 레지스트리**의 우리 single-use 데몬까지 종료됐다(`--no-daemon`도 데몬 프로세스다 — LinkMemo 세션이 확인·사과). 우리 코드 문제 아님, 재시도로 성공(~15분). 규칙은 `common/DEV_ALLOCATION.md` §0.1(LinkMemo 기록) |
| vc10 · 1.0.9 | 2026-09-01 | 검토 통과·테스터 제공(9/1 14:23 — 전송 후 약 1시간) · **Phase 12 부팅 활성 하트비트**(SDK 2026-09-01 재복사 · `fetchOnce`에 `ensureDeviceSession` 병렬 · `inquiry.status.reviewing` · 웰컴 문구) — JS만 변경. CLI 경로 7회차(vc9 제공 확인 8/31 11:37 → 권한 켬 API 204 → `eas submit` draft → 출시명 `10 (1.0.9)`·노트 en/ko → 다음 → 저장(⚠ 첫 저장은 "개요로 이동" 다이얼로그가 안 잡혀 draft로 남았다 — 재진입해 저장 후 JS로 다이얼로그 확인) → 게시 개요 → 검토 전송 "검토 중인 변경사항" → 권한 회수). SHA1 일치, 62.6MB. 디버그 빌드는 `ANDROID_HOME` 없이 gradle이 실패한다(bash 환경) — `export ANDROID_HOME=$LOCALAPPDATA/Android/Sdk`. 같은 날 latest `1.0.8` PATCH · 처리방침 rev.5 게시 |
| vc9 · 1.0.8 | 2026-08-31 | 검토 통과·테스터 제공(8/31 11:37) · **§14 T 사용자 지시 4건 반영**(입력 필드 searchBar→card · 테마/언어 시스템(자동) 제거 · 카테고리 헤더 ＋) + 브랜드명 Vivace Games Studio(`lib/links.ts`) — JS만 변경. CLI 경로 6회차(vc8 제공 확인 → 권한 켬 API 204 → `eas submit` draft → 출시명 `9 (1.0.8)`·노트 en/ko → 저장 → 검토 전송 "검토 중인 변경사항" → 권한 회수 리로드 4개·API 403 즉시). SHA1 vc8과 대조 일치, 65.7MB. 같은 날 **운영값 PATCH**(latest 1.0.7 + 스토어 URL — PLAN §11.1, bootstrap 실측) |
| vc8 · 1.0.7 | 2026-08-26 | 검토 통과·테스터 제공(8/26 12:47) · **Phase 11** 소프트 업데이트 안내(`update-popup` + `useSoftUpdateStore`) · 검색 매치 힌트(`query.ts` m_* 플래그) — JS만 변경. CLI 경로 5회차(vc7 검토 통과 확인 → 권한 켬 API 204 → `eas submit` draft → 출시명 `8 (1.0.7)`·노트 en/ko → 저장 → 검토 전송 "검토 중인 변경사항" → 권한 회수 리로드 4개·API 403). SHA1 일치, 65.7MB. **AAB 실측: targetSdk 36 · 64비트 `.so` 46개 전부 16KB 정렬**(`common/GLOBAL_DATA_COMPLIANCE.md` §9.5) |
| vc7 · 1.0.6 | 2026-08-23 | 검토 통과·테스터 제공(8/23 16:46) · **UI 규격 통일**(ListRow·EditRow·Dialog·Badge·ProgressBar, UI_GUIDE) — JS만 변경. CLI 경로 4회차(권한 켬 API 204 → `eas submit` draft → 출시명 `7 (1.0.6)`·노트 en/ko → 저장 → 게시 개요 검토 전송 "검토 중인 변경사항" → 권한 회수 리로드 4개·API 403). SHA1 대조 일치, 65.7MB. ⚠ 빌드 스크립트를 PowerShell `*>&1`로 감싸면 prebuild의 NODE_ENV stderr 한 줄이 NativeCommandError로 보이지만 빌드는 정상(exit 0) — 로그만 보고 실패로 단정하지 말 것 |
| vc6 · 1.0.5 | 2026-08-21 | **로컬 백업(내보내기·가져오기)** + 약관 5차/처리방침 4차 — 검토 통과·테스터 제공(8/21 16:25) · CLI 경로 3회차(권한 켬 API 204 → eas submit draft → 출시명·노트 → 검토 전송 → 권한 회수 리로드 3개 확인). 네이티브 모듈 3종 추가(expo-file-system·sharing·document-picker). ⚠ 콘솔 체크박스·버튼은 ref 클릭이 Angular 상태를 안 바꾼다 — 좌표 클릭으로 |
| vc5 · 1.0.4 | 2026-08-21 | 단어 관리 헤더 ＋ 아이콘·하단 액션 제거 · 한국어 조사 자동 처리(es-hangul) — 검토 통과·테스터 제공(8/21 12:04) · CLI 경로 2회차(권한 켬 API 204 → eas submit draft → 출시명·노트 → 검토 전송 → 권한 회수, 리로드 3개 확인·API 403). ⚠ 회수 직후 API 프로브는 수십 초 204 유지(전파 지연) — 콘솔 리로드로 먼저 확인 |
