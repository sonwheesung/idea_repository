# MONETIZATION_SYSTEM — 광고 + Remove Ads

> 정책 요약은 [`../CLAUDE.md`](../CLAUDE.md) §7·§7.1, 여기는 상세. 2026-08-17 기획 확정 — 구현 0%.
> LinkMemo `docs/MONETIZATION_SYSTEM.md`의 구현 규칙·함정을 승계한다.

## 구현 현황

| 영역 | 상태 | 비고 |
|---|---|---|
| 하단 배너 — 메인·상세 | ❌ | 작성/편집 화면 없음 |
| App Open 광고(콜드 스타트 · 쿨타임 3시간) | ❌ | 2026-08-17 확정 |
| UMP 동의 폼(EEA) | ❌ | 글로벌 출시 전제 |
| 광고 게이트 `adsEnabled()` | ❌ | 단일 출처 |
| AdMob 앱·광고단위 발급 | ❌ | 사용자 콘솔 작업(또는 브라우저 대행) |
| Remove Ads 구매(RevenueCat 익명) | ❌ | |
| Restore Purchases | ❌ | |

---

## 1. 수익 모델 (기획서 §27~31)

**무료 + 광고**가 기본. 무료 사용자도 **모든 기능**을 쓴다 — 프로젝트·아이디어 정보·진행 관리·노트·자료·카테고리·태그·
검색·필터·정렬·다국어 전부 무제한.

| | 무료 | Remove Ads |
|---|---|---|
| 기능 | 전부 | 전부 (차이 없음) |
| 하단 배너 | O | X |
| 메인 화면 전면 | O | X |
| 가격 | 무료 | **₩1,500** · 1회 구매 |
| 구독 | 없음 | 없음 |

```
FREE ── 모든 기능 + 배너 + 간헐적 전면 ──▶ Remove Ads ₩1,500 ──▶ 모든 기능 + 광고 없음
```

Remove Ads는 **기능 상품이 아니다** — 광고만 사라진다(기획서 §30). 구독 모델은 사용하지 않는다(§31).

---

## 2. 광고 지면

### 2.1 하단 배너 (기획서 §27.1)

- **메인 화면 최하단**(세이프에어리어 위) + **프로젝트 상세 하단**. 단일 화면 구조라 네비 바가 없다 —
  "네비를 가리지 않는다"는 "시스템 제스처 바를 가리지 않는다"로 승계.
- **작성/편집·노트 입력·자료 입력·카테고리 관리 화면에는 배너 없음**(2026-08-17 위임 판단 H) — 기획서 원칙
  "작성 화면에서는 광고를 최소화한다 · 입력 영역을 가리지 않는다 · 상세 내용을 방해하지 않는다"의 가장 단순한 이행.
  키보드가 올라오는 화면에서 배너가 겹치는 문제도 함께 사라진다.
- 화면의 주요 콘텐츠보다 눈에 띄지 않게 — ANCHORED_ADAPTIVE 배너, 강조 테두리 없음.

```
│  Project Cards          │
├─────────────────────────┤
│      Banner Ad          │   ← 미수신 시 이 줄 자체가 없다
└─────────────────────────┘
```

### 2.2 메인 화면 간헐적 전면 (기획서 §28) — ✅ App Open · 쿨타임 3시간 (2026-08-17 확정)

기획서가 정한 것: **메인 화면 방문 → 노출 조건 확인 → 조건 충족 시 광고.** 매 실행·매 프로젝트 열기마다 X.
작성·편집 중 X. **빈도 제한 필수.**

확정(2026-08-17 사용자 승인): **A. App Open 포맷, 콜드 스타트 1회, 쿨타임 3시간.** 포그라운드 복귀 노출 없음.

```
Cold start → last shown ≥ 3h ago? → load & show App Open Ad : continue to Main
```

| 안 | 트리거 | 정책 | 장단 |
|---|---|---|---|
| **A. App Open — ✅ 확정** | 콜드 스타트 1회, **쿨타임 3시간** | 앱 실행 지점 전용 포맷 — 안전 | LinkMemo `features/ads/app-open.ts` 그대로 재사용. 작성 흐름 방해 0. 노출 빈도는 낮다 |
| B. Interstitial — 🚫 | 상세/편집 → 메인 **복귀** 시, 쿨타임 + 최소 전환 횟수 | 화면 전환 사이 노출은 허용. **앱 시작·종료 시는 위반** | 노출 기회는 많지만 "프로젝트를 열 때 광고 X"(기획서 §28) 취지와 마찰 — 열고 닫는 게 이 앱의 기본 동선 |

- 어느 안이든 **AdMob 정책 근거**: *"Do not place interstitial ads on app load"*(Disallowed interstitial implementations —
  LinkMemo 2026-08-14 웹 확인). 앱 시작에 전면을 띄우려면 App Open만 가능하다.
- 어느 안이든 **금지 순간**(§2.3)이 우선한다.
- App Open 로드 유효기간(4시간)과 쿨타임(3시간) 조합상 **쿨타임이 지난 실행에서만 로드**한다(미리 로드 후 만료 낭비 회피).
  로드 타임아웃 8초 — 시작을 붙잡지 않는다(LinkMemo 승계).

### 2.3 전면형 광고를 띄우지 않는 순간 (기둥 5 — 기획 확정)

프로젝트 작성 중 · 편집 중 · 아이디어 노트 작성 중 · 관련 자료 입력 중 · 삭제 확인 중 · 카테고리 관리 중.

