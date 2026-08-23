import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/use-theme';

interface EditRowProps {
  name: string;
  /** 부제(예: "N개 프로젝트") — 목록 단위로 전부/전무 */
  subtitle?: string;
  onEdit: () => void;
  onDelete: () => void;
}

/** 관리 목록 행 — 카테고리·단어 관리가 같은 규격(docs/UI_GUIDE.md §5.3). 카드 없이 구분선은 목록이 그린다. */
export function EditRow({ name, subtitle, onEdit, onDelete }: EditRowProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {name}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.textMuted }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Pressable hitSlop={8} accessibilityLabel={t('common.edit')} onPress={onEdit} style={styles.iconButton}>
        <Ionicons name="pencil-outline" size={20} color={theme.icon} />
      </Pressable>
      <Pressable
        hitSlop={8}
        accessibilityLabel={t('common.delete')}
        onPress={onDelete}
        style={styles.iconButton}>
        <Ionicons name="trash-outline" size={20} color={theme.danger} />
      </Pressable>
    </View>
  );
}

/** 관리 목록의 행 구분선 — FlatList/SectionList `ItemSeparatorComponent`에 그대로 */
export function EditRowSeparator() {
  const theme = useTheme();
  return <View style={[styles.separator, { backgroundColor: theme.border }]} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  texts: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 13 },
  iconButton: { padding: 8 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 16 },
});
