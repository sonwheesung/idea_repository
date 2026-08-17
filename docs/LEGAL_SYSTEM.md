# LEGAL_SYSTEM — 개인정보처리방침 · 이용약관 · 데이터 보안 선언

> 정책 원칙은 [`../CLAUDE.md`](../CLAUDE.md) §4(회원 없음)·§6(데이터 저장·정직한 표현 규칙)·§7·§7.1(광고·Remove Ads)·§10(서버 경계),
> 실제 트래픽은 [`ARCHITECTURE.md`](./ARCHITECTURE.md)·[`MONETIZATION_SYSTEM.md`](./MONETIZATION_SYSTEM.md). 여기는 **이용자 대면 법률 문서**의
> 정본 위치·정합 규칙·게시 절차. 2026-08-17 초안 작성 — **게시 0%**. LinkMemo(배구 서버 정적 페이지 게시, 2026-08-14)의 방식을 승계한다.
> ⚠ 이 문서와 `docs/legal/*`는 **변호사 검토를 거치지 않은 초안**이다. 스토어 제출 전 사람이 읽고 확정한다.

## 구현 현황

| 항목 | 상태 | 비고 |
|---|---|---|
| 개인정보처리방침 EN 정본 `docs/legal/PRIVACY.en.md` | ✅ 초안 작성 | 2026-08-17. GDPR·CCPA·PIPA 권리 절 포함 |
| 개인정보처리방침 KO 정본 `docs/legal/PRIVACY.ko.md` | ✅ 초안 작성 | 2026-08-17. PIPA §30 항목(목적·항목·기간·파기·위탁·국외이전·권리·자동수집·안전조치·보호책임자·구제·변경) |
| 이용약관 EN `docs/legal/TERMS.en.md` | ✅ 초안 작성 | 2026-08-17 |
| 이용약관·운영·환불 정책 KO `docs/legal/TERMS.ko.md` | ✅ 초안 작성 | 2026-08-17. 전자상거래법 판매자 정보·청약철회 제한 고지·종료 30일 고지 |
| Play 데이터 보안·Apple 라벨 답안 `docs/legal/DATA_SAFETY.md` | ✅ 초안 작성 | 2026-08-17. ❌ 콘솔 미제출 |
| 게시용 페이지 `docs/legal/pages/idearepository/{privacy,terms}/page.tsx` | ✅ 초안 작성 | 2026-08-17. ❌ 배구 서버 레포 미복사·미배포 |
| 처리방침 실게시 `https://vivace-games.com/idearepository/privacy` | ❌ 미게시 | Phase 8 |
| 약관 실게시 `https://vivace-games.com/idearepository/terms` | ❌ 미게시 | Phase 8 |
| 앱 내 노출(설정 → About: 처리방침·약관 링크·사업자 정보) | ✅ | 2026-08-17 `app/about.tsx` · `lib/links.ts`(URL·사업자 값 상수) · i18n `about.*`. 링크는 게시 전까지 404 |
| Play 데이터 보안 양식 제출 | ❌ | Phase 8 — AdMob·RC 공식 표 재확인 후 |
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
| Remove Ads: 스토어 결제 + RC 익명 ID·구매 이력 | `features/purchase/*` (Phase 7) | EN §3.d·§4 / KO 제2조 3항·제6조·제7조 | 구매 내역·기기 ID |
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
| 6 | **iOS EULA 표기** | 미표기 | App Store Connect 기본 EULA(Apple Standard EULA)를 쓸지, 이 약관을 커스텀 EULA로 올릴지. iOS 출시 시 결정. ATT 문구도 함께 |
| 7 | 일본어 등 추가 언어(ja·zh·es·fr·de·pt) 법률 문서 | EN·KO만 | 앱 UI 언어 추가(CLAUDE.md §9) 시 처리방침 번역 필요 여부. 일본은 APPI 별도 형식(`privacy-jp` 스킬) |
| 8 | 청약철회 제한 고지의 앱 내 문구·위치 | §3 표에 제안 | Phase 7 구현 시 확정. 스토어(Play) 자체 환불 정책도 병기 |
| 9 | 아동 연령 기준 표기 | 국외 13세 · 한국 14세 병기 | GDPR 회원국별 13~16세 차이는 "not directed at children"으로 처리 — 유지 여부 |
| 10 | 게시 URL 경로 | `/idearepository/privacy`·`/terms` | 배구 서버 라우트와 충돌 없음(LinkMemo `/linkmemo/...` 선례). 확정 시 BUSINESS_INFO §3 갱신 |

- 이 문서는 **세무·정산(AdMob 세금정보·RC 정산·부가세)과 무관**하다 — 그건 BUSINESS_INFO §5·스토어 콘솔의 영역.
- Play "계정 삭제 URL" 요건은 계정이 없어 **해당 없음**(CLAUDE.md §4). 로그인을 붙이는 순간 처리방침·약관·삭제 URL이 세트로 바뀐다.
