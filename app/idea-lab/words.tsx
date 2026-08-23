import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, SectionList, StyleSheet, Text } from 'react-native';

import { Dialog } from '@/components/dialog';
import { EditRow, EditRowSeparator } from '@/components/edit-row';
import { Screen } from '@/components/screen';
import { Select, type SelectOption } from '@/components/select';
import { TextField } from '@/components/text-field';
import { MINE_GROUP_KEY } from '@/features/ideation/shuffle';
import {
  WORD_GROUP_KEYS,
  addWord,
  deleteWord,
  listWordSections,
  updateWord,
  type IdeationWord,
} from '@/features/ideation/words';
import { useTheme } from '@/theme/use-theme';

type Editing = { mode: 'add' } | { mode: 'edit'; word: IdeationWord } | null;

// 단어 관리 — 그룹별 목록·추가(헤더 ＋)·수정·삭제 (docs/IDEATION_SYSTEM.md §3.5).
// 내장 단어도 일반 행(기본 카테고리와 같은 원칙). 카테고리 관리와 같은 EditRow·Dialog(UI_GUIDE §5.3·§5.4).
export default function WordsScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const lang = i18n.language;
  const [sections, setSections] = useState(() => listWordSections(lang));
  const [editing, setEditing] = useState<Editing>(null);

  const reload = useCallback(() => setSections(listWordSections(lang)), [lang]);

  const confirmDelete = (w: IdeationWord) =>
    Alert.alert(t('ideation.words.deleteTitle', { word: w.word }), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          deleteWord(w.id);
          reload();
        },
      },
    ]);

  const total = sections.reduce((n, s) => n + s.words.length, 0);

  return (
    <Screen hasHeader>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => setEditing({ mode: 'add' })}
              hitSlop={8}
              style={styles.headerButton}
              accessibilityRole="button"
              accessibilityLabel={t('ideation.words.add')}>
              <Ionicons name="add" size={26} color={theme.primary} />
            </Pressable>
          ),
        }}
      />
      <SectionList
        sections={sections.map((s) => ({ key: s.key, data: s.words }))}
        keyExtractor={(w) => w.id}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <Text style={[styles.intro, { color: theme.textMuted }]}>
            {t('ideation.words.intro', { count: total })}
          </Text>
        }
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionHeader, { color: theme.textMuted, backgroundColor: theme.background }]}>
            {t(`ideation.group.${section.key}`, { defaultValue: section.key })}
          </Text>
        )}
        ItemSeparatorComponent={EditRowSeparator}
        renderItem={({ item }) => (
          <EditRow
            name={item.word}
            onEdit={() => setEditing({ mode: 'edit', word: item })}
            onDelete={() => confirmDelete(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textMuted }]}>{t('ideation.words.empty')}</Text>
        }
      />

      {editing ? (
        <WordDialog
          title={editing.mode === 'add' ? t('ideation.words.add') : t('ideation.words.edit')}
          initialWord={editing.mode === 'edit' ? editing.word.word : ''}
          initialGroup={editing.mode === 'edit' ? editing.word.group : MINE_GROUP_KEY}
          onCancel={() => setEditing(null)}
          onSubmit={(word, group) => {
            try {
              if (editing.mode === 'add') addWord(lang, word, group);
              else updateWord(editing.word.id, lang, word, group);
            } catch (e) {
              return e instanceof Error ? t(e.message) : t('ideation.words.errorEmpty');
            }
            setEditing(null);
            reload();
            return null;
          }}
        />
      ) : null}
    </Screen>
  );
}

function WordDialog({
  title,
  initialWord,
  initialGroup,
  onCancel,
  onSubmit,
}: {
  title: string;
  initialWord: string;
  initialGroup: string;
  onCancel: () => void;
  onSubmit: (word: string, group: string) => string | null; // 에러 문구 반환 시 닫지 않는다
}) {
  const { t } = useTranslation();
  const [word, setWord] = useState(initialWord);
  const [group, setGroup] = useState(initialGroup);
  const [error, setError] = useState<string | undefined>();

  const groupOptions: SelectOption<string>[] = WORD_GROUP_KEYS.map((k) => ({
    value: k,
    label: t(`ideation.group.${k}`, { defaultValue: k }),
  }));

  const submit = () => {
    const err = onSubmit(word, group);
    if (err) setError(err);
  };

  return (
    <Dialog title={title} onConfirm={submit} onCancel={onCancel}>
      <TextField
        label={t('ideation.words.word')}
        value={word}
        onChangeText={(v) => {
          setWord(v);
          if (error) setError(undefined);
        }}
        error={error}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      <Select label={t('ideation.words.group')} value={group} options={groupOptions} onChange={setGroup} />
    </Dialog>
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: 8, paddingBottom: 24 },
  intro: { fontSize: 13, lineHeight: 18, paddingHorizontal: 16, paddingBottom: 8 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  empty: { fontSize: 14, paddingHorizontal: 16, paddingVertical: 24, textAlign: 'center' },
  headerButton: { padding: 4 },
});
