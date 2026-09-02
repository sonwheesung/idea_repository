# LEGAL_SYSTEM — 개인정보처리방침 · 이용약관 · 데이터 보안 선언

> 정책 원칙은 [`../CLAUDE.md`](../CLAUDE.md) §4(회원 없음)·§6(데이터 저장·정직한 표현 규칙)·§7·§7.1(광고·Remove Ads)·§10(서버 경계),
> 실제 트래픽은 [`ARCHITECTURE.md`](./ARCHITECTURE.md)·[`MONETIZATION_SYSTEM.md`](./MONETIZATION_SYSTEM.md). 여기는 **이용자 대면 법률 문서**의
> 정본 위치·정합 규칙·게시 절차. 2026-08-17 초안 작성 → 같은 날 **처리방침·약관 게시 완료**(변호사 미검토 초안 상태로 게시 — 검토 후 갱신). LinkMemo(배구 서버 정적 페이지 게시, 2026-08-14)의 방식을 승계한다.
> ⚠ 이 문서와 `docs/legal/*`는 **변호사 검토를 거치지 않은 초안**이다. 스토어 제출 전 사람이 읽고 확정한다.

## 구현 현황

| 항목 | 상태 | 비고 |
|---|---|---|
| 개인정보처리방침 EN 정본 `docs/legal/PRIVACY.en.md` | ✅ 초안 작성 | 2026-08-17. GDPR·CCPA·PIPA 권리 절 포함 |
| 개인정보처리방침 KO 정본 `docs/legal/PRIVACY.ko.md` | ✅ 초안 작성 | 2026-08-17. PIPA §30 항목(목적·항목·기간·파기·위탁·국외이전·권리·자동수집·안전조치·보호책임자·구제·변경) |
| 이용약관 EN `docs/legal/TERMS.en.md` | ✅ 초안 작성 | 2026-08-17 |
| 이용약관·운영·환불 정책 KO `docs/legal/TERMS.ko.md` | ✅ 초안 작성 | 2026-08-17. 전자상거래법 판매자 정보·청약철회 제한 고지·종료 30일 고지 |
| Play 데이터 보안·Apple 라벨 답안 `docs/legal/DATA_SAFETY.md` | ✅ | 2026-08-17. **Play 콘솔 제출 완료**(§2 그대로 — 구매 내역 행은 Phase 7 RC 도입 시 추가) |
| 게시용 페이지 `docs/legal/pages/idearepository/{privacy,terms}/page.tsx` | ✅ | 2026-08-17. 배구 레포 `server/app/idearepository/…`로 복사·커밋(볼리볼 `3eb8929` → 2차 `6297b52`) — **정본은 이 레포의 docs/legal**, 수정 시 재복사·재배포 |
| **2차 글로벌 점검(2026-08-17)** | ✅ | 아래 §8. md 4종·page.tsx 2종·앱 코드(UMP 개인정보 옵션·웰컴 문구) 동시 갱신, 재배포 |
| **3·4차 타 앱 벤치마크(2026-08-17)** | ✅ | 아래 §9. 처리방침 rev.3 · 약관 4차 재배포 |
| **처리방침 EN rev.5 · KO 5차(2026-09-01)** — 기기 식별자 첫 실행 생성 + 활성 사용자 통계 | ✅ 정본·page.tsx 개정 | 2026-09-01 시행. 근거 [`ARCHITECTURE.md`](./ARCHITECTURE.md) §5.5. Data Safety 양식 변경 없음. 게시·공지는 아래 게시 기록 |
| **처리방침 EN rev.6 · KO 6차(2026-09-01 → 2026-09-02 확장)** — Expo EAS Update(OTA) 수탁·국외 이전·수집 항목 + **웜 스타트 하트비트 전송 시점**("앱 실행 시 1회" → "실행 시 + 앱으로 돌아올 때", SDK 2026-09-02) | ✅ 정본·page.tsx 개정 · ⏳ **미게시** | 시행 2026-09-02(게시일에 맞춰 재설정). 근거 [`OTA_SYSTEM.md`](./OTA_SYSTEM.md) §8 · [`ARCHITECTURE.md`](./ARCHITECTURE.md) §5.7. **게시(`vercel --prod`)는 사용자 확인 후 · vc11 업로드 전 필수**(vc11이 첫 OTA 가능 빌드 = Expo 통신 시작 + 하트비트 시작). Data Safety 양식 변경 없음(기기 ID 기선언·항목 불변) — §7 #15 |
| 처리방침 실게시 `https://vivace-games.com/idearepository/privacy` | ✅ 게시 | 2026-08-17 — HTTP 200 실측 |
| 약관 실게시 `https://vivace-games.com/idearepository/terms` | ✅ 게시 | 2026-08-17 — HTTP 200 실측 |
| 앱 내 노출(설정 → About: 처리방침·약관 링크·사업자 정보) | ✅ | 2026-08-17 `app/about.tsx` · `lib/links.ts`(URL·사업자 값 상수) · i18n `about.*`. 링크는 게시 전까지 404 |
| Play 데이터 보안 양식 제출 | ✅ | 2026-08-17 — 미리보기 확인 후 저장. 광고 ID 선언 예(분석·광고·사기방지). ⏳ Phase 7에서 "금융 정보 › 구매 내역" 추가 |
| Apple 앱 개인정보 라벨 · ATT | ⏸ | iOS 출시 시 |
| 변호사 검토 | ❌ | 사람 결정 |

