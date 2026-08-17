import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Select, type SelectOption } from '@/components/select';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type AppLanguage } from '@/lib/i18n';
import { useLanguageStore } from '@/lib/language';
import { showPrivacyOptions } from '@/features/ads/ads';
import { useAdsStore } from '@/features/ads/store';
import { useUnreadNoticeCount } from '@/features/support/store';
import { useThemeStore } from '@/theme/store';
import { useResolvedThemeId, useTheme } from '@/theme/use-theme';

type LanguageChoice = 'system' | AppLanguage;

// 설정 — 테마(→ 선택 화면)·언어 Select(2026-08-17 사용자 요청: 칩 → select).
// 광고 제거(Phase 7)·공지·문의(Phase 5) 행은 해당 Phase에서 추가.
export default function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const themeSetting = useThemeStore((s) => s.setting);
  const unreadNotices = useUnreadNoticeCount();
  const privacyOptionsRequired = useAdsStore((s) => s.privacyOptionsRequired);
  const resolvedTheme = useResolvedThemeId();
  const override = useLanguageStore((s) => s.override);
  const setOverride = useLanguageStore((s) => s.setOverride);

  const languageOptions: SelectOption<LanguageChoice>[] = [
    { value: 'system', label: t('settings.languageSystem') },
    ...SUPPORTED_LANGUAGES.map((lang) => ({ value: lang, label: LANGUAGE_LABELS[lang] })),
  ];

  return (
    <Screen hasHeader>
      <View style={styles.body}>
        <Pressable
          onPress={() => router.push('/theme')}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.navRow,
            { backgroundColor: theme.searchBar, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
          ]}>
          <View>
            <Text style={[styles.navLabel, { color: theme.text }]}>{t('settings.theme')}</Text>
            <Text style={[styles.navValue, { color: theme.textMuted }]}>
              {themeSetting === 'system'
                ? `${t('theme.system')} · ${t(`theme.names.${resolvedTheme}`)}`
                : t(`theme.names.${resolvedTheme}`)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.icon} />
        </Pressable>
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

        {/* 공지 — 안 읽은 공지가 있으면 배지 점(푸시가 없어 이 점이 통지의 전부다 — 조각·LinkMemo 승계) */}
        <Pressable
          onPress={() => router.push('/notice')}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.navRow,
            { backgroundColor: theme.searchBar, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
          ]}>
          <View style={styles.navLabelRow}>
            <Text style={[styles.navLabel, { color: theme.text }]}>{t('settings.notice')}</Text>
            {unreadNotices > 0 ? (
              <View style={[styles.badgeDot, { backgroundColor: theme.primary }]} />
            ) : null}
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.icon} />
        </Pressable>

        {/* 문의 — 첫 화면은 내역(상태·답변), 우상단에서 새 문의 (LinkMemo 동선) */}
        <Pressable
          onPress={() => router.push('/inquiries')}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.navRow,
            { backgroundColor: theme.searchBar, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
          ]}>
          <Text style={[styles.navLabel, { color: theme.text }]}>{t('settings.inquiry')}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.icon} />
        </Pressable>

        {/* 광고 제거(Remove Ads·복원) 행 — Phase 7 에서 이 자리에 추가 */}

        {/* UMP 개인정보 옵션 — EEA·영국·스위스(privacyOptionsRequirementStatus=REQUIRED)에서만 보인다.
            Google EU 사용자 동의 정책: 동의를 다시 바꿀 수단 제공. 처리방침 §5·제9조가 이 행을 가리킨다. */}
        {privacyOptionsRequired ? (
          <Pressable
            onPress={() => void showPrivacyOptions()}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.navRow,
              { backgroundColor: theme.searchBar, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
            ]}>
            <View>
              <Text style={[styles.navLabel, { color: theme.text }]}>{t('settings.privacyOptions')}</Text>
              <Text style={[styles.navValue, { color: theme.textMuted }]}>
                {t('settings.privacyOptionsHint')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.icon} />
          </Pressable>
        ) : null}

        <Pressable
          onPress={() => router.push('/about')}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.navRow,
            { backgroundColor: theme.searchBar, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
          ]}>
          <Text style={[styles.navLabel, { color: theme.text }]}>{t('settings.about')}</Text>
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
  navLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badgeDot: { width: 8, height: 8, borderRadius: 4 },
  navValue: { fontSize: 12, marginTop: 2 },
});
