import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/use-theme';

/** 진행률 바 — 카드(6) · 상세(8). 값은 0~100(docs/UI_GUIDE.md §5.5). */
export function ProgressBar({ value, height = 6 }: { value: number; height?: number }) {
  const theme = useTheme();
  const radius = height / 2;
  return (
    <View style={[styles.track, { height, borderRadius: radius, backgroundColor: theme.progressTrack }]}>
      <View
        style={[
          styles.fill,
          { borderRadius: radius, backgroundColor: theme.progressFill, width: `${value}%` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { overflow: 'hidden' },
  fill: { height: '100%' },
});
