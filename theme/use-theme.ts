import { useColorScheme } from 'react-native';

import { THEMES, type ThemePalette } from '@/theme/palettes';
import { useThemeStore } from '@/theme/store';

/** 현재 팔레트 — mode가 system이면 OS 색상 스킴을 따른다. */
export function useTheme(): ThemePalette {
  const mode = useThemeStore((s) => s.mode);
  const scheme = useColorScheme();
  const resolved = mode === 'system' ? (scheme === 'dark' ? 'dark' : 'light') : mode;
  return THEMES[resolved];
}
