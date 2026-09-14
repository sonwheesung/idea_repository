# UI_GUIDE — 공통 컴포넌트 · 표면 · 간격 · 타이포 규약

> 화면을 그릴 때 따르는 **수치 규약**. 색은 [`THEME_SYSTEM.md`](./THEME_SYSTEM.md) 토큰만 쓰고, 폼 규약(Select·TextField)은
> [`../CLAUDE.md`](../CLAUDE.md) §14 M. 작성 2026-08-23 — 사용자 지적 "설정 화면 카드 규격이 일정하지 않다(부제가 있는 행과 없는 행)"에서
> 출발해 앱 전체의 행·카드·다이얼로그를 한 번에 맞췄다(§14 Q). `docs/README.md`가 ❌로 두었던 문서.

## 구현 현황

| 영역 | 상태 |
|---|---|
| `components/list-row.tsx` — `ListRow`(탐색 행) · `ListGroup`(묶음 카드) | ✅ 2026-08-23 — 설정 · 발상 도구 목록 · About 링크 |
| `components/edit-row.tsx` — `EditRow`(관리 목록 행: 이름·부제·연필·휴지통) | ✅ 2026-08-23 — 카테고리 관리 · 단어 관리 |
| `components/dialog.tsx` — `Dialog`(가운데 다이얼로그 껍데기) | ✅ 2026-08-23 — 카테고리 이름/삭제 · 단어 · 자료 다이얼로그 3벌 통합 |
| `components/badge.tsx` · `components/progress-bar.tsx` | ✅ 2026-08-23 — 카드·상세에 중복돼 있던 Badge·진행 바 추출 |
| 반경·간격·타이포 스케일(§2~§4) 적용 | ✅ 2026-08-23 — 설정 행 10→14 · 발상 행 12→14 · 백업 안내 ad-hoc 박스 → `Card` |
| 에뮬레이터 육안 확인(설정 · 발상 도구 · About · 카테고리 · 상세) | ✅ 2026-08-23 — 아래 §7 |
| 입력 필드 배경 `searchBar` → `card`(테두리형) · 카테고리 추가 헤더 ＋ | ✅ 2026-08-27 — 사용자 지적 "회색이라 비활성/입력 불가처럼 보인다"(§2 정정) |

---

## 1. 원칙

1. **한 목록 안의 행은 전부 같은 규격이다.** 부제(설명)가 있는 행과 없는 행을 섞지 않는다 — 목록 단위로 *전부 있거나 전부 없거나*.
   설정 화면은 **전부 있음**(현재 값 또는 한 줄 힌트). 그래도 높이는 `minHeight`로 고정해 내용이 비어도 줄지 않는다.
2. **같은 역할은 같은 컴포넌트.** 화면마다 `Pressable` + `StyleSheet`로 행을 다시 그리지 않는다(2026-08-23 전까지 설정·발상 도구·About이 세 벌이었다).
3. **반경은 역할별 3단계만**(§2). 한 화면에서 같은 역할에 다른 반경을 쓰지 않는다.
4. **색은 토큰만.** 리터럴 색상 금지(THEME_SYSTEM). 눌림은 `opacity 0.85`, 비활성은 `0.4`.
5. 레퍼런스(`common/.claude/skills/ui-design-reference`) — 2026-08-23 시도: Material 3 Lists spec · Apple HIG Lists 페이지는 JS 렌더링이라
   본문을 못 받았다(**못 봤다고 적는다**). Flutter `ListTile` 문서에서 확인한 것: leading/trailing 시각 크기 ≤ 40(비-dense), 탭 영역 ≥ 48.
   M3 두 줄 행 72dp·한 줄 56dp·가로 16dp는 **기억값**(페이지 미확인) — 행 `minHeight 72`의 근거로만 쓴다.

## 2. 표면(surface) · 반경

| 역할 | 반경 | 배경/테두리 토큰 | 컴포넌트 |
|---|---|---|---|
| **컨테이너** — 카드·탐색 행·다이얼로그·옵션 시트·테마 타일·질문 카드 | **14** | `card` / `border` 1px(다이얼로그·시트는 hairline) | `Card` · `ListRow` · `Dialog` · `OptionSheet` · `QuestionCard` |
| **컨트롤** — 버튼·검색바 | **12** | `button` / `searchBar` | `Button` · 홈 검색바 |
| **입력·내부 박스** — TextField·Select·DateField·TagInput·행 아이콘 박스·카드 안 보조 박스(답변·주의) | **10** | 입력 4종 = ~~`searchBar`~~ → **`card` / `border` 1px**(2026-08-27 — 회색 채움이 비활성 필드로 읽혔다. 라이트 테마에서 흰 바탕 + 테두리, 다크 테마는 card=searchBar라 변화 없음) · 행 아이콘 박스는 `searchBar` 유지 · 내부 박스는 `surface` + hairline | `TextField` · `Select` · `DateField` · `TagInput` · `ListRow` icon box |
| 알약(배지·태그 칩) | 999 | `badge` / `primary` | `Badge` · `TagInput` 칩 |
| 하단 시트(필터) | 상단 18 | `card` | `FilterSheet` — 예외(화면 가장자리에 붙는 시트) |

