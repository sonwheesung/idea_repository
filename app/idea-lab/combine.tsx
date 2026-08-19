import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { WordPicker } from '@/components/word-picker';
import type { WordGroup } from '@/db/ideation-pool';
import { toPrefillParams } from '@/features/ideation/prefill';
import { MINE_GROUP_KEY, pickPair, pickPartner, type WordPick } from '@/features/ideation/shuffle';
import { listShuffleGroups } from '@/features/ideation/words';
import { useTheme } from '@/theme/use-theme';

// 조합 — 슬롯 A × B, 섞기, 떠오르는 것 → 프로젝트로 저장. 헤더 우측 = 단어 관리(/idea-lab/words). docs/IDEATION_SYSTEM.md §3.1·§3.5
export default function CombineScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  // 단어는 DB(관리 화면에서 바뀐다) — 포커스마다 다시 읽는다. 2개 미만이면 내장 풀 대체(words.ts)
  const [groups, setGroups] = useState<WordGroup[]>(() => listShuffleGroups(i18n.language));
  useFocusEffect(useCallback(() => setGroups(listShuffleGroups(i18n.language)), [i18n.language]));
  const allWords = useMemo(() => groups.flatMap((g) => g.words), [groups]);

  const [pair, setPair] = useState<[WordPick, WordPick]>(() => pickPair(groups));
  const [picking, setPicking] = useState<0 | 1 | null>(null);
  const [idea, setIdea] = useState('');

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
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/idea-lab/words')}
              hitSlop={8}
              style={styles.headerButton}
              accessibilityRole="button"
              accessibilityLabel={t('ideation.words.title')}>
              <Ionicons name="library-outline" size={22} color={theme.primary} />
            </Pressable>
          ),
        }}
      />
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
  headerButton: { padding: 4 },
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
