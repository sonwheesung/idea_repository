import { useColorScheme } from 'react-native';

import { SYSTEM_DARK, SYSTEM_LIGHT, THEMES, type ThemeId, type ThemePalette } from '@/theme/palettes';
import { useThemeStore } from '@/theme/store';

/** 설정 → 실제 테마 id (system이면 OS 스킴으로 Light/Dark Minimal) */
export function useResolvedThemeId(): ThemeId {
  const setting = useThemeStore((s) => s.setting);
  const scheme = useColorScheme();
  if (setting === 'system') return scheme === 'dark' ? SYSTEM_DARK : SYSTEM_LIGHT;
  return setting;
}

export function useTheme(): ThemePalette {
  return THEMES[useResolvedThemeId()];
}