✅ 초안 작성 = 파일이 있음 / ❌ 미게시 = URL 없음 / ⏸ 보류

---

## 1. 문서 목록과 정본 위치

| 문서 | 정본(레포) | 게시 형태 | 게시 URL(예정) | 언어 |
|---|---|---|---|---|
| 개인정보처리방침 | `docs/legal/PRIVACY.en.md` + `PRIVACY.ko.md` | 배구 서버 `server/app/idearepository/privacy/page.tsx`(정적) | `https://vivace-games.com/idearepository/privacy` | EN 정본 + KO 병기 |
| 이용약관·운영·환불 정책 | `docs/legal/TERMS.ko.md` + `TERMS.en.md` | 배구 서버 `server/app/idearepository/terms/page.tsx`(정적) | `https://vivace-games.com/idearepository/terms` | KO 정본 + EN 병기 |
| Play 데이터 보안 · Apple 라벨 답안 | `docs/legal/DATA_SAFETY.md` | 콘솔 입력(게시 문서 아님) | — | KO(작업용) |
| 게시 페이지 소스 | `docs/legal/pages/idearepository/{privacy,terms}/page.tsx` | 배구 레포로 복사 후 배포 | 위 두 URL | — |

- **KO 처리방침은 EN의 번역이 아니다** — 「개인정보 보호법」 제30조 형식(조 단위)으로 별도 작성. EN은 GDPR Art. 13·CCPA 공개 항목 중심.
  두 문서의 **사실(수집 항목·목적·기간·수탁자)은 동일**해야 하며 형식만 다르다.
- 약관은 KO가 정본(전자상거래법 판매자 정보·청약철회 제한 고지·종료 고지가 한국법 요건), EN은 같은 내용의 소비자 대면 요약.
- 사업자 값(상호·대표자·사업자등록번호·주소·통신판매업 신고번호·연락처·보호책임자)의 **단일 출처는 `C:\project\common\BUSINESS_INFO.md`**.
  그 파일은 커밋하지 않고 값만 옮겨 적는다. 값이 바뀌면 배구 `/privacy`·`/terms`·LinkMemo `/linkmemo/privacy`와 **함께** 고친다.

## 2. 정합 규칙 — 처리방침 ⇄ Data Safety ⇄ 실제 트래픽 1:1

CLAUDE.md §6 "정직한 표현 규칙"의 실행 규칙. **세 곳이 같은 사실을 말해야 한다.**

```
실제 트래픽(코드)  ⇄  PRIVACY.en/ko (+ page.tsx)  ⇄  DATA_SAFETY.md (+ Play 콘솔·Apple 라벨)
```

| 사실 | 코드 위치(예정) | 처리방침 | Data Safety |
|---|---|---|---|
| AdMob: 광고 ID·대략 위치·앱 상호작용·진단 → Google 수집·공유 | `features/ads/*` (Phase 6) | EN §3.a·§4 / KO 제2조 3항·제7조·제9조 | 위치·앱 활동·진단·기기 ID = 수집/공유(광고) |
| 문의: 본문·유형·platform·appVersion·UUID → common_server, 3년 | `lib/common-server/` `sendInquiry`·`registerDevice` (Phase 5) | EN §3.b·§5 / KO 제2조 2항·제3조·제4조·제8조 | 기타 사용자 제작 콘텐츠·기기 ID = 선택 수집·삭제 가능 |
| bootstrap: app_code·platform·appVersion, 미저장 | `fetchBootstrap` (Phase 5) | EN §3.c / KO 제2조 2항 | 선언 없음 |
| **기기 식별자 첫 실행 등록 + 부팅 세션 → 활성 일자 400일**(2026-09-01, 서비스 이용 통계) + **포그라운드 복귀 하트비트**(2026-09-02, 쿨다운 5분 — 같은 활성 일자 1행, 새 항목 없음, 1.0.10~) | `features/support/store.ts` `fetchOnce` → `ensureDeviceSession` ∥ `fetchBootstrap` · `components/boot-gate.tsx` AppState → `heartbeat()`(SDK 2026-09-02, ARCHITECTURE §5.7) | EN §3.b·c·§4·§5 / KO 제1·2·3·6·7·8조 | 기기 ID(기선언 — 변경 없음) |
| Remove Ads: 스토어 결제 + RC 익명 ID·구매 이력 | `features/purchase/*` (Phase 7) | EN §3.d·§4 / KO 제2조 3항·제6조·제7조 | 구매 내역·기기 ID |
| **OTA 업데이트 확인: 기기 OS·런타임 버전·플랫폼·채널·무작위 토큰 → Expo(미국)**(2026-09-01, 1.0.10~) | `expo-updates` 네이티브 · `app.json` `updates`(OTA_SYSTEM §3) | EN §3.e·§4 / KO 제1·2조 3항·3·6·7조 | 기기 ID(기선언 — 변경 없음, DATA_SAFETY §0 ⚠) |
| 프로젝트·노트·자료·카테고리·태그·설정 = 로컬 전용 | expo-sqlite·AsyncStorage | EN §2 / KO 제2조 1항 | 선언 없음 |

