import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { FilterSheet } from '@/components/filter-sheet';
import { OptionSheet } from '@/components/option-sheet';
import { ProjectCard } from '@/components/project-card';
import { Screen } from '@/components/screen';
import { listCategories, type Category } from '@/features/categories/api';
import { deleteProject } from '@/features/projects/api';
import { useFilterStore } from '@/features/projects/filter-store';
import { queryProjects, SORT_KEYS, type SortKey } from '@/features/projects/query';
import type { ProjectCard as ProjectCardData } from '@/features/projects/types';
import { useTheme } from '@/theme/use-theme';

const SEARCH_DEBOUNCE_MS = 250;

// 메인 화면 (docs/PROJECT_SYSTEM.md §8) — 검색(9필드) · 필터(상태·카테고리·우선순위 Select)/정렬 시트 · 카드 목록.
// 상태 칩 줄은 2026-08-18 필터 시트로 이동(사용자 지시).
export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const status = useFilterStore((s) => s.status);
  const categoryId = useFilterStore((s) => s.categoryId);
  const priority = useFilterStore((s) => s.priority);
  const sort = useFilterStore((s) => s.sort);
  const setStatus = useFilterStore((s) => s.setStatus);
  const setCategoryId = useFilterStore((s) => s.setCategoryId);
  const setPriority = useFilterStore((s) => s.setPriority);
  const setSort = useFilterStore((s) => s.setSort);
  const resetFilter = useFilterStore((s) => s.reset);

  const [searchText, setSearchText] = useState('');
  const [q, setQ] = useState('');
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // 검색어 디바운스 — 세션 한정(저장하지 않는다)
  useEffect(() => {
    const timer = setTimeout(() => setQ(searchText), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchText]);

  const reload = useCallback(() => {
    const cats = listCategories();
    setCategories(cats);
    // 저장된 카테고리 필터가 삭제됐으면 해제
    if (categoryId && !cats.some((c) => c.id === categoryId)) {
      setCategoryId(null);
      return;
    }
    setProjects(queryProjects({ q, status, categoryId, priority, sort }));
  }, [q, status, categoryId, priority, sort, setCategoryId]);
  useFocusEffect(reload);
  useEffect(reload, [reload]);

  const activeFilterCount = (status ? 1 : 0) + (categoryId ? 1 : 0) + (priority ? 1 : 0);
  const isFiltering = activeFilterCount > 0 || q.trim().length > 0;

  const sortOptions = useMemo(() => SORT_KEYS.map((k) => ({ value: k, label: t(`sort.${k}`) })), [t]);

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

      {/* 검색바 */}
      <View style={[styles.searchBar, { backgroundColor: theme.searchBar, borderColor: theme.border }]}>
        <Ionicons name="search" size={18} color={theme.textMuted} />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder={t('search.placeholder')}
          placeholderTextColor={theme.textMuted}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.searchInput, { color: theme.text }]}
          accessibilityLabel={t('common.search')}
        />
        {searchText ? (
          <Pressable hitSlop={8} onPress={() => setSearchText('')} accessibilityLabel={t('common.clear')}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {/* 필터 · 정렬 · 개수 */}
      <View style={styles.toolbar}>
        <Pressable onPress={() => setFilterOpen(true)} style={styles.toolButton} accessibilityRole="button">
          <Ionicons name="funnel-outline" size={16} color={activeFilterCount ? theme.primary : theme.icon} />
          <Text style={[styles.toolText, { color: activeFilterCount ? theme.primary : theme.text }]}>
            {t('filter.button')}
            {activeFilterCount ? ` · ${activeFilterCount}` : ''}
          </Text>
        </Pressable>
        <Pressable onPress={() => setSortOpen(true)} style={styles.toolButton} accessibilityRole="button">
          <Ionicons name="swap-vertical-outline" size={16} color={theme.icon} />
          <Text style={[styles.toolText, { color: theme.text }]} numberOfLines={1}>
            {t(`sort.${sort}`)}
          </Text>
        </Pressable>
        <Text style={[styles.count, { color: theme.textMuted }]}>
          {t('home.count', { count: projects.length })}
        </Text>
      </View>

      <FlatList
        data={projects}
        keyExtractor={(p) => p.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={projects.length === 0 ? styles.emptyContainer : styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => (
          <ProjectCard
            project={item}
            index={index}
            onPress={() => router.push({ pathname: '/project/[id]', params: { id: item.id } })}
            onLongPress={() => confirmDelete(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name={isFiltering ? 'search-outline' : 'bulb-outline'}
              size={40}
              color={theme.textMuted}
            />
            {isFiltering ? (
              <>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>
                  {q.trim() ? t('search.empty') : t('filter.empty')}
                </Text>
                <Pressable
                  onPress={() => {
                    setSearchText('');
                    resetFilter();
                  }}
                  style={styles.resetLink}>
                  <Text style={[styles.resetText, { color: theme.primary }]}>{t('filter.resetAll')}</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('home.empty.title')}</Text>
                <Text style={[styles.emptyBody, { color: theme.textMuted }]}>{t('home.empty.body')}</Text>
                {/* 데이터 손실 안내 — CLAUDE.md §6 (키 분리: data.notice.*) */}
                <Text style={[styles.notice, { color: theme.textMuted }]}>
                  {t('data.notice.local')} {t('data.notice.loss')}
                </Text>
              </>
            )}
          </View>
        }
      />

      <FilterSheet
        visible={filterOpen}
        categories={categories}
        status={status}
        categoryId={categoryId}
        priority={priority}
        onStatus={setStatus}
        onCategory={setCategoryId}
        onPriority={setPriority}
        onReset={() => {
          setStatus(null);
          setCategoryId(null);
          setPriority(null);
        }}
        onClose={() => setFilterOpen(false)}
      />
      <OptionSheet<SortKey>
        visible={sortOpen}
        title={t('sort.title')}
        value={sort}
        options={sortOptions}
        onSelect={setSort}
        onClose={() => setSortOpen(false)}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
  },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 0 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  toolButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  toolText: { fontSize: 13, fontWeight: '500' },
  count: { marginLeft: 'auto', fontSize: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  separator: { height: 12 },
  emptyContainer: { flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  emptyBody: { fontSize: 14, textAlign: 'center' },
  notice: { fontSize: 12, textAlign: 'center', marginTop: 24, lineHeight: 18 },
  resetLink: { paddingVertical: 6 },
  resetText: { fontSize: 14, fontWeight: '500' },
});
