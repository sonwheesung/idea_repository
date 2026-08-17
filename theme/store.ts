import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_THEME_MODE, THEME_MODES, type ThemeMode } from '@/theme/palettes';

interface ThemeState {
  /** system = 기기 설정 따르기 (기본) */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: DEFAULT_THEME_MODE,
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'idearepository-theme',
      storage: createJSONStorage(() => AsyncStorage),
      // 저장값이 깨진 경우 기본(system)으로 복원
      merge: (persisted, current) => {
        const p = persisted as Partial<ThemeState> | undefined;
        const mode = p?.mode && THEME_MODES.includes(p.mode) ? p.mode : DEFAULT_THEME_MODE;
        return { ...current, mode };
      },
    },
  ),
);
