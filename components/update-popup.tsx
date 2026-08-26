import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, Text } from 'react-native';

import { Dialog } from '@/components/dialog';
import { useAdsStore } from '@/features/ads/store';
import { useOnboardingStore } from '@/features/onboarding/store';
import { APP_VERSION } from '@/features/support/server';
import { useBootStore, useSoftUpdateStore } from '@/features/support/store';
import { compareVersions } from '@/lib/common-server';
import { useTheme } from '@/theme/use-theme';

// 소프트 업데이트 안내 — bootstrap latest 미만이면 홈에서 모달 1회 (ARCHITECTURE §5.4, Phase 11 2026-08-26).
// 강제(min)는 BootGate가 화면을 막는다; 여기는 권유만 — [나중에]를 누른 latest 값은 다시 묻지 않는다.
// 순서: 웰컴 시트 → App Open 광고 → 이 팝업. 스토어 URL이 없으면 갈 곳이 없으니 아예 띄우지 않는다(소음).
export function UpdatePopup() {
  const { t } = useTranslation();
  const theme = useTheme();
  const boot = useBootStore((s) => s.boot);
  const adSettled = useAdsStore((s) => s.startupAdSettled);
  const welcomeSeen = useOnboardingStore((s) => s.welcomeSeen);
  const dismissedVersion = useSoftUpdateStore((s) => s.dismissedVersion);
  const dismiss = useSoftUpdateStore((s) => s.dismiss);
  const [focused, setFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  const latest = boot?.version.latest ?? null;
  const storeUrl = boot?.version.androidUrl ?? boot?.version.iosUrl ?? null;
  const outdated = latest !== null && compareVersions(APP_VERSION, latest) < 0;
  const visible =
    focused && adSettled && welcomeSeen && outdated && storeUrl !== null && dismissedVersion !== latest;
  if (!visible || latest === null || storeUrl === null) return null;

  const later = () => dismiss(latest);
  const open = () => {
    dismiss(latest);
    void Linking.openURL(storeUrl);
  };

  return (
    <Dialog
      title={t('update.title')}
      confirmLabel={t('update.open')}
      cancelLabel={t('update.later')}
      onConfirm={open}
      onCancel={later}>
      <Text style={[styles.body, { color: theme.textMuted }]}>{t('update.body', { version: latest })}</Text>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  body: { fontSize: 15, lineHeight: 22 },
});
