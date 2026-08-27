import { THEMES, type ThemeId, type ThemePalette } from '@/theme/palettes';
import { useThemeStore } from '@/theme/store';

/** 설정 → 실제 테마 id. ~~system이면 OS 스킴으로 Light/Dark Minimal~~ → 2026-08-27 제거: 설정값이 곧 테마 */
export function useResolvedThemeId(): ThemeId {
  return useThemeStore((s) => s.setting);
}

export function useTheme(): ThemePalette {
  return THEMES[useResolvedThemeId()];
}
