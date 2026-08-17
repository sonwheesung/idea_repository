import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/use-theme';

interface ProgressFieldProps {
  label: string;
  value: number; // 0~100
  onChange: (value: number) => void;
}

/** 진행률 — 슬라이더(1% 단위) + 숫자 + 바. 사용자가 직접 설정, 상태와 자동 연동 없음 (PROJECT_SYSTEM §3.3) */
export function ProgressField({ label, value, onChange }: ProgressFieldProps) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
        <Text style={[styles.value, { color: theme.text }]}>{value}%</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={value}
        onValueChange={(v) => onChange(Math.round(v))}
        minimumTrackTintColor={theme.progressFill}
        maximumTrackTintColor={theme.progressTrack}
        thumbTintColor={theme.primary}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 13, fontWeight: '500' },
  value: { fontSize: 14, fontWeight: '600' },
  slider: { width: '100%', height: 40 },
});
