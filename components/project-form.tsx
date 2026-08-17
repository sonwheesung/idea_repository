import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { DateField } from '@/components/date-field';
import { ProgressField } from '@/components/progress-field';
import { Select, type SelectOption } from '@/components/select';
import { TagInput } from '@/components/tag-input';
import { TextField } from '@/components/text-field';
import { listCategories } from '@/features/categories/api';
import {
  PRIORITIES,
  STATUSES,
  type Priority,
  type ProjectInput,
  type Status,
} from '@/features/projects/types';
import { useTheme } from '@/theme/use-theme';

const NO_CATEGORY = '__none__';

export interface ProjectFormValues {
  name: string;
  summary: string;
  description: string;
  categoryId: string | null;
  tags: string[];
  problem: string;
  goal: string;
  coreIdea: string;
  targetUser: string;
  progress: number;
  status: Status;
  priority: Priority;
  startDate: string | null;
  targetEndDate: string | null;
}

export const EMPTY_PROJECT_FORM: ProjectFormValues = {
  name: '',
  summary: '',
  description: '',
  categoryId: null,
  tags: [],
  problem: '',
  goal: '',
  coreIdea: '',
  targetUser: '',
  progress: 0,
  status: 'idea',
  priority: 'none',
  startDate: null,
  targetEndDate: null,
};

export function toProjectInput(v: ProjectFormValues): ProjectInput {
  return { ...v };
}

interface ProjectFormProps {
  initial?: ProjectFormValues;
  /** create = 이름 1칸 + "Add details" 펼침(기둥 1) · edit = 전 필드 펼침 */
  mode: 'create' | 'edit';
  submitLabel: string;
  onSubmit: (values: ProjectFormValues) => void;
}

/**
 * 프로젝트 폼 — Label + input (CLAUDE.md §14 M). 생성·편집이 같은 폼을 쓴다.
 * 필수는 이름 하나. 마감일 < 시작일은 막지 않고 경고만(PROJECT_SYSTEM §3.3).
 */
export function ProjectForm({ initial = EMPTY_PROJECT_FORM, mode, submitLabel, onSubmit }: ProjectFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [v, setV] = useState<ProjectFormValues>(initial);
  const [nameError, setNameError] = useState<string | undefined>();
  const [showDetails, setShowDetails] = useState(mode === 'edit');

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

  const set = <K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const dateWarning =
    v.startDate && v.targetEndDate && v.targetEndDate < v.startDate ? t('project.dateWarning') : undefined;

  const submit = () => {
    if (v.name.trim().length === 0) {
      setNameError(t('project.nameRequired'));
      return;
    }
    onSubmit(v);
  };

  return (
    <>
      <TextField
        label={t('project.name')}
        required
        value={v.name}
        onChangeText={(text) => {
          set('name', text);
          if (nameError) setNameError(undefined);
        }}
        placeholder={t('project.namePlaceholder')}
        error={nameError}
        autoFocus={mode === 'create'}
        returnKeyType="done"
        onSubmitEditing={submit}
      />

      {mode === 'create' ? (
        <Pressable onPress={() => setShowDetails((s) => !s)} accessibilityRole="button" style={styles.toggle}>
          <Ionicons name={showDetails ? 'chevron-down' : 'chevron-forward'} size={16} color={theme.primary} />
          <Text style={[styles.toggleText, { color: theme.primary }]}>{t('project.addDetails')}</Text>
        </Pressable>
      ) : null}

      {showDetails ? (
        <View style={styles.details}>
          <TextField label={t('project.summary')} value={v.summary} onChangeText={(x) => set('summary', x)} />
          <TextField
            label={t('project.description')}
            value={v.description}
            onChangeText={(x) => set('description', x)}
            multiline
          />
          <Select
            label={t('project.category')}
            value={v.categoryId ?? NO_CATEGORY}
            options={categoryOptions}
            onChange={(id) => set('categoryId', id === NO_CATEGORY ? null : id)}
          />
          <TagInput
            label={t('project.tags')}
            value={v.tags}
            onChange={(tags) => set('tags', tags)}
            placeholder={t('project.tagsPlaceholder')}
          />

          <SectionTitle label={t('project.sectionIdea')} />
          <TextField
            label={t('project.problem')}
            value={v.problem}
            onChangeText={(x) => set('problem', x)}
            multiline
          />
          <TextField
            label={t('project.goal')}
            value={v.goal}
            onChangeText={(x) => set('goal', x)}
            multiline
          />
          <TextField
            label={t('project.coreIdea')}
            value={v.coreIdea}
            onChangeText={(x) => set('coreIdea', x)}
            multiline
          />
          <TextField
            label={t('project.targetUser')}
            value={v.targetUser}
            onChangeText={(x) => set('targetUser', x)}
            multiline
          />

          <SectionTitle label={t('project.sectionProgress')} />
          <Select
            label={t('project.status')}
            value={v.status}
            options={statusOptions}
            onChange={(s) => set('status', s)}
          />
          <Select
            label={t('project.priority')}
            value={v.priority}
            options={priorityOptions}
            onChange={(p) => set('priority', p)}
          />
          <ProgressField
            label={t('project.progress')}
            value={v.progress}
            onChange={(n) => set('progress', n)}
          />
          <DateField
            label={t('project.startDate')}
            value={v.startDate}
            onChange={(d) => set('startDate', d)}
            placeholder={t('project.datePlaceholder')}
          />
          <DateField
            label={t('project.targetEndDate')}
            value={v.targetEndDate}
            onChange={(d) => set('targetEndDate', d)}
            placeholder={t('project.datePlaceholder')}
            warning={dateWarning}
          />
        </View>
      ) : null}

      {/* 저장 버튼은 스크롤 콘텐츠 마지막 — 고정 footer는 키보드에 가리거나 숨겨야 한다 */}
      <Button label={submitLabel} onPress={submit} />
    </>
  );
}

function SectionTitle({ label }: { label: string }) {
  const theme = useTheme();
  return (
    <Text style={[styles.section, { color: theme.textMuted, borderTopColor: theme.border }]}>{label}</Text>
  );
}

const styles = StyleSheet.create({
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  toggleText: { fontSize: 14, fontWeight: '500' },
  details: { gap: 16 },
  section: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
