import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { PrivacyOverview } from '@/components/privacy-overview';
import { useOnboardingStore } from '@/features/onboarding/store';
import { useTheme } from '@/theme/use-theme';

/**
 * 첫 실행 1회 프라이버시 웰컴 시트 — 한 장, 버튼 하나(Start). 닫으면 다시 뜨지 않는다.
 * (2026-08-17 사용자 결정 — 온보딩 여러 장 🚫, 매 실행 팝업 🚫. 다시 보기는 설정 → About → Privacy at a glance)
 * persist 복원 전에는 그리지 않는다(재방문자 깜빡임 방지).
 */
export function WelcomeSheet() {
  const { t } = useTranslation();
  const theme = useTheme();
  const hydrated = useOnboardingStore((s) => s.hydrated);
  const seen = useOnboardingStore((s) => s.welcomeSeen);
  const markSeen = useOnboardingStore((s) => s.markWelcomeSeen);

  const visible = hydrated && !seen;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={markSeen}>
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <PrivacyOverview />
        </ScrollView>
        <View style={styles.footer}>
          <Button label={t('welcome.start')} onPress={markSeen} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  footer: { padding: 20 },
});
