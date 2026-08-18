import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { QuestionCard } from '@/components/question-card';
import { Screen } from '@/components/screen';
import { StepDots } from '@/components/step-dots';
import { TextField } from '@/components/text-field';
import { toPrefillParams } from '@/features/ideation/prefill';

// 불편에서 — 질문 3장(docs/IDEATION_SYSTEM.md §3.3). 첫 답만 필수(문제점이 없으면 프로젝트가 안 된다).
const QUESTIONS = ['what', 'who', 'how'] as const;
const NAME_MAX = 40;

export default function ProblemScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => QUESTIONS.map(() => ''));
  const [error, setError] = useState<string | undefined>();
  const q = QUESTIONS[step];

  const setAnswer = (text: string) => {
    if (error) setError(undefined);
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = text;
      return next;
    });
  };

  const save = () => {
    const [what, who, how] = answers.map((a) => a.trim());
    if (what.length === 0) {
      setStep(0);
      setError(t('ideation.problem.firstRequired'));
      return;
    }
    const firstLine = what.split('\n')[0];
    const name = firstLine.length > NAME_MAX ? `${firstLine.slice(0, NAME_MAX).trimEnd()}…` : firstLine;
    router.push({
      pathname: '/project/new',
      params: toPrefillParams({
        name: name || t('ideation.problem.projectNameFallback'),
        problem: what,
        targetUser: who || undefined,
        approach: 'problem',
        notes: how ? [`${t('ideation.problem.q.how.q')}\n— ${how}`] : undefined,
      }),
    });
  };

  return (
    <Screen hasHeader scroll contentStyle={styles.body}>
      <StepDots count={QUESTIONS.length} index={step} />
      <QuestionCard
        kicker={t(`ideation.problem.q.${q}.k`)}
        question={t(`ideation.problem.q.${q}.q`)}
        hint={t(`ideation.problem.q.${q}.hint`)}
      />
      <TextField
        label={t('ideation.improve.answer')}
        value={answers[step]}
        onChangeText={setAnswer}
        placeholder={step === 0 ? undefined : t('ideation.improve.answerPlaceholder')}
        error={step === 0 ? error : undefined}
        multiline
        autoFocus
      />
      <View style={styles.row}>
        <View style={styles.flex}>
          <Button
            label={t('ideation.improve.back')}
            variant="ghost"
            disabled={step === 0}
            onPress={() => setStep((s) => Math.max(0, s - 1))}
          />
        </View>
        <View style={styles.flex}>
          <Button
            label={t('ideation.improve.next')}
            variant={step === QUESTIONS.length - 1 ? 'ghost' : 'primary'}
            disabled={step === QUESTIONS.length - 1}
            onPress={() => setStep((s) => Math.min(QUESTIONS.length - 1, s + 1))}
          />
        </View>
      </View>
      <Button label={t('ideation.improve.saveAnswers')} onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, gap: 16, paddingBottom: 24 },
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: 8 },
});
