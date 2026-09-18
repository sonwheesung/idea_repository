import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Remove Ads 구매 상태의 로컬 캐시 (docs/MONETIZATION_SYSTEM.md §4.1)
// 진실은 스토어(RevenueCat)지만, 조회에는 네트워크가 필요하다 — 그동안 광고가 번쩍이지 않도록
// 마지막으로 확인된 값을 저장해 두고 앱 시작 즉시 게이트에 적용한다.
// 🔴 조회 실패에는 이 값을 지우지 않는다. 비행기 모드에서 구매자가 광고를 보는 일은 없어야 한다.
interface PurchaseState {
  owned: boolean;
  setOwned: (owned: boolean) => void;
}

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set) => ({
      owned: false,
      setOwned: (owned) => set({ owned }),
    }),
    {
      name: 'idearepository.purchase',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
