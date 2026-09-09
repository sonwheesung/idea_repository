# 로컬 AAB 빌드 — EAS 안 씀 (docs/BUILD.md).
# 사용: powershell -ExecutionPolicy Bypass -File tools/build-aab.ps1 [-VersionCode 3] [-VersionName 1.0.2]
#  1) app.json version/versionCode 갱신(인자 주면) → 2) expo prebuild --platform android → 3) gradlew bundleRelease
#  4) 산출물 → 루트 idearepository-vc{N}.aab → 5) 매니페스트 문자열 점검(versionName·권한)
# 서명: android/app/build.gradle release가 credentials/idearepository-upload.jks + credentials/keystore.pass를 읽는다.
#      새 키스토어를 만들지 말 것 — Play App Signing 업로드 키와 달라지면 AAB가 거부된다.
param(
  [int]$VersionCode = 0,
  [string]$VersionName = '',
  # 네이티브 모듈 추가·변경 빌드: android/ 삭제 → prebuild → 서명 블록 자동 주입 (docs/OTA_SYSTEM.md §7, 2026-09-01)
  [switch]$CleanNative
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not (Test-Path 'credentials/idearepository-upload.jks') -or -not (Test-Path 'credentials/keystore.pass')) {
  Write-Error 'credentials/idearepository-upload.jks 또는 keystore.pass 없음 — 백업 C:\private_key 에서 복원'
}
# .env 게이트 (common/PLAY_RELEASE_AUTOMATION.md §5.5) — prebuild가 .env/.env.local을 읽어 번들에 박는다. 릴리스 빌드 전에 옆으로 치운다.
$envFiles = Get-ChildItem -Path . -Filter '.env*' -File -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne 'expo-env.d.ts' }
if ($envFiles) { Write-Error ("릴리스 빌드 전 .env 파일 제거/이동 필요: " + ($envFiles.Name -join ', ')) }
if (-not $env:ANDROID_HOME) { $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk" }
if (-not $env:JAVA_HOME) { $env:JAVA_HOME = 'C:\Program Files\Java\jdk-19' }

$app = Get-Content app.json -Raw | ConvertFrom-Json
if ($VersionCode -gt 0) { $app.expo.android.versionCode = $VersionCode }
if ($VersionName -ne '') { $app.expo.version = $VersionName }
if ($VersionCode -gt 0 -or $VersionName -ne '') {
  ($app | ConvertTo-Json -Depth 20) -replace "`r`n", "`n" | Set-Content app.json -Encoding utf8 -NoNewline
  Add-Content app.json "`n" -NoNewline
}
$vc = $app.expo.android.versionCode
$vn = $app.expo.version
Write-Host "== versionCode $vc · versionName $vn"

if ($CleanNative -and (Test-Path android)) {
  Write-Host '== -CleanNative: android/ 삭제 (CNG 산출물 — 네이티브 모듈 변경 반영)'
  Remove-Item android -Recurse -Force
}
Write-Host ('== expo prebuild (android' + $(if ($CleanNative) { ', 재생성' } else { ', 기존 android/ 유지 — 서명 설정 보존' }) + ')')
npx expo prebuild --platform android --no-install
if ($LASTEXITCODE -ne 0) { throw 'prebuild 실패' }
$gradlePath = 'android/app/build.gradle'
$gradle = Get-Content $gradlePath -Raw
if ($gradle -notmatch 'idearepository-upload.jks') {
  # android/를 새로 만들면 템플릿 서명(debug만)으로 돌아온다 — docs/BUILD.md §2 블록을 주입한다 (2026-09-01)
  Write-Host '== release 서명 블록 없음 — docs/BUILD.md §2 블록 자동 주입'
  if ($gradle -notmatch "keyPassword 'android'") { throw 'build.gradle debug 서명 블록을 못 찾음 — 템플릿이 바뀐 듯. docs/BUILD.md §2 수동 복원' }
  $releaseCfg = @"

        // 업로드 키(Play App Signing) — credentials/는 커밋 금지, 백업 C:\private_key (tools/build-aab.ps1 자동 주입, docs/BUILD.md §2)
        release {
            storeFile file('../../credentials/idearepository-upload.jks')
            storePassword file('../../credentials/keystore.pass').text.trim()
            keyAlias 'upload'
            keyPassword file('../../credentials/keystore.pass').text.trim()
        }
"@
  # 'android' 비밀번호는 debug 블록에만 있어 1회 매치 — static Replace(입력, 패턴, 평가자)
  $gradle = [regex]::Replace($gradle, "(keyPassword 'android'\r?\n\s*\})", { param($m) $m.Groups[1].Value + $releaseCfg })
  $marker = 'signingConfig signingConfigs.debug'
  $last = $gradle.LastIndexOf($marker)   # buildTypes.release 쪽(마지막 등장)만 release로
  if ($last -lt 0) { throw 'buildTypes.release의 signingConfig를 못 찾음 — docs/BUILD.md §2 수동 복원' }
  $gradle = $gradle.Substring(0, $last) + 'signingConfig signingConfigs.release' + $gradle.Substring($last + $marker.Length)
  [System.IO.File]::WriteAllText((Resolve-Path $gradlePath), $gradle, (New-Object System.Text.UTF8Encoding $false))  # BOM 없이
  $gradle = Get-Content $gradlePath -Raw
}
if ($gradle -notmatch 'idearepository-upload.jks') { throw 'build.gradle release 서명 설정이 없음 — docs/BUILD.md §2 대로 복원' }
if ($gradle -notmatch 'signingConfig signingConfigs\.release') { throw 'buildTypes.release가 signingConfigs.release를 쓰지 않음 — docs/BUILD.md §2' }  # 2026-09-01 첫 실행: split Count 오판(-lt 3)으로 정상 주입을 실패 처리했던 것 수정

# R8 (docs/BUILD.md §2.5 · common/R8_OBFUSCATION.md, 2026-09-09 vc12부터)
# ① 게이트: expo-build-properties가 minify를 켰는지 — 플러그인이 빠지면 Play 난독화 경고가 조용히 되살아난다
$gprops = Get-Content 'android/gradle.properties' -Raw
if ($gprops -notmatch 'android\.enableMinifyInReleaseBuilds=true') { throw 'gradle.properties에 enableMinifyInReleaseBuilds=true 없음 — app.json expo-build-properties 플러그인 확인 (docs/BUILD.md §2.5)' }
if ($gprops -notmatch 'android\.enableShrinkResourcesInReleaseBuilds=true') { throw 'gradle.properties에 enableShrinkResourcesInReleaseBuilds=true 없음 — app.json expo-build-properties 플러그인 확인' }
if ((Get-Content 'android/app/proguard-rules.pro' -Raw) -notmatch 'expo\.modules') { throw 'proguard-rules.pro에 expo.modules keep 없음 — app.json extraProguardRules 확인' }
# ② optimize 전환: 플러그인이 못 하는 한 가지 — 기본 proguard-android.txt에는 -dontoptimize가 있다(My Word와 동일 구성)
if ($gradle -match 'proguard-android\.txt') {
  $gradle = $gradle.Replace('getDefaultProguardFile("proguard-android.txt")', 'getDefaultProguardFile("proguard-android-optimize.txt")')
  [System.IO.File]::WriteAllText((Resolve-Path $gradlePath), $gradle, (New-Object System.Text.UTF8Encoding $false))
  Write-Host '== R8: proguard-android.txt → proguard-android-optimize.txt 패치'
}

Write-Host '== gradlew bundleRelease'
Push-Location android
try { & .\gradlew bundleRelease --no-daemon -q; if ($LASTEXITCODE -ne 0) { throw 'gradle 실패' } }
finally { Pop-Location }

$out = "idearepository-vc$vc.aab"
Copy-Item android/app/build/outputs/bundle/release/app-release.aab $out -Force
Write-Host "== $out ($([math]::Round((Get-Item $out).Length/1MB,1)) MB)"
# R8 실동작 확인: mapping.txt가 있어야 난독화가 실제로 돌았다는 뜻(AAB에 자동 동봉 — 별도 업로드 없음)
if (-not (Test-Path 'android/app/build/outputs/mapping/release/mapping.txt')) { throw 'mapping.txt 없음 — R8이 안 돌았다 (docs/BUILD.md §2.5)' }
Write-Host ("== R8 mapping.txt {0:N1} MB" -f ((Get-Item 'android/app/build/outputs/mapping/release/mapping.txt').Length/1MB))

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $out))
$entry = $zip.GetEntry('base/manifest/AndroidManifest.xml')
$sr = New-Object System.IO.StreamReader($entry.Open()); $m = $sr.ReadToEnd(); $sr.Close(); $zip.Dispose()
foreach ($k in @($vn, 'READ_EXTERNAL_STORAGE', 'USE_BIOMETRIC', 'AD_ID', 'com.vivacegames.idearepository', 'expo-channel-name', 'EXPO_RUNTIME_VERSION', 'u.expo.dev')) {
  Write-Host ("   {0,-35} {1}" -f $k, $m.Contains($k))
}
Write-Host '== 기대: versionName true · READ_EXTERNAL_STORAGE false · USE_BIOMETRIC false · AD_ID true · expo-channel-name true · EXPO_RUNTIME_VERSION true · u.expo.dev true'
Write-Host '== (OTA 채널·런타임이 false면 올리지 않는다 — docs/OTA_SYSTEM.md §3 "게시 성공 ≠ 전달")'
Write-Host '== 다음: 업로드는 사용자 지시 후 docs/BUILD.md §3.5(eas submit). OTA 게시(eas update)도 사용자 지시 때만'
