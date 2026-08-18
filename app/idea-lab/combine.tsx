import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Select, type SelectOption } from '@/components/select';
import { TextField } from '@/components/text-field';
import { WordPicker } from '@/components/word-picker';
import { listCategories } from '@/features/categories/api';
import { getPool } from '@/features/ideation/pool';
import { toPrefillParams } from '@/features/ideation/prefill';
import {
  MINE_GROUP_KEY,
  WORD_SOURCES,
  pickPair,
  pickPartner,
  resolveGroups,
  type WordPick,
  type WordSource,
} from '@/features/ideation/shuffle';
import { listAllTags } from '@/features/tags/api';
import { useTheme } from '@/theme/use-theme';

const SOURCE_LABEL_KEY: Record<WordSource, string> = {
  builtin: 'ideation.combine.sourceBuiltin',
  builtinAndMine: 'ideation.combine.sourceBuiltinAndMine',
  mineOnly: 'ideation.combine.sourceMineOnly',
};

// 조합 — 슬롯 A × B, 섞기, 단어 출처, 떠오르는 것 → 프로젝트로 저장. docs/IDEATION_SYSTEM.md §3.1
export default function CombineScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const pool = useMemo(() => getPool(i18n.language), [i18n.language]);
  const mine = useMemo(() => [...listAllTags(), ...listCategories().map((c) => c.name)], []);
  const [source, setSource] = useState<WordSource>('builtin');
  const groups = useMemo(() => resolveGroups(source, pool.groups, mine), [source, pool, mine]);
  const allWords = useMemo(() => groups.flatMap((g) => g.words), [groups]);

  const [pair, setPair] = useState<[WordPick, WordPick]>(() =>
    pickPair(resolveGroups('builtin', pool.groups, [])),
  );
  const [picking, setPicking] = useState<0 | 1 | null>(null);
  const [idea, setIdea] = useState('');

  const sourceOptions: SelectOption<WordSource>[] = WORD_SOURCES.map((s) => ({
    value: s,
    label: t(SOURCE_LABEL_KEY[s]),
  }));

  const shuffleBoth = () => setPair(pickPair(groups));
  const shuffleRight = () => setPair(([a]) => [a, pickPartner(groups, a)]);
  const setSlot = (i: 0 | 1, word: string) =>
    setPair((prev) => {
      const next: [WordPick, WordPick] = [prev[0], prev[1]];
      next[i] = { word, group: MINE_GROUP_KEY }; // 손으로 고른 단어는 그룹을 모른다 → 다음 섞기에서 제약 없음
      return next;
    });

  const save = () => {
    const [a, b] = pair;
    router.push({
      pathname: '/project/new',
      params: toPrefillParams({
        name: `${a.word} × ${b.word}`,
        coreIdea: idea.trim() || undefined,
        approach: 'combine',
        tags: [a.word, b.word],
      }),
    });
  };

  return (
    <Screen hasHeader scroll contentStyle={styles.body}>
      <View style={styles.combo}>
        <Slot word={pair[0].word} onPress={() => setPicking(0)} />
        <Text style={[styles.x, { color: theme.textMuted }]}>×</Text>
        <Slot word={pair[1].word} onPress={() => setPicking(1)} />
      </View>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Button label={t('ideation.combine.shuffleBoth')} variant="ghost" onPress={shuffleBoth} />
        </View>
        <View style={styles.flex}>
          <Button label={t('ideation.combine.shuffleRight')} variant="ghost" onPress={shuffleRight} />
        </View>
      </View>
      <Select
        label={t('ideation.combine.source')}
        value={source}
        options={sourceOptions}
        onChange={setSource}
      />

      <View style={[styles.result, { borderColor: theme.primary }]}>
        <Text style={[styles.resultQ, { color: theme.textMuted }]}>
          {t('ideation.combine.question', { a: pair[0].word, b: pair[1].word })}
        </Text>
        <Text style={[styles.resultH, { color: theme.text }]}>
          {pair[0].word} × {pair[1].word}
        </Text>
      </View>

      <TextField
        label={t('ideation.comesToMind')}
        value={idea}
        onChangeText={setIdea}
        placeholder={t('ideation.comesToMindPlaceholder')}
        multiline
      />
      <Button label={t('ideation.saveProject')} onPress={save} />

      <WordPicker
        visible={picking !== null}
        words={allWords}
        onSelect={(w) => picking !== null && setSlot(picking, w)}
        onClose={() => setPicking(null)}
      />
    </Screen>
  );
}

function Slot({ word, onPress }: { word: string; onPress: () => void }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.slot,
        { backgroundColor: theme.searchBar, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
      ]}>
      <Text style={[styles.slotWord, { color: theme.text }]} numberOfLines={2}>
        {word}
      </Text>
      <Text style={[styles.slotHint, { color: theme.textMuted }]}>{t('ideation.combine.slotHint')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, gap: 16, paddingBottom: 24 },
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: 8 },
  combo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  slot: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 2,
    minHeight: 76,
    justifyContent: 'center',
  },
  slotWord: { fontSize: 17, fontWeight: '600', textAlign: 'center' },
  slotHint: { fontSize: 11 },
  x: { fontSize: 20, fontWeight: '600' },
  result: { borderWidth: 1, borderRadius: 12, padding: 14, gap: 4 },
  resultQ: { fontSize: 13 },
  resultH: { fontSize: 18, fontWeight: '700' },
});
