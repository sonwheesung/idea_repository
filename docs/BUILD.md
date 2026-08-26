# BUILD — 로컬 AAB 빌드·서명 (EAS 미사용)

> 작성 2026-08-18. vc1·vc2 모두 이 절차로 만들었다. EAS 무료 플랜 소진과 무관하게 **처음부터 로컬 gradle**이다.
> 스크립트: [`../tools/build-aab.ps1`](../tools/build-aab.ps1). 릴리스 노트·업로드 기록: [`STORE_LISTING.md`](./STORE_LISTING.md) §9·§10.
> ⚠ 비공개 테스트 기간 수정분은 **AAB 재업로드로만** — OTA(expo-updates) 절대 금지(CLAUDE.md §16).

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
`--clean`이나 `android/` 삭제 후에는 **이 블록을 다시 넣어야** 한다(스크립트가 없으면 중단시킨다):

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

## 3. 빌드 절차

> 🔴 `.env`·`.env*.local`이 있으면 `tools/build-aab.ps1`이 **빌드를 거부**한다(common §5.5 — prebuild가 env를 읽어 번들에 문자열로 박고, 올린 뒤엔 못 고친다). 이 프로젝트는 env 파일을 쓰지 않는다(`EXPO_PUBLIC_SERVER_URL`만 코드 기본값). 2026-08-21 게이트 추가.

```powershell
# 다음 버전 예: versionCode 3, 1.0.2 (versionCode는 업로드마다 +1 필수)
powershell -ExecutionPolicy Bypass -File tools/build-aab.ps1 -VersionCode 3 -VersionName 1.0.2
```

수동으로 하면: ① `app.json` `expo.version` / `expo.android.versionCode` 수정 → ② `npx expo prebuild --platform android --no-install`
→ ③ `cd android; .\gradlew bundleRelease` (`ANDROID_HOME`=`%LOCALAPPDATA%\Android\Sdk`, `JAVA_HOME`=jdk-19 — 없으면 "SDK location not found")
→ ④ `android/app/build/outputs/bundle/release/app-release.aab` → 루트 `idearepository-vc{N}.aab`(gitignore `*.aab`)
→ ⑤ 업로드는 §3.5 CLI 경로(기본) 또는 사용자 수동 드롭(브라우저 도구 10MB 제한). 출시명 `{N} ({version})`, 노트는 STORE_LISTING §10.

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

- 🔴 **권한은 켰다 끈다** — 업로드 끝나면 즉시 회수, 리로드로 개수 확인. "프로덕션으로 출시"는 절대 켜지 않는다.
- ⚠ 콘솔 저장은 2단계("변경사항 저장" → "예") — 저장 후 리로드해서 남았는지 확인.
- `releaseStatus: draft`인 이유: eas submit은 출시 노트를 못 넣는다 → 초안으로 올린 뒤 콘솔에서 출시명·노트(en/ko) 입력 → 검토 전송. 이 마무리는 브라우저로 가능(업로드만 CLI).
- ⚠ 트랙 식별자 `alpha`는 기본값 가정 — 첫 제출에서 오류가 나면 콘솔의 실제 트랙 식별자로 맞춘다(기억으로 단정 금지).
- 업로드 전 서명 지문 대조(§4)는 CLI 경로에서도 동일하게 한다.
- `releaseStatus: draft`의 근거 하나 더(common §5.11·§5.12, 2026-08-20 조각 실측): `completed`는 **스토어 등록정보가 완성돼야** 통과하고, 등록정보는 비공개 테스트부터 필수다. 우리는 vc1부터 충족 — 하지만 draft면 이 검사와 무관하게 번들이 먼저 올라간다.
- 권한 진단: `npm run check:play-access`(`scripts/check-play-access.mjs` — 키·토큰 미출력, HTTP 상태만. **403 = 앱 권한 없음(회수 성공)** · 204/200 = 부여됨 · 401 = 계정 권한). ⚠ 회수 직후 수십 초는 204가 남는다(전파 지연) — 콘솔 리로드로 먼저 확인.
- 콘솔 웹 업로드는 **이미지는 된다**(`input[type=file]` 직접 주입 — common §5.10). 스크린샷·그래픽 교체 때 쓴다. AAB는 계속 `eas submit`.