- 카드 테두리는 **1px + 진한 `border`**(2026-08-17 사용자 지적 "너무 희미하다") — hairline은 다이얼로그·시트·내부 박스에만.
- **회색 채움(`searchBar`)은 홈 검색바·단어 검색·행 아이콘 박스 같은 "컨트롤"에만** — 사용자가 글을 쓰는 입력 필드는 채우지 않는다(2026-08-27). 채운 입력은 Android 관습상 비활성으로 읽힌다.
- 2026-08-23 정정: 설정 행 ~~10~~ → 14, 발상 도구 행 ~~12~~ → 14, 질문 카드·조합 결과 ~~12~~ → 14, 백업 안내 ~~ad-hoc 10~~ → `Card`.

## 3. 간격

| 곳 | 값 |
|---|---|
| 화면 안쪽 여백 | 16 |
| 목록의 행/카드 사이 | **12**(설정 ~~18~~ → 12, 홈·발상 도구와 동일). 공지·문의 카드 10은 유지(본문 카드) |
| 카드·행 안쪽 패딩 | 14 (다이얼로그 20, 질문 카드 16) |
| 행 안 요소 사이 | 12 (아이콘 ↔ 글 ↔ 꼬리) |
| 폼 필드 사이 | 14~16 |

## 4. 타이포 (크기/굵기)

| 역할 | 값 |
|---|---|
| 화면 제목(홈) | 22/700 · 상세 프로젝트명 24/700 |
| 행 제목 · 카드 제목 | **16/600**(설정 ~~16/400~~·카테고리 ~~16/500~~ → 통일) · 프로젝트 카드 이름 17/600 |
| 본문 | 15, lineHeight 22 |
| 행 설명(부제) | **13**, 한 줄(`numberOfLines 1`), `textMuted`(설정·발상·카테고리 ~~12~~ → 13) |
| 캡션(날짜·개수) | 12 |
| 섹션 라벨 | 12/600 uppercase letterSpacing 0.4 |
| 다이얼로그 제목 | 17/600 |
| 버튼 | 16/600 |

## 5. 컴포넌트

### 5.1 `ListRow` — 탐색 행 (설정 · 발상 도구 · About 링크)

```
┌────────────────────────────────────────────┐  minHeight 72 · padding 14 · radius 14
│ [icon 40]  제목 16/600            ●  ›      │  icon box: 40×40 radius 10 searchBar 배경, primary 아이콘
│            설명 13 muted (1줄)               │  trailing: chevron(기본) · external(open-outline) · none
└────────────────────────────────────────────┘  badge: 제목 옆 8px 점(primary)
```

- `variant="card"`(기본) = 독립 카드(`card`/`border` 1px). `variant="flat"` = `ListGroup` 안에서 테두리 없이, 구분선은 그룹이 그린다.
- `description`은 **목록 단위로 전부 주거나 전부 비운다**(§1-1). 설정: 테마·언어 = 현재 값, 카테고리 = 개수, 백업 = 마지막 내보내기,
  공지 = 안 읽음 N / 없음, 문의 = 힌트, 개인정보 옵션 = 힌트, 정보 = 버전. 발상 도구 = 한 줄 설명. About 링크 = 없음(전부).
- 아이콘도 목록 단위로 전부/전무. 설정(2026-08-23 추가)·발상 도구·About 링크 전부 있음.

### 5.2 `ListGroup` — 행 묶음 카드

`Card`(padding 0) 안에 `flat` 행을 세로로 쌓고 사이에 hairline 구분선. About 링크가 쓴다.

### 5.3 `EditRow` — 관리 목록 행 (카테고리 · 단어)

이름 16/600 · 부제 13(선택 — 카테고리는 "N개 프로젝트", 단어는 없음) · 연필 · 휴지통(danger). **추가는 두 화면 모두 헤더 우상단 ＋ 아이콘**(단어 2026-08-20 · 카테고리 2026-08-27 — ~~목록 끝 "+ 추가" 행~~ 제거). `paddingVertical 12 · minHeight 56`,
카드 없이 hairline 구분선(`marginLeft 16`). 연필·휴지통은 `hitSlop 8` + padding 8(탭 영역 ≥ 36+16).

### 5.4 `Dialog` — 가운데 다이얼로그

