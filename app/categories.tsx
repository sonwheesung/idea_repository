import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
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
// 기본 카테고리도 일반 행 — 수정·삭제 가능(CLAUDE.md §14 #5).
export default function CategoriesScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [categories, setCategories] = useState<CategoryWithCount[]>(() => listCategoriesWithCount());
  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<CategoryWithCount | null>(null);

  const reload = useCallback(() => setCategories(listCategoriesWithCount()), []);

  return (
    <Screen edges={[]}>
      <FlatList
        data={categories}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.border }]} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.count, { color: theme.textMuted }]}>
                {t('category.projectCount', { count: item.projectCount })}
              </Text>
            </View>
            <Pressable
              hitSlop={8}
              accessibilityLabel={t('common.edit')}
              onPress={() => setEditing({ mode: 'rename', category: item })}
              style={styles.iconButton}>
              <Ionicons name="pencil-outline" size={20} color={theme.icon} />
            </Pressable>
            <Pressable
              hitSlop={8}
              accessibilityLabel={t('common.delete')}
              onPress={() => setDeleting(item)}
              style={styles.iconButton}>
              <Ionicons name="trash-outline" size={20} color={theme.danger} />
            </Pressable>
          </View>
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
  const theme = useTheme();
  const [name, setName] = useState(initial);
  const [error, setError] = useState<string | undefined>();

  const submit = () => {
    const err = onSubmit(name);
    if (err) setError(err);
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={[styles.dialog, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.dialogTitle, { color: theme.text }]}>{title}</Text>
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
          <View style={styles.dialogActions}>
            <View style={styles.flex}>
              <Button label={t('common.cancel')} variant="ghost" onPress={onCancel} />
            </View>
            <View style={styles.flex}>
              <Button label={t('common.save')} onPress={submit} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
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
    <Modal transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={[styles.dialog, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.dialogTitle, { color: theme.text }]}>
            {t('category.deleteTitle', { name: category.name })}
          </Text>
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
          <View style={styles.dialogActions}>
            <View style={styles.flex}>
              <Button label={t('common.cancel')} variant="ghost" onPress={onCancel} />
            </View>
            <View style={styles.flex}>
              <Button label={t('common.delete')} onPress={() => onConfirm(used ? choice : null)} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
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
  flex: { flex: 1 },
  list: { paddingVertical: 8 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 4 },
  rowText: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '500' },
  count: { fontSize: 12 },
  iconButton: { padding: 8 },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 16 },
  addText: { fontSize: 16, fontWeight: '500' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  dialog: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 20, gap: 14 },
  dialogTitle: { fontSize: 17, fontWeight: '600' },
  dialogBody: { fontSize: 14, lineHeight: 20 },
  dialogActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  optionGroup: { fontSize: 13, fontWeight: '500', marginTop: 4 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  radioIndent: { paddingLeft: 16 },
  radioLabel: { fontSize: 15 },
});
