import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { ProjectCard } from '@/components/project-card';
import { Screen } from '@/components/screen';
import { deleteProject, listProjects } from '@/features/projects/api';
import type { ProjectCard as ProjectCardData } from '@/features/projects/types';
import { useTheme } from '@/theme/use-theme';

// 메인 화면 (docs/PROJECT_SYSTEM.md §8). 검색바·상태 칩·필터/정렬은 Phase 3에서.
export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectCardData[]>([]);

  const reload = useCallback(() => setProjects(listProjects()), []);
  useFocusEffect(reload);

  const confirmDelete = (p: ProjectCardData) => {
    Alert.alert(t('project.deleteTitle', { name: p.name }), t('project.deleteBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          deleteProject(p.id);
          reload();
        },
      },
    ]);
  };

  return (
    <Screen footer={<AdBanner />}>
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

      <FlatList
        data={projects}
        keyExtractor={(p) => p.id}
        contentContainerStyle={projects.length === 0 ? styles.emptyContainer : styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => <ProjectCard project={item} onLongPress={() => confirmDelete(item)} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bulb-outline" size={40} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('home.empty.title')}</Text>
            <Text style={[styles.emptyBody, { color: theme.textMuted }]}>{t('home.empty.body')}</Text>
            {/* 데이터 손실 안내 — CLAUDE.md §6 (키 분리: data.notice.*) */}
            <Text style={[styles.notice, { color: theme.textMuted }]}>
              {t('data.notice.local')} {t('data.notice.loss')}
            </Text>
          </View>
        }
      />
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
  list: { padding: 16 },
  separator: { height: 12 },
  emptyContainer: { flexGrow: 1 },
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
