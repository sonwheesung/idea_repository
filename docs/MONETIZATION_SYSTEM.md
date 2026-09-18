# MONETIZATION_SYSTEM — 광고 + Remove Ads

> 정책 요약은 [`../CLAUDE.md`](../CLAUDE.md) §7·§7.1, 여기는 상세. 2026-08-17 기획 확정 — ~~구현 0%~~ → 구현 현황표 참조(광고 ✅ · Remove Ads ⏸).
> LinkMemo `docs/MONETIZATION_SYSTEM.md`의 구현 규칙·함정을 승계한다.

## 구현 현황

| 영역 | 상태 | 비고 |
|---|---|---|
| ~~하단 배너 — 자리 플레이스홀더~~ | 🚫 | 실배너로 교체하며 삭제(2026-08-17) |
| 하단 배너 — 실제 AdMob(메인·상세) | ✅ | 2026-08-17 Phase 6 — `components/ad-banner.tsx`(ANCHORED_ADAPTIVE). 미수신·미초기화·구매자면 자리 미점유. dev는 테스트 단위 |
| App Open 광고(콜드 스타트 · 쿨타임 3시간) | ✅ | 2026-08-17 Phase 6 — `features/ads/app-open.ts`. 콜드 스타트만, 쿨타임 전엔 로드 안 함, 로드 8초 타임아웃 |
| UMP 동의 폼(EEA) | ✅ | 2026-08-17 Phase 6 — `features/ads/ads.ts`(requestInfoUpdate→REQUIRED면 showForm→**canRequestAds일 때만** init), `delayAppMeasurementInit`. 콘솔 GDPR 메시지 게시됨 |
| **UMP 개인정보 옵션 재진입**(설정 → Privacy options) | ✅ | 2026-08-17 법무 점검 — `privacyOptionsRequirementStatus === REQUIRED`(EEA·영국·스위스)일 때만 설정에 행 노출 → `AdsConsent.showPrivacyOptionsForm()`. Google EU 사용자 동의 정책(동의 재방문 수단) + 처리방침 §5·제9조 약속의 실체 |
| 광고 게이트 `adsEnabled()` | ✅ | 2026-08-17 — `features/ads/store.ts` 단일 출처. Phase 7에서 removeAds 연결 |
| AdMob 앱·광고단위 발급 + GDPR 메시지 | ✅ | 2026-08-17 브라우저 대행 — §3.1 |
| Remove Ads 구매(RevenueCat 익명) | ✅ 코드 · ⏳ 외부 | **2026-09-18 Phase 7 착수**(AdMob 정지 해제) — `features/purchase/{store,purchases}.ts` + 설정 두 행. ⏳ RC 프로젝트·키·Play 상품 등록 후 실구매(§4.1) |
| Restore Purchases | ✅ 코드 | 2026-09-18 — 설정 → 구매 복원. `restorePurchases()`(스토어 계정 이력 기준) |

---

## 1. 수익 모델 (기획서 §27~31)

**무료 + 광고**가 기본. 무료 사용자도 **모든 기능**을 쓴다 — 프로젝트·아이디어 정보·진행 관리·노트·자료·카테고리·태그·
검색·필터·정렬·다국어 전부 무제한.

| | 무료 | Remove Ads |
|---|---|---|
| 기능 | 전부 | 전부 (차이 없음) |
| 하단 배너 | O | X |
| 메인 화면 전면 | O | X |
| 가격 | 무료 | ~~₩1,500~~ → **₩3,300**(2026-08-17 형제 앱 통일) · 1회 구매 |
| 구독 | 없음 | 없음 |

```
FREE ── 모든 기능 + 배너 + 간헐적 전면 ──▶ Remove Ads ₩3,300 ──▶ 모든 기능 + 광고 없음
```

Remove Ads는 **기능 상품이 아니다** — 광고만 사라진다(기획서 §30). 구독 모델은 사용하지 않는다(§31).

---

### 1.1 백업은 무료 — Remove Ads에 묶지 않는다 (2026-08-21 사용자 결정)

