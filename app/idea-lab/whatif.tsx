import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { QuestionCard } from '@/components/question-card';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { getPool, type IdeationPool } from '@/features/ideation/pool';
import { toPrefillParams } from '@/features/ideation/prefill';
import { pick, pickWord } from '@/features/ideation/shuffle';

interface Card {
  sentence: string;
  word: string;
}

function drawCard(pool: IdeationPool, previous?: Card): Card {
  let card = makeCard(pool);
  for (let i = 0; i < 10 && previous && card.sentence === previous.sentence; i++) card = makeCard(pool);
  return card;
}

function makeCard(pool: IdeationPool): Card {
  const { word } = pickWord(pool.groups);
  return { sentence: pick(pool.whatIf).replace('{X}', word), word };
}

// 만약에… — 문장 틀 × 단어 풀 카드(docs/IDEATION_SYSTEM.md §3.4). 다음 카드 / 떠오르는 것 + 저장.
export default function WhatIfScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const pool = useMemo(() => getPool(i18n.language), [i18n.language]);
  const [card, setCard] = useState<Card>(() => drawCard(pool));
  const [idea, setIdea] = useState('');

  const save = () => {
    router.push({
      pathname: '/project/new',
      params: toPrefillParams({
        name: card.sentence,
        coreIdea: idea.trim() || undefined,
        approach: 'whatif',
        tags: [card.word],
      }),
    });
  };

  return (
    <Screen hasHeader scroll contentStyle={styles.body}>
      <QuestionCard kicker={t('ideation.tools.whatif.title')} question={card.sentence} />
      <Button
        label={t('ideation.whatif.nextCard')}
        variant="ghost"
        onPress={() => {
          setCard((prev) => drawCard(pool, prev));
          setIdea('');
        }}
      />
      <TextField
        label={t('ideation.comesToMind')}
        value={idea}
        onChangeText={setIdea}
        placeholder={t('ideation.comesToMindPlaceholder')}
        multiline
      />
      <Button label={t('ideation.saveProject')} onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, gap: 16, paddingBottom: 24 },
});
