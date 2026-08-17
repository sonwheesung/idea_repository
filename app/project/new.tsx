import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Select, type SelectOption } from '@/components/select';
import { TagInput } from '@/components/tag-input';
import { TextField } from '@/components/text-field';
import { listCategories } from '@/features/categories/api';
import { createProject } from '@/features/projects/api';
import { PRIORITIES, STATUSES, type Priority, type Status } from '@/features/projects/types';
import { useTheme } from '@/theme/use-theme';

const NO_CATEGORY = '__none__';

// 프로젝트 생성 — 이름 1칸 + "Add details" 펼침, 저장 후 목록 복귀 (PROJECT_SYSTEM §2).
// 폼은 Label + input (2026-08-17 사용자 요청). 문제점·목표·핵심 아이디어·타겟·일정·태그·노트·자료는
// 상세/편집(Phase 2)에서 — 생성은 빠르게(기둥 1). 태그는 생성 시에도 넣을 수 있다.
export default function NewProjectScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | undefined>();
  const [showDetails, setShowDetails] = useState(false);
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>(NO_CATEGORY);
  const [status, setStatus] = useState<Status>('idea');
  const [priority, setPriority] = useState<Priority>('none');
  const [tags, setTags] = useState<string[]>([]);

  const categories = useMemo(() => listCategories(), []);
  const categoryOptions: SelectOption<string>[] = [
    { value: NO_CATEGORY, label: t('project.categoryNone') },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];
  const statusOptions: SelectOption<Status>[] = STATUSES.map((s) => ({ value: s, label: t(`status.${s}`) }));
  const priorityOptions: SelectOption<Priority>[] = PRIORITIES.map((p) => ({
    value: p,
    label: t(`priority.${p}`),
  }));

  const save = () => {
    if (name.trim().length === 0) {
      setNameError(t('project.nameRequired'));
      return;
    }
    createProject({
      name,
      summary,
      description,
      categoryId: categoryId === NO_CATEGORY ? null : categoryId,
      status,
      priority,
      tags,
    });
    router.back();
  };

  return (
    <Screen edges={[]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <TextField
            label={t('project.name')}
            required
            value={name}
            onChangeText={(v) => {
              setName(v);
              if (nameError) setNameError(undefined);
            }}
            placeholder={t('project.namePlaceholder')}
            error={nameError}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={save}
          />

          <Pressable
            onPress={() => setShowDetails((v) => !v)}
            accessibilityRole="button"
            style={styles.detailsToggle}>
            <Ionicons
              name={showDetails ? 'chevron-down' : 'chevron-forward'}
              size={16}
              color={theme.primary}
            />
            <Text style={[styles.detailsToggleText, { color: theme.primary }]}>
              {t('project.addDetails')}
            </Text>
          </Pressable>

          {showDetails ? (
            <View style={styles.details}>
              <TextField label={t('project.summary')} value={summary} onChangeText={setSummary} />
              <TextField
                label={t('project.description')}
                value={description}
                onChangeText={setDescription}
                multiline
              />
              <Select
                label={t('project.category')}
                value={categoryId}
                options={categoryOptions}
                onChange={setCategoryId}
              />
              <TagInput
                label={t('project.tags')}
                value={tags}
                onChange={setTags}
                placeholder={t('project.tagsPlaceholder')}
              />
              <Select
                label={t('project.status')}
                value={status}
                options={statusOptions}
                onChange={setStatus}
              />
              <Select
                label={t('project.priority')}
                value={priority}
                options={priorityOptions}
                onChange={setPriority}
              />
            </View>
          ) : null}
        </ScrollView>
        <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
          <Button label={t('common.save')} onPress={save} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { padding: 16, gap: 16, paddingBottom: 24 },
  detailsToggle: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  detailsToggleText: { fontSize: 14, fontWeight: '500' },
  details: { gap: 16 },
  footer: { padding: 16, borderTopWidth: StyleSheet.hairlineWidth },
});
