import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';

import { Dialog } from '@/components/dialog';
import { EditRow, EditRowSeparator } from '@/components/edit-row';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import {
  createCategory,
  deleteCategory,
  listCategoriesWithCount,
  renameCategory,
  type CategoryWithCount,
} from '@/features/categories/api';
import { useTheme } from '@/theme/use-theme';

type Editing = { mode: 'add' } | { mode: 'rename'; category: CategoryWithCount } | null;
type DeleteChoice = { kind: 'clear' } | { kind: 'move'; targetId: string };

// 카테고리 관리 — 추가·이름 변경·삭제(사용 중이면 "없음으로 / 다른 카테고리로 이동 / 취소") (PROJECT_SYSTEM §4).
// 기본 카테고리도 일반 행 — 수정·삭제 가능(CLAUDE.md §14 #5). 행·다이얼로그는 공용 EditRow·Dialog(UI_GUIDE §5.3·§5.4).
export default function CategoriesScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [categories, setCategories] = useState<CategoryWithCount[]>(() => listCategoriesWithCount());
  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<CategoryWithCount | null>(null);

  const reload = useCallback(() => setCategories(listCategoriesWithCount()), []);

  return (
    <Screen hasHeader>
      <FlatList
        data={categories}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={EditRowSeparator}
        renderItem={({ item }) => (
          <EditRow
            name={item.name}
            subtitle={t('category.projectCount', { count: item.projectCount })}
            onEdit={() => setEditing({ mode: 'rename', category: item })}
            onDelete={() => setDeleting(item)}
          />
        )}
        ListFooterComponent={
          <Pressable onPress={() => setEditing({ mode: 'add' })} style={styles.addRow}>
            <Ionicons name="add-circle-outline" size={22} color={theme.primary} />
            <Text style={[styles.addText, { color: theme.primary }]}>{t('category.add')}</Text>
          </Pressable>
        }
      />

      {editing ? (
        <NameDialog
          title={editing.mode === 'add' ? t('category.add') : t('category.rename')}
          initial={editing.mode === 'rename' ? editing.category.name : ''}
          onCancel={() => setEditing(null)}
          onSubmit={(name) => {
            try {
              if (editing.mode === 'add') createCategory(name);
              else renameCategory(editing.category.id, name);
            } catch (e) {
              return e instanceof Error ? t(e.message) : t('category.error');
            }
            setEditing(null);
            reload();
            return null;
          }}
        />
      ) : null}

      {deleting ? (
        <DeleteDialog
          category={deleting}
          others={categories.filter((c) => c.id !== deleting.id)}
          onCancel={() => setDeleting(null)}
          onConfirm={(choice) => {
            deleteCategory(deleting.id, choice?.kind === 'move' ? choice.targetId : null);
            setDeleting(null);
            reload();
          }}
        />
      ) : null}
    </Screen>
  );
}

function NameDialog({
  title,
  initial,
  onCancel,
  onSubmit,
}: {
  title: string;
  initial: string;
  onCancel: () => void;
  onSubmit: (name: string) => string | null; // 에러 문구 반환 시 닫지 않는다
}) {
  const { t } = useTranslation();
  const [name, setName] = useState(initial);
  const [error, setError] = useState<string | undefined>();

  const submit = () => {
    const err = onSubmit(name);
    if (err) setError(err);
  };

  return (
    <Dialog title={title} onConfirm={submit} onCancel={onCancel}>
      <TextField
        label={t('category.name')}
        value={name}
        onChangeText={(v) => {
          setName(v);
          if (error) setError(undefined);
        }}
        error={error}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={submit}
      />
    </Dialog>
  );
}

function DeleteDialog({
  category,
  others,
  onCancel,
  onConfirm,
}: {
  category: CategoryWithCount;
  others: CategoryWithCount[];
  onCancel: () => void;
  onConfirm: (choice: DeleteChoice | null) => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const used = category.projectCount > 0;
  const [choice, setChoice] = useState<DeleteChoice>({ kind: 'clear' });

  return (
    <Dialog
      title={t('category.deleteTitle', { name: category.name })}
      confirmLabel={t('common.delete')}
      onConfirm={() => onConfirm(used ? choice : null)}
      onCancel={onCancel}>
      {used ? (
        <>
          <Text style={[styles.dialogBody, { color: theme.textMuted }]}>
            {t('category.deleteUsed', { count: category.projectCount })}
          </Text>
          <RadioRow
            label={t('category.deleteOption.clear')}
            active={choice.kind === 'clear'}
            onPress={() => setChoice({ kind: 'clear' })}
          />
          {others.length > 0 ? (
            <>
              <Text style={[styles.optionGroup, { color: theme.textMuted }]}>
                {t('category.deleteOption.move')}
              </Text>
              {others.map((c) => (
                <RadioRow
                  key={c.id}
                  label={c.name}
                  indent
                  active={choice.kind === 'move' && choice.targetId === c.id}
                  onPress={() => setChoice({ kind: 'move', targetId: c.id })}
                />
              ))}
            </>
          ) : null}
        </>
      ) : (
        <Text style={[styles.dialogBody, { color: theme.textMuted }]}>{t('category.deleteUnused')}</Text>
      )}
    </Dialog>
  );
}

function RadioRow({
  label,
  active,
  indent,
  onPress,
}: {
  label: string;
  active: boolean;
  indent?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.radioRow, indent && styles.radioIndent]}>
      <Ionicons
        name={active ? 'radio-button-on' : 'radio-button-off'}
        size={20}
        color={active ? theme.primary : theme.icon}
      />
      <Text style={[styles.radioLabel, { color: theme.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: { paddingVertical: 8 },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 16 },
  addText: { fontSize: 16, fontWeight: '500' },
  dialogBody: { fontSize: 14, lineHeight: 20 },
  optionGroup: { fontSize: 13, fontWeight: '500', marginTop: 4 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  radioIndent: { paddingLeft: 16 },
  radioLabel: { fontSize: 15 },
});