로컬 백업(내보내기·가져오기, [`BACKUP_SYSTEM.md`](./BACKUP_SYSTEM.md))은 **무료 기능**이다. Remove Ads는 계속 "광고 없는 환경"만 판다(기둥 6·§7.1 "기능 해제 없음"). 근거와 재검토 조건(AdMob 영구 정지로 BM 재설계 시)은 CLAUDE §14 P.

## 2. 광고 지면

### 2.1 하단 배너 (기획서 §27.1)

- **메인 화면 최하단**(세이프에어리어 위) + **프로젝트 상세 하단**. 단일 화면 구조라 네비 바가 없다 —
  "네비를 가리지 않는다"는 "시스템 제스처 바를 가리지 않는다"로 승계.
- Phase 6 전까지는 같은 자리에 **점선 플레이스홀더**(높이 50, "Banner Ad")를 표시해 레이아웃을 미리 검증한다
  (2026-08-17 사용자 요청). App Open은 전면이라 상주 영역이 없다 — 플레이스홀더는 배너만.
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
  GDPR 메시지 설정이 선행. **동의 후 `canRequestAds`가 false면 SDK를 초기화하지 않는다**(광고 0 — 앱은 정상 동작).
  **동의 재방문**: `privacyOptionsRequirementStatus === REQUIRED`면 설정 화면에 "Privacy options" 행을 노출해
  `showPrivacyOptionsForm()`을 연다(Google 정책 요건 — 동의를 바꿀 수단 제공). 그 외 지역엔 행 자체가 없다.
- **개발 빌드는 Google 테스트 단위만.** `__DEV__` 분기 유지.
- ⚠ `react-native-google-mobile-ads`는 **16.0.0 고정**(조각·LinkMemo 실증: 16.4.0의 play-services-ads 25.4.0이
  Kotlin 2.3 컴파일 → Expo SDK 54의 2.1.20과 충돌). 올릴 때 pinned ads sdk의 Kotlin 버전 먼저 확인.
- 네이티브 모듈 → **Expo Go 불가, dev build로 개발.** `app.json`의 AdMob 앱 ID는 네이티브 매니페스트에 박힌다 —
  바꾸면 prebuild + 재빌드.
- 스토어 미출시 상태의 AdMob 앱은 "게재 제한"이 정상. 출시 후 스토어 연결 → 승인까지 실노출 0 — 코드 문제로 오해하지 않는다.

## 3.1 AdMob 계정 (2026-08-17 발급 — 브라우저 대행, LinkMemo 방식)

| 것 | 값 |
|---|---|
| AdMob 앱 (Android) | `ca-app-pub-2731473780180274~7371574153` — `app.json` config plugin에 들어간다(네이티브 매니페스트에 박힘 — 변경 시 prebuild 재빌드). 스토어 미등록 상태로 등록("아니요") |
| 배너 `하단 배너` | `ca-app-pub-2731473780180274/5348046046` |
| 앱 오프닝 `앱 시작 오프닝` | `ca-app-pub-2731473780180274/9239189595` |
| GDPR 메시지 | **"Idea Repository GDPR" 게시됨**(2026-08-17) — 동의 / 동의하지 않음(전 EEA 국가) / 옵션 관리 3버튼, 기본 언어 영어, 처리방침 URL `https://vivace-games.com/idearepository/privacy` 등록 |
| 미국 주 규정 메시지 | ⏸ 미생성 — LinkMemo도 미생성. CCPA "판매 안 함" 입장이라 선택 사항; 필요해지면 같은 화면에서 생성 |

