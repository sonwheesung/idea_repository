---
name: emulator-test
description: Drive an Expo/React Native app on a real Android emulator end-to-end ("에뮬레이터 테스트", "에뮬로 띄워서 테스트", "화면 직접 보면서 터치 테스트", "run an emulator cycle", "E2E on emulator"). Claude boots the AVD, builds/installs the dev app, then SEES screens via screencap→Read and TAPS by coordinate — catching real-device render/transition/touch bugs that unit/component tests can't. Runs user-defined parameterized scenarios ("cycles") with mandatory preconditions. Use when the user wants visual/touch verification of a flow on device; for unit/component regression use the project's test runner instead.
---

# Emulator Test — see-and-tap E2E on Android (generic)

Claude가 안드로이드 에뮬레이터로 앱을 **실제 띄우고, 스크린샷으로 보고, 좌표로 탭**해 사용자 정의 시나리오(사이클)를 끝까지 돈다. 단위·컴포넌트 테스트가 못 보는 **실기기 렌더·전이·터치**를 사람 눈으로 잡는다(테스트 PASS인데 실기기 버그 = 거짓 확신).

> 프로젝트 고유값(AVD 이름·앱 패키지·docs 경로)은 **플레이스홀더 `<…>`** 로 둔다. 프로젝트별 구체 버전은 그 레포의 `.claude/skills/emulator-test`에 둔다([feedback_claude_assets_common_sync]).

## 진행 규율 (불변)

```
사이클 실행 → 오류 발견 시 → 즉시 수정 → 다시 시연(클린할 때까지) → 애매한 사항은 마지막에 한꺼번에 질문
```

- **오류**(크래시·렌더 깨짐·터치 무반응·잘못된 텍스트/수치)는 도중에 고치고 재시연. 고침은 등재·사각 분석·형제 사냥(grep 전수)까지 = 완료.
- **애매한 사항**(취향·문구·밸런스 의문)은 건드리지 말고 메모, 오류 다 고친 뒤 모아서 질문.
- **계정 안전**: 인증 테스트는 **더미/QA 계정만** — 사용자 실계정·실비밀번호 입력 금지.

## 0. 사전조건 확인

> 🔴 **에뮬레이터 정책 정본은 `C:\project\common\EMULATOR_POOL.md`** — 값이 아니라 문서를 따른다.
> ~~공용 2대(common_1·common_2) 클레임~~ → **2026-09-08부터 프로젝트별 AVD + 외장 D: 저장**.
> 이 프로젝트의 AVD = `idea_repository` · **포트 5572**(포트 정본: `common/DEV_ALLOCATION.md` §3).

```bash
ADB="$LOCALAPPDATA/Android/Sdk/platform-tools/adb.exe"      # Windows. macOS/Linux: ~/Library/Android/sdk · ~/Android/Sdk
EMU="$LOCALAPPDATA/Android/Sdk/emulator/emulator.exe"
SER=emulator-5572          # 🔴 Idea Repository 배정 — 모든 adb 명령에 -s "$SER". 안 붙이면 붙어 있는 아무 기기(사용자 폰 포함)로 간다
"$ADB" devices             # $SER 가 이미 떠 있으면 부팅 스킵. 다른 serial 은 남의 것 — 절대 건드리지 않는다
"$EMU" -list-avds          # AVD 없으면 EMULATOR_POOL §1 절차로 생성(🔴 ANDROID_AVD_HOME='D:\emulators\idea_repository' 필수 — 빼먹으면 C:에 생긴다)
```

## 1. 부팅 + 빌드·설치

```bash
"$EMU" -avd idea_repository -port 5572 -no-snapshot -no-snapshot-save -no-boot-anim -gpu auto &
"$ADB" -s "$SER" wait-for-device
until [ "$("$ADB" -s "$SER" shell getprop sys.boot_completed | tr -d '\r')" = 1 ]; do sleep 5; done
# Expo 앱 빌드+설치(첫회 수십 분). JDK·ANDROID_HOME 환경 맞춰서:
JAVA_HOME="<jdk-path>" ANDROID_HOME="$LOCALAPPDATA/Android/Sdk" npx expo run:android
# dev-client 런처면 Metro 서버 행 탭 / dev 메뉴 Continue.
```

