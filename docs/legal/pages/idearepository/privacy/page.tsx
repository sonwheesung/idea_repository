// Idea Repository 개인정보처리방침(공개 정적 페이지 · 인증 없음 공개 GET). Play 스토어·AdMob GDPR 메시지의 필수 URL.
// vivace-games.com이 배구 서버 Vercel 프로젝트에 연결돼 있어 형제 앱 Idea Repository의 방침을 여기서 서빙한다(LinkMemo 2026-08-14 방식 승계).
// 배치 위치: volleyball `server/app/idearepository/privacy/page.tsx` → https://vivace-games.com/idearepository/privacy
// ⚠ 이 페이지는 Idea Repository의 Play 데이터 보안 선언(idea_repository `docs/legal/DATA_SAFETY.md`)과 1:1로 일치해야 한다:
//   수집·공유 = 광고 ID·대략적 위치·앱 상호작용·진단(AdMob, 광고 목적) / 수집 = 문의 본문·유형(선택) · 무작위 기기 식별자 ·
//   구매 내역(RevenueCat, 선택). 프로젝트·노트·자료·카테고리·태그·설정은 기기 로컬 전용(서버 전송 없음).
//   선언을 바꾸면 이 페이지도 같이 고친다. 사업자 정보는 /privacy(배구)·/linkmemo/privacy §1과 같은 값
//   (단일 출처 C:\project\common\BUSINESS_INFO.md — 커밋 금지). 정본 관리는 idea_repository 레포 docs/legal/PRIVACY.en.md·PRIVACY.ko.md.
import type { CSSProperties } from 'react';

export const metadata = {
  title: 'Idea Repository — Privacy Policy',
  description:
    'Idea Repository privacy policy: your ideas, projects and notes stay on your device. Details on ads (AdMob), optional inquiries, purchases, and your rights.',
};
export const dynamic = 'force-static';

const SUPPORT_EMAIL = 'support@vivace-games.com';

const card: CSSProperties = {
  background: '#111C2B',
  border: '1px solid #1E2E44',
  borderRadius: 14,
  padding: 20,
  marginTop: 16,
};
const h2: CSSProperties = { fontSize: 18, fontWeight: 800, marginBottom: 10 };
const h3: CSSProperties = { fontSize: 15, fontWeight: 700, color: '#C7D5E5', margin: '10px 0 4px' };
const muted: CSSProperties = { color: '#9FB0C4', lineHeight: 1.85, margin: '6px 0' };
const bullet: CSSProperties = { ...muted, margin: '2px 0', paddingLeft: 12 };
const link: CSSProperties = { color: '#7FB3FF' };
const divider: CSSProperties = { border: 'none', borderTop: '1px solid #1E2E44', margin: '40px 0' };
const table: CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 8 };
const th: CSSProperties = {
  textAlign: 'left',
  color: '#C7D5E5',
  borderBottom: '1px solid #1E2E44',
  padding: '6px 8px',
};
const td: CSSProperties = { color: '#9FB0C4', borderBottom: '1px solid #1E2E44', padding: '6px 8px', verticalAlign: 'top' };