- 개발 빌드는 여전히 **Google 테스트 단위**를 쓴다(`__DEV__` 분기) — 실단위로 개발하면 무효 트래픽으로 계정 정지 위험.
- 이 앱은 스토어 미출시라 "검토 필요 · 게재 제한" 상태가 정상. Play 출시 후 스토어 연결 → 승인까지 실노출 0.
- ⚠ 광고 단위 발급 후 게재 시작까지 최대 1시간(콘솔 안내).
- ~~⏸ **AdMob 계정 정지 중(2026-08-21 사용자 고지)**~~ → ✅ **정지 해제(2026-09-18** — 사장님 확인 "광고 활성화 됐어" + 같은 계정 `pub-2731473780180274` 배구명가 실기기 게재 검증. Phase 7 Remove Ads 착수). 정지 기간에도 광고 코드·지면(배너·App Open·UMP·`adsEnabled()` 게이트)은 **그대로 유지**했고, 광고 관련 후속 작업(스토어 연결·게재 확인·Phase 7 Remove Ads)은 **정지 해제 후 진행**(사용자 결정 "영역만 해놓고 정지 풀리면 진행"). 정지 중 실동작: 배너 미수신 → `onAdFailedToLoad` → 자리 미점유 · App Open 로드 실패 → 즉시 메인 진입 — 둘 다 기존 규칙(§7 "로드 실패가 앱 사용을 막지 않는다")대로라 코드 변경 없음. Play 데이터 보안 선언(광고 SDK 포함)은 SDK가 여전히 초기화되므로 그대로 참. 해제 후 할 일: AdMob 콘솔 앱-스토어 연결 → 실게재 확인 → Phase 7.

---

## 4. Remove Ads 상품

| 항목 | 값 |
|---|---|
| 유형 | **비소모성(non-consumable) 일회성** 인앱결제. 구독 아님 |
| 가격 | ~~₩1,500~~ → **₩3,300**(한국 — 2026-08-17 사용자 결정, 형제 앱 통일. Play 상품 등록 시 기본 가격 KRW 3,300, 나머지 국가는 Play 자동 환산). 글로벌은 스토어 국가별 가격 정책 — 앱 UI에 특정 통화 고정 금지, 스토어 가격 문자열 그대로 표시 |
| 로그인 | 불요 — Idea Repository 회원 시스템이 없다 |
| 효과 | 하단 배너 제거 + 메인 전면 제거. 기능 동일 |
| 흐름 | `Settings → Remove Ads → Store Purchase → Purchase Complete → Ads Removed` |
| 복원 | `Settings → Remove Ads → Restore Purchases → Store Purchase History → Restore` |

### 결제 경로 — RevenueCat 익명 모드 (LinkMemo 2026-08-14 판단 승계 — CLAUDE.md §14 B)

`react-native-purchases`, 익명 ID(`$RCAnonymousID`) 그대로 — `Purchases.logIn()`을 부르지 않는다(매칭할 subject가 없다).

근거(LinkMemo와 조건 동일):

- **비용 0**: RC 무료 구간 MTR $2.5k/월 — ₩3,300 일회성 기준 월 약 1,000건까지 무료.
- 영수증 검증·플랫폼 분기 직접 구현 회피 + 형제 앱(배구·조각·LinkMemo)과 운영 도구 통일 — `store-iap-setup` 스킬 재사용.
- **서버 개입 없음**: common_server 웹훅·엔타이틀먼트 미러를 쓰지 않는다. 진실은 스토어, 복원은 `restorePurchases()`.

구현 규칙:

- entitlement 키 `remove_ads` 하나. **구매 상태는 로컬 캐시 + 실행 시 재확인** — 오프라인·조회 실패에 캐시를 지우지 않는다.
  비소모성이라 만료 시각은 없다.
- **환불 시 회수**: RC entitlement가 비활성으로 돌아오면 캐시를 갱신한다(다음 온라인 확인 시점).
- 한국 규제(청약철회 고지 등)는 `payment-security-compliance` 스킬로 착수 전 점검.

### 4.1 구현 배선 (실제 값 — 2026-09-18 Phase 7 착수)

AdMob 정지 해제(§3.1, 2026-09-18)로 Phase 7에 착수했다. **코드는 LinkMemo `features/purchase/*`를 그대로 승계**(RevenueCat 익명, `store-iap-setup` 스킬과 동일 패턴).