- ⚠ **외장 D: 는 콜드 부팅 ~259초(내장의 7.8배)** — 실패가 아니라 느린 것이다(EMULATOR_POOL §0). 조용히 기다린다.
- 이미 설치돼 있으면 재빌드 말고 `"$ADB" -s "$SER" shell monkey -p com.vivacegames.idearepository 1`로 앱만 재실행.
- ⚠ Expo 프로젝트면 `metro.config.js` blockList로 `.test/.spec` 파일을 번들에서 제외해야 require.context가 테스트 파일을 끌어와 깨지지 않는다.

## 2. 보고-판단-탭 루프 (핵심)

한 동작 = 한 확인. 화면 안 보고 연속 탭 금지.

```bash
"$ADB" -s "$SER" exec-out screencap -p > shot.png
```
→ **Read(shot.png)** → 다음 동작 판단 → 탭 → 다시 screencap.

### ⚠ 좌표 환산 (가장 자주 틀림)

- screencap PNG는 기기 네이티브 해상도(예 1080×W). Read로 열면 harness가 축소 표시하고 **"× N.NN" 배율 안내**를 붙인다.
- **내가 본 좌표 × (안내 배율) = 기기 좌표.** `adb shell input tap` 은 **기기 좌표**를 받는다 → 항상 본 좌표에 그 배율을 곱해 탭한다(안 곱하면 빗나감).

```bash
"$ADB" -s "$SER" shell input tap <devX> <devY>            # 기기 좌표(= 본 좌표 × 배율)
"$ADB" -s "$SER" shell input text "hello"
"$ADB" -s "$SER" shell input swipe <x1> <y1> <x2> <y2> 300
"$ADB" -s "$SER" shell input keyevent 4                   # 뒤로
```

### 빗나가면 — uiautomator bounds

RN 텍스트 노드는 안 잡혀도 **버튼 bounds는 잡힌다**.

```bash
MSYS_NO_PATHCONV=1 "$ADB" -s "$SER" shell uiautomator dump /sdcard/ui.xml   # Git Bash: 프리픽스 필수(/sdcard 경로 망가짐 방지)
MSYS_NO_PATHCONV=1 "$ADB" -s "$SER" shell cat /sdcard/ui.xml > ui.xml
# bounds="[x1,y1][x2,y2]" 중심 = ((x1+x2)/2,(y1+y2)/2) 로 탭(이미 기기 좌표 — 배율 곱 X)
```

## 3. 관찰 포인트

- **표시 텍스트**: placeholder 날것(`{name}`)·조사/복수형 깨짐·잘못된 이름을 스크린샷에서 눈으로 — 이게 see-and-tap의 고유 가치(엔진 sim은 key로만 해소해 표시 텍스트를 못 본다).
- **진행 게이트·자동 넘김**: 멈춤 지점이 곧 확인 포인트.
- **dev 전용 화면**: 빌드 환경 플래그(`__DEV__`/`EXPO_PUBLIC_APP_ENV` 류)로 노출되는 디버그/시뮬 화면 확인.

## 4. 끝나면

- **결과 기록**: 사이클·날짜·사전조건·PASS/오류·애매(질문대기). 핵심 스크린샷만 보관.
- 오류 고쳤으면 프로젝트 엣지케이스 레지스트리에 등재 + 형제 사냥 + 영향 계층 테스트.
- 종료 판단(EMULATOR_POOL §0 — ~~"점유하니 끝나면 끈다"~~ → 2026-09-08 기준이 부팅 비용으로 바뀜):
  **곧 화면을 또 볼 작업이 남았으면 끄지 말고 켜 둔다**(외장 콜드 부팅 ~4분 — Metro만 재시작).
  정말 끝났을 때만 `"$ADB" -s "$SER" emu avd name`으로 **내 AVD인지 확인 후** `"$ADB" -s "$SER" emu kill`.
  🔴 `-s` 없는 `emu kill`은 붙어 있는 아무 기기를 끈다.

## 사이클 사전조건 — 필수 기입 7항목

재현 가능해야 테스트다. 케이스마다 빠짐없이: ① 빌드/환경 ② 계정 상태(신규/기존) ③ 과금/권한 상태 ④ 보유 자원(인벤토리) ⑤ 도메인 상태(진행도·날짜·엔티티 구성) ⑥ **선행 화면**(직전에 있던 화면) ⑦ **선행 동작**(무엇을 해서 여기 왔나). 그 뒤 절차·기대·관찰 포인트.

> 같은 화면이라도 *어떤 경로로 왔는가*가 상태를 가른다(게이트·캐시·세션). ⑥⑦을 생략하면 버그가 재현 안 된다.
