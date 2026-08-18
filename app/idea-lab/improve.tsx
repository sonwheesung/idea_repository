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

// SCAMPER 축약 5문(docs/IDEATION_SYSTEM.md §3.2) — 키는 i18n ideation.improve.q.*
const QUESTIONS = ['add', 'remove', 'flip', 'reuse', 'other'] as const;

// 개선 — "이미 있는 것" 하나 + 질문 카드 5장(답은 전부 선택) → 답이 있는 카드마다 노트 1개.
export default function ImproveScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [subject, setSubject] = useState('');
  const [subjectError, setSubjectError] = useState<string | undefined>();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => QUESTIONS.map(() => ''));

  const x = subject.trim();
  const started = x.length > 0;
  const q = QUESTIONS[step];

  const requireSubject = (): boolean => {
    if (started) return true;
    setSubjectError(t('ideation.improve.subjectRequired'));
    return false;
  };

  const setAnswer = (text: string) =>
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = text;
      return next;
    });

  const save = () => {
    if (!requireSubject()) return;
    const notes = QUESTIONS.map((key, i) => ({ key, a: answers[i].trim() }))
      .filter(({ a }) => a.length > 0)
      .map(({ key, a }) => `${t(`ideation.improve.q.${key}.q`, { x })}\n— ${a}`);
    router.push({
      pathname: '/project/new',
      params: toPrefillParams({
        name: t('ideation.improve.projectName', { x }),
        approach: 'improve',
        notes,
      }),
    });
  };

  return (
    <Screen hasHeader scroll contentStyle={styles.body}>
      <TextField
        label={t('ideation.improve.subject')}
        value={subject}
        onChangeText={(v) => {
          setSubject(v);
          if (subjectError) setSubjectError(undefined);
        }}
        placeholder={t('ideation.improve.subjectPlaceholder')}
        error={subjectError}
        autoFocus
        returnKeyType="done"
      />

      <StepDots count={QUESTIONS.length} index={step} />
      <QuestionCard
        kicker={`${t('ideation.improve.step', { n: step + 1, total: QUESTIONS.length })} · ${t(`ideation.improve.q.${q}.k`)}`}
        question={t(`ideation.improve.q.${q}.q`, { x: started ? x : '…' })}
        hint={t(`ideation.improve.q.${q}.hint`)}
      />
      <TextField
        label={t('ideation.improve.answer')}
        value={answers[step]}
        onChangeText={setAnswer}
        placeholder={t('ideation.improve.answerPlaceholder')}
        multiline
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
            onPress={() => {
              if (!requireSubject()) return;
              setStep((s) => Math.min(QUESTIONS.length - 1, s + 1));
            }}
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
