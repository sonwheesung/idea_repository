// Idea Repository 이용약관 · 운영·환불 정책(공개 정적 페이지 · 인증 없음 공개 GET). 스토어 심사·앱 내 링크 URL.
// 배치 위치: volleyball `server/app/idearepository/terms/page.tsx` → https://vivace-games.com/idearepository/terms
// 정합 기준: idea_repository 레포 docs/legal/TERMS.ko.md(정본)·TERMS.en.md + MONETIZATION_SYSTEM §4(Remove Ads 비소모성 1상품).
//   배구 /terms(운영·환불 정책 + 판매자 정보 블록) 구조 승계 — 유료 재화는 "광고 제거" 하나뿐이라 그에 맞게 줄였다.
//   전자상거래법: 판매자 정보(상호·대표자·사업자등록번호·통신판매업 신고번호·소재지·연락처) 표시 + 디지털 콘텐츠 청약철회 제한 사전 고지 +
//   서비스 종료 30일 전 고지. 사업자 값은 /privacy(배구)·/linkmemo/privacy와 같은 값(단일 출처 C:\project\common\BUSINESS_INFO.md — 커밋 금지).
// ⚠ 개인정보 관련 서술(광고 SDK·문의 UUID)은 /idearepository/privacy 및 Play 데이터 보안 선언과 어긋나면 안 된다.
import type { CSSProperties } from 'react';

export const metadata = {
  title: 'Idea Repository — 이용약관 · Terms of Use',
  description:
    'Idea Repository 이용약관 · 운영·환불 정책 (로컬 저장·백업 책임, 광고, 광고 제거 일회성 구매·환불·복원, 서비스 종료 고지, 판매자 정보) / Terms of Use',
};
export const dynamic = 'force-static';

const SUPPORT_EMAIL = 'support@vivace-games.com';
const PRIVACY_URL = 'https://vivace-games.com/idearepository/privacy';

const card: CSSProperties = {
  background: '#111C2B',
  border: '1px solid #1E2E44',
  borderRadius: 14,
  padding: 20,
  marginTop: 16,
};
const h2: CSSProperties = { fontSize: 18, fontWeight: 800, marginBottom: 10 };
const muted: CSSProperties = { color: '#9FB0C4', lineHeight: 1.85, margin: '6px 0' };
const li: CSSProperties = { color: '#9FB0C4', lineHeight: 1.85 };
const link: CSSProperties = { color: '#7FB3FF' };
const divider: CSSProperties = { border: 'none', borderTop: '1px solid #1E2E44', margin: '40px 0' };