- 허용 문구: *"Your ideas are stored locally on your device and are not uploaded to our servers."*
  금지 문구: "절대 유출되지 않는다" · "아무 데이터도 나가지 않는다"(AdMob 때문에 거짓).
- **SDK를 추가·제거하거나 서버로 보내는 필드가 바뀌면** 같은 커밋(또는 먼저)에서 PRIVACY 두 개·page.tsx·DATA_SAFETY를 고친다.
  체크리스트는 [`legal/DATA_SAFETY.md`](./legal/DATA_SAFETY.md) §4.
- 제출 직전 `play-store-launch-checklist` §1.4(SDK 자동 수집분 전수 신고 · 병합 매니페스트 `AD_ID`)와 AdMob·RC 공식 disclosure 표를 재확인한다
  (DOC_DISCIPLINE §6 — 기억으로 단정 금지).

## 3. 앱 내 노출 지점 (Phase 8)

| 화면 | 노출 | 비고 |
|---|---|---|
| 설정 → About(정보) | 개인정보처리방침 링크 · 이용약관 링크 · 앱 버전 · **사업자 정보**(상호·대표자·사업자등록번호·통신판매업 신고번호·주소·이메일) | 링크는 `Linking.openURL`로 게시 URL. 사업자 정보는 전자상거래법 표시 의무 — 약관 제15조와 같은 값 |
| 설정 → Remove Ads | 구매 버튼 옆/아래에 **청약철회 제한 고지 한 줄**("결제 즉시 적용되며 제공 개시 후 청약철회가 제한될 수 있습니다 — 환불은 스토어 정책") + 약관 링크 | 전자상거래법 제17조 제2항 사전 고지 요건. i18n 키 `purchase.notice.*` |
| 설정 → 문의하기 | "앱 삭제·기기 변경 시 답변 확인이 불가"(CLAUDE.md §4) + 처리방침 링크 | 이미 §4에 고지 결정 |
| 홈 빈 화면·설정 | 데이터 손실 안내(`data.notice.*`) | ✅ 홈은 구현됨(2026-08-17) |
| UMP 동의 폼(EEA·영국·스위스) | AdMob 콘솔 GDPR 메시지에 처리방침 URL 등록 | Phase 6 — URL이 먼저 있어야 한다 |
| Play 콘솔 | 스토어 등록정보 처리방침 URL · 데이터 보안 양식 · 광고 ID 선언 · 한국 개발자 추가 정보(사업자번호·통신판매업 신고번호) | LinkMemo 2026-08-14 선례 |

## 4. 갱신 절차

1. 사실이 바뀐다(SDK·서버 필드·수탁자·보유기간·사업자 값). → **먼저** `docs/legal/PRIVACY.en.md`·`PRIVACY.ko.md`(또는 `TERMS.*`)를 고친다.
2. `DATA_SAFETY.md` §2·§3 표와 §4 대조표를 같이 고친다.
3. `docs/legal/pages/idearepository/*/page.tsx`를 .md와 맞춘다(시행일·최종 수정일 갱신, 개정 이력 1줄 추가).
4. 시행 전 고지: 처리방침 7일(중대 30일)·약관 7일(불리 30일) 전 앱 공지(common_server 공지) + 게시 URL.
   **발행 방법(2026-08-23 확정)**: common_server `POST /api/admin/announcements`(Bearer `ADMIN_TOKEN` — `common_server/.env.local`을
   `node --env-file`로 주입, 값은 출력·복사·대화 기재 금지. 로컬 토큰 = 프로덕션 토큰임을 `_dv_admin.ts` 200으로 확인). 공지는 **단일 언어 필드**
   (title·body)라 **EN 본문 + KO 본문을 한 공지에 병기**한다(앱 기본 언어 영어, 테스터 다수 한국어). 앱은 `app/notice.tsx`가 본문을 **평문 Text**로
   그린다 — 마크다운·링크 태그 금지, URL은 평문. `kind: notice`, `pinned: false`(Idea Repository는 pinned 팝업 미채택 — ARCHITECTURE §6),
   `endsAt` = 시행일 + 30일(자동 종료 — 지난 고지가 목록에 남지 않게). 발행 후 `bootstrap?app=idearepository`에서 `announcements[]`로 실측.
5. 게시(§5) → Play 콘솔 데이터 보안 양식 재제출(변경 시).
6. 정정 이력은 취소선 + 날짜로 남긴다(DOC_DISCIPLINE §4).

## 5. 게시 절차 (LinkMemo 방식)

`vivace-games.com`은 배구 서버 Vercel 프로젝트에 연결돼 있다(LinkMemo 2026-08-14 확인). 별도 호스팅 없이 정적 페이지 2개를 추가한다.

```
1. 복사: idea_repository/docs/legal/pages/idearepository/privacy/page.tsx
        → volleyball/server/app/idearepository/privacy/page.tsx
        idea_repository/docs/legal/pages/idearepository/terms/page.tsx
        → volleyball/server/app/idearepository/terms/page.tsx
2. 배구 레포에서 npm run build(또는 typecheck·lint)로 페이지 컴파일 확인 — 정적(force-static)이라 데이터 의존 없음
3. 배구 레포 커밋(배구 규칙: `YYMMDD :: [태그] …`)
4. ⚠ `npx vercel --prod`는 **사용자 확인 후** 실행(프로덕션 배포 — 배구명가 본 서비스와 같은 배포다)
5. 확인: curl -s -o /dev/null -w "%{http_code}" https://vivace-games.com/idearepository/privacy → 200, /terms → 200
6. URL을 Play 콘솔(스토어 등록정보·데이터 보안) · AdMob GDPR 메시지 · 앱 설정 About · BUSINESS_INFO.md §3에 기입
```