## 4. 점검

- 스크립트 마지막 출력: `versionName true · READ_EXTERNAL_STORAGE false · USE_BIOMETRIC false · AD_ID true` (blockedPermissions 반영 확인).
- 서명 확인: `keytool -printcert -jarfile idearepository-vc{N}.aab` — Play 콘솔 앱 서명 페이지의 **업로드 키 인증서 SHA-1**과 일치해야 한다.
- 콘솔 검토 페이지의 "R8 가독화 파일 없음" 경고는 비차단(vc1·vc2 동일).

## 5. 이력

| 버전 | 날짜 | 비고 |
|---|---|---|
| vc1 · 1.0.0 | 2026-08-17 | 첫 비공개 테스트 — 검토 통과(테스터 제공) |
| vc2 · 1.0.1 | 2026-08-18 | 설정 통일·필터 Select·개인정보 옵션·발상 도구·blockedPermissions — 검토 전송 |
| vc3 · 1.0.2 | 2026-08-19 | 발상 단어 관리 화면(DB v3)·뒤로가기 종료 확인 — 검토 통과·테스터 제공(8/19 19:34, 콘솔 수동 업로드) |
| vc4 · 1.0.3 | 2026-08-20 | 조합 헤더 "단어 관리하기" 텍스트 버튼 — **§3.5 CLI 경로 첫 실전**(eas submit draft → 콘솔 노트 → 검토 전송, 권한 켰다 끔·API 403 복귀 확인) — 검토 통과·테스터 제공(8/20 11:08) |
| vc8 · 1.0.7 | 2026-08-26 | **Phase 11** 소프트 업데이트 안내(`update-popup` + `useSoftUpdateStore`) · 검색 매치 힌트(`query.ts` m_* 플래그) — JS만 변경. CLI 경로 5회차(vc7 검토 통과 확인 → 권한 켬 API 204 → `eas submit` draft → 출시명 `8 (1.0.7)`·노트 en/ko → 저장 → 검토 전송 "검토 중인 변경사항" → 권한 회수 리로드 4개·API 403). SHA1 일치, 65.7MB. **AAB 실측: targetSdk 36 · 64비트 `.so` 46개 전부 16KB 정렬**(`common/GLOBAL_DATA_COMPLIANCE.md` §9.5) |
| vc7 · 1.0.6 | 2026-08-23 | 검토 통과·테스터 제공(8/23 16:46) · **UI 규격 통일**(ListRow·EditRow·Dialog·Badge·ProgressBar, UI_GUIDE) — JS만 변경. CLI 경로 4회차(권한 켬 API 204 → `eas submit` draft → 출시명 `7 (1.0.6)`·노트 en/ko → 저장 → 게시 개요 검토 전송 "검토 중인 변경사항" → 권한 회수 리로드 4개·API 403). SHA1 대조 일치, 65.7MB. ⚠ 빌드 스크립트를 PowerShell `*>&1`로 감싸면 prebuild의 NODE_ENV stderr 한 줄이 NativeCommandError로 보이지만 빌드는 정상(exit 0) — 로그만 보고 실패로 단정하지 말 것 |
| vc6 · 1.0.5 | 2026-08-21 | **로컬 백업(내보내기·가져오기)** + 약관 5차/처리방침 4차 — 검토 통과·테스터 제공(8/21 16:25) · CLI 경로 3회차(권한 켬 API 204 → eas submit draft → 출시명·노트 → 검토 전송 → 권한 회수 리로드 3개 확인). 네이티브 모듈 3종 추가(expo-file-system·sharing·document-picker). ⚠ 콘솔 체크박스·버튼은 ref 클릭이 Angular 상태를 안 바꾼다 — 좌표 클릭으로 |
| vc5 · 1.0.4 | 2026-08-21 | 단어 관리 헤더 ＋ 아이콘·하단 액션 제거 · 한국어 조사 자동 처리(es-hangul) — 검토 통과·테스터 제공(8/21 12:04) · CLI 경로 2회차(권한 켬 API 204 → eas submit draft → 출시명·노트 → 검토 전송 → 권한 회수, 리로드 3개 확인·API 403). ⚠ 회수 직후 API 프로브는 수십 초 204 유지(전파 지연) — 콘솔 리로드로 먼저 확인 |
