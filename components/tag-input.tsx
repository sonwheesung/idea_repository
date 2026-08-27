import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { splitTags, suggestTags } from '@/features/tags/api';
import { useTheme } from '@/theme/use-theme';

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

/**
 * 태그 입력 — 칩 + 입력창 + 기존 태그 자동완성 (PROJECT_SYSTEM §5).
 * 공백·쉼표·엔터로 확정, '#'은 있어도 없어도 된다(저장은 # 없이). 대소문자 무시 중복 제거.
 */
export function TagInput({ label, value, onChange, placeholder }: TagInputProps) {
  const theme = useTheme();
  const [draft, setDraft] = useState('');

  const suggestions = useMemo(() => suggestTags(draft, value), [draft, value]);

  const commit = (raw: string) => {
    const parts = splitTags(raw);
    if (parts.length === 0) return;
    const lower = new Set(value.map((v) => v.toLowerCase()));
    const next = [...value];
    for (const p of parts) {
      if (!lower.has(p.toLowerCase())) {
        next.push(p);
        lower.add(p.toLowerCase());
      }
    }
    onChange(next);
    setDraft('');
  };

  const onChangeText = (text: string) => {
    // 구분자가 들어오면 그 앞까지 확정 — 공백/쉼표 입력 = 태그 하나 완성
    if (/[\s,]$/.test(text)) commit(text);
    else setDraft(text);
  };

  const remove = (tag: string) => onChange(value.filter((v) => v !== tag));

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
      <View style={[styles.field, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {value.map((tag) => (
          <View key={tag} style={[styles.chip, { backgroundColor: theme.badge }]}>
            <Text style={[styles.chipText, { color: theme.badgeText }]}>#{tag}</Text>
            <Pressable hitSlop={6} onPress={() => remove(tag)} accessibilityLabel={`remove ${tag}`}>
              <Ionicons name="close" size={14} color={theme.badgeText} />
            </Pressable>
          </View>
        ))}
        <TextInput
          value={draft}
          onChangeText={onChangeText}
          onSubmitEditing={() => commit(draft)}
          onBlur={() => commit(draft)}
          placeholder={value.length === 0 ? placeholder : undefined}
          placeholderTextColor={theme.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit={false}
          returnKeyType="done"
          style={[styles.input, { color: theme.text }]}
        />
      </View>
      {suggestions.length > 0 ? (
        <View style={styles.suggestions}>
          {suggestions.map((s) => (
            <Pressable
              key={s}
              onPress={() => commit(s)}
              style={[styles.suggestion, { borderColor: theme.border, backgroundColor: theme.card }]}>
              <Text style={[styles.suggestionText, { color: theme.text }]}>#{s}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 13, fontWeight: '500' },
  field: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 48,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: { fontSize: 13, fontWeight: '500' },
  input: { flexGrow: 1, minWidth: 80, fontSize: 16, paddingVertical: 4, paddingHorizontal: 4 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  suggestion: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  suggestionText: { fontSize: 13 },
});
