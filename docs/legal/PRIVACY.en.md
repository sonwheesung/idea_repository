# Idea Repository — Privacy Policy

Effective date: 2026-08-17 · Last updated: 2026-09-01 (rev. 5 — device identifier at first launch and active-user statistics; effective 2026-09-01)

> Publication target: `https://vivace-games.com/idearepository/privacy` (EN main + KO section).
> This document is the source text; the published page (`docs/legal/pages/idearepository/privacy/page.tsx`) and the
> Google Play Data Safety form (`docs/legal/DATA_SAFETY.md`) must stay 1:1 consistent with it. Business facts come from
> `C:\project\common\BUSINESS_INFO.md` (not committed). Korean version: `PRIVACY.ko.md`.

Idea Repository is a personal idea and project organizer. It is built around one principle: **your ideas are stored
locally on your device and are not uploaded to our servers.** Idea Repository has no user accounts, no login and no
cloud sync. This policy explains the small amount of data that does leave your device, why it does, and what your
rights are. (한국어 안내는 별도 페이지 하단에 있습니다.)

## 1. Who we are

- Operator (data controller): Hwiseong Games (brand: Vivace Games Studio)
- Representative: Son Hwi-seong
- Business registration no.: 749-25-02260 (Republic of Korea)
- Address: 204, 2F, 22 Seongan 5-gil, Jung-gu, Ulsan, 44421, Republic of Korea
- Contact / privacy officer: support@vivace-games.com

## 2. Data that stays on your device

Everything you create in Idea Repository — **projects, summaries, descriptions, problems, goals, core ideas, target
users, progress, status, priority, dates, idea notes, related resources (titles, URLs, descriptions), categories,
tags, and settings (theme, language, filters)** — is stored only in local storage on your device (SQLite / app
storage). It is not uploaded to our servers, and we cannot read it. If you delete the app or change devices, this
data may be lost; there is no cloud backup. Settings → Backup can export all of this data as a single file created on
your device and handed to the app or location **you** choose via the system share sheet (and import it back later); we
never receive that file. Note that your device's own backup features (Android Auto Backup /
Google One, iCloud Backup) may copy app data to Google's or Apple's servers under **your** account and settings — that
copy is outside our control and governed by their policies.

When you tap a related resource, the URL is opened by your device's browser. The app itself does not fetch the page or
its icon, so your list of saved resources is not disclosed to any third party by the app.

## 3. Data that leaves your device

### a. Advertising (Google AdMob)

