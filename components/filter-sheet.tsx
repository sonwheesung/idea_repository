import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import type { Category } from '@/features/categories/api';
import { PRIORITIES, type Priority } from '@/features/projects/types';
import { useTheme } from '@/theme/use-theme';

interface FilterSheetProps {
  visible: boolean;
  categories: Category[];
  categoryId: string | null;
  priority: Priority | null;
  onCategory: (id: string | null) => void;
  onPriority: (p: Priority | null) => void;
  onReset: () => void;
  onClose: () => void;
}

/**
 * 필터 시트 — 카테고리·우선순위 (상태는 메인의 칩 줄이 담당). 세 축 AND (PROJECT_SYSTEM §10).
 * 모달 안에서 또 모달(Select)을 띄우지 않으려고 칩 그룹으로 그린다.
 */
export function FilterSheet({
  visible,
  categories,
  categoryId,
  priority,
  onCategory,
  onPriority,
  onReset,
  onClose,
}: FilterSheetProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>{t('filter.title')}</Text>
          <ScrollView contentContainerStyle={styles.body}>
            <Text style={[styles.group, { color: theme.textMuted }]}>{t('filter.category')}</Text>
            <View style={styles.chips}>
              <Chip label={t('filter.all')} active={categoryId === null} onPress={() => onCategory(null)} />
              {categories.map((c) => (
                <Chip
                  key={c.id}
                  label={c.name}
                  active={categoryId === c.id}
                  onPress={() => onCategory(c.id)}
                />
              ))}
            </View>
            <Text style={[styles.group, { color: theme.textMuted }]}>{t('filter.priority')}</Text>
            <View style={styles.chips}>
              <Chip label={t('filter.all')} active={priority === null} onPress={() => onPriority(null)} />
              {PRIORITIES.map((p) => (
                <Chip
                  key={p}
                  label={t(`priority.${p}`)}
                  active={priority === p}
                  onPress={() => onPriority(p)}
                />
              ))}
            </View>
          </ScrollView>
          <View style={styles.actions}>
            <View style={styles.flex}>
              <Button label={t('common.reset')} variant="ghost" onPress={onReset} />
            </View>
            <View style={styles.flex}>
              <Button label={t('common.done')} onPress={onClose} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/** 칩 — 필터 전용(폼의 선택형은 Select — CLAUDE.md §14 M) */
export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.primary : theme.badge,
          borderColor: active ? theme.primary : theme.border,
        },
      ]}>
      <Text
        style={[
          styles.chipText,
          { color: active ? theme.buttonText : theme.badgeText, fontWeight: active ? '600' : '400' },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    gap: 12,
    maxHeight: '75%',
  },
  title: { fontSize: 17, fontWeight: '600' },
  body: { gap: 10, paddingBottom: 8 },
  group: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  chipText: { fontSize: 14 },
  actions: { flexDirection: 'row', gap: 10, paddingBottom: 8 },
});
