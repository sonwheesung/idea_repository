import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/use-theme';

/** 단계 점 인디케이터 — 발상 도구 질문 카드(개선·불편에서). 현재 단계는 길게. */
export function StepDots({ count, index }: { count: number; index: number }) {
  const theme = useTheme();
  return (
    <View style={styles.row} accessibilityLabel={`${index + 1} / ${count}`}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i === index ? theme.primary : theme.progressTrack,
              width: i === index ? 18 : 6,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 5 },
  dot: { height: 6, borderRadius: 3 },
});
