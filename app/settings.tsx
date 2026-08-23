import Constants from 'expo-constants';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { ListRow } from '@/components/list-row';
import { OptionSheet, type SheetOption } from '@/components/option-sheet';
import { Screen } from '@/components/screen';
import { showPrivacyOptions } from '@/features/ads/ads';
import { useAdsStore } from '@/features/ads/store';
import { useBackupStore } from '@/features/backup/store';
import { listCategories } from '@/features/categories/api';
import { useUnreadNoticeCount } from '@/features/support/store';
import { formatDate } from '@/lib/date';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type AppLanguage } from '@/lib/i18n';
import { useLanguageStore } from '@/lib/language';
import { useThemeStore } from '@/theme/store';
import { useResolvedThemeId, useTheme } from '@/theme/use-theme';

type LanguageChoice = 'system' | AppLanguage;

// 설정 — 모든 행이 같은 규격(아이콘 · 제목 · 한 줄 설명 · 화살표)이다(2026-08-18 "언어만 라벨형" → 통일,
// 2026-08-23 "부제 있는 행과 없는 행이 섞여 규격이 다르다" → 전 행에 설명 + ListRow minHeight — docs/UI_GUIDE.md §5.1).
// 테마·카테고리·백업·공지·문의·About은 화면으로, 언어·개인정보 옵션은 시트/폼으로 이어지지만 행 모양은 구분하지 않는다.
// 광고 제거(Phase 7) 행도 같은 ListRow로 추가한다.
export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const themeSetting = useThemeStore((s) => s.setting);
  const unreadNotices = useUnreadNoticeCount();
  const privacyOptionsRequired = useAdsStore((s) => s.privacyOptionsRequired);
  const resolvedTheme = useResolvedThemeId();
  const override = useLanguageStore((s) => s.override);
  const setOverride = useLanguageStore((s) => s.setOverride);
  const [languageOpen, setLanguageOpen] = useState(false);
  const lastExportedAt = useBackupStore((s) => s.lastExportedAt);
  const [categoryCount, setCategoryCount] = useState(0);
  const version = Constants.expoConfig?.version ?? '0.0.0';

  // 카테고리 수 — 관리 화면에서 돌아오면 갱신
  useFocusEffect(
    useCallback(() => {
      setCategoryCount(listCategories().length);
    }, []),
  );

  const languageOptions: SheetOption<LanguageChoice>[] = [
    { value: 'system', label: t('settings.languageSystem') },
    ...SUPPORTED_LANGUAGES.map((lang) => ({ value: lang, label: LANGUAGE_LABELS[lang] })),
  ];
  const languageValue: LanguageChoice = override ?? 'system';
  const languageLabel = languageOptions.find((o) => o.value === languageValue)?.label ?? '';

  return (
    <Screen hasHeader scroll contentStyle={[styles.body, { backgroundColor: theme.background }]}>
      <ListRow
        icon="color-palette-outline"
        title={t('settings.theme')}
        description={
          themeSetting === 'system'
            ? `${t('theme.system')} · ${t(`theme.names.${resolvedTheme}`)}`
            : t(`theme.names.${resolvedTheme}`)
        }
        onPress={() => router.push('/theme')}
      />
      <ListRow
        icon="language-outline"
        title={t('settings.language')}
        description={languageLabel}
        onPress={() => setLanguageOpen(true)}
      />
      <ListRow
        icon="pricetags-outline"
        title={t('settings.categories')}
        description={t('settings.categoriesCount', { count: categoryCount })}
        onPress={() => router.push('/categories')}
      />

      {/* 백업 — 내보내기/가져오기. 설명 = 마지막 내보내기(docs/BACKUP_SYSTEM.md §5) */}
      <ListRow
        icon="archive-outline"
        title={t('settings.backup')}
        description={`${t('backup.lastExport')}: ${lastExportedAt ? formatDate(lastExportedAt) : t('backup.never')}`}
        onPress={() => router.push('/backup')}
      />

      {/* 공지 — 안 읽은 공지가 있으면 배지 점(푸시가 없어 이 점이 통지의 전부다 — 조각·LinkMemo 승계) */}
      <ListRow
        icon="notifications-outline"
        title={t('settings.notice')}
        description={
          unreadNotices > 0 ? t('settings.noticeUnread', { count: unreadNotices }) : t('settings.noticeNone')
        }
        badge={unreadNotices > 0}
        onPress={() => router.push('/notice')}
      />

      {/* 문의 — 첫 화면은 내역(상태·답변), 우상단에서 새 문의 (LinkMemo 동선) */}
      <ListRow
        icon="chatbubble-ellipses-outline"
        title={t('settings.inquiry')}
        description={t('settings.inquiryHint')}
        onPress={() => router.push('/inquiries')}
      />

      {/* 광고 제거(Remove Ads·복원) 행 — Phase 7 에서 이 자리에 추가 */}

      {/* UMP 개인정보 옵션 — EEA·영국·스위스(privacyOptionsRequirementStatus=REQUIRED)에서만 보인다.
          Google EU 사용자 동의 정책: 동의를 다시 바꿀 수단 제공. 처리방침 §5·제9조가 이 행을 가리킨다. */}
      {privacyOptionsRequired ? (
        <ListRow
          icon="shield-checkmark-outline"
          title={t('settings.privacyOptions')}
          description={t('settings.privacyOptionsHint')}
          onPress={() => void showPrivacyOptions()}
        />
      ) : null}

      <ListRow
        icon="information-circle-outline"
        title={t('settings.about')}
        description={t('about.version', { version })}
        onPress={() => router.push('/about')}
      />

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

const styles = StyleSheet.create({
  body: { padding: 16, gap: 12, paddingBottom: 24 },
});
