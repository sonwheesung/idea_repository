import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OptionSheet, type SheetOption } from '@/components/option-sheet';
import { Screen } from '@/components/screen';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type AppLanguage } from '@/lib/i18n';
import { useLanguageStore } from '@/lib/language';
import { showPrivacyOptions } from '@/features/ads/ads';
import { useAdsStore } from '@/features/ads/store';
import { useUnreadNoticeCount } from '@/features/support/store';
import { useThemeStore } from '@/theme/store';
import { useResolvedThemeId, useTheme } from '@/theme/use-theme';

type LanguageChoice = 'system' | AppLanguage;

// 설정 — 모든 행이 같은 모양(라벨 · 현재 값 부제 · 화살표)이다(2026-08-18 사용자 지적: 언어만 라벨형이라 통일).
// 테마·카테고리·공지·문의·About은 화면으로, 언어·개인정보 옵션은 시트/폼으로 이어지지만 행 모양은 구분하지 않는다.
// 광고 제거(Phase 7) 행도 같은 SettingRow로 추가한다.
export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const themeSetting = useThemeStore((s) => s.setting);
  const unreadNotices = useUnreadNoticeCount();
  const privacyOptionsRequired = useAdsStore((s) => s.privacyOptionsRequired);
  const resolvedTheme = useResolvedThemeId();
  const override = useLanguageStore((s) => s.override);
  const setOverride = useLanguageStore((s) => s.setOverride);
  const [languageOpen, setLanguageOpen] = useState(false);

  const languageOptions: SheetOption<LanguageChoice>[] = [
    { value: 'system', label: t('settings.languageSystem') },
    ...SUPPORTED_LANGUAGES.map((lang) => ({ value: lang, label: LANGUAGE_LABELS[lang] })),
  ];
  const languageValue: LanguageChoice = override ?? 'system';
  const languageLabel = languageOptions.find((o) => o.value === languageValue)?.label ?? '';

  return (
    <Screen hasHeader>
      <View style={styles.body}>
        <SettingRow
          label={t('settings.theme')}
          value={
            themeSetting === 'system'
              ? `${t('theme.system')} · ${t(`theme.names.${resolvedTheme}`)}`
              : t(`theme.names.${resolvedTheme}`)
          }
          onPress={() => router.push('/theme')}
        />
        <SettingRow
          label={t('settings.language')}
          value={languageLabel}
          onPress={() => setLanguageOpen(true)}
        />
        <SettingRow label={t('settings.categories')} onPress={() => router.push('/categories')} />

        {/* 공지 — 안 읽은 공지가 있으면 배지 점(푸시가 없어 이 점이 통지의 전부다 — 조각·LinkMemo 승계) */}
        <SettingRow
          label={t('settings.notice')}
          badge={unreadNotices > 0}
          onPress={() => router.push('/notice')}
        />

        {/* 문의 — 첫 화면은 내역(상태·답변), 우상단에서 새 문의 (LinkMemo 동선) */}
        <SettingRow label={t('settings.inquiry')} onPress={() => router.push('/inquiries')} />

        {/* 광고 제거(Remove Ads·복원) 행 — Phase 7 에서 이 자리에 추가 */}

        {/* UMP 개인정보 옵션 — EEA·영국·스위스(privacyOptionsRequirementStatus=REQUIRED)에서만 보인다.
            Google EU 사용자 동의 정책: 동의를 다시 바꿀 수단 제공. 처리방침 §5·제9조가 이 행을 가리킨다. */}
        {privacyOptionsRequired ? (
          <SettingRow
            label={t('settings.privacyOptions')}
            value={t('settings.privacyOptionsHint')}
            onPress={() => void showPrivacyOptions()}
          />
        ) : null}

        <SettingRow label={t('settings.about')} onPress={() => router.push('/about')} />
      </View>

      <OptionSheet
        visible={languageOpen}
        title={t('settings.language')}
        value={languageValue}
        options={languageOptions}
        onSelect={(v) => setOverride(v === 'system' ? null : v)}
        onClose={() => setLanguageOpen(false)}
      />
    </Screen>
  );
}

interface SettingRowProps {
  label: string;
  /** 현재 값 부제(테마·언어·힌트). 없으면 라벨만 */
  value?: string;
  badge?: boolean;
  onPress: () => void;
}

/** 설정 행 — 라벨(+배지 점) · 값 부제 · chevron. 색은 토큰만. */
function SettingRow({ label, value, badge, onPress }: SettingRowProps): ReactNode {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.navRow,
        { backgroundColor: theme.searchBar, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
      ]}>
      <View style={styles.navLeft}>
        <View style={styles.navLabelRow}>
          <Text style={[styles.navLabel, { color: theme.text }]}>{label}</Text>
          {badge ? <View style={[styles.badgeDot, { backgroundColor: theme.primary }]} /> : null}
        </View>
        {value ? (
          <Text style={[styles.navValue, { color: theme.textMuted }]} numberOfLines={1}>
            {value}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.icon} />
    </Pressable>
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
  navLeft: { flex: 1, marginRight: 8 },
  navLabel: { fontSize: 16 },
  navLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badgeDot: { width: 8, height: 8, borderRadius: 4 },
  navValue: { fontSize: 12, marginTop: 2 },
});
