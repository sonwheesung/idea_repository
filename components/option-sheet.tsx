import { Ionicons } from '@expo/vector-icons';
import { FlatList, Modal, Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/theme/use-theme';

export interface SheetOption<T extends string> {
  value: T;
  label: string;
}

interface OptionSheetProps<T extends string> {
  visible: boolean;
  title: string;
  value: T;
  options: SheetOption<T>[];
  onSelect: (value: T) => void;
  onClose: () => void;
}

/** 옵션 목록 모달 — Select의 펼침부이자 정렬 시트. 색은 토큰만. */
export function OptionSheet<T extends string>({
  visible,
  title,
  value,
  options,
  onSelect,
  onClose,
}: OptionSheetProps<T>) {
  const theme = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.textMuted }]}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(o) => o.value}
            renderItem={({ item }) => {
              const active = item.value === value;
              return (
                <Pressable
                  onPress={() => {
                    onSelect(item.value);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.option,
                    { backgroundColor: pressed ? theme.surface : 'transparent' },
                  ]}>
                  <Text
                    style={[styles.optionLabel, { color: theme.text, fontWeight: active ? '600' : '400' }]}>
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
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  sheet: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, paddingVertical: 8, maxHeight: '70%' },
  title: { fontSize: 13, fontWeight: '600', paddingHorizontal: 16, paddingVertical: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionLabel: { fontSize: 16 },
});
