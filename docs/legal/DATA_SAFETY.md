# DATA_SAFETY — Google Play 데이터 보안 양식 · Apple 앱 개인정보 라벨 답안

> Play 콘솔 "앱 콘텐츠 → 데이터 보안"과 App Store Connect "앱 개인정보 보호"에 그대로 옮겨 적기 위한 답안.
> **처리방침(`PRIVACY.en.md`·`PRIVACY.ko.md`) ⇄ 이 양식 ⇄ 실제 트래픽이 1:1**이어야 한다(CLAUDE.md §6 정직한 표현 규칙,
> `play-store-launch-checklist` §1.4 "SDK 자동 수집분 전수 신고"). SDK를 추가·제거하면 세 곳을 같이 고친다.
> 작성일 2026-08-17 — 상태 **초안(❌ 미제출)**. LinkMemo 2026-08-14 선언(광고 ID·대략 위치·앱 상호작용·기기 ID = 수집/공유(광고),
> 문의 본문 = 선택 수집)을 기준으로 Idea Repository 실태에 맞춰 작성했다.

---

## 0. 전제 — 실제로 기기 밖으로 나가는 것

| 경로 | 데이터 | 우리 서버 저장? |
|---|---|---|
| AdMob SDK(Google) | 광고 ID, IP 기반 대략적 위치, 광고 상호작용, 기기·진단 정보 | ❌ Google이 수집·보유 |
| 문의하기(선택, 이용자 발신) | 문의 본문·유형, platform, appVersion, 기기 UUID(SecureStore 무작위) | ✅ common_server(Supabase 서울) 3년 |
| 부팅 조회(bootstrap) | app_code, platform, appVersion | ❌ 응답 후 폐기(저장 없음) |
| Remove Ads(선택) | 스토어 결제 → RevenueCat 영수증 검증(익명 ID·구매 이력) | ❌ RC·스토어가 보유. 서버 웹훅 없음 |
| 프로젝트·노트·자료·카테고리·태그·설정 | — | **전송 자체가 없다**(로컬 SQLite/AsyncStorage) |

⚠ 부팅 조회의 platform·appVersion은 Play 데이터 유형 목록에 해당 항목이 없고 저장하지 않으므로 선언하지 않는다(LinkMemo 동일).
IP는 문의 레이트리밋에 일시 사용 후 폐기 — Play 기준 "일시적 처리"로 선언 제외.

---

## 1. Google Play 데이터 보안 — 개요 답안

| 질문 | 답 |
|---|---|
| 앱에서 필수 사용자 데이터 유형을 수집하거나 공유하나요? | **예** |
| 앱에서 수집한 모든 사용자 데이터는 전송 중에 암호화되나요? | **예**(HTTPS 전용) |
| 사용자가 데이터 삭제를 요청할 방법을 제공하나요? | **예** — support@vivace-games.com(문의 기록). 계정이 없으므로 "계정 삭제 URL"은 해당 없음 |
| 독립적인 보안 검토(MASA)를 받았나요? | 아니요 |
| 데이터 보안 관행 페이지 URL(처리방침) | `https://vivace-games.com/idearepository/privacy` (❌ 미게시 — 게시 후 기입) |

## 2. Google Play 데이터 보안 — 데이터 유형별 답안

| 카테고리 › 데이터 유형 | 수집 | 공유 | 목적 | 필수/선택 | 임시 처리 | 삭제 요청 | 근거·처리방침 §  |
|---|---|---|---|---|---|---|---|
| **위치 › 대략적인 위치** | 예 | 예 | 광고 또는 마케팅 | 필수(광고 SDK 자동) | 아니요 | 아니요(Google 보유) | AdMob — EN §3.a / KO 제2조 3항·제9조 |
| **앱 활동 › 앱 상호작용** | 예 | 예 | 광고 또는 마케팅 · 분석 | 필수(광고 SDK 자동) | 아니요 | 아니요 | AdMob — EN §3.a / KO 제9조 |
| **앱 활동 › 기타 사용자 제작 콘텐츠** | 예 | 아니요 | 앱 기능(고객 지원) | **선택**(문의를 보낼 때만) | 아니요 | **예**(이메일 요청) | 문의 본문·유형 — EN §3.b / KO 제2조 2항 |
| **앱 정보 및 성능 › 진단** | 예 | 예 | 분석 · 사기 방지·보안 | 필수(광고 SDK 자동) | 아니요 | 아니요 | AdMob 기기·진단 정보 — EN §3.a / KO 제9조. ⚠ AdMob 공식 표(§5 링크)에서 "비정상 종료 로그" 별도 신고 여부 재확인 |
| **기기 또는 기타 ID › 기기 또는 기타 ID** | 예 | 예 | 광고 또는 마케팅 · 분석 · 사기 방지 · 앱 기능 | 필수(광고 ID는 자동; 문의 UUID·RC 익명 ID는 선택 기능이지만 유형 단위 답은 "필수") | 아니요 | **예**(문의 UUID·RC 고객 레코드는 삭제 가능. 광고 ID는 기기에서 재설정) | 광고 ID(AdMob) + 문의 UUID + RC 익명 ID — EN §3.a·b·d / KO 제2조·제9조 |
| **금융 정보 › 구매 내역** | 예 | 아니요 | 앱 기능(구매 제공·복원) | 선택(구매자만) | 아니요 | 예(RC 고객 삭제 요청) | RevenueCat — EN §3.d / KO 제2조 3항. ⚠ RC 공식 disclosure 문서와 대조 후 확정 |

