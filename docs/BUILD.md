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

```powershell
# 다음 버전 예: versionCode 3, 1.0.2 (versionCode는 업로드마다 +1 필수)
powershell -ExecutionPolicy Bypass -File tools/build-aab.ps1 -VersionCode 3 -VersionName 1.0.2
```

수동으로 하면: ① `app.json` `expo.version` / `expo.android.versionCode` 수정 → ② `npx expo prebuild --platform android --no-install`
→ ③ `cd android; .\gradlew bundleRelease` (`ANDROID_HOME`=`%LOCALAPPDATA%\Android\Sdk`, `JAVA_HOME`=jdk-19 — 없으면 "SDK location not found")
→ ④ `android/app/build/outputs/bundle/release/app-release.aab` → 루트 `idearepository-vc{N}.aab`(gitignore `*.aab`)
→ ⑤ Play 콘솔 업로드는 사용자(브라우저 도구 10MB 제한), 출시명 `{N} ({version})`, 노트는 STORE_LISTING §10.

## 4. 점검

- 스크립트 마지막 출력: `versionName true · READ_EXTERNAL_STORAGE false · USE_BIOMETRIC false · AD_ID true` (blockedPermissions 반영 확인).
- 서명 확인: `keytool -printcert -jarfile idearepository-vc{N}.aab` — Play 콘솔 앱 서명 페이지의 **업로드 키 인증서 SHA-1**과 일치해야 한다.
- 콘솔 검토 페이지의 "R8 가독화 파일 없음" 경고는 비차단(vc1·vc2 동일).

## 5. 이력

| 버전 | 날짜 | 비고 |
|---|---|---|
| vc1 · 1.0.0 | 2026-08-17 | 첫 비공개 테스트 — 검토 통과(테스터 제공) |
| vc2 · 1.0.1 | 2026-08-18 | 설정 통일·필터 Select·개인정보 옵션·발상 도구·blockedPermissions — 검토 전송 |
