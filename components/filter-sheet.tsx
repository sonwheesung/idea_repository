import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Select, type SelectOption } from '@/components/select';
import type { Category } from '@/features/categories/api';
import { PRIORITIES, STATUSES, type Priority, type Status } from '@/features/projects/types';
import { useTheme } from '@/theme/use-theme';

interface FilterSheetProps {
  visible: boolean;
  categories: Category[];
  status: Status | null;
  categoryId: string | null;
  priority: Priority | null;
  onStatus: (s: Status | null) => void;
  onCategory: (id: string | null) => void;
  onPriority: (p: Priority | null) => void;
  onReset: () => void;
  onClose: () => void;
}

/** "전체" 값 — Select는 string 값만 받으므로 null 대신 sentinel */
const ALL = '__all__';

/**
 * 필터 시트 — 상태·카테고리·우선순위 세 개의 Select. 세 축 AND (PROJECT_SYSTEM §10).
 * ~~메인의 상태 칩 줄 + 시트 안 칩 그룹~~ → 2026-08-18 사용자 지시("필터에 넣고 select로")로 통일.
 * 시트(Modal) 위에 Select의 OptionSheet(Modal)가 겹쳐 뜬다.
 */
export function FilterSheet({
  visible,
  categories,
  status,
  categoryId,
  priority,
  onStatus,
  onCategory,
  onPriority,
  onReset,
  onClose,
}: FilterSheetProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const all = { value: ALL, label: t('filter.all') };
  const statusOptions: SelectOption<string>[] = [
    all,
    ...STATUSES.map((s) => ({ value: s, label: t(`status.${s}`) })),
  ];
  const categoryOptions: SelectOption<string>[] = [
    all,
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];
  const priorityOptions: SelectOption<string>[] = [
    all,
    ...PRIORITIES.map((p) => ({ value: p, label: t(`priority.${p}`) })),
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            // 하단 시트 — 시스템 내비 바/홈 인디케이터 위로(2026-08-18 에뮬 실측: 버튼이 가려짐)
            { backgroundColor: theme.card, borderColor: theme.border, paddingBottom: 12 + insets.bottom },
          ]}>
          <Text style={[styles.title, { color: theme.text }]}>{t('filter.title')}</Text>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <Select
              label={t('filter.status')}
              value={status ?? ALL}
              options={statusOptions}
              onChange={(v) => onStatus(v === ALL ? null : (v as Status))}
            />
            <Select
              label={t('filter.category')}
              value={categoryId ?? ALL}
              options={categoryOptions}
              onChange={(v) => onCategory(v === ALL ? null : v)}
            />
            <Select
              label={t('filter.priority')}
              value={priority ?? ALL}
              options={priorityOptions}
              onChange={(v) => onPriority(v === ALL ? null : (v as Priority))}
            />
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
  body: { gap: 14, paddingBottom: 8 },
  actions: { flexDirection: 'row', gap: 10, paddingBottom: 8 },
});
