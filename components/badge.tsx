import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/use-theme';

/** 알약 배지 — 상태(기본) · 우선순위(accent). 카드·상세 공용(docs/UI_GUIDE.md §5.5). */
export function Badge({ label, accent }: { label: string; accent?: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: accent ? theme.primary : theme.badge }]}>
      <Text style={[styles.text, { color: accent ? theme.buttonText : theme.badgeText }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  text: { fontSize: 12, fontWeight: '500' },
});
