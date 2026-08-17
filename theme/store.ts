import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_THEME_SETTING, THEME_IDS, type ThemeSetting } from '@/theme/palettes';

interface ThemeState {
  /** system = OS 라이트/다크 → Light/Dark Minimal. 그 외 = 고정 테마 */
  setting: ThemeSetting;
  setSetting: (setting: ThemeSetting) => void;
}

function isValid(v: unknown): v is ThemeSetting {
  return v === 'system' || (typeof v === 'string' && (THEME_IDS as readonly string[]).includes(v));
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      setting: DEFAULT_THEME_SETTING,
      setSetting: (setting) => set({ setting }),
    }),
    {
      name: 'idearepository-theme',
      storage: createJSONStorage(() => AsyncStorage),
      // 저장값이 깨졌거나 테마가 사라진 경우 system으로 복원
      merge: (persisted, current) => {
        const p = persisted as Partial<ThemeState> | undefined;
        return { ...current, setting: isValid(p?.setting) ? p.setting : DEFAULT_THEME_SETTING };
      },
    },
  ),
);