**선언하지 않는 유형(수집 없음 — 이유를 남긴다)**: 개인 정보(이름·이메일·ID·주소·전화 — 수집 안 함) · 정확한 위치 · 메시지 ·
사진/동영상 · 오디오 · 파일/문서 · 캘린더 · 연락처 · 건강 · 검색 기록(검색은 로컬 SQLite 안에서만) · 설치된 앱 · 웹 탐색 기록
(관련 자료 URL은 로컬 저장·OS 브라우저 열기만) · 비정상 종료 로그(⚠ AdMob 표 확인 후 필요 시 추가).

**"공유" 판정 기준**: Play는 서비스 제공자(우리 지시로만 처리)에게 넘기는 것을 "공유"로 보지 않는다 → Supabase·Vercel·Discord·
RevenueCat = 공유 아님. AdMob은 Google이 자체 목적(광고)으로 쓰므로 **공유 = 예**.

## 3. Apple App Privacy(개인정보 처리방침 라벨) 매핑 — iOS 출시 시

| Apple 데이터 유형 | 수집 | 사용자와 연결(Linked) | 추적(Tracking) | 목적 | 출처 |
|---|---|---|---|---|---|
| Identifiers › Device ID | 예 | 아니요 | **예**(맞춤 광고 시) | Third-Party Advertising, App Functionality | AdMob 광고 ID / 문의 UUID / RC 익명 ID |
| Location › Coarse Location | 예 | 아니요 | 예 | Third-Party Advertising | AdMob(IP 기반) |
| Usage Data › Advertising Data | 예 | 아니요 | 예 | Third-Party Advertising | AdMob |
| Usage Data › Product Interaction | 예 | 아니요 | 예 | Third-Party Advertising, Analytics | AdMob |
| Diagnostics › Other Diagnostic Data | 예 | 아니요 | 아니요 | Analytics | AdMob |
| Purchases › Purchase History | 예 | 아니요 | 아니요 | App Functionality | RevenueCat |
| User Content › Other User Content | 예 | 아니요 | 아니요 | App Functionality(고객 지원) | 문의 본문 |

- "Tracking = 예"이면 iOS에서 **ATT(App Tracking Transparency) 권한 요청**이 필수 — UMP와 함께 첫 광고 요청 전에 띄운다.
  ATT 거부 시 AdMob은 비맞춤 광고로 동작(추적 아님). iOS는 Phase 8 이후이므로 라벨 제출 시 AdMob·RC의 그 시점 공식 표를 재확인.
- "Linked to user" — 계정이 없고 이름·이메일도 없으므로 전 항목 아니요.

## 4. 처리방침 ⇄ 양식 대조표 (변경 시 체크리스트)

| 항목 | PRIVACY.en | PRIVACY.ko | Play 양식 | 실제 코드(예정) |
|---|---|---|---|---|
| AdMob 4종(광고 ID·대략 위치·앱 상호작용·진단) 수집·공유 | §3.a, §4 | 제2조 3항·제7조·제9조 | 위치·앱 활동·진단·기기 ID | `features/ads/*` (Phase 6) |
| 문의 본문·유형·platform·appVersion·UUID, 3년 | §3.b, §5 | 제2조 2항·제3조·제4조 | 기타 사용자 제작 콘텐츠·기기 ID(선택·삭제 가능) | `lib/common-server/` `sendInquiry` (Phase 5) |
| 부팅 조회 = 미저장 | §3.c | 제2조 2항·제3조 | 선언 없음 | `fetchBootstrap` (Phase 5) |
| RC 익명 ID·구매 이력 | §3.d, §4 | 제2조 3항·제6조·제7조 | 구매 내역·기기 ID | `features/purchase/*` (Phase 7) |
| 이용자 콘텐츠 = 로컬 전용 | §2 | 제2조 1항 | 선언 없음 | expo-sqlite / AsyncStorage |
| 삭제 요청 경로 = 이메일 | §5, §9 | 제8조·제11조 | 개요 "삭제 요청 방법 제공 = 예" | — |

## 5. 출처 (제출 전 최신본 재확인)

- AdMob Play 데이터 공개 매핑: https://developers.google.com/admob/android/privacy/play-data-disclosure
- AdMob iOS App Privacy: https://developers.google.com/admob/ios/data-disclosure
- RevenueCat Data Safety / App Privacy 안내: https://www.revenuecat.com/docs (Google Play Data Safety · Apple App Privacy 항목)
- Play 데이터 보안 정책: https://support.google.com/googleplay/android-developer/answer/10787469

## 6. 미결·주의

- ⚠ **비정상 종료 로그** 신고 여부 — AdMob 공식 표 기준으로 제출 직전 확정(2026-08-17 초안은 "진단"만).
- ⚠ **기기 ID 유형의 삭제 요청 답** — 광고 ID(불가)와 문의 UUID(가능)가 한 유형에 섞인다. 초안은 "예"(우리가 보유한 것은 삭제 가능). 사람 확인.
- ⚠ RC 도입 시 RC 공식 disclosure와 대조. RC를 쓰지 않기로 바뀌면 "구매 내역" 행 삭제.
- 병합 매니페스트에서 `com.google.android.gms.permission.AD_ID` 자동 추가 확인 후 "광고 ID" 선언(콘솔의 별도 "광고 ID" 질문 = 예).
