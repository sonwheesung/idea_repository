import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme/use-theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  /** 필수 표시(프로젝트명 하나뿐 — CLAUDE.md §5) */
  required?: boolean;
}

/** 라벨 + 입력 (2026-08-17 사용자 요청: 폼은 Label + input 형태). LinkMemo text-field 승계. */
export function TextField({ label, error, required, style, ...inputProps }: TextFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: theme.textMuted }]}>
        {label}
        {required ? <Text style={{ color: theme.danger }}> *</Text> : null}
      </Text>
      <TextInput
        {...inputProps}
        placeholderTextColor={theme.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: theme.searchBar,
            borderColor: error ? theme.danger : theme.border,
            color: theme.text,
          },
          inputProps.multiline && styles.multiline,
          style,
        ]}
      />
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 13, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
  error: { fontSize: 12 },
});
