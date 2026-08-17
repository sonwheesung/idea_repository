import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OnboardingState {
  /** 첫 실행 프라이버시 웰컴 시트를 닫았는가 — 다시 뜨지 않는다(설정 → About에서 다시 볼 수 있다) */
  welcomeSeen: boolean;
  /** persist 복원 완료 전에는 시트를 그리지 않는다(재방문 사용자에게 깜빡임 방지) */
  hydrated: boolean;
  markWelcomeSeen: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      welcomeSeen: false,
      hydrated: false,
      markWelcomeSeen: () => set({ welcomeSeen: true }),
    }),
    {
      name: 'idearepository-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ welcomeSeen: s.welcomeSeen }),
      onRehydrateStorage: () => (state) => {
        // 복원 후에도 hydrated는 저장하지 않으므로 여기서 켠다
        useOnboardingStore.setState({ hydrated: true, welcomeSeen: state?.welcomeSeen ?? false });
      },
    },
  ),
);
