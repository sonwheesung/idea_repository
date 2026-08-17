// 테마 정본 — 라이트/다크 2종 (CLAUDE.md §14 #6). 컴포넌트는 색상 리터럴 금지 — 이 토큰만 참조한다.
// LinkMemo theme/palettes.ts 구조를 2종으로 축소 승계. 테마 10종 시스템은 만들지 않는다.

export type ThemeMode = 'system' | 'light' | 'dark';
export const THEME_MODES: readonly ThemeMode[] = ['system', 'light', 'dark'];
export const DEFAULT_THEME_MODE: ThemeMode = 'system';

export type ThemeId = 'light' | 'dark';

export interface ThemePalette {
  id: ThemeId;
  isDark: boolean; // 상태바·헤더 콘텐츠 스타일 파생
  background: string;
  surface: string;
  card: string;
  searchBar: string;
  primary: string;
  text: string;
  textMuted: string;
  icon: string;
  button: string;
  buttonText: string;
  border: string;
  badge: string;
  badgeText: string;
  danger: string;
  progressTrack: string;
  progressFill: string;
}

export const THEMES: Record<ThemeId, ThemePalette> = {
  light: {
    id: 'light',
    isDark: false,
    background: '#FFFFFF',
    surface: '#F5F6F8',
    card: '#FFFFFF',
    searchBar: '#F1F3F5',
    primary: '#2563EB',
    text: '#111827',
    textMuted: '#6B7280',
    icon: '#374151',
    button: '#2563EB',
    buttonText: '#FFFFFF',
    border: '#E5E7EB',
    badge: '#F3F4F6',
    badgeText: '#374151',
    danger: '#DC2626',
    progressTrack: '#E5E7EB',
    progressFill: '#2563EB',
  },
  dark: {
    id: 'dark',
    isDark: true,
    background: '#121214',
    surface: '#1A1A1E',
    card: '#232327',
    searchBar: '#232327',
    primary: '#3B82F6',
    text: '#F3F4F6',
    textMuted: '#9CA3AF',
    icon: '#D1D5DB',
    button: '#3B82F6',
    buttonText: '#FFFFFF',
    border: '#2E2E33',
    badge: '#2E2E33',
    badgeText: '#D1D5DB',
    danger: '#F87171',
    progressTrack: '#2E2E33',
    progressFill: '#3B82F6',
  },
};
