import Purchases, { LOG_LEVEL, PURCHASES_ERROR_CODE, type PurchasesPackage } from 'react-native-purchases';

import { useAdsStore } from '@/features/ads/store';
import { usePurchaseStore } from '@/features/purchase/store';

// Remove Ads — RevenueCat 익명 모드 (docs/MONETIZATION_SYSTEM.md §4·§4.1)
// 🔴 Purchases.logIn()을 부르지 않는다. Idea Repository는 회원이 없어 매칭할 subject가 없다 —
//    익명 ID($RCAnonymousID)가 그대로 구매의 주인이고, 복원은 스토어 계정 이력으로 한다.
// 어떤 실패도 앱 사용을 막지 않는다: 실패하면 캐시된 상태가 유지될 뿐이다.

const ENTITLEMENT = 'remove_ads';
const API_KEY = process.env.EXPO_PUBLIC_RC_ANDROID_KEY ?? '';

let configured = false;

/** 키가 없으면(개발 편의 빌드 등) 결제 UI 자체를 숨긴다 — 눌러도 안 되는 버튼을 두지 않는다 */
export function purchasesAvailable(): boolean {
  return API_KEY.length > 0;
}

/** 캐시를 게이트에 즉시 반영한 뒤, 백그라운드로 스토어에 재확인한다 */
export async function initPurchases(): Promise<void> {
  applyOwned(usePurchaseStore.getState().owned);
  if (configured || !purchasesAvailable()) return;
  configured = true;

  try {
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.WARN : LOG_LEVEL.ERROR);
    await Purchases.configure({ apiKey: API_KEY });
    await refreshEntitlement();
  } catch {
    // 초기화·조회 실패 — 캐시된 상태 그대로 간다 (지우지 않는다)
  }
}

/**
 * 스토어에 현재 권한을 물어 캐시를 갱신한다.
 * 🔴 성공 응답일 때만 값을 내린다 — 실패는 "안 샀다"가 아니라 "모른다"이다.
 */
export async function refreshEntitlement(): Promise<void> {
  if (!purchasesAvailable()) return;
  try {
    const info = await Purchases.getCustomerInfo();
    applyOwned(info.entitlements.active[ENTITLEMENT] !== undefined);
  } catch {
    // 오프라인·일시 오류 — 캐시 유지
  }
}

/** 현재 offering의 Remove Ads 패키지. 없으면 null(상품 미등록·offering 미구성) */
export async function getRemoveAdsPackage(): Promise<PurchasesPackage | null> {
  if (!purchasesAvailable()) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages[0] ?? null;
  } catch {
    return null;
  }
}

export type PurchaseOutcome = 'purchased' | 'cancelled' | 'failed';

/** 구매. 사용자가 닫은 것은 실패가 아니다 — 조용히 돌아간다 */
export async function purchaseRemoveAds(pkg: PurchasesPackage): Promise<PurchaseOutcome> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    applyOwned(customerInfo.entitlements.active[ENTITLEMENT] !== undefined);
    return 'purchased';
  } catch (e) {
    const code = (e as { code?: string }).code;
    if (code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return 'cancelled';
    // 이미 소유한 상품은 오류가 아니라 복원 신호다 (store-iap-setup 스킬 §6.1)
    if (code === PURCHASES_ERROR_CODE.PRODUCT_ALREADY_PURCHASED_ERROR) {
      await restorePurchases();
      return usePurchaseStore.getState().owned ? 'purchased' : 'failed';
    }
    return 'failed';
  }
}

/** 복원 — 같은 스토어 계정의 구매 이력 기준. 회사 로그인 불필요 */
export async function restorePurchases(): Promise<boolean> {
  if (!purchasesAvailable()) return false;
  try {
    const info = await Purchases.restorePurchases();
    const owned = info.entitlements.active[ENTITLEMENT] !== undefined;
    applyOwned(owned);
    return owned;
  } catch {
    return false;
  }
}

function applyOwned(owned: boolean): void {
  usePurchaseStore.getState().setOwned(owned);
  useAdsStore.getState().setRemoveAds(owned);
}
