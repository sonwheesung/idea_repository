import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/use-theme';

interface QuestionCardProps {
  /** 작은 상단 키(예: "2 / 5 · 빼기") */
  kicker: string;
  question: string;
  hint?: string;
}

/** 발상 도구 — 질문 카드(개선·불편에서·만약에 공용). docs/IDEATION_SYSTEM.md §3 */
export function QuestionCard({ kicker, question, hint }: QuestionCardProps) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.kicker, { color: theme.primary }]}>{kicker}</Text>
      <Text style={[styles.question, { color: theme.text }]}>{question}</Text>
      {hint ? <Text style={[styles.hint, { color: theme.textMuted }]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 6 },
  kicker: { fontSize: 11, fontWeight: '600', letterSpacing: 0.6 },
  question: { fontSize: 18, fontWeight: '600', lineHeight: 26 },
  hint: { fontSize: 13, lineHeight: 19 },
});
