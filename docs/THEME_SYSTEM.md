# THEME_SYSTEM — 테마 12종 (~~+ 시스템 자동~~ 2026-08-27 제거)

> 정책은 [`../CLAUDE.md`](../CLAUDE.md) §14 #6(정정). 2026-08-17 사용자 시안으로 확정 — LinkMemo `docs/THEME_SYSTEM.md` 승계.
> **전부 무료.** 유료 테마·커스텀 테마는 MVP 밖.

## 구현 현황

| 영역 | 상태 |
|---|---|
| 테마 토큰 구조(`theme/palettes.ts` — 17토큰 + isDark + cardAccents?) | ✅ 2026-08-17 |
| 12종 팔레트(시안 추출 근사값) | ✅ 2026-08-17 — 실기기 대조 조정 여지 |
| 선택 UX(Settings → Theme, 토큰 미니어처 그리드 ~~+ "시스템" 항목~~) | ✅ 2026-08-17 — 시스템 항목 2026-08-27 제거 |
| 선택 로컬 저장(zustand persist) — 깨진 저장값은 ~~system~~ Light Minimal 폴백, 구 `'system'` 저장값은 그 순간 OS 스킴이 보여 주던 테마로 고정 | ✅ 2026-08-17 · 마이그레이션 2026-08-27 |
| 상태바·스택 헤더 토큰 연동 | ✅ |
| 그라데이션 미니멀(#11)의 헤더 그라데이션 | ⏸ 단색 근사(핑크 틴트) — `expo-linear-gradient` 도입 여부는 실기기 보고 결정 |

## 결정 이력

- ~~라이트/다크 2종 · 시스템 따르기 + 수동~~(2026-08-17 오전, CLAUDE.md §14 #6) →
  **12종 팔레트 + "시스템(자동)" 항목**(2026-08-17 오후, 사용자 시안 제공 "다양하게 만들어줘").
  시스템 자동은 유지한다 — `system`이면 OS 라이트/다크에 따라 **Light Minimal / Dark Minimal**로 매핑.
  LinkMemo가 시스템 자동을 뺀 이유("다크모드인데 Warm Beige면?")는 12종 중 하나를 고른 상태에선 자동 전환을 안 하는 것으로 해소된다 —
  자동은 오직 `system` 선택일 때만.
- ~~**12종 + "시스템(자동)"**~~ → **12종만, 시스템(자동) 항목 제거**(2026-08-27 사용자 지시 "테마, 언어에 시스템(자동)을 제거 — 바로 매핑").
  `ThemeSetting = ThemeId`, 기본 `lightMinimal`. 구 `'system'` 저장값은 `Appearance.getColorScheme()`으로 그 순간 보이던
  Light/Dark Minimal에 고정(사용자 화면이 갑자기 안 바뀌게). `useResolvedThemeId`는 설정값을 그대로 돌려준다(이름은 호출처 호환용).
  근거: 자동 전환이 없으면 "OS 다크인데 Warm Beige" 류 모순이 원천 소멸 — LinkMemo가 자동을 뺀 이유와 같다. 언어도 같은 날 같은 결정(I18N_SYSTEM §1).
- **카드 테두리는 1px + 눈에 띄는 border 토큰**(2026-08-17 사용자 지적 "너무 희미하다") — hairline·#E5E7EB에서 상향.

---

## 1. 테마 목록 (시안 정본: [`design/theme-mockups-12.png`](./design/theme-mockups-12.png), 2026-08-17 사용자 제공)

시안이 보여주는 홈 구조(상단 제목·검색·＋ / 상태 칩 / 카드: 아이콘·이름·요약·상태·진행률·우선순위 / 하단 네비)는
**팔레트·톤 기준으로만** 쓴다. ⚠ 하단 네비 4탭은 우리 정본(단일 화면, 헤더 버튼)이 아니다 — 시안 표기일 뿐.

| id | 이름 | 시안 라벨 | 방향 |
|---|---|---|---|
| `lightMinimal` | Light Minimal | 라이트 미니멀 | 화이트 + 블루 포인트. **기본(system의 라이트)** |
| `darkMinimal` | Dark Minimal | 다크 미니멀 | 블랙 + 인디고 포인트. **system의 다크** |
| `softPurple` | Soft Purple | 소프트 퍼플 | 연보라 배경 + 퍼플 포인트 |
| `mintClean` | Mint Clean | 민트 클린 | 화이트/연민트 + 그린 포인트 |
| `oceanBlue` | Ocean Blue | 오션 블루 | 연하늘 배경 + 블루 포인트 |
| `warmBeige` | Warm Beige | 웜 베이지 | 크림/베이지 + 오렌지브라운 포인트 |
| `monotone` | Monotone | 모노톤 | 화이트 무채색, 포인트 블랙 |
| `lightGlass` | Light Glass | 라이트 글래스 | 블루그레이 배경 + 반투명 느낌 카드 + 블루 포인트 |
| `natureLight` | Nature Light | 네이처 라이트 | 연그린 틴트 + 그린 포인트 |
| `simpleNavy` | Simple Navy | 심플 네이비 | 딥 네이비 + 블루 포인트 (다크) |
| `gradientMinimal` | Gradient Minimal | 그라데이션 미니멀 | 핑크→블루 상단 그라데이션 + 핑크 포인트 (MVP는 핑크 틴트 단색 근사) |
| `colorPoint` | Color Point | 컬러 포인트 | 화이트 + 카드마다 다른 포인트 컬러(`cardAccents` 순환 — 카드 왼쪽 컬러 바) |

---

## 2. 토큰 (하나의 디자인 세트)

`background · surface · card · searchBar · primary · text · textMuted · icon · button · buttonText · border ·
badge · badgeText · danger · progressTrack · progressFill` + `isDark`(상태바·헤더 파생) + `cardAccents?`(컬러 포인트 전용, 선택).

- **팔레트 객체 하나 추가 = 테마 하나 추가.** 컴포넌트는 색상 리터럴 금지, 토큰만 참조.
- 정확한 hex는 `theme/palettes.ts`가 정본 — 시안 추출 근사값으로 시작, 실기기 대조로 조정.
- 상태바·헤더는 `isDark`에서 파생(darkMinimal·simpleNavy는 라이트 콘텐츠).
- 광고 배너 영역은 테마를 모른다 — `surface` 배경 + 경계선으로 흡수(Phase 6 확인).

## 3. 선택 UX

```
Settings → Theme (현재: Light Minimal)

~~[ System (auto) ]~~                    ← 2026-08-27 제거(결정 이력)
┌──────────┐ ┌──────────┐
│ Preview  │ │ Preview  │ …            ← 토큰으로 그린 홈 미니어처(제목·검색·칩·카드 2장·배너 자리)
│ Light    │ │ Dark     │
│ Minimal  │ │ Minimal  │
└──────────┘ └──────────┘
```

- 미리보기는 이미지가 아니라 **토큰으로 그린 미니어처** — 팔레트를 추가하면 미리보기도 따라온다.
- 선택 즉시 적용 + 로컬 저장(재시작 후 유지). 이름은 i18n(`theme.names.*`).
