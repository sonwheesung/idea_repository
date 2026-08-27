import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  DEFAULT_THEME_SETTING,
  LEGACY_SYSTEM_DARK,
  LEGACY_SYSTEM_LIGHT,
  THEME_IDS,
  type ThemeSetting,
} from '@/theme/palettes';

interface ThemeState {
  /** 고정 테마 id. ~~system = OS 라이트/다크~~ → 2026-08-27 제거 */
  setting: ThemeSetting;
  setSetting: (setting: ThemeSetting) => void;
}

function isValid(v: unknown): v is ThemeSetting {
  return typeof v === 'string' && (THEME_IDS as readonly string[]).includes(v);
}

/** 저장값 → 설정. 구 'system'은 그 순간 OS 스킴이 보여 주던 테마로 고정(사용자가 보던 화면이 안 바뀌게) */
function migrate(v: unknown): ThemeSetting {
  if (isValid(v)) return v;
  if (v === 'system')
    return Appearance.getColorScheme() === 'dark' ? LEGACY_SYSTEM_DARK : LEGACY_SYSTEM_LIGHT;
  return DEFAULT_THEME_SETTING;
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
      // 저장값이 깨졌거나 테마가 사라진 경우 기본(Light Minimal)으로 복원
      merge: (persisted, current) => {
        const p = persisted as Partial<ThemeState> | undefined;
        return { ...current, setting: migrate(p?.setting) };
      },
    },
  ),
);
