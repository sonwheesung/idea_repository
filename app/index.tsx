import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { useTheme } from '@/theme/use-theme';

// 메인 화면 골격 (docs/PROJECT_SYSTEM.md §8). 검색바·상태 칩·카드 목록은 Phase 1~3에서.
export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>{t('home.title')}</Text>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityLabel={t('project.new')}
            hitSlop={8}
            onPress={() => router.push('/project/new')}
            style={styles.iconButton}>
            <Ionicons name="add" size={26} color={theme.icon} />
          </Pressable>
          <Pressable
            accessibilityLabel={t('common.settings')}
            hitSlop={8}
            onPress={() => router.push('/settings')}
            style={styles.iconButton}>
            <Ionicons name="settings-outline" size={22} color={theme.icon} />
          </Pressable>
        </View>
      </View>

      <View style={styles.empty}>
        <Ionicons name="bulb-outline" size={40} color={theme.textMuted} />
        <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('home.empty.title')}</Text>
        <Text style={[styles.emptyBody, { color: theme.textMuted }]}>{t('home.empty.body')}</Text>
        {/* 데이터 손실 안내 — CLAUDE.md §6 (키 분리: data.notice.*) */}
        <Text style={[styles.notice, { color: theme.textMuted }]}>
          {t('data.notice.local')} {t('data.notice.loss')}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 22, fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: 4 },
  iconButton: { padding: 6 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginTop: 6 },
  emptyBody: { fontSize: 14, textAlign: 'center' },
  notice: { fontSize: 12, textAlign: 'center', marginTop: 24, lineHeight: 18 },
});
