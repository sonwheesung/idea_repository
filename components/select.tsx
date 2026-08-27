import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OptionSheet, type SheetOption } from '@/components/option-sheet';
import { useTheme } from '@/theme/use-theme';

export type SelectOption<T extends string> = SheetOption<T>;

interface SelectProps<T extends string> {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  /** 값이 없을 때 표시(예: 카테고리 없음) */
  placeholder?: string;
}

/**
 * 셀렉트 — 라벨 + 현재 값 행, 탭하면 옵션 목록 모달(2026-08-17 사용자 요청: 칩 대신 select).
 * 프로젝트 폼(카테고리·상태·우선순위)·문의 폼(분류)이 쓴다. 설정 화면은 행 모양 통일을 위해 OptionSheet를 직접 연다(2026-08-18). 색은 토큰만.
 */
export function Select<T extends string>({ label, value, options, onChange, placeholder }: SelectProps<T>) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.field,
          { backgroundColor: theme.card, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
        ]}>
        <Text style={[styles.value, { color: current ? theme.text : theme.textMuted }]} numberOfLines={1}>
          {current?.label ?? placeholder ?? ''}
        </Text>
        <Ionicons name="chevron-down" size={18} color={theme.icon} />
      </Pressable>
      <OptionSheet
        visible={open}
        title={label}
        value={value}
        options={options}
        onSelect={onChange}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 13, fontWeight: '500' },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  value: { fontSize: 16, flex: 1, marginRight: 8 },
});
