import mobileAds, {
  AdsConsent,
  AdsConsentPrivacyOptionsRequirementStatus,
  AdsConsentStatus,
} from 'react-native-google-mobile-ads';

import { useAdsStore } from '@/features/ads/store';

// 광고 초기화 — UMP 동의(EEA·영국·스위스)를 먼저, 그다음 SDK init (docs/MONETIZATION_SYSTEM.md §3).
// 어떤 실패도 앱 사용을 막지 않는다: 실패하면 ready=false로 남아 광고만 안 나갈 뿐이다.
let started = false;

export async function initAds(): Promise<void> {
  if (started) return;
  started = true;

  let canRequestAds = true;
  try {
    // EEA·영국·스위스에서만 REQUIRED가 온다. 그 외 지역은 NOT_REQUIRED — 폼 없이 통과.
    let info = await AdsConsent.requestInfoUpdate();
    if (info.isConsentFormAvailable && info.status === AdsConsentStatus.REQUIRED) {
      info = await AdsConsent.showForm();
    }
    canRequestAds = info.canRequestAds;
    // 동의를 다시 바꿀 수단(Google EU 사용자 동의 정책) — 설정 화면의 "Privacy options" 행 노출 여부.
    useAdsStore
      .getState()
      .setPrivacyOptionsRequired(
        info.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED,
      );
  } catch {
    // 동의 조회 실패(오프라인 등) — 다음 콜드 스타트에서 다시 시도된다. 조회 자체가 안 되면 SDK는 초기화한다(비EEA 대다수).
  }

  if (!canRequestAds) return; // 동의를 거부·미완료 — 광고 요청 자체를 하지 않는다(앱은 정상 동작)

  try {
    await mobileAds().initialize();
    useAdsStore.getState().setReady(true);
  } catch {
    // 초기화 실패 — 광고 없이 계속
  }
}

/** 설정 → Privacy options. UMP 개인정보 옵션 폼을 다시 연다(EEA·영국·스위스에서만 행이 보인다). */
export async function showPrivacyOptions(): Promise<void> {
  try {
    const info = await AdsConsent.showPrivacyOptionsForm();
    // 동의를 새로 허용했고 아직 SDK가 안 올라와 있으면 이번 세션에서 바로 살린다.
    if (info.canRequestAds && !useAdsStore.getState().ready) {
      await mobileAds().initialize();
      useAdsStore.getState().setReady(true);
    }
  } catch {
    // 폼 표시 실패 — 무시(다음 시도 가능)
  }
}
