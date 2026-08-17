import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Select, type SelectOption } from '@/components/select';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type AppLanguage } from '@/lib/i18n';
import { useLanguageStore } from '@/lib/language';
import { THEME_MODES, type ThemeMode } from '@/theme/palettes';
import { useThemeStore } from '@/theme/store';
import { useTheme } from '@/theme/use-theme';

type LanguageChoice = 'system' | AppLanguage;

// 설정 — 화면 모드·언어는 Select(2026-08-17 사용자 요청: 칩 → select).
// 카테고리 관리·광고 제거·공지·문의 행은 해당 Phase에서 추가.
export default function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const override = useLanguageStore((s) => s.override);
  const setOverride = useLanguageStore((s) => s.setOverride);

  const modeOptions: SelectOption<ThemeMode>[] = THEME_MODES.map((m) => ({
    value: m,
    label:
      m === 'system'
        ? t('settings.appearanceSystem')
        : m === 'light'
          ? t('settings.appearanceLight')
          : t('settings.appearanceDark'),
  }));

  const languageOptions: SelectOption<LanguageChoice>[] = [
    { value: 'system', label: t('settings.languageSystem') },
    ...SUPPORTED_LANGUAGES.map((lang) => ({ value: lang, label: LANGUAGE_LABELS[lang] })),
  ];

  return (
    <Screen hasHeader>
      <View style={styles.body}>
        <Select label={t('settings.appearance')} value={mode} options={modeOptions} onChange={setMode} />
        <Select
          label={t('settings.language')}
          value={override ?? 'system'}
          options={languageOptions}
          onChange={(v) => setOverride(v === 'system' ? null : v)}
        />

        <Pressable
          onPress={() => router.push('/categories')}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.navRow,
            { backgroundColor: theme.searchBar, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
          ]}>
          <Text style={[styles.navLabel, { color: theme.text }]}>{t('settings.categories')}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.icon} />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, gap: 18 },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  navLabel: { fontSize: 16 },
});
