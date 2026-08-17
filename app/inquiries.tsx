import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { commonServer, ensureDeviceSession } from '@/features/support/server';
import type { MyInquiry } from '@/lib/common-server';
import { formatDate } from '@/lib/date';
import { useTheme } from '@/theme/use-theme';

// 문의하기의 첫 화면 — 기기 토큰으로 귀속된 내 문의의 상태·답변, 우상단 [문의 등록하기] → 작성 폼
// (ARCHITECTURE §4, LinkMemo 2026-08-17 동선 승계: 설정 행 하나 → 내역이 첫 화면)
export default function InquiriesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const [inquiries, setInquiries] = useState<MyInquiry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void (async () => {
        await ensureDeviceSession();
        const r = await commonServer.fetchMyInquiries();
        if (!cancelled) {
          if (r.ok) setInquiries(r.inquiries);
          setLoaded(true);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const statusColor = (status: MyInquiry['status']) =>
    status === 'replied' ? theme.primary : status === 'resolved' ? theme.textMuted : theme.badgeText;

  return (
    <Screen hasHeader>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/inquiry')}
              hitSlop={8}
              style={styles.headerButton}
              accessibilityRole="button"
              accessibilityLabel={t('inquiry.newTitle')}>
              <Ionicons name="create-outline" size={20} color={theme.primary} />
              <Text style={[styles.headerButtonLabel, { color: theme.primary }]}>
                {t('inquiry.newTitle')}
              </Text>
            </Pressable>
          ),
        }}
      />
      {loaded && inquiries.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={[styles.empty, { color: theme.textMuted }]}>{t('inquiry.historyEmpty')}</Text>
        </View>
      ) : (
        <FlatList
          data={inquiries}
          keyExtractor={(q) => q.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            inquiries.length > 0 ? (
              <Text style={[styles.note, { color: theme.textMuted }]}>{t('inquiry.historyNote')}</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <Card>
              <View style={styles.cardHeader}>
                <Text style={[styles.category, { color: theme.textMuted }]}>
                  {t(`inquiry.categories.${item.category}`)}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: theme.badge }]}>
                  <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                    {t(`inquiry.status.${item.status}`)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.content, { color: theme.text }]}>{item.content}</Text>
              <Text style={[styles.date, { color: theme.textMuted }]}>
                {formatDate(Date.parse(item.createdAt))}
              </Text>
              {item.reply ? (
                <View
                  style={[styles.replyBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Text style={[styles.replyLabel, { color: theme.primary }]}>{t('inquiry.replyLabel')}</Text>
                  <Text style={[styles.replyText, { color: theme.text }]}>{item.reply}</Text>
                </View>
              ) : null}
            </Card>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerButton: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  headerButtonLabel: { fontSize: 15, fontWeight: '600' },
  emptyWrap: { flex: 1, alignItems: 'center', paddingTop: 48 },
  empty: { fontSize: 14 },
  list: { padding: 16 },
  separator: { height: 10 },
  note: { fontSize: 12, lineHeight: 18, marginTop: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  category: { fontSize: 12, fontWeight: '600' },
  statusBadge: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  content: { fontSize: 14, lineHeight: 21 },
  date: { fontSize: 12 },
  replyBox: { borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, padding: 12, gap: 4, marginTop: 2 },
  replyLabel: { fontSize: 12, fontWeight: '700' },
  replyText: { fontSize: 14, lineHeight: 21 },
});