export default function IdeaRepositoryPrivacy() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: 26, fontWeight: 900 }}>Idea Repository — Privacy Policy</h1>
      <p style={{ ...muted, fontSize: 13 }}>Effective date: 2026-08-17 · Last updated: 2026-08-17 (rev. 3)</p>
      <p style={muted}>
        Idea Repository is a personal idea and project organizer. It is built around one principle:{' '}
        <b>your ideas are stored locally on your device and are not uploaded to our servers.</b> Idea Repository has
        no user accounts, no login and no cloud sync. This policy explains the small amount of data that does leave
        your device, why it does, and what your rights are. (한국어 안내는 아래에 있습니다.)
      </p>

      <section style={card}>
        <h2 style={h2}>1. Who we are</h2>
        <p style={bullet}>• Operator (data controller): Hwiseong Games (brand: Vivace Games)</p>
        <p style={bullet}>• Representative: Son Hwi-seong</p>
        <p style={bullet}>• Business registration no.: 749-25-02260 (Republic of Korea)</p>
        <p style={bullet}>• Address: 204, 2F, 22 Seongan 5-gil, Jung-gu, Ulsan, 44421, Republic of Korea</p>
        <p style={bullet}>• Contact / privacy officer: {SUPPORT_EMAIL}</p>
      </section>

      <section style={card}>
        <h2 style={h2}>2. Data that stays on your device</h2>
        <p style={muted}>
          Everything you create in Idea Repository — <b>projects, summaries, descriptions, problems, goals, core
          ideas, target users, progress, status, priority, dates, idea notes, related resources (titles, URLs,
          descriptions), categories, tags, and settings</b> — is stored only in local storage on your device. It is
          not uploaded to our servers, and we cannot read it. If you delete the app or change devices, this data may
          be lost; there is no cloud backup.
        </p>
        <p style={muted}>
          When you tap a related resource, the URL is opened by your device&apos;s browser. The app itself does not
          fetch the page or its icon, so your list of saved resources is not disclosed to any third party by the app.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>3. Data that leaves your device</h2>
        <p style={h3}>a. Advertising (Google AdMob)</p>
        <p style={muted}>
          Idea Repository shows ads served by Google AdMob (a bottom banner and an app-open ad on cold start, at most
          once every 3 hours). For this purpose the AdMob SDK collects and shares with Google and its advertising
          partners: <b>advertising ID (device identifier)</b>, <b>approximate location (derived from IP address)</b>,{' '}
          <b>ad interaction data (app interactions)</b> and <b>device / diagnostic information</b>. In the EEA, the UK
          and Switzerland, ads are shown only in accordance with your choices in the in-app consent form (Google UMP),
          where you can also decline personalized ads. See{' '}
          <a href="https://policies.google.com/privacy" style={link}>
            Google&apos;s Privacy Policy
          </a>{' '}
          and{' '}
          <a href="https://policies.google.com/technologies/partner-sites" style={link}>
            how Google uses information from apps that use its services
          </a>
          . Purchasing &quot;Remove Ads&quot; (where available) stops ad serving entirely.
        </p>
        <p style={muted}>
          <b>How to control ads (anywhere).</b> Android: Settings → Google → Ads → <i>Delete advertising ID</i> or <i>Opt out
          of Ads Personalization</i>. iOS: Settings → Privacy &amp; Security → Tracking, and Apple Advertising → Personalized
          Ads. EEA / UK / Switzerland: the in-app consent form, later Settings → Privacy options.
        </p>
        <p style={muted}>
          <b>What we do not use.</b> No analytics, crash-reporting or attribution SDK (no Firebase, no Google Analytics), no
          social login, no push notifications. Beyond the AdMob SDK and the two requests in 3.b / 3.c the App makes no
          network requests. Android permissions: Internet, advertising ID (AD_ID) and the store billing library — no camera,
          contacts, location, microphone, storage or notification permissions.
        </p>
        <p style={bullet}>• Purpose: ad serving, ad measurement, fraud prevention.</p>
        <p style={bullet}>
          • Legal basis (GDPR): consent (personalized ads, via the consent form); legitimate interest (non-personalized
          ads, fraud prevention).
        </p>
        <p style={bullet}>• Retention: by Google under Google&apos;s policies. We do not receive or store this data.</p>

        <p style={h3}>b. Support inquiries (optional, user-initiated)</p>
        <p style={muted}>
          If you choose to send an inquiry from Settings, we receive: <b>the message you write and its category</b>,
          your <b>platform (Android/iOS) and app version</b>, and a <b>random device identifier (UUID)</b> generated by
          the app and stored in secure storage on your device. The identifier contains no personal details; it only
          lets the app show you replies to your own inquiries. We do not ask for your name or email address. Your IP
          address is used transiently for rate limiting and is not stored with the inquiry. If you never send an
          inquiry, none of this is transmitted.
        </p>
        <p style={bullet}>• Purpose: answering your inquiry, keeping a customer-support record.</p>
        <p style={bullet}>
          • Legal basis (GDPR): performance of a contract / steps at your request; legitimate interest (abuse
          prevention).
        </p>
        <p style={bullet}>
          • Retention: up to 3 years from receipt (consumer-dispute record period under Korean e-commerce law), then
          destroyed.
        </p>

        <p style={h3}>c. App start check (announcements, maintenance, required updates)</p>
        <p style={muted}>
          On launch the app contacts our server once to fetch service notices, maintenance status and version
          requirements. The request carries only the app code, platform and app version. None of your saved content
          is included, and nothing personal is stored from this request.
        </p>
        <p style={bullet}>• Purpose: service operation. Legal basis (GDPR): legitimate interest. Retention: not stored.</p>

        <p style={h3}>d. Purchases (&quot;Remove Ads&quot;)</p>
        <p style={muted}>
          The one-time &quot;Remove Ads&quot; purchase is processed by Google Play (Android) or the Apple App Store
          (iOS), where that purchase is available in your version of the App. We never receive your card or payment
          details. Purchase receipts are validated by RevenueCat (US),
          which keeps an anonymous purchase identifier and purchase history so that &quot;Restore Purchases&quot; works
          after reinstalling or changing devices. We do not link purchases to any account (there are none).
        </p>
        <p style={bullet}>
          • Purpose: delivering and restoring the purchase. Legal basis (GDPR): performance of a contract. Retention: by
          the store and RevenueCat under their policies.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>4. Processors and international transfers</h2>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Recipient</th>
              <th style={th}>Role</th>
              <th style={th}>Data</th>
              <th style={th}>Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>Google (AdMob, Play Billing)</td>
              <td style={td}>Advertising; payment processing</td>
              <td style={td}>Advertising ID, approximate location, ad interactions, device/diagnostic info; purchase records</td>
              <td style={td}>US and global</td>
            </tr>
            <tr>
              <td style={td}>Apple (App Store)</td>
              <td style={td}>Payment processing (iOS)</td>
              <td style={td}>Purchase records</td>
              <td style={td}>US and global</td>
            </tr>
            <tr>
              <td style={td}>RevenueCat</td>
              <td style={td}>Purchase receipt validation and restore</td>
              <td style={td}>Anonymous purchase ID, purchase history</td>
              <td style={td}>US</td>
            </tr>
            <tr>
              <td style={td}>Vercel</td>
              <td style={td}>Application server hosting (inquiries, start check)</td>
              <td style={td}>Inquiry data in transit; transient request logs</td>
              <td style={td}>US / global</td>
            </tr>
            <tr>
              <td style={td}>Supabase</td>
              <td style={td}>Inquiry database hosting</td>
              <td style={td}>Inquiry text, category, platform, app version, device UUID</td>
              <td style={td}>Seoul, Republic of Korea</td>
            </tr>
            <tr>
              <td style={td}>Discord</td>
              <td style={td}>Internal notification of new inquiries to the operator</td>
              <td style={td}>Inquiry text summary</td>
              <td style={td}>US</td>
            </tr>
          </tbody>
        </table>
        <p style={muted}>
          Where data is transferred outside your jurisdiction, we rely on the recipient&apos;s standard contractual
          clauses or equivalent safeguards. Their own privacy policies apply to their processing:{' '}
          <a href="https://policies.google.com/privacy" style={link}>Google</a> ·{' '}
          <a href="https://www.apple.com/legal/privacy/" style={link}>Apple</a> ·{' '}
          <a href="https://www.revenuecat.com/privacy" style={link}>RevenueCat</a> ·{' '}
          <a href="https://vercel.com/legal/privacy-policy" style={link}>Vercel</a> ·{' '}
          <a href="https://supabase.com/privacy" style={link}>Supabase</a> ·{' '}
          <a href="https://discord.com/privacy" style={link}>Discord</a>. Our Google Play Data Safety form and (on iOS) App
          Store privacy label mirror this policy.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>5. Your rights</h2>
        <p style={muted}>
          You can request access to, correction or deletion of the inquiry data described in section 3.b at any time
          via {SUPPORT_EMAIL}. Because we hold no name or email, please include the approximate date and content of the
          inquiry so that we can locate it. Data stored on your device is under your control: deleting the app
          deletes it.
        </p>
        <p style={muted}>
          <b>EEA / UK / Switzerland (GDPR, UK GDPR, Swiss FADP).</b> You have the rights of access, rectification,
          erasure, restriction, data portability and objection, and the right to withdraw consent at any time (for ads:
          Settings → Privacy options in the app — shown where the consent form applies — or your device&apos;s ad
          settings) without affecting prior processing. You may lodge a complaint with your local supervisory authority.
          We respond within one month. We have not appointed an EU/UK representative because our processing is
          occasional, small-scale and low-risk (GDPR Art. 27(2)); contact us directly. We make no automated decisions
          with legal or similarly significant effects.
        </p>
        <p style={muted}>
          <b>California and other US states (CCPA/CPRA and similar laws).</b> You have the right to know, delete and
          correct personal information, and the right to opt out of &quot;sale&quot; or &quot;sharing&quot;. We do not
          sell personal information. The AdMob SDK&apos;s sharing of advertising data for personalized ads may be
          considered &quot;sharing&quot; for cross-context behavioral advertising; you can opt out via the in-app consent
          form (where shown), by turning off personalized ads / resetting the advertising ID in your device settings
          (Android: Settings → Google → Ads; iOS: Settings → Privacy &amp; Security → Tracking), or by purchasing
          &quot;Remove Ads&quot;. We do not knowingly sell or share the personal information of consumers under 16. We
          will not discriminate against you for exercising your rights.
        </p>
        <p style={muted}>
          <b>Republic of Korea (PIPA).</b> You may request access, correction, deletion or suspension of processing of
          your personal information, and you may object to the international transfer of the data in section 4.
          Requests are handled by the privacy officer below within 10 days. Details in the Korean policy below.
        </p>
        <p style={muted}>
          <b>Other countries (e.g. Brazil LGPD, Canada PIPEDA, Australia, Japan APPI, India DPDP).</b> Where local law
          grants you rights of access, correction, deletion, portability, objection or complaint to a local authority,
          exercise them through the same contact; we honor them to the extent that law requires. Deletion of an inquiry
          covers the database record and the operator&apos;s notification copy.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>6. Children</h2>
        <p style={muted}>
          Idea Repository is not directed at children under 13 — or the higher minimum age in your country (14 in the
          Republic of Korea; up to 16 in some EEA member states for consent to ad personalization) — and we do not
          knowingly collect their personal data. Ads shown to users who have not consented are not personalized. If you believe a child has sent us an inquiry, contact us and we will
          delete it.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>7. Security and honest limits</h2>
        <p style={muted}>
          All transmissions described above use encrypted connections (HTTPS). Inquiry records are stored with access
          controls and are accessible only to the operator. Data stored locally on your device is protected by your
          device&apos;s own security (screen lock, device encryption). We cannot guarantee absolute security: shared
          devices, malware, device loss, OS vulnerabilities or device backups you create are outside our control. Your
          device&apos;s own backup features (Android Auto Backup / Google One, iCloud Backup) may copy app data to Google&apos;s
          or Apple&apos;s servers under your account and settings — that copy is governed by their policies, not by us.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>8. Changes &amp; contact</h2>
        <p style={muted}>
          We will post any changes to this policy at this URL with a new effective date; material changes will also be
          announced in the app&apos;s notice screen. Questions: {SUPPORT_EMAIL}. Privacy officer (개인정보 보호책임자):
          Son Hwi-seong, Representative — {SUPPORT_EMAIL}.
        </p>
      </section>

      <hr style={divider} />

      <h1 style={{ fontSize: 24, fontWeight: 900 }}>Idea Repository — 개인정보처리방침 (한국어)</h1>
      <p style={{ ...muted, fontSize: 13 }}>시행일: 2026-08-17 · 최종 수정: 2026-08-17</p>
      <p style={muted}>
        휘성게임즈(브랜드 표기 Vivace Games, 이하 &quot;회사&quot;)는 「개인정보 보호법」 제30조에 따라 다음과 같이 개인정보
        처리방침을 수립·공개합니다. Idea Repository(이하 &quot;앱&quot;)는 회원가입·로그인·클라우드 동기화가 없는 개인용 로컬
        아이디어 보관함으로, 이용자가 작성한 아이디어는 이용자 기기에만 저장되며 회사 서버로 전송되지 않습니다.
      </p>

      <section style={card}>
        <h2 style={h2}>제1조 처리 목적</h2>
        <p style={bullet}>• 문의 응대: 앱 내 &quot;문의하기&quot;로 보낸 문의의 접수·답변·상태 안내, 소비자 상담 기록 보존</p>
        <p style={bullet}>• 서비스 운영: 앱 실행 시 공지·점검·필수 업데이트 여부 확인(부팅 조회)</p>
        <p style={bullet}>• 광고 게재: Google AdMob을 통한 배너·앱 오픈 광고 게재·측정(제3자 수집 — 제9조)</p>
        <p style={bullet}>• 유료 결제: &quot;광고 제거(Remove Ads)&quot; 일회성 구매의 제공 및 구매 복원</p>
      </section>

      <section style={card}>
        <h2 style={h2}>제2조 처리하는 개인정보 항목 및 수집 방법</h2>
        <p style={muted}>
          <b>기기에만 저장되는 정보(회사 미수집)</b>: 프로젝트명·요약·설명·문제점·목표·핵심 아이디어·타겟 사용자·진행률·상태·
          우선순위·시작일·마감일·아이디어 노트·관련 자료(제목·URL·설명)·카테고리·태그·설정. 이용자 기기(SQLite·앱 저장소)에만
          저장되며 회사는 열람할 수 없고, 앱 삭제·기기 변경 시 함께 사라질 수 있습니다(클라우드 백업 없음).
        </p>
        <p style={bullet}>
          • <b>문의하기(선택)</b>: 문의 본문·문의 유형, 플랫폼(Android/iOS)·앱 버전, 앱이 생성한 무작위 기기 식별자(UUID) — 이용자가
          문의 화면에서 직접 입력·전송할 때만. UUID는 이름·이메일 등 어떤 개인정보도 포함하지 않으며 본인 문의의 답변 확인 용도로만 쓰입니다.
        </p>
        <p style={bullet}>• <b>부팅 조회(자동)</b>: 앱 코드·플랫폼·앱 버전 — 저장하지 않음.</p>
        <p style={bullet}>• <b>접속 정보</b>: IP 주소 — 문의 전송 요청 제한에 일시 사용 후 저장하지 않음.</p>
        <p style={bullet}>
          • <b>제3자(SDK) 자동 수집</b>: Google AdMob — 광고 식별자(ADID/IDFA), IP 기반 대략적 위치, 광고 상호작용, 기기·진단 정보(광고
          게재·측정) / RevenueCat — 익명 구매 식별자, 구매 이력(구매 검증·복원) / 스토어 — 결제 정보(스토어가 직접 처리).
        </p>
        <p style={bullet}>
          • <b>사용하지 않는 것</b>: 분석·비정상 종료 보고·어트리뷰션 SDK(Firebase·Google Analytics 등), 소셜 로그인, 푸시 알림 없음. AdMob SDK와 위 두
          요청(문의·부팅 조회) 외 네트워크 요청 없음. Android 권한은 인터넷·광고 ID(AD_ID)·스토어 결제 라이브러리뿐(카메라·연락처·위치·마이크·저장소·알림
          권한 없음).
        </p>
        <p style={bullet}>
          • <b>기기 백업</b>: 기기 자체 백업 기능(Android 자동 백업 / Google One, iCloud 백업)이 이용자 본인 계정·설정에 따라 앱 데이터를 Google·Apple
          서버에 복사할 수 있으며, 이는 회사 통제 밖으로 각 사 정책을 따릅니다.
        </p>
        <p style={bullet}>• 회사는 이름·이메일·전화번호·주소·결제 카드 정보를 수집하지 않습니다.</p>
      </section>

      <section style={card}>
        <h2 style={h2}>제3조 보유 기간 · 제4조 파기</h2>
        <p style={bullet}>
          • 문의 기록(본문·유형·플랫폼·앱 버전·기기 식별자): <b>접수일로부터 3년</b> 후 파기 — 전자상거래법 시행령 제6조(소비자 불만·분쟁처리
          기록). 이용자 요청 시 10일 이내 파기.
        </p>
        <p style={bullet}>• 부팅 조회 정보·IP: 저장하지 않음(처리 후 즉시 폐기).</p>
        <p style={bullet}>• 광고·결제 SDK 수집 정보: 각 사업자 정책에 따름(회사 미보유).</p>
        <p style={bullet}>• 파기 방법: 전자적 파일은 복구 불가능한 방법으로 데이터베이스에서 영구 삭제. 종이 문서 없음.</p>
      </section>

      <section style={card}>
        <h2 style={h2}>제5조 제3자 제공 · 제6조 처리위탁 · 제7조 국외 이전</h2>
        <p style={muted}>
          회사는 「개인정보 보호법」 제17조·제18조에 해당하는 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다. 광고 SDK가 Google에
          전송하는 행태정보는 제9조와 아래 국외 이전 표에 따릅니다.
        </p>
        <p style={muted}>
          <b>처리위탁(제26조)</b> — 위탁계약에 목적 외 처리 금지·보호조치·재위탁 제한을 규정하며, 수탁자 변경 시 이 방침으로 공개합니다.
        </p>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>수탁자</th>
              <th style={th}>위탁 업무</th>
              <th style={th}>위탁 항목</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>Supabase, Inc.</td>
              <td style={td}>문의 데이터베이스 호스팅(서울 리전)</td>
              <td style={td}>문의 본문·유형, 플랫폼·앱 버전, 기기 식별자</td>
            </tr>
            <tr>
              <td style={td}>Vercel Inc.</td>
              <td style={td}>애플리케이션 서버 호스팅(문의·부팅 조회 처리)</td>
              <td style={td}>위 항목의 전송·처리, 일시적 요청 로그</td>
            </tr>
            <tr>
              <td style={td}>RevenueCat, Inc.</td>
              <td style={td}>인앱결제 영수증 검증·구매 복원(광고 제거 제공 버전)</td>
              <td style={td}>익명 구매 식별자, 구매 이력</td>
            </tr>
            <tr>
              <td style={td}>Discord Inc.</td>
              <td style={td}>신규 문의 접수 시 운영자 내부 알림</td>
              <td style={td}>문의 본문 요약</td>
            </tr>
          </tbody>
        </table>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>이전받는 자(연락처)</th>
              <th style={th}>국가</th>
              <th style={th}>시기·방법</th>
              <th style={th}>항목</th>
              <th style={th}>목적 · 보유 기간</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>Google LLC (AdMob) — policies.google.com/privacy</td>
              <td style={td}>미국 등</td>
              <td style={td}>광고 요청 시 SDK 네트워크 전송</td>
              <td style={td}>광고 식별자, 대략적 위치, 광고 상호작용, 기기·진단 정보</td>
              <td style={td}>광고 게재·측정 · Google 정책</td>
            </tr>
            <tr>
              <td style={td}>Google LLC (Play) / Apple Inc. (App Store)</td>
              <td style={td}>미국</td>
              <td style={td}>구매 시 스토어 결제</td>
              <td style={td}>구매 기록</td>
              <td style={td}>결제 처리 · 각 사 정책</td>
            </tr>
            <tr>
              <td style={td}>RevenueCat, Inc. — support@revenuecat.com</td>
              <td style={td}>미국</td>
              <td style={td}>구매·복원 시 SDK 전송</td>
              <td style={td}>익명 구매 식별자, 구매 이력</td>
              <td style={td}>영수증 검증·복원 · RC 정책</td>
            </tr>
            <tr>
              <td style={td}>Vercel Inc. — privacy@vercel.com</td>
              <td style={td}>미국 등</td>
              <td style={td}>문의·부팅 조회 시 전송</td>
              <td style={td}>문의 항목 일체(전송 처리), 일시적 요청 로그</td>
              <td style={td}>서버 호스팅(위탁) · 처리 후 즉시</td>
            </tr>
            <tr>
              <td style={td}>Discord Inc. — privacy@discord.com</td>
              <td style={td}>미국</td>
              <td style={td}>문의 접수 시 웹훅</td>
              <td style={td}>문의 본문 요약</td>
              <td style={td}>운영자 알림(위탁) · 회사 삭제 시까지</td>
            </tr>
          </tbody>
        </table>
        <p style={muted}>
          문의 데이터베이스 호스팅은 Supabase, Inc.(위탁)의 대한민국 서울(ap-northeast-2) 리전에 보관됩니다. 이용자는 국외 이전을 거부할 수
          있으며(제8조 연락처), 거부 시 문의하기 이용이 제한될 수 있고 광고는 기기 설정·앱 내 동의 철회로 거부할 수 있습니다.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>제8조 정보주체의 권리 · 행사 방법</h2>
        <p style={bullet}>
          • 정보주체는 언제든지 열람·정정·삭제·처리정지 요구, 국외 이전 거부, 동의 철회를 할 수 있습니다. 이메일({SUPPORT_EMAIL})로
          요청하시면 10일 이내 조치합니다.
        </p>
        <p style={bullet}>
          • 회사는 이름·이메일을 보유하지 않으므로 문의 기록의 열람·삭제 요청 시 <b>문의를 보낸 대략의 시점과 내용</b>을 함께 알려 주세요.
        </p>
        <p style={bullet}>• 법정대리인·위임받은 대리인을 통한 행사 가능(위임장 제출).</p>
        <p style={bullet}>• 기기에만 저장된 아이디어 데이터는 이용자가 직접 관리·삭제하며 회사가 대신 열람·삭제할 수 없습니다.</p>
      </section>

      <section style={card}>
        <h2 style={h2}>제9조 자동 수집 장치(광고 식별자·행태정보) 및 거부 방법</h2>
        <p style={muted}>
          앱은 Google AdMob 광고 SDK를 포함하며, 광고 게재·측정을 위해 광고 식별자, IP 기반 대략적 위치, 광고 상호작용, 기기·진단 정보가
          Google 및 광고 파트너에 수집·공유됩니다. 회사는 이를 직접 보유하지 않습니다.
        </p>
        <p style={bullet}>• Android: 설정 → Google → 광고 → 광고 ID 재설정/삭제, 광고 개인 최적화 선택 해제</p>
        <p style={bullet}>• iOS: 설정 → 개인정보 보호 및 보안 → 추적 끄기 / Apple 광고 → 맞춤형 광고 끄기</p>
        <p style={bullet}>• EEA·영국·스위스: 앱 내 동의 폼(Google UMP)에서 맞춤 광고 거부, 이후 앱 설정의 개인정보 옵션에서 변경</p>
        <p style={bullet}>• &quot;광고 제거&quot; 구매 시 광고 요청 자체가 발생하지 않습니다.</p>
      </section>

      <section style={card}>
        <h2 style={h2}>제10조 안전성 확보 조치</h2>
        <p style={muted}>
          모든 전송 구간 HTTPS 암호화, 데이터베이스 접근 통제(서버만 접근·앱은 본인 기기 문의만 조회), 문의 전송 요청 제한, 이름·이메일 등
          식별 정보 미수집, 취급자 최소화(대표자 1인). 기기 저장 데이터의 보호는 기기 자체 보안(화면 잠금·기기 암호화)에 의존하며, 회사는
          기기 공유·악성코드·분실·OS 취약점·이용자 백업 파일 노출까지 막을 수 없으므로 절대적 안전을 보장하지 않습니다.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>제11조 개인정보 보호책임자 · 열람청구 접수 부서 · 제12조 권익침해 구제</h2>
        <p style={bullet}>• 개인정보 보호책임자: 손휘성(대표) · {SUPPORT_EMAIL}</p>
        <p style={bullet}>• 열람청구 접수·처리: 휘성게임즈 대표 직접 처리 — {SUPPORT_EMAIL} (또는 앱 내 &quot;문의하기&quot;)</p>
        <p style={bullet}>
          • 개인정보 분쟁조정위원회 1833-6972(kopico.go.kr) · 개인정보 침해신고센터 118(privacy.kisa.or.kr) · 대검찰청 1301 · 경찰청 182
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>제13조 아동 · 제14조 변경 · 처리자 정보</h2>
        <p style={muted}>
          앱은 만 14세 미만 아동(국외 만 13세 미만 또는 해당국 법령상 더 높은 연령 — 일부 EEA 회원국 만 16세)을 대상으로 하지 않으며 아동의 개인정보를 알면서 수집하지 않습니다. 방침 변경 시 시행 7일 전
          (중대한 변경은 30일 전)부터 본 URL과 앱 내 공지사항에 게시합니다. 개정 이력: 2026-08-17 최초 제정.
        </p>
        <p style={bullet}>• 상호: 휘성게임즈 (브랜드 표기 Vivace Games) · 대표 손휘성</p>
        <p style={bullet}>• 사업자등록번호: 749-25-02260</p>
        <p style={bullet}>• 주소: 울산광역시 중구 성안5길 22, 2층 204호(성안동), 우 44421</p>
        <p style={bullet}>• 문의: {SUPPORT_EMAIL}</p>
      </section>
    </main>
  );
}