Idea Repository shows ads served by Google AdMob (a bottom banner and an app-open ad on cold start, at most once every
3 hours). For this purpose the AdMob SDK collects and shares with Google and its advertising partners: **advertising
ID (device identifier)**, **approximate location (derived from IP address)**, **ad interaction data (app
interactions)** and **device / diagnostic information**. In the EEA, the UK and Switzerland, ads are shown only in
accordance with your choices in the in-app consent form (Google UMP), where you can also decline personalized ads.
See [Google's Privacy Policy](https://policies.google.com/privacy) and
[how Google uses information from apps that use its services](https://policies.google.com/technologies/partner-sites).
Purchasing "Remove Ads" stops ad serving entirely.

- Purpose: ad serving, ad measurement, fraud prevention.
- Legal basis (GDPR): consent (personalized ads, via the consent form); legitimate interest (non-personalized ads,
  fraud prevention).
- Retention: by Google under Google's policies. We do not receive or store this data ourselves.

**How to control ads (anywhere in the world).** Android: Settings → Google → Ads → *Delete advertising ID* or *Opt out
of Ads Personalization*. iOS: Settings → Privacy & Security → Tracking (turn off *Allow Apps to Request to Track*) and
Apple Advertising → Personalized Ads. EEA / UK / Switzerland: the in-app consent form, later Settings → Privacy options.
Any region: the one-time "Remove Ads" purchase, where available, stops ad requests entirely.

**What we do not use.** The App contains no analytics, crash-reporting or attribution SDK (no Firebase, no Google
Analytics), no social login and no push notifications. Beyond the AdMob SDK and the requests described in 3.b and
3.c (inquiries, the one-time device registration and the start check), the App makes no network requests. Android permissions requested: Internet, advertising ID (`AD_ID`), and the
store billing library — no camera, contacts, location, microphone, storage or notification permissions.

### b. Support inquiries (optional, user-initiated)

If you choose to send an inquiry from Settings, we receive: **the message you write and its category**, your
**platform (Android/iOS) and app version**, and the **random device identifier (UUID)** described in 3.c. The
identifier contains no personal details; for inquiries it only lets the app show you replies to your own inquiries.
We do not ask for your name or email address. Your IP address is used transiently for rate limiting and is not stored
with the inquiry. If you never send an inquiry, no message content is transmitted.

- Purpose: answering your inquiry, keeping a customer-support record.
- Legal basis (GDPR): performance of a contract / steps at your request; legitimate interest (abuse prevention).
- Retention: up to 3 years from receipt (consumer-dispute record period under Korean e-commerce law), then destroyed.

### c. App start check (announcements, maintenance, required updates) and active-user statistics

On launch the app contacts our server once to fetch service notices, maintenance status and version requirements. The
request carries the app code, platform and app version (plus the standard connection data of any internet request,
such as your IP address, which our hosting provider processes transiently). None of your saved content is included.

**Device identifier.** On first launch the app generates a **random device identifier (UUID)**, stores it in secure
storage on your device and registers it with our server once. From then on the start check carries a session tied to
that identifier, and our server records **that this device was active on that day** — one row per device per day
(app code, device identifier, date), nothing else. We use these rows only to count daily, weekly and monthly active
users so that we know whether the service is being used. The identifier contains no name, email or other personal
details, is not the advertising ID, is not shared with anyone and is not used for advertising or tracking. Deleting
the app breaks the link (a reinstall generates a new identifier).

- Purpose: service operation (notices, maintenance gate, update prompts); service usage statistics (active-user
  counts).
- Legal basis (GDPR): legitimate interest in operating and measuring the service.
- Retention: request data is not stored beyond transient server processing. Active-day rows are kept for **400 days**
  (to allow year-over-year comparison), then destroyed. The device identifier itself is deleted on request (see
  section 5).

### d. Purchases ("Remove Ads")

Where the one-time "Remove Ads" purchase is available in your version of the App, it is processed by Google Play
(Android) or the Apple App Store (iOS). We never receive
your card or payment details. Purchase receipts are validated by RevenueCat (US), which keeps an anonymous purchase
identifier and purchase history so that "Restore Purchases" works after reinstalling or changing devices. We do not
link purchases to any account (there are none).

- Purpose: delivering and restoring the purchase.
- Legal basis (GDPR): performance of a contract.
- Retention: by the store and RevenueCat under their policies.

## 4. Processors and international transfers

| Recipient | Role | Data | Location |
|---|---|---|---|
| Google (AdMob, Play Billing) | Advertising; payment processing | Advertising ID, approximate location, ad interactions, device/diagnostic info; purchase records | US and global |
| Apple (App Store) | Payment processing (iOS) | Purchase records | US and global |
| RevenueCat | Purchase receipt validation and restore | Anonymous purchase ID, purchase history | US |
| Vercel | Application server hosting (inquiries, start check) | Inquiry data in transit; transient request logs | US / global |
| Supabase | Inquiry and statistics database hosting | Inquiry text, category, platform, app version, device UUID; active-day rows (device UUID + date) | Seoul, Republic of Korea |
| Discord | Internal notification of new inquiries to the operator | Inquiry text summary | US |

Where data is transferred outside your jurisdiction, we rely on the recipient's standard contractual clauses or
equivalent safeguards. Their own privacy policies apply to their processing: [Google](https://policies.google.com/privacy)
· [Apple](https://www.apple.com/legal/privacy/) · [RevenueCat](https://www.revenuecat.com/privacy) ·
[Vercel](https://vercel.com/legal/privacy-policy) · [Supabase](https://supabase.com/privacy) ·
[Discord](https://discord.com/privacy). Our Google Play Data Safety form and (on iOS) App Store privacy label mirror
this policy.

## 5. Your rights

You can request access to, correction or deletion of the inquiry data described in section 3.b and the device
identifier and active-day rows described in 3.c at any time via support@vivace-games.com. Because we hold no name or
email, please include the approximate date and content of the inquiry so that we can locate it; for the device
identifier, the easiest way is to send the deletion request from the in-app inquiry screen (Settings → Inquiry),
because that message carries the identifier and lets us find exactly your records. Deletion covers the database
records and the operator's notification copy (section 4). Data stored on your device is under your control: deleting
the app deletes it.

**EEA / UK / Switzerland (GDPR, UK GDPR, Swiss FADP).** You have the rights of access, rectification, erasure,
restriction, data portability and objection, and the right to withdraw consent at any time (for ads: Settings →
Privacy options in the app — shown where the consent form applies — or your device's ad settings) without affecting
prior processing. You may lodge a complaint with your local supervisory authority. We respond within one month. We
have not appointed an EU/UK representative because our processing is occasional, small-scale and low-risk (GDPR
Art. 27(2)); contact us directly at the address below. We do not make automated decisions with legal or similarly
significant effects.

**California and other US states (CCPA/CPRA and similar laws).** You have the right to know, delete and correct
personal information, and the right to opt out of "sale" or "sharing". We do not sell personal information. The
AdMob SDK's sharing of advertising data for personalized ads may be considered "sharing" for cross-context behavioral
advertising; you can opt out via the in-app consent form (where shown), by turning off personalized ads / resetting the
advertising ID in your device settings (Android: Settings → Google → Ads; iOS: Settings → Privacy & Security →
Tracking), or by purchasing "Remove Ads". We do not knowingly sell or share the personal information of consumers
under 16. We will not discriminate against you for exercising your rights.

**Republic of Korea (PIPA).** You may request access, correction, deletion or suspension of processing of your
personal information, and you may object to the international transfer of the data in section 4. Requests are handled
by the privacy officer below within 10 days. Details in the Korean policy.

**Other countries (e.g. Brazil LGPD, Canada PIPEDA, Australia Privacy Act, Japan APPI, India DPDP).** Where local
law grants you rights of access, correction, deletion, portability, objection or complaint to a local authority, you
can exercise them through the same contact, and we will honor them to the extent required by that law.

## 6. Children

Idea Repository is not directed at children under 13 — or under the higher minimum age that applies in your country
(14 in the Republic of Korea; up to 16 in some EEA member states for consent to ad personalization) — and we do not
knowingly collect their personal data. Ads shown to users who have not consented are not personalized. If you believe a child has sent us an inquiry, contact us and we will delete it.

## 7. Security and honest limits

All transmissions described above use encrypted connections (HTTPS). Inquiry records are stored with access controls
and are accessible only to the operator. Data stored locally on your device is protected by your device's own
security (screen lock, device encryption). We cannot guarantee absolute security: shared devices, malware, device
loss, OS vulnerabilities or device backups you create are outside our control.

## 8. Changes

We will post any changes to this policy at the publication URL with a new effective date. Material changes will also
be announced in the app's notice screen.

Revision history: 2026-08-17 first version · 2026-08-17 rev. 2 (global review: Switzerland and other-jurisdiction
rights, minimum age by country, connection data of the start check, deletion scope, Remove Ads availability) ·
2026-08-17 rev. 3 (peer-app benchmark: OS backup caveat, global ad controls, "what we do not use" and permissions,
processor policy links, Data Safety mirror) · 2026-08-21 rev. 4 (§2: local backup export/import file — created on
device, shared only where you choose, never received by us; effective 2026-08-28) · 2026-09-01 rev. 5 (§3.b–c, §4, §5:
the random device identifier is now generated at first launch, not only when you send an inquiry, and the start check
carries it so that we can count active users — one row per device per day, kept 400 days; not the advertising ID,
not shared, not used for ads; effective 2026-09-01).

## 9. Contact

- Email: support@vivace-games.com
- Privacy officer (개인정보 보호책임자): Son Hwi-seong, Representative — support@vivace-games.com
- Postal: Hwiseong Games, 204, 2F, 22 Seongan 5-gil, Jung-gu, Ulsan, 44421, Republic of Korea
