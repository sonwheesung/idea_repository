import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/use-theme';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

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
 * 설정(화면 모드·언어)과 프로젝트 폼(카테고리·상태·우선순위)이 공용으로 쓴다. 색은 토큰만.
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
          { backgroundColor: theme.searchBar, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
        ]}>
        <Text style={[styles.value, { color: current ? theme.text : theme.textMuted }]} numberOfLines={1}>
          {current?.label ?? placeholder ?? ''}
        </Text>
        <Ionicons name="chevron-down" size={18} color={theme.icon} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sheetTitle, { color: theme.textMuted }]}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(o) => o.value}
              renderItem={({ item }) => {
                const active = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      { backgroundColor: pressed ? theme.surface : 'transparent' },
                    ]}>
                    <Text style={[styles.optionLabel, { color: theme.text, fontWeight: active ? '600' : '400' }]}>
                      {item.label}
                    </Text>
                    {active ? <Ionicons name="checkmark" size={20} color={theme.primary} /> : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    maxHeight: '70%',
  },
  sheetTitle: { fontSize: 13, fontWeight: '600', paddingHorizontal: 16, paddingVertical: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionLabel: { fontSize: 16 },
});
