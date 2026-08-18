# 로컬 AAB 빌드 — EAS 안 씀 (docs/BUILD.md).
# 사용: powershell -ExecutionPolicy Bypass -File tools/build-aab.ps1 [-VersionCode 3] [-VersionName 1.0.2]
#  1) app.json version/versionCode 갱신(인자 주면) → 2) expo prebuild --platform android → 3) gradlew bundleRelease
#  4) 산출물 → 루트 idearepository-vc{N}.aab → 5) 매니페스트 문자열 점검(versionName·권한)
# 서명: android/app/build.gradle release가 credentials/idearepository-upload.jks + credentials/keystore.pass를 읽는다.
#      새 키스토어를 만들지 말 것 — Play App Signing 업로드 키와 달라지면 AAB가 거부된다.
param(
  [int]$VersionCode = 0,
  [string]$VersionName = ''
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not (Test-Path 'credentials/idearepository-upload.jks') -or -not (Test-Path 'credentials/keystore.pass')) {
  Write-Error 'credentials/idearepository-upload.jks 또는 keystore.pass 없음 — 백업 C:\private_key 에서 복원'
}
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

Write-Host '== expo prebuild (android, 기존 android/ 유지 — 서명 설정 보존)'
npx expo prebuild --platform android --no-install
if ($LASTEXITCODE -ne 0) { throw 'prebuild 실패' }
$gradle = Get-Content android/app/build.gradle -Raw
if ($gradle -notmatch 'idearepository-upload.jks') { throw 'build.gradle release 서명 설정이 사라짐 — docs/BUILD.md §2 대로 복원' }

Write-Host '== gradlew bundleRelease'
Push-Location android
try { & .\gradlew bundleRelease --no-daemon -q; if ($LASTEXITCODE -ne 0) { throw 'gradle 실패' } }
finally { Pop-Location }

$out = "idearepository-vc$vc.aab"
Copy-Item android/app/build/outputs/bundle/release/app-release.aab $out -Force
Write-Host "== $out ($([math]::Round((Get-Item $out).Length/1MB,1)) MB)"

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $out))
$entry = $zip.GetEntry('base/manifest/AndroidManifest.xml')
$sr = New-Object System.IO.StreamReader($entry.Open()); $m = $sr.ReadToEnd(); $sr.Close(); $zip.Dispose()
foreach ($k in @($vn, 'READ_EXTERNAL_STORAGE', 'USE_BIOMETRIC', 'AD_ID', 'com.vivacegames.idearepository')) {
  Write-Host ("   {0,-35} {1}" -f $k, $m.Contains($k))
}
Write-Host '== 기대: versionName true · READ_EXTERNAL_STORAGE false · USE_BIOMETRIC false · AD_ID true'
Write-Host '== 다음: Play 콘솔 → 테스트 및 출시 → 비공개 테스트 Alpha → 새 버전 만들기 → 위 파일 드롭 (OTA 금지, AAB만)'
