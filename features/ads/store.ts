import { create } from 'zustand';

// 광고 게이트의 단일 출처 (docs/MONETIZATION_SYSTEM.md §3) — LinkMemo 승계.
// Phase 7에서 Remove Ads 구매 상태가 여기 연결된다 — 게이트는 이 store 한 곳만 본다.
interface AdsState {
  /** SDK 초기화(+동의 흐름) 완료 여부 */
  ready: boolean;
  /** Remove Ads 구매 여부 — Phase 7에서 RevenueCat과 연결 */
  removeAds: boolean;
  /** 콜드 스타트 App Open 흐름이 끝났는가(안 띄웠거나·실패했거나·닫혔거나) */
  startupAdSettled: boolean;
  /** UMP 개인정보 옵션 재진입이 필요한 지역인가(EEA·영국·스위스) — 설정 행 노출 여부 */
  privacyOptionsRequired: boolean;
  setReady: (ready: boolean) => void;
  setRemoveAds: (removeAds: boolean) => void;
  setStartupAdSettled: () => void;
  setPrivacyOptionsRequired: (required: boolean) => void;
}

export const useAdsStore = create<AdsState>()((set) => ({
  ready: false,
  removeAds: false,
  startupAdSettled: false,
  privacyOptionsRequired: false,
  setReady: (ready) => set({ ready }),
  setRemoveAds: (removeAds) => set({ removeAds }),
  setStartupAdSettled: () => set({ startupAdSettled: true }),
  setPrivacyOptionsRequired: (privacyOptionsRequired) => set({ privacyOptionsRequired }),
}));

export function adsEnabled(): boolean {
  const s = useAdsStore.getState();
  return s.ready && !s.removeAds;
}