AdMob 정책 근거(조각 §7에서 확인): *"Placing interstitial ads so that they suddenly appear when a user is focused
on a task at hand (e.g. filling out a form, reading content) may lead to accidental clicks."*

---

## 3. 구현 규칙 (LinkMemo·조각 승계)

- 광고 게이트는 `adsEnabled()` **한 곳** — 구매 여부·개발 분기·초기화 실패를 전부 여기서 판정.
- SDK 초기화·로드 실패가 앱 사용을 막지 않는다. 배너 미수신 시 자리를 차지하지 않는다(빈 띠 금지).
- 전면형은 쿨타임을 먼저 판정하고, 통과한 경우에만 로드한다 — 캡에 걸려 있으면 로드조차 안 한다.
- **EEA·영국·스위스 포함 출시 — UMP 동의 폼**: `AdsConsent.requestInfoUpdate()` → 필요 시 `showForm()`을
  **첫 광고 요청 전에**. `app.json`에 `delay_app_measurement_init: true`. AdMob 콘솔 Privacy & messaging에서
  GDPR 메시지 설정이 선행.
- **개발 빌드는 Google 테스트 단위만.** `__DEV__` 분기 유지.
- ⚠ `react-native-google-mobile-ads`는 **16.0.0 고정**(조각·LinkMemo 실증: 16.4.0의 play-services-ads 25.4.0이
  Kotlin 2.3 컴파일 → Expo SDK 54의 2.1.20과 충돌). 올릴 때 pinned ads sdk의 Kotlin 버전 먼저 확인.
- 네이티브 모듈 → **Expo Go 불가, dev build로 개발.** `app.json`의 AdMob 앱 ID는 네이티브 매니페스트에 박힌다 —
  바꾸면 prebuild + 재빌드.
- 스토어 미출시 상태의 AdMob 앱은 "게재 제한"이 정상. 출시 후 스토어 연결 → 승인까지 실노출 0 — 코드 문제로 오해하지 않는다.

## 3.1 AdMob 계정 (미발급)

| 것 | 값 |
|---|---|
| AdMob 앱 (Android) | ❌ 미발급 — 발급 후 여기 기록. LinkMemo는 `ca-app-pub-2731473780180274~…` 같은 퍼블리셔 계정 |
| 배너 단위 | ❌ |
| App Open 단위 | ❌ |
| GDPR 메시지 | ❌ |

- 처리방침 URL이 AdMob 앱 설정에 들어간다 — LinkMemo는 배구 서버 Vercel 정적 페이지(`vivace-games.com/linkmemo/privacy`)로
  게시했다. 같은 방식이면 `vivace-games.com/idearepository/privacy` 류. Play 데이터 보안 선언과 1:1 일치시킬 것.

---

## 4. Remove Ads 상품

| 항목 | 값 |
|---|---|
| 유형 | **비소모성(non-consumable) 일회성** 인앱결제. 구독 아님 |
| 가격 | **₩1,500**(한국). 글로벌은 스토어 국가별 가격 정책 — 앱 UI에 특정 통화 고정 금지, 스토어 가격 문자열 그대로 표시 |
| 로그인 | 불요 — Idea Repository 회원 시스템이 없다 |
| 효과 | 하단 배너 제거 + 메인 전면 제거. 기능 동일 |
| 흐름 | `Settings → Remove Ads → Store Purchase → Purchase Complete → Ads Removed` |
| 복원 | `Settings → Remove Ads → Restore Purchases → Store Purchase History → Restore` |

### 결제 경로 — RevenueCat 익명 모드 (LinkMemo 2026-08-14 판단 승계 — CLAUDE.md §14 B)

`react-native-purchases`, 익명 ID(`$RCAnonymousID`) 그대로 — `Purchases.logIn()`을 부르지 않는다(매칭할 subject가 없다).

근거(LinkMemo와 조건 동일):

- **비용 0**: RC 무료 구간 MTR $2.5k/월 — ₩1,500 일회성 기준 월 약 2,000건까지 무료.
- 영수증 검증·플랫폼 분기 직접 구현 회피 + 형제 앱(배구·조각·LinkMemo)과 운영 도구 통일 — `store-iap-setup` 스킬 재사용.
- **서버 개입 없음**: common_server 웹훅·엔타이틀먼트 미러를 쓰지 않는다. 진실은 스토어, 복원은 `restorePurchases()`.

구현 규칙:

- entitlement 키 `remove_ads` 하나. **구매 상태는 로컬 캐시 + 실행 시 재확인** — 오프라인·조회 실패에 캐시를 지우지 않는다.
  비소모성이라 만료 시각은 없다.
- **환불 시 회수**: RC entitlement가 비활성으로 돌아오면 캐시를 갱신한다(다음 온라인 확인 시점).
- 한국 규제(청약철회 고지 등)는 `payment-security-compliance` 스킬로 착수 전 점검.

---

## 5. 스토어 포지셔닝 (기획서 §35)

- 핵심 문구: **Your ideas. Your device. Yours to build.** / **Capture your ideas. Keep them private. Build what matters.**
- 정직한 보안 문구: *Your ideas are stored locally on your device and are not uploaded to our servers.* — 절대 보장 표현 금지(CLAUDE.md §6).
- ⚠ 스토어 데이터 보안 선언은 **실제 트래픽 기준**(광고 SDK 수집 항목 포함). 출시 직전 `play-store-launch-checklist` 스킬로 점검.
