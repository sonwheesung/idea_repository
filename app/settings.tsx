import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type AppLanguage } from '@/lib/i18n';
import { useLanguageStore } from '@/lib/language';
import { THEME_MODES, type ThemeMode } from '@/theme/palettes';
import { useThemeStore } from '@/theme/store';
import { useTheme } from '@/theme/use-theme';

// 설정 골격 — 화면 모드(시스템/라이트/다크)·언어(시스템/en/ko)는 Phase 0에서 바로 동작.
// 카테고리 관리·광고 제거·공지·문의 행은 해당 Phase에서 추가.
export default function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const override = useLanguageStore((s) => s.override);
  const setOverride = useLanguageStore((s) => s.setOverride);

  const modeLabel: Record<ThemeMode, string> = {
    system: t('settings.appearanceSystem'),
    light: t('settings.appearanceLight'),
    dark: t('settings.appearanceDark'),
  };

  return (
    <Screen edges={[]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{t('settings.appearance')}</Text>
        <View style={styles.row}>
          {THEME_MODES.map((m) => (
            <Chip key={m} label={modeLabel[m]} active={mode === m} onPress={() => setMode(m)} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{t('settings.language')}</Text>
        <View style={styles.row}>
          <Chip label={t('settings.languageSystem')} active={override === null} onPress={() => setOverride(null)} />
          {SUPPORTED_LANGUAGES.map((lang: AppLanguage) => (
            <Chip
              key={lang}
              label={LANGUAGE_LABELS[lang]}
              active={override === lang}
              onPress={() => setOverride(lang)}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.primary : theme.badge,
          borderColor: active ? theme.primary : theme.border,
        },
      ]}>
      <Text style={{ color: active ? theme.buttonText : theme.badgeText, fontWeight: active ? '600' : '400' }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, paddingTop: 20, gap: 10 },
  sectionTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