export default function IdeaRepositoryTerms() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: 26, fontWeight: 900 }}>Idea Repository — 이용약관 · 운영·환불 정책</h1>
      <p style={muted}>
        본 약관은 휘성게임즈(브랜드 표기 Vivace Games Studio, 이하 &quot;회사&quot;)가 제공하는 모바일 앱 &quot;Idea Repository&quot;(이하
        &quot;앱&quot;)의 이용 조건과 유료 서비스(광고 제거)의 결제·환불 기준을 정합니다. 개인정보 처리는{' '}
        <a href={PRIVACY_URL} style={link}>
          개인정보처리방침
        </a>
        을 따릅니다. (English version below.)
      </p>
      <p style={{ ...muted, fontSize: 13 }}>시행일: 2026-08-17 · 최종 수정: 2026-08-21 (5차 — 2026-08-28 시행)</p>

      <section style={card}>
        <h2 style={h2}>제1조 목적 · 제2조 정의</h2>
        <ul style={li}>
          <li>이 약관은 앱의 이용 조건 및 절차, 회사와 이용자의 권리·의무·책임, 유료 서비스의 결제·환불 기준을 정함을 목적으로 합니다.</li>
          <li>
            &quot;이용자&quot;란 앱을 설치하여 이용하는 자를 말합니다. 앱은 회원가입·로그인이 없으므로 회원·비회원 구분이 없습니다. 만 13세 미만(거주국
            법령이 더 높은 연령을 정한 경우 그 연령 미만)은 이용할 수 없으며, 미성년자는 법정대리인의 동의를 얻어 이용합니다.
          </li>
          <li>&quot;이용자 데이터&quot;란 이용자가 앱에 입력한 프로젝트·노트·관련 자료·카테고리·태그·설정 등 일체의 정보를 말합니다.</li>
          <li>&quot;광고 제거(Remove Ads)&quot;란 앱 내 광고를 표시하지 않도록 하는 비소모성 일회성 유료 상품을, &quot;스토어&quot;란 Google Play·App Store를 말합니다.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>제3조 약관의 효력 및 변경</h2>
        <ul style={li}>
          <li>이 약관은 앱 내(설정 → 정보) 및 본 URL에 게시함으로써 효력이 발생합니다.</li>
          <li>
            회사는 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수 있으며, 적용일자·변경 사유를 명시하여 적용일 <strong>7일 전</strong>부터
            (이용자에게 불리하거나 중대한 변경은 <strong>30일 전</strong>부터) 앱 내 공지사항 및 본 URL에 공지합니다.
          </li>
          <li>변경에 동의하지 않는 이용자는 앱 이용을 중단(삭제)할 수 있으며, 적용일 이후 계속 이용하면 변경에 동의한 것으로 봅니다.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>제4조 서비스의 내용</h2>
        <ul style={li}>
          <li>
            프로젝트 생성·수정·삭제, 기본 정보·아이디어 정보·진행 관리, 아이디어 노트, 관련 자료, 카테고리·태그, 검색·필터·정렬, 테마·언어 설정 —{' '}
            <strong>모든 기능은 무료</strong>이며 무료 이용 시 광고가 표시됩니다(제6조).
          </li>
          <li>앱은 실행 시 회사 서버에서 공지·점검·필수 업데이트 여부를 조회할 수 있으며, 지원 종료 버전에는 업데이트를 안내할 수 있습니다.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>제5조 이용자 데이터의 저장과 백업 책임</h2>
        <ul style={li}>
          <li>
            이용자 데이터는 <strong>이용자 기기에만 저장</strong>되며 회사 서버로 전송되지 않습니다. 회사는 이를 열람·복구·복원할 수 없습니다.
          </li>
          <li>
            <strong>앱 삭제·기기 초기화·분실·기기 변경 시 이용자 데이터가 소실될 수 있습니다.</strong> 클라우드 백업·동기화 기능은 제공하지 않습니다.
            설정 → 백업에서 모든 데이터를 기기 안의 파일 하나로 내보내고(이후 가져오기) 할 수 있으며, 그 파일의 보관 장소와 관리는 이용자가 정하고
            회사는 파일을 수신하지 않습니다. 필요한 사본의 보관 책임은 이용자에게 있습니다.
          </li>
          <li>이용자 데이터에 대한 권리는 이용자에게 있으며, 회사는 이를 수신하지 않으므로 어떠한 이용 권한도 주장하지 않습니다.</li>
          <li>저장하는 내용·URL의 적법성은 이용자가 책임집니다. 관련 자료 URL은 기기 브라우저에서 열리며 외부 사이트는 해당 사이트 약관을 따릅니다.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>제6조 광고</h2>
        <ul style={li}>
          <li>무료 이용 시 메인·상세 화면 하단 배너와 앱 콜드 스타트 시 앱 오픈 광고(3시간에 최대 1회)가 Google AdMob을 통해 표시됩니다.</li>
          <li>광고 SDK가 수집하는 정보와 거부 방법은 개인정보처리방침에 따릅니다. EEA·영국·스위스에서는 앱 내 동의 폼에서 맞춤 광고 여부를 선택할 수 있습니다.</li>
          <li>프로젝트 작성·편집, 노트·자료 입력, 삭제 확인 중에는 전면형 광고를 표시하지 않습니다.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>제7조 유료 서비스 — 광고 제거(Remove Ads)</h2>
        <ul style={li}>
          <li>
            유형: <strong>비소모성 일회성 구매</strong>(해당 기능이 제공되는 앱 버전에서). 구독·자동 갱신·추가 과금 없음. 내용: 앱 내 모든 광고 제거 — <strong>기능 차이 없음</strong>
            (무료 = 모든 기능 + 광고, 구매 = 모든 기능 + 광고 없음).
          </li>
          <li>
            가격: <strong>₩3,300</strong>(대한민국 기준, 부가세 포함 여부는 스토어 표시에 따름). 국외는 스토어의 국가별 현지 통화 가격이 결제 전 표시됩니다.
          </li>
          <li>결제: 스토어(Google Play·App Store) 인앱결제. 회사는 결제 카드 정보를 취급하지 않습니다. 제공 시기: 스토어 결제 승인 <strong>즉시</strong> 적용.</li>
          <li>
            구매 복원: 설정 → 광고 제거 → <strong>구매 복원(Restore Purchases)</strong> — 동일 스토어 계정의 구매 이력 기준. 회사 로그인 불필요.
          </li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>제8조 청약철회 및 환불</h2>
        <ul style={li}>
          <li>
            <strong>청약철회 제한 고지:</strong> 광고 제거는 결제 즉시 제공이 완료되는 디지털 콘텐츠로서, 「전자상거래 등에서의 소비자보호에 관한 법률」
            제17조 제2항 제5호에 따라 <strong>제공이 개시된 후에는 청약철회가 제한될 수 있습니다.</strong> 회사는 결제 전 이 사실을 앱 화면과 이 약관으로 고지합니다.
          </li>
          <li>
            결제 환불은 <strong>Google Play·App Store의 환불 정책 및 절차</strong>에 따라 처리됩니다. 결제의 판매·정산 주체는 각 스토어이며 회사는 앱에서
            카드 결제를 직접 환불하지 않습니다. 환불 신청은 스토어 환불 경로를 이용해 주시고, 앱 내 <strong>&quot;문의하기&quot;(환불 유형)</strong>로도 접수할 수 있습니다.
          </li>
          <li>
            상품이 표시 내용과 다르거나 정상 제공되지 않은 경우(예: 결제 후에도 광고가 계속 표시되고 복원으로도 해결되지 않는 경우)에는 관련 법령에 따라
            청약철회·환불을 요청할 수 있습니다.
          </li>
          <li>환불이 이루어지면 광고 제거 적용이 해제되어 광고가 다시 표시될 수 있습니다.</li>
          <li>
            적용 범위: 동일 스토어 계정으로 로그인한 기기의 앱(iOS 가족 공유가 허용되는 경우 포함). 광고 없는 버전의 이용 권한이며 영구 업데이트·서버 기능의 영구 제공을
            보장하지 않습니다(제13조). Google Play에서 Google이 판매자가 아닌 지역에서는 회사가 판매자이며, Play 환불 정책에 따른 환불을 Google이 회사를 대신해 처리합니다.
          </li>
          <li>미성년자가 법정대리인의 동의 없이 결제한 경우, 본인 또는 법정대리인은 스토어 절차 또는 문의하기로 취소를 신청할 수 있습니다.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>제9조 문의하기 · 제10조 금지 행위 · 제11조 지식재산권</h2>
        <ul style={li}>
          <li>
            이용자는 로그인 없이 앱 내 &quot;문의하기&quot;로 문의를 보낼 수 있습니다. 앱은 답변을 앱에서 확인할 수 있도록 무작위 기기 식별자를 생성하며,
            앱 삭제·기기 변경 시 연결이 끊겨 이전 답변을 다시 볼 수 없습니다. 답변 시한은 보장하지 않습니다.
          </li>
          <li>
            금지 행위: 법령·공서양속 위반 목적의 이용, 회사 서버·광고·결제 시스템 방해 및 문의 기능 남용(자동화·과다 전송), 광고·구매 검증 우회, 앱의 복제·배포·
            판매·역설계(법령 허용 범위 제외), 문의 시 사칭·허위 기재, 스토어 정책 위반.
          </li>
          <li>앱과 그 디자인·상표·소스코드의 권리는 회사 또는 정당한 권리자에게 있으며, 이용자에게는 개인적·비상업적 목적의 비독점적 이용 권한만 부여됩니다.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>제12조 면책 및 책임 제한</h2>
        <ul style={li}>
          <li>회사는 천재지변, 스토어·광고·결제·호스팅 사업자의 장애 등 합리적 통제를 벗어난 사유로 인한 손해에 책임을 지지 않습니다.</li>
          <li>회사는 이용자 기기에 저장된 이용자 데이터의 소실·훼손에 책임을 지지 않습니다(제5조). 다만 회사의 고의·중대한 과실로 인한 경우는 제외합니다.</li>
          <li>
            회사의 손해배상 책임은 관련 법령이 허용하는 범위에서 이용자가 최근 12개월간 회사에 지급한 금액을 한도로 하며, 소비자에게 불리하게 법령상 책임을
            배제·제한하지 않습니다.
          </li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>제13조 서비스의 변경·중단·종료</h2>
        <ul style={li}>
          <li>회사는 운영상·기술상 필요에 따라 앱 또는 서버 기능(공지·문의)을 변경하거나 중단할 수 있습니다.</li>
          <li>
            서비스 전부를 종료하는 경우, 회사는 종료 예정일 <strong>최소 30일 전</strong>부터 앱 내 공지 및 본 URL로 종료일과 사유를 고지합니다.
          </li>
          <li>이용자 데이터는 기기에 있으므로 서버 기능 종료 후에도 앱의 로컬 기능은 계속 동작할 수 있으나, 광고·구매·구매 복원은 지원되지 않을 수 있습니다.</li>
          <li>종료 고지 이후 광고 제거의 신규 판매를 중단하며, 관련 법령상 환불 대상이 있는 경우 스토어 절차에 따라 환불합니다.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>제14조 준거법 및 관할</h2>
        <p style={muted}>
          이 약관은 대한민국 법률을 준거법으로 하며, 분쟁은 「민사소송법」에 따른 관할 법원에 제기합니다. 대한민국 외에 거주하는 소비자는 거주국의 강행
          소비자보호 규정에 따른 보호를 추가로 받으며, 이 조항이 그 권리를 제한하지 않습니다. EU 소비자는 거주 회원국의 대체적 분쟁해결(ADR)
          기구를 이용할 수 있습니다(유럽위원회 ODR 플랫폼은 2025-07-20 운영 종료).
        </p>
        <p style={muted}>
          <b>스토어 약관.</b> 앱은 Google Play 및 (출시 시) Apple App Store를 통해 배포되며 다운로드·결제에는 각 스토어의 약관이 함께 적용됩니다.
          스토어는 이 약관의 당사자가 아니며 앱의 유지보수·지원 의무를 지지 않습니다. iOS의 경우 이 약관은 이용자와 회사 사이의 것으로 Apple은
          앱에 대한 보증·제조물 책임·지식재산권 침해·법령 준수 의무를 지지 않으며, Apple 및 그 자회사는 이 약관의 제3수익자로서 약관을 집행할 수
          있습니다. 이용자는 미국 정부의 금수 대상 국가에 거주하지 않고 미국 정부의 거래 금지·제한 대상자 명단에 없음을 확인합니다.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>제15조 판매자 정보</h2>
        <ul style={li}>
          <li>상호: <strong>휘성게임즈</strong> (브랜드 표기 Vivace Games Studio)</li>
          <li>대표자: 손휘성</li>
          <li>사업자등록번호: 749-25-02260</li>
          <li>통신판매업 신고번호: 제2026-울산중구-0170호 (신고기관: 울산광역시 중구청)</li>
          <li>사업장 소재지: 울산광역시 중구 성안5길 22, 2층 204호(성안동), 우 44421</li>
          <li>연락처: <strong>{SUPPORT_EMAIL}</strong> (또는 앱 내 &quot;문의하기&quot;)</li>
          <li>
            개인정보 처리:{' '}
            <a href={PRIVACY_URL} style={link}>
              {PRIVACY_URL}
            </a>
          </li>
        </ul>
      </section>

      <p style={{ ...muted, marginTop: 24, fontSize: 13 }}>부칙 — 이 약관은 2026-08-17부터 시행합니다. 개정 이력: 2026-08-17 최초 제정 · 2차(글로벌 점검: 최소 연령·ODR 종료 반영·스토어 약관 조항) · 3차(광고 제거 기준 가격 ₩1,500 → ₩3,300, 판매 개시 전 정정) · 4차(유사 앱 벤치마크: 구매 적용 범위, Play 판매자 지위·환불 위임, 미국 금수 확인) · 2026-08-21 5차(제5조 — 로컬 백업 파일 내보내기·가져오기 제공 반영, 2026-08-28 시행).</p>

      <hr style={divider} />

      <h1 style={{ fontSize: 24, fontWeight: 900 }}>Idea Repository — Terms of Use (English)</h1>
      <p style={{ ...muted, fontSize: 13 }}>Effective date: 2026-08-17 · Last updated: 2026-08-21 (rev. 5 — local backup; effective 2026-08-28)</p>
      <p style={muted}>
        These Terms govern your use of the mobile application <b>Idea Repository</b> (the &quot;App&quot;) provided by
        Hwiseong Games (brand: Vivace Games Studio; &quot;we&quot;, &quot;us&quot;). By installing or using the App you agree to
        these Terms. Privacy is covered by the{' '}
        <a href={PRIVACY_URL} style={link}>
          Privacy Policy
        </a>
        .
      </p>

      <section style={card}>
        <h2 style={h2}>1. The service · 2. License</h2>
        <p style={muted}>
          Idea Repository is a personal, on-device organizer for ideas and projects. It has <b>no user accounts, no
          login and no cloud sync</b>. All features are free; the free version shows ads. You must be at least 13 (or the
          higher minimum age in your country) to use the App; minors need a parent&apos;s or guardian&apos;s consent. We grant you a personal,
          non-exclusive, non-transferable, revocable license to use the App on devices you own or control for personal,
          non-commercial purposes. You may not copy, modify, distribute, sell, rent, reverse-engineer or create
          derivative works of the App except as permitted by law.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>3. Your content stays on your device — you are responsible for backups</h2>
        <ul style={li}>
          <li>Everything you enter is stored only on your device. It is not uploaded to our servers, and we cannot read, restore or recover it.</li>
          <li>
            <b>If you delete the App, reset or lose your device, or change devices, your data may be lost.</b> The App provides no cloud backup or sync.
            Settings → Backup lets you export all your data to a single file on your device (and import it later); where you keep that file is up to you,
            and we never receive it. You are solely responsible for keeping any copies you need.
          </li>
          <li>You retain all rights to your content; we claim no license to it. You are responsible for the lawfulness of what you store and for saved URLs.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>4. Ads and the &quot;Remove Ads&quot; purchase</h2>
        <ul style={li}>
          <li>
            The free version shows a bottom banner on the main and detail screens and an app-open ad on cold start (at most once every 3 hours), served by
            Google AdMob. In the EEA, the UK and Switzerland you choose in the in-app consent form whether ads are personalized.
          </li>
          <li>
            <b>Remove Ads</b>, where available in your version of the App, is a single one-time, non-consumable in-app purchase (Settings → Remove Ads). It removes all ads; it does not unlock features and
            is not a subscription. Price is shown in the store in your local currency (reference price in Korea: ₩3,300).
          </li>
          <li>Payment is processed by Google Play or the Apple App Store; we do not receive your payment details. Ads are removed <b>immediately</b> after the store confirms the purchase.</li>
          <li>Restore: Settings → Remove Ads → <b>Restore Purchases</b> (same store account; no login with us).</li>
          <li>
            Scope: applies to the App on devices signed in to the same store account (incl. iOS Family Sharing where the store enables it). It is a licence to the
            ad-free version, not a promise of perpetual updates or of server-side features beyond section 8. On Google Play, where Google is not the merchant of
            record we are the seller of record and have authorised Google to refund on our behalf under the Play refund policy.
          </li>
          <li>
            Refunds and withdrawal: because the content is delivered immediately, your statutory right to withdraw may be limited once ads have been removed, to
            the extent permitted by law. Refunds follow the <b>refund policy of Google Play or the Apple App Store</b>. Non-waivable consumer rights (e.g. if the
            purchase does not work) are unaffected; you may also contact {SUPPORT_EMAIL}. If a purchase is refunded, ads may return.
          </li>
          <li>Minors should purchase only with a parent&apos;s or guardian&apos;s consent; a guardian may request cancellation through the store.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>5. Prohibited use · 6. Support inquiries</h2>
        <p style={muted}>
          You may not use the App unlawfully, interfere with our servers or the ad/billing systems, abuse the inquiry feature (automated or abusive
          messages), circumvent ads or purchase verification, misrepresent yourself in an inquiry, or violate app-store policies. Inquiries can be sent
          from Settings without an account; the App generates a random device identifier so replies can be shown in the App — if you delete the App or
          change devices, that connection is lost. We do not guarantee response times.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>7. Disclaimer and limitation of liability</h2>
        <p style={muted}>
          The App is provided &quot;as is&quot; and &quot;as available&quot;. To the maximum extent permitted by law we disclaim all warranties and are not
          liable for loss of data stored on your device, loss of profits, or indirect, incidental or consequential damages. Our total liability is limited to
          the amount you paid us for the App in the 12 months before the claim (or, if none, USD 10). Nothing in these Terms limits liability that cannot be
          limited under the law of your country of residence, including mandatory consumer-protection rights.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>8. Termination and service discontinuation · 9. Changes</h2>
        <ul style={li}>
          <li>You may stop using the App at any time by uninstalling it. We may restrict server-side features (notices, inquiries) if you materially breach these Terms.</li>
          <li>
            If we <b>discontinue the service entirely, we will give at least 30 days&apos; prior notice</b> in the App&apos;s notice screen and at this URL. Local features
            may keep working after server-side features end, but ads, purchases and restore may no longer be supported. Where required by law we will refund unused
            paid content through the store&apos;s process.
          </li>
          <li>
            Changes to these Terms are posted at this URL with a new effective date; material changes are announced in the App at least 7 days in advance (30 days
            for changes disadvantageous to you). Continued use after the effective date constitutes acceptance.
          </li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>10. Governing law · 11. Contact and seller information</h2>
        <p style={muted}>
          These Terms are governed by the laws of the Republic of Korea, with disputes subject to its competent courts. Consumers residing elsewhere keep the
          protection of the mandatory consumer-protection provisions of their country of residence, including any right to bring proceedings in local courts. EU
          consumers may refer disputes to an ADR body in their member state (the EU ODR platform was discontinued on 20 July 2025).
        </p>
        <p style={muted}>
          <b>App store terms.</b> Google Play and (if released there) the Apple App Store terms also apply to your download and purchases; the stores are not
          parties to these Terms and owe no maintenance or support. For iOS: these Terms are between you and us, not Apple; Apple has no warranty,
          product-claim, IP-infringement or legal-compliance obligation for the App; you represent you are not in a US-embargoed country or on a US
          prohibited-parties list; Apple and its subsidiaries are third-party beneficiaries entitled to enforce these Terms.
        </p>
        <ul style={li}>
          <li>Operator: Hwiseong Games (brand: Vivace Games Studio) — Representative: Son Hwi-seong</li>
          <li>Business registration no.: 749-25-02260 (Republic of Korea) · Mail-order business report no.: 제2026-울산중구-0170호</li>
          <li>Address: 204, 2F, 22 Seongan 5-gil, Jung-gu, Ulsan, 44421, Republic of Korea</li>
          <li>Email: {SUPPORT_EMAIL} (or in-app &quot;Contact us&quot;)</li>
        </ul>
      </section>
    </main>
  );
}
