import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { useBootStore, useNoticeReadStore } from '@/features/support/store';
import { formatDate } from '@/lib/date';
import { useTheme } from '@/theme/use-theme';

// 공지 — bootstrap 응답의 announcements를 보여준다. 읽음 처리는 로컬 (features/support/store.ts)
export default function NoticeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const boot = useBootStore((s) => s.boot);
  const markRead = useNoticeReadStore((s) => s.markRead);
  const announcements = useMemo(() => boot?.announcements ?? [], [boot]);

  useFocusEffect(
    useCallback(() => {
      if (announcements.length > 0) markRead(announcements.map((a) => a.id));
    }, [announcements, markRead]),
  );

  return (
    <Screen hasHeader>
      {announcements.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={[styles.empty, { color: theme.textMuted }]}>{t('notice.empty')}</Text>
        </View>
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(a) => a.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.cardHeader}>
                {item.pinned ? (
                  <View style={[styles.pin, { backgroundColor: theme.badge }]}>
                    <Text style={[styles.pinText, { color: theme.primary }]}>{t('notice.pinned')}</Text>
                  </View>
                ) : null}
                <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
              </View>
              <Text style={[styles.cardBody, { color: theme.textMuted }]}>{item.body}</Text>
              <Text style={[styles.cardDate, { color: theme.textMuted }]}>
                {formatDate(Date.parse(item.startsAt))}
              </Text>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyWrap: { flex: 1, alignItems: 'center', paddingTop: 48 },
  empty: { fontSize: 14 },
  list: { padding: 16 },
  separator: { height: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pin: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  pinText: { fontSize: 11, fontWeight: '700' },
  cardTitle: { fontSize: 16, fontWeight: '600', flexShrink: 1 },
  cardBody: { fontSize: 14, lineHeight: 21 },
  cardDate: { fontSize: 12 },
});
