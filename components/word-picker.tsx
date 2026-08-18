import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/use-theme';

interface WordPickerProps {
  visible: boolean;
  /** 후보 단어(그룹 합친 평면 목록) */
  words: string[];
  onSelect: (word: string) => void;
  onClose: () => void;
}

/**
 * 발상 도구 — 단어 선택 시트(검색 + 목록 + 입력한 그대로 쓰기). docs/IDEATION_SYSTEM.md §3.1.
 * 무작위는 시작점일 뿐 — 사용자가 언제든 손으로 바꾼다.
 */
export function WordPicker({ visible, words, onSelect, onClose }: WordPickerProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return words;
    return words.filter((w) => w.toLowerCase().includes(needle));
  }, [q, words]);

  const typed = q.trim();
  const showTyped = typed.length > 0 && !words.some((w) => w.toLowerCase() === typed.toLowerCase());

  const choose = (w: string) => {
    onSelect(w);
    setQ('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            { backgroundColor: theme.card, borderColor: theme.border, paddingBottom: 12 + insets.bottom },
          ]}>
          <Text style={[styles.title, { color: theme.text }]}>{t('ideation.combine.pickerTitle')}</Text>
          <View style={[styles.search, { backgroundColor: theme.searchBar, borderColor: theme.border }]}>
            <Ionicons name="search" size={16} color={theme.textMuted} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder={t('ideation.combine.pickerSearch')}
              placeholderTextColor={theme.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={() => (showTyped ? choose(typed) : filtered[0] ? choose(filtered[0]) : null)}
              style={[styles.searchInput, { color: theme.text }]}
              autoFocus
            />
          </View>
          {showTyped ? (
            <Pressable onPress={() => choose(typed)} accessibilityRole="button" style={styles.typedRow}>
              <Ionicons name="add-circle-outline" size={18} color={theme.primary} />
              <Text style={[styles.typedText, { color: theme.primary }]}>
                {t('ideation.combine.useTyped', { word: typed })}
              </Text>
            </Pressable>
          ) : null}
          <FlatList
            data={filtered}
            keyExtractor={(w, i) => `${w}-${i}`}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => choose(item)}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.option,
                  { backgroundColor: pressed ? theme.surface : 'transparent' },
                ]}>
                <Text style={[styles.optionText, { color: theme.text }]}>{item}</Text>
              </Pressable>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    gap: 12,
    height: '70%',
  },
  title: { fontSize: 17, fontWeight: '600' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 0 },
  typedRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  typedText: { fontSize: 15, fontWeight: '600' },
  list: { flex: 1 },
  option: { paddingVertical: 12, paddingHorizontal: 4, borderRadius: 8 },
  optionText: { fontSize: 16 },
});
