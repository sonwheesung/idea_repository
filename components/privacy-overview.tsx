import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { LINKS } from '@/lib/links';
import { useTheme } from '@/theme/use-theme';

/**
 * "Privacy at a glance" — 첫 실행 웰컴 시트와 설정 → About에서 같은 내용을 쓴다 (2026-08-17 사용자 결정).
 * 문구 규칙(CLAUDE.md §6): "서버에 업로드되지 않는다"(O) · "무엇이 나가는지"를 같이 적는다 · 절대 보장 표현(X).
 */
export function PrivacyOverview() {
  const { t } = useTranslation();
  const theme = useTheme();

  const openPolicy = async () => {
    try {
      await Linking.openURL(LINKS.privacy);
    } catch {
      Alert.alert(t('about.openFailed'));
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={[styles.iconWrap, { backgroundColor: theme.badge }]}>
        <Ionicons name="lock-closed-outline" size={40} color={theme.primary} />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{t('welcome.title')}</Text>
      <Text style={[styles.lead, { color: theme.textMuted }]}>{t('welcome.lead')}</Text>

      <View style={styles.points}>
        <Point icon="person-remove-outline" text={t('welcome.point.noAccount')} />
        <Point icon="cloud-offline-outline" text={t('welcome.point.noCloud')} />
        <Point icon="swap-horizontal-outline" text={t('welcome.point.whatLeaves')} />
      </View>

      <View style={[styles.caution, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Ionicons name="alert-circle-outline" size={18} color={theme.textMuted} />
        <Text style={[styles.cautionText, { color: theme.textMuted }]}>
          {t('data.notice.loss')} {t('data.notice.backupHint')}
        </Text>
      </View>

      <Pressable onPress={openPolicy} accessibilityRole="link" style={styles.link}>
        <Text style={[styles.linkText, { color: theme.primary }]}>{t('welcome.readPolicy')}</Text>
        <Ionicons name="open-outline" size={14} color={theme.primary} />
      </Pressable>
    </View>
  );
}

function Point({ icon, text }: { icon: React.ComponentProps<typeof Ionicons>['name']; text: string }) {
  const theme = useTheme();
  return (
    <View style={styles.point}>
      <Ionicons name={icon} size={20} color={theme.primary} style={styles.pointIcon} />
      <Text style={[styles.pointText, { color: theme.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 14 },
  iconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  lead: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
  points: { alignSelf: 'stretch', gap: 12, marginTop: 8 },
  point: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  pointIcon: { marginTop: 1 },
  pointText: { flex: 1, fontSize: 15, lineHeight: 22 },
  caution: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    marginTop: 4,
  },
  cautionText: { flex: 1, fontSize: 13, lineHeight: 19 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  linkText: { fontSize: 14, fontWeight: '500' },
});