| 것 | 값 |
|---|---|
| 패키지 | `react-native-purchases ^10.10.0`(LinkMemo ^10.8.1과 같은 10.x). **config plugin 불필요**(autolink) — `app.json` plugins 무변경. 네이티브 모듈이라 **다음 빌드부터 실동작**(vc13 이하엔 없음) |
| entitlement | `remove_ads`(코드 상수 `ENTITLEMENT`) |
| offering | `default`(current)의 첫 패키지 `availablePackages[0]` |
| 공개 키 | env `EXPO_PUBLIC_RC_ANDROID_KEY`(`goog_…` 공개값 — 번들에 박힘). 🔴 시크릿 `sk_…`는 앱에 넣지 않는다(서버 없음). 키가 비면 `purchasesAvailable()=false` → 결제 UI 자체를 숨긴다. ⚠ **이 프로젝트 `build-aab.ps1`은 `.env`/`.env.local`이 있으면 빌드를 거부**한다(common §5.5) → 키는 `.env` 파일이 아니라 **빌드 명령에 인라인**으로 준다: `NODE_ENV=production EXPO_PUBLIC_RC_ANDROID_KEY=goog_xxx powershell -File tools/build-aab.ps1 …`(BUILD §5 vc14 함정) |
| 로컬 캐시 | zustand persist 키 `idearepository.purchase`(`features/purchase/store.ts`) — 🔴 조회 실패에 지우지 않음 |
| 코드 | `features/purchase/purchases.ts`(configure·refreshEntitlement·getRemoveAdsPackage·purchaseRemoveAds·restorePurchases·applyOwned) · 게이트는 `features/ads/store.ts` `setRemoveAds` 한 곳 · 부팅은 `app/_layout.tsx`에서 `initPurchases()`를 **initAds보다 먼저**(구매자에게 광고 번쩍임 방지) |
| UI | 설정 → 광고 제거 / 구매 복원 두 `ListRow`(`purchasesAvailable()`일 때만 노출, 구매 완료면 "구매함"으로 잠금). i18n `purchase.*`(en·ko) |

**⏳ 실구매 전 남은 외부 작업**(사람·콘솔 — 코드로 못 채움):

1. ~~**RevenueCat 프로젝트/앱** 생성~~ → ✅ **2026-09-18 브라우저로 생성**: RC 프로젝트 "Idea Repository"(`c31935bf`, React Native) + Play Store 앱 config(`app1a6df7a99e`, package `com.vivacegames.idearepository`) + Android 공개 SDK 키 발급 완료(LinkMemo `228eec90`와 별개). ⏳ 남은 RC 작업: **서비스 계정 자격증명(JSON) 업로드는 사용자 몫**(RC↔Google 검증·developer notifications 연결 — 자격증명이라 세션이 안 함) · entitlement `remove_ads` 생성·상품 attach + offering `default` 패키지 추가는 아래 2가 된 뒤.
2. ~~**Play 상품 등록**~~ → ✅ **2026-09-18 생성·활성**: 제품 ID `remove_ads`(비소모성 일회성 "구입") · 구매 옵션 `remove-ads` · 이름/설명 en(Remove Ads)+ko(광고 제거) · 기본가 **KRW 3,300** → 173개국 자동 환산 · 상태 활성. ⚠ **순서 함정 실측**: 처음엔 "결제 권한을 APK에 추가해야 합니다"로 막혔고, **vc14(BILLING) 내부 테스트 게시**(BUILD §5) 후 메뉴가 열려 등록 성공. ⏳ 남은 것: RC로 상품 import → entitlement `remove_ads` attach → offering `default` 추가(서비스계정 JSON 업로드 후).
3. **법무** — RevenueCat(미국)이 구매·영수증 데이터를 받는다 → 처리방침·Play 데이터 보안에 "구매 내역" 반영(사용자 확인 후 게시) · 약관 §3 "제공되는 버전에 한함" 확인(PLAN 남은 작업 로드맵).
4. **AAB 빌드 + 샌드박스 검증** — 네이티브 모듈이라 새 빌드 필요. 실기기 샌드박스 구매·복원·환불 회수 E2E는 위 1·2 완료 후 테스트 ID로만.

---

## 5. 스토어 포지셔닝 (기획서 §35)

- 핵심 문구: **Your ideas. Your device. Yours to build.** / **Capture your ideas. Keep them private. Build what matters.**
- 정직한 보안 문구: *Your ideas are stored locally on your device and are not uploaded to our servers.* — 절대 보장 표현 금지(CLAUDE.md §6).
- ⚠ 스토어 데이터 보안 선언은 **실제 트래픽 기준**(광고 SDK 수집 항목 포함). 출시 직전 `play-store-launch-checklist` 스킬로 점검.