`Modal(transparent, fade)` → `KeyboardAvoidingView` → 배경(0.4 검정, 탭 = 취소) → 카드(radius 14 · hairline · padding 20 · gap 14)
→ 제목 17/600 → children → 액션 행(취소 ghost + 확인 primary, 각 `flex 1`, gap 10). 카테고리 이름/삭제 · 단어 · 자료가 같은 껍데기.
`confirmLabel`·`confirmDisabled`·`onConfirm` props. 라디오 목록 등 본문은 children.

### 5.5 `Badge` · `ProgressBar`

- `Badge(label, accent?)` — 알약 999, 12/500. 기본 `badge`/`badgeText`, accent = `primary`/`buttonText`(우선순위).
- `ProgressBar(value, height=6)` — `progressTrack`/`progressFill`, 상세는 `height 8`.

### 5.6 기존 유지

`Screen`(세이프에어리어·키보드) · `Card` · `Button` · `TextField` · `Select` · `DateField` · `TagInput` · `OptionSheet` · `FilterSheet` ·
`QuestionCard` · `WordPicker` · `StepDots` · `ProjectCard` · `AdBanner` · `PrivacyOverview` · `WelcomeSheet` · `BootGate`.

- `OptionSheet` 옵션과 `Select` 현재 값 행은 선택적 **색 점(`swatch`, 지름 14)**을 가질 수 있다(2026-09-14 카드 색상 — CLAUDE §14 W). 점 색만 예외적으로 옵션이 든 hex를 그대로 쓴다. 그 hex의 출처는 `theme/palettes.ts`여야 한다(§6 색 리터럴 금지는 유지).

## 6. 하지 말 것

- 화면 파일 안에서 행/다이얼로그를 `Pressable`+`StyleSheet`로 새로 그리기 → `components/`에 올린다(README §4 "공통 UI는 components/에만").
- 한 목록에서 부제 유무·아이콘 유무 섞기.
- 반경 3단계 밖의 값(8·11·16 등) 새로 만들기.
- 색 리터럴, hairline 카드 테두리.

## 7. 에뮬레이터 확인 기록

- 2026-08-23 (AVD `volleyball`(이미 떠 있던 에뮬레이터), 디버그 APK `android/app/build/outputs/apk/debug/app-debug.apk` 2026-08-21 14:40 빌드를
  `adb install -r`로 재설치 + Metro 8087, 콜드 번들 1793모듈): 설정(행 7개 같은 높이 72 · 아이콘 · 부제 · 공지 배지 점 "1 unread") · 발상 도구 목록 ·
  About(링크 그룹 4행 + 외부 링크 아이콘 · 판매자 정보) · 카테고리 관리(EditRow + 삭제 Dialog 라디오) · 단어 관리(EditRow, 부제 없음) · 백업(`Card` 안내) ·
  홈 카드·상세(Badge·ProgressBar) — `idearepository://<route>` 딥링크로 화면 진입, 스크린샷 육안. Metro 신규 경고 0.
  ⚠ 함정: 에뮬레이터에 남아 있던 구 디버그 APK(백업 네이티브 모듈 없음)로는 `Cannot find native module 'ExpoSharing'` — 디버그 APK도 네이티브 모듈 추가 뒤엔
  재설치가 먼저다. 같은 에뮬레이터를 형제 프로젝트 세션이 동시에 쓰고 있었다(조각·LinkMemo 전면 전환·ANR 다이얼로그) — 스크린샷이 섞이면 `topResumedActivity`로 확인.
  JS만 바뀐 변경이라 AAB 재빌드는 불필요했지만, 비공개 테스트 반영은 **다음 AAB(vc7)** 로만(OTA 금지 — CLAUDE §16).
- 2026-08-27 (전용 AVD `idea_repository` · `emulator-5572` 첫 사용, 디버그 APK 8/21 빌드 재설치 + Metro **8090**, 번들 1794모듈): 필터 시트 Select 3개·새 프로젝트 폼(이름·Add details 펼침: Select·태그·다중행 4개) — 흰 바탕 + `border` 1px로 바뀜 ·
  설정(테마 "Light Minimal" 단독 · 언어 "English") · 언어 시트 = English/한국어 2항목 · 테마 그리드 = 12종(시스템 항목 없음, Current · Light Minimal) · 카테고리 헤더 ＋ → "Add category" 다이얼로그(목록 끝 추가 행 없음).
  ⚠ 함정: 새 AVD에서 `debug_http_host=10.0.2.2:8090`은 Metro에 요청이 아예 안 닿았다(원인 미확인 — 방화벽 추정) → **`adb -s <serial> reverse tcp:8090 tcp:8090` + 프리퍼런스 `localhost:8090`**으로 해결(DEV_ALLOCATION §3 "에뮬레이터는 adb reverse"와 일치). `expo start --clear`는 형제 Metro와 공유하는 `%TEMP%\metro-cache`를 지우다 ENOTEMPTY로 죽는다 — 동시 실행 중엔 `--clear` 금지.