- 이 레포는 page.tsx **소스만** 보관한다 — 배구 레포로의 복사는 게시 시점에 사람이(또는 지시받은 세션이) 한다. 자동 동기화 없음.
- 배포 후 두 레포의 page.tsx가 어긋나지 않게: **수정은 항상 이 레포 → 배구 레포 순서**.

## 6. 근거 법령·정책 (초안 작성 시 참조 — 제출 전 최신본 재확인)

- 한국: 「개인정보 보호법」 제30조(처리방침 필수 항목)·제28조의8(국외 이전 고지 항목)·제31조(보호책임자)·2025.4 처리방침 작성지침 /
  「전자상거래 등에서의 소비자보호에 관한 법률」 제10조·제13조(사업자 정보 표시)·제17조 제2항 제5호(디지털 콘텐츠 청약철회 제한 — 사전 고지 요건)·
  시행령 제6조(소비자 불만·분쟁처리 기록 3년) / 「약관의 규제에 관한 법률」 / 전기통신사업법(휴·폐업 30일 전 고지)
- EU/UK: GDPR Art. 6(적법 근거)·13(고지 항목)·15~21(권리)·Chapter V(국외 이전) / ODR 플랫폼
- 미국: CCPA/CPRA(알 권리·삭제·정정·판매/공유 opt-out·비차별) — AdMob 맞춤 광고 = "share" 가능성 → opt-out 경로 기재
- 스토어: Play 데이터 보안 정책 · AdMob Play 데이터 공개 매핑 · Apple App Privacy·ATT
- 스킬: `privacy-kr`·`privacy-eu`·`privacy-us`·`payment-security-compliance`·`play-store-launch-checklist`(`C:\Users\user\.claude\skills\`)

## 7. 미결 · 주의 (사람 결정 필요)

| # | 항목 | 현재 초안 | 결정 필요 |
|---|---|---|---|
| 1 | **변호사 검토** | 미검토 초안 | 스토어 제출 전 검토 여부·범위(최소 KO 처리방침·약관) |
| 2 | 보호책임자 연락처에 **전화번호** 기재 | 이메일만(support@) | PIPA §31 "연락처"는 이메일로 충족 가능하다고 봤다. 대표 전화(개인 번호) 공개 여부는 BUSINESS_INFO §7-5와 같은 미결 |
| 3 | Discord 수탁자 표기 | 포함(ARCHITECTURE §5.2-5 웹훅 계획 기준, LinkMemo 방침과 동일) | 웹훅을 안 붙이면 표에서 삭제 |
| 4 | Data Safety "비정상 종료 로그" · "기기 ID 삭제 요청" 답 | 진단만 / 삭제 가능 = 예 | AdMob 공식 표 대조 후 확정([`legal/DATA_SAFETY.md`](./legal/DATA_SAFETY.md) §6) |
| 5 | RevenueCat 실제 채택 여부 | 채택 전제(CLAUDE.md §14 B) | 바뀌면 처리방침 §3.d·§4·KO 제6·7조·Data Safety 구매 내역 행 삭제 |
| 6 | **iOS EULA 표기** | 약관에 "스토어 약관"(Apple 최소 조항·제3수익자) 절 추가(2차) | App Store Connect 기본 EULA(Apple Standard EULA)를 쓸지, 이 약관을 커스텀 EULA로 올릴지. iOS 출시 시 결정. ATT 문구도 함께 |
| 7 | 일본어 등 추가 언어(ja·zh·es·fr·de·pt) 법률 문서 | EN·KO만 | 앱 UI 언어 추가(CLAUDE.md §9) 시 처리방침 번역 필요 여부. 일본은 APPI 별도 형식(`privacy-jp` 스킬) |
| 8 | 청약철회 제한 고지의 앱 내 문구·위치 | §3 표에 제안 | Phase 7 구현 시 확정. 스토어(Play) 자체 환불 정책도 병기 |
| 9 | 아동 연령 기준 표기 | 13세 + 거주국 상향 연령(한국 14 · 일부 EEA 16) 병기(2차) | 해소 — 미동의 사용자에게 맞춤 광고 없음 문장 추가 |
| 11 | **판매자 정보 전화번호** | 이메일만 | 전자상거래법 제10조 표시사항에 전화번호가 있다(대표번호 = 개인 휴대전화, BUSINESS_INFO §1). **형제 앱 4종 전부 미기재 확인(2026-08-17) → 이메일만 유지**(일관성) |
| 12 | **스토어 설명의 Remove Ads 문장** | 등록정보 EN/KO에 "one-time Remove Ads purchase" 기재 | vc1에는 미구현(Phase 7). 비공개 테스트 중엔 무해하나 **프로덕션 전 Phase 7 완료 또는 문장 삭제** 중 택1 |
| 14 | **5차 시행일 = 게시 당일(2026-09-01)** — KO 제14조 "시행 7일 전 게시"에 미달 | 처음 9/8로 잡았다가 같은 날 사용자 지시("아직 개시 안 해서 처리방침은 오늘로")로 당일 시행. 근거 = #13과 동일: 비공개 테스트 중 이용자는 사용자 본인뿐(테스터 = 업체 인원 설치·실행만, `common/CLOSED_TESTING.md` §3 "고지 기간은 프로덕션 이용자 기준"). 재게시·공지 PATCH 완료. ⚠ Play 콘솔 vc10 출시 노트에는 "effective 2026-09-08"이 그대로 남아 있다(검토 중 릴리스는 수정 불가 — 고치려면 검토 취소). 사용자 결정(같은 날): vc11 없음 — 프로덕션 출시 노트에서 정정. 알파 노트는 테스터에게만 보인다 | 해소 — 프로덕션 전환 뒤 개정부터는 7일 규칙을 지킨다 |
| 15 | **6차(OTA — Expo EAS Update) 게시·시행 대기**(2026-09-01) | 정본·page.tsx는 개정됐지만 **미게시**. 시행일은 임시 2026-09-02 — 게시 당일로 재설정한 뒤 `vercel --prod`(사용자 확인 필수, §5). vc11 · 1.0.10이 첫 OTA 가능 빌드라 **vc11 업로드 전에 게시**해야 앱 동작 ⇄ 방침이 어긋나는 창이 없다. 웰컴 시트 문구(`welcome.point.whatLeaves`)는 vc11에 실려 같이 나간다. Play 데이터 보안 양식은 변경 없음으로 판단(기기 ID 기선언) — 프로덕션 제출 전 콘솔에서 사람 확인. ⚠ LinkMemo는 같은 날 OTA를 넣었지만 처리방침에 Expo 항목이 없다(형제 앱 정합 — 그쪽 세션에 전달할 것) | 해소 조건: 게시 200 실측 + 시행 고지(§4-4) + 게시 기록 |
| 10 | 게시 URL 경로 | `/idearepository/privacy`·`/terms` | 배구 서버 라우트와 충돌 없음(LinkMemo `/linkmemo/...` 선례). 확정 시 BUSINESS_INFO §3 갱신 |
| 13 | **4차/5차 시행 고지가 7일 규칙에 2일 미달**(2026-08-23 발견) | 게시 2026-08-21 · 시행 2026-08-28인데 앱 내 공지는 2026-08-23 발행 → **5일 전**. 처리방침 KO 제17항 2호·§4-4가 약속한 "시행 7일 전 앱 내 공지"에 못 미친다 | 선택지: (a) 시행일 유지 + 5일 고지(변경이 이용자에게 불리하지 않은 고지성 정정 — 백업 파일 고지·"내보내기 없음" 오기 정정 — 이고, 기능은 vc6로 이미 제공 중이라 시행을 늦출수록 약관 ⇄ 실제 불일치 창이 길어진다) / (b) 시행일 2026-08-30으로 연기(md 4종·page.tsx 2종·재게시 필요). ~~**권고 (a)** — 사용자 결정 대기~~ → **해소(2026-08-23 사용자)**: 비공개 테스트 중 이용자는 사실상 사용자 본인뿐(테스터 = 업체 인원, 설치·실행만 — `common/CLOSED_TESTING.md`). 고지 기간은 **프로덕션 이용자 기준**으로 프로덕션 전에 맞추면 된다 → 시행일 8/28 유지, 재게시 없음. 다음부터는 **정본 개정 커밋과 같은 날 공지 발행** |

- 이 문서는 **세무·정산(AdMob 세금정보·RC 정산·부가세)과 무관**하다 — 그건 BUSINESS_INFO §5·스토어 콘솔의 영역.
- Play "계정 삭제 URL" 요건은 계정이 없어 **해당 없음**(CLAUDE.md §4). 로그인을 붙이는 순간 처리방침·약관·삭제 URL이 세트로 바뀐다.

## 8. 2차 글로벌 점검 기록 (2026-08-17)

점검 기준: GDPR/UK GDPR/Swiss FADP · CCPA/CPRA · PIPA · COPPA · LGPD 등 기타국 · Google Play(데이터 보안·EU 사용자 동의 정책·메타데이터) · Apple 최소 EULA · 전자상거래법.

| # | 발견 | 조치 |
|---|---|---|
| 1 | 약관의 **EU ODR 플랫폼 링크** — 플랫폼은 2025-07-20 운영 종료(Reg. (EU) 2024/3037) | EN §10·KO 제14조 → 회원국 ADR 기구 안내로 교체 |
| 2 | 처리방침이 약속한 "설정 → Privacy options"(동의 재변경)가 **앱에 없었다** — Google EU 사용자 동의 정책 위반 소지 | `features/ads/ads.ts` `showPrivacyOptions()` + 설정 행(REQUIRED 지역만) 구현. `canRequestAds` false면 SDK 미초기화 |
| 3 | 웰컴 시트 "기기를 떠나는 것 = 광고 SDK와 문의뿐, 그 외 없음" — bootstrap 조회(앱 버전)도 나간다 → §6 정직 규칙 위반 | 문구 3가지로 정정(en·ko), CLAUDE.md §6 동기 |
| 4 | 스위스(FADP)·기타국(LGPD·PIPEDA·APPI·DPDP) 권리 절 없음, GDPR 제27조 대리인 미지정 미고지, 자동화 결정 미언급 | EN §5·page 추가 |
| 5 | 아동 연령이 13/14만 — EEA 회원국 16세 상향 미반영 | §6·제13조 정정 + 미동의 시 비맞춤 광고 명시 |
| 6 | Remove Ads가 현재 버전에 없는데 단정 서술 | "제공되는 버전에 한함" 한정(처리방침·약관 EN/KO) — §7 #12 |
| 7 | KO 게시 페이지에 **처리위탁 표(제26조)** 누락(md에만 있음), RevenueCat 수탁자 미표기 | page.tsx 제5~7조 절에 위탁 표 삽입 |
| 8 | 삭제 요청 범위에 Discord 알림 사본 미언급 | EN §5·KO 제4조 보완 |
| 9 | bootstrap 요청의 접속 정보(IP) 미언급 | EN §3.c·KO 제2조 보완 |
| 10 | Apple 최소 EULA 조항·최소 연령 조항 없음 | 약관 EN §11·KO 제15조 "스토어 약관", 이용 연령 13세+ 추가 |
| — | 값 대조(이메일·주소·번호·보유기간·가격·URL) md ⇄ page ⇄ 라이브 | 불일치 없음(서브에이전트 대조). 라이브 = tsx |

남은 사람 결정: §7 #1(변호사 검토 — 형제 앱도 전부 미검토, 인터넷 참고로 자체 작성. 2026-08-17 타 앱 벤치마크 수행 → §9) · #12(스토어 설명 Remove Ads).

**2026-08-17 가격 통일**: Remove Ads 기준 가격 ₩1,500 → **₩3,300**(사용자 결정, LinkMemo와 같은 날 형제 앱 통일). 약관 KO/EN·게시 페이지 3차(볼리볼 `8ca3613`), CLAUDE·MONETIZATION·STORE_LISTING 동기. 판매 개시 전 정정이라 이용자 불이익 변경 아님.

## 9. 타 앱 벤치마크 (2026-08-17 — 변호사 검토 대신, 형제 앱 관행과 동일하게 인터넷 공개 문서 참고)

**처리방침 비교 대상(실게시본)**: Notepad Free(atomczak) · My Notes(KreoSoft) · Loop Habit Tracker · メモ帳 memo(Komorebi, AdMob+Remove Ads) ·
Splend Apps Notepad · ClevNote(Cleveni, KR) · Joplin. **약관 비교 대상**: Daylio · HabitKit(독일 1인 개발, lifetime IAP) · Loop(GPL) ·
편한가계부(Realbyte, KR 광고제거 IAP) · Apple 최소 EULA 조항 · Google Play DDA §3.4/3.8/5.3 · 국내 이용약관 가이드(법무법인 스타 2025-09).

| 벤치마크에서 드러난 우리 쪽 부족 | 조치(3·4차) |
|---|---|
| Google `partner-sites` 링크가 게시 페이지에서 빠짐(md엔 있었음) | 페이지 복원 |
| OS 백업(Android 자동 백업·iCloud)이 앱 데이터를 Google/Apple 서버로 복사할 수 있다는 고지 없음(Loop·Notepad Free·Komorebi는 명시) | §2·§7·제2조·제10조 추가 |
| 광고 제어 경로(Android 광고 ID 삭제·iOS 추적 끄기)가 EN에선 CCPA 절에만 | §3.a에 전 지역 공통 "How to control ads" |
| 미사용 SDK(Firebase·GA·크래시)·권한 목록 무언급 — 심사자에겐 침묵이 모호 | "What we do not use" + Android 권한 3종 명시. **`app.json` `blockedPermissions`**(READ/WRITE_EXTERNAL_STORAGE·USE_BIOMETRIC·USE_FINGERPRINT — 조각 선례)로 다음 빌드부터 매니페스트도 일치 |
| 수탁자 정책 링크 없음(이름만) | Google·Apple·RevenueCat·Vercel·Supabase·Discord 링크 + Data Safety 미러 문장 |
| 약관: 구매 적용 범위(동일 스토어 계정·가족 공유)·"영구 업데이트/서버 기능 보장 아님"(HabitKit) 없음 | 제7조·§4 추가 |
| 약관: Play DDA §3.4/3.8 판매자 지위·환불 위임 문장 없음 | 제8조·§4 추가 |
| 약관: Apple 최소 조항 중 미국 금수 확인이 KO에 없음 | 제15조 추가 |
| Apple 최소 조항의 **전화번호** | 미기재 유지(형제 앱 일관성) — iOS 출시 시 §7 #6과 함께 재결정 |
| 최소 연령 13(국내 피어는 14) | 유지 — 개인정보(이메일 등) 미수집이 근거. 문의에 이메일을 받기 시작하면 KO 만 14세로 |

**우리가 피어보다 앞서는 것(유지)**: 나가는 요청 전수 열거(Joplin 수준) · 흐름별 법적 근거 · UMP 재진입 경로 · 처리자/국외이전 표 · 국가별 연령 3단 ·
GDPR/CCPA/PIPA/기타국 권리 · 정직한 보안 한계 · 개정 이력 · 약관의 미성년자·복원·30일 종료 고지·ODR 종료 반영·전상법 판매자 블록(신고번호 포함).

## 게시 기록

- **2026-09-01 (처리방침 EN rev.6 · KO 6차 — ⏳ 미게시, 사용자 확인 대기)** — OTA(expo-updates · Expo EAS Update, [`OTA_SYSTEM.md`](./OTA_SYSTEM.md) §8, CLAUDE §14 V) 도입으로 기기가 Expo, Inc.(미국)와 통신하게 되는 것을 반영:
  EN §3.e 신설·§4 수탁자 행·"no network requests" 문장·개정 이력 / KO 제1조 목적·제2조 3항 SDK 표·"사용하지 않는 것"·제3조·제6조 위탁·제7조 국외 이전·제14조 이력. 임시 시행일 2026-09-02 — **게시 당일로 재설정 후** 배구 레포 복사 → `vercel --prod`(§5, 사용자 확인) → 시행 고지(§4-4). vc11 업로드 전 필수(§7 #15).
  **2026-09-02 확장(게시 전 동일 rev.6에 편입)**: 웜 스타트 하트비트(SDK 2026-09-02, [`ARCHITECTURE.md`](./ARCHITECTURE.md) §5.7)로 활성 신호 전송 시점이 "앱 실행 시 1회"에서 "실행 시 + 앱으로 돌아올 때(최소 5분 간격)"로 넓어진 것을 EN §3.c·이력 / KO 제2조 2항 수집 방법·제14조 이력에 반영. 저장 항목·보관 기간은 불변(활성 일자 1행·400일) — 미게시 상태라 rev 번호는 그대로 6이고 앱 동작 ⇄ 방침 불일치 창이 생기지 않는다.

- **2026-09-01 (처리방침 EN rev.5 · KO 5차 — ✅ 게시 + ✅ 시행 고지 발행, 같은 날)** — 부팅 활성 하트비트([`ARCHITECTURE.md`](./ARCHITECTURE.md) §5.5, CLAUDE §14 U)로
  기기 식별자가 첫 실행에 생성·등록되고 부팅 조회에 실려 활성 일자(400일)가 서버에 남게 된 것을 반영. 사용자 승인("동의하고 전부 다 진행") 후:
  배구 레포 `4559131`(idearepository 페이지 1개만 스테이징 — 다른 세션의 linkmemo 페이지 미커밋 변경 미포함) → detached worktree `vercel link --project volleyball --scope sonws` →
  `vercel --prod` → `volleyball-19bb6adus` Ready(29s) → 라이브 `/idearepository/privacy`에 "rev. 5 … effective 2026-09-01" · "5차 … 2026-09-01 시행" 실측, `/terms` 200 → worktree 삭제(`.env.local` 포함).
  Data Safety 양식 변경 없음(기기 ID 기선언 — [`legal/DATA_SAFETY.md`](./legal/DATA_SAFETY.md) §0). 약관은 변경 없음(제·§ "무작위 기기 식별자를 생성" 서술은 여전히 참).
  **시행 고지**: `POST /api/admin/announcements` 200 → id `13dc2524-9d3d-4e75-ae4b-18d163851af7`, `kind: notice`, `pinned: false`, ~~`endsAt: 2026-10-07T15:00:00Z`~~ → `2026-09-30T15:00:00Z`(= KST 10-01 00:00, 시행 + 30일).
  bootstrap 실측 `announcements` 2건(8/28 고지 병존, 9/27 종료), 본문 1,164자 정본과 글자 단위 일치. ~~시행 7일 전 규칙 충족(9/1 → 9/8)~~ → **같은 날 사용자 지시 "아직 개시 안 해서 처리방침은 오늘로" → 시행일 2026-09-01(당일)로 정정**(§7 #14): 정본·page.tsx 재게시(배구 `115495e` → `volleyball-435idnr98` Ready, 라이브 "2026-09-01 시행" 실측) + 공지 `PATCH`(제목·본문 날짜·endsAt, bootstrap 본문 글자 일치). §7 #13 교훈대로 정본 개정과 같은 날 발행.
  **문안(정본)**:

  ```
  title: Privacy Policy updated (effective 2026-09-01) · 개인정보처리방침 개정 안내

  We've updated the Privacy Policy (rev. 5). It takes effect on 2026-09-01.

  What changed
  • Device identifier: the app already used a random device ID (not your advertising ID) so that you can see replies to your inquiries. From this version it is created at first launch, not only when you send an inquiry, and the start-up check carries it so that we can count how many devices were active each day. We keep one row per device per day (app code, device ID, date) for 400 days. It contains no name or email, is never shared, and is not used for advertising.
  • Nothing else changed — your ideas, notes and resources still stay on your device and are never uploaded to us.

  Full text
  Privacy Policy: https://vivace-games.com/idearepository/privacy

  ──

  개인정보처리방침(5차)을 개정했습니다. 시행일은 2026-09-01입니다.

  바뀐 내용
  • 기기 식별자: 앱은 문의 답변을 보여 드리기 위해 무작위 기기 ID(광고 ID가 아닙니다)를 이미 쓰고 있었습니다. 이번 버전부터는 문의를 보낼 때만이 아니라 앱을 처음 실행할 때 생성되고, 시작 시 확인 요청에 함께 실려 하루에 몇 대의 기기가 활성이었는지 집계하는 데 쓰입니다. 기기당 하루 1건(앱 코드·기기 ID·날짜)을 400일 보관합니다. 이름·이메일을 담지 않고, 제3자에게 제공하지 않으며, 광고에 쓰지 않습니다.
  • 그 외 변경은 없습니다 — 아이디어·노트·자료는 여전히 기기에만 저장되며 회사로 업로드되지 않습니다.

  전문 보기
  개인정보처리방침: https://vivace-games.com/idearepository/privacy
  ```

- **2026-08-23 (4차/5차 시행 고지 — ✅ 발행)** — §4-4 방법으로 common_server 공지 1건(EN+KO 병기, `kind: notice`, `pinned: false`,
  `endsAt: 2026-09-27T15:00:00Z` = KST 2026-09-28 00:00). `POST /api/admin/announcements` 200 → id `df35b667-8c71-4f14-a1b5-5c30e655f65a`,
  startsAt 2026-08-23T03:19:15Z(KST 12:19). 프로덕션 `bootstrap?app=idearepository` → `announcements` 1건, 본문 1,162자 = 아래 정본과 글자 단위 일치(node 대조).
  사용자 판단 "미리 발행" — 9/27까지 살아 있어 프로덕션 전환 후 이용자도 본다. 7일 규칙 미달은 §7 #13 해소. 발행 스크립트는 세션 스크래치(토큰 미출력, 상태·id만 출력).
  **문안(정본 — 발행 본문과 글자 단위로 같아야 한다)**:

  ```
  title: Privacy Policy & Terms updated (effective 2026-08-28) · 개인정보처리방침·이용약관 개정 안내

  We've updated the Privacy Policy (rev. 4) and the Terms of Service (rev. 5). Both take effect on 2026-08-28.

  What changed
  • Backup (Settings → Backup): the app can now export all your ideas to a single file on your device and import it back later. The Privacy Policy now states that this file is created on your device, shared only where you choose, and never received by us. The Terms no longer say "no export" and clarify that keeping the file safe is up to you.
  • Nothing else changed — what leaves your device (ad SDK, the version check at startup, inquiries you send) stays the same.

  Full text
  Privacy Policy: https://vivace-games.com/idearepository/privacy
  Terms of Service: https://vivace-games.com/idearepository/terms

  ──

  개인정보처리방침(4차)과 이용약관(5차)을 개정했습니다. 시행일은 2026-08-28입니다.

  바뀐 내용
  • 백업(설정 → 백업): 모든 아이디어를 기기 안의 파일 하나로 내보내고, 나중에 다시 가져올 수 있습니다. 처리방침에 이 파일은 기기에서 만들어져 이용자가 고른 곳으로만 전달되며 회사는 받지 않는다는 내용을 추가했습니다. 약관의 "내보내기 기능 없음" 문구를 정정하고, 파일 보관 책임은 이용자에게 있음을 명시했습니다.
  • 그 외 변경은 없습니다 — 기기 밖으로 나가는 정보(광고 SDK · 시작 시 버전 확인 · 직접 보낸 문의)는 그대로입니다.

  전문 보기
  개인정보처리방침: https://vivace-games.com/idearepository/privacy
  이용약관: https://vivace-games.com/idearepository/terms
  ```

- **2026-08-21 (처리방침 4차 · 약관 5차 — ✅ 게시)** — 배구 레포 `ab74543`(페이지 2개만 스테이징, 다른 세션 미커밋 작업 분리) → detached worktree에서 `vercel --prod`(복사한 `.vercel`은 "Not authorized" → `vercel link --project volleyball --scope sonws` 재링크 후 성공, 2차 게시와 동일) → `volleyball-9ovttvm8y` production Ready → 라이브 `/idearepository/privacy` "최종 수정: 2026-08-21 (4차…)" · `/terms` "(5차…)" 200 확인 → worktree 삭제(link가 만든 `.env.local` 포함). 원래 줄: — 로컬 백업 편입([`BACKUP_SYSTEM.md`](./BACKUP_SYSTEM.md) §6): 약관 §3/제5조 "내보내기 없음" 정정 + 처리방침 §2 백업 파일 한 문장(기기 생성·이용자가 고른 곳으로만·회사 미수신). 시행 2026-08-28(7일 고지 규칙). Data Safety 변경 없음(수집·공유 항목 불변). **재게시는 §5 절차 — 배구 레포 복사 → `vercel --prod`는 사용자 확인 후.** 앱 내 공지(common_server)로 변경 고지 필요.

- **2026-08-17 (2차)** — 배구 레포 `6297b52` → detached worktree에서 `vercel link --project volleyball --scope sonws` 후 `vercel --prod --yes`(복사한 `.vercel`로는 "Not authorized" — 재링크로 해결) → Ready → 라이브에서 `rev. 2`·`처리위탁(제26조)`·ODR 종료 문구 확인. worktree 삭제(link가 만든 `.env.local` 포함).

- **2026-08-17** — 배구 레포 커밋 `3eb8929`(페이지 2개만 스테이징 — 다른 세션의 미커밋 작업과 분리) → 깨끗한 git worktree(HEAD)에서
  `npx vercel --prod --yes`(⚠ Vercel 프로젝트 Root Directory = `server`이므로 **레포 루트에서** 실행, `.vercel/project.json`은 루트 것) →
  프로덕션 Ready → `vivace-games.com/idearepository/{privacy,terms}` 200 실측. 작업 트리에서 직접 배포하지 않은 이유: 다른 세션의 임시 파일·미커밋 변경이 함께 올라가는 것을 피하려고.
