import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import {
  EMPTY_PROJECT_FORM,
  ProjectForm,
  toProjectInput,
  type ProjectFormValues,
} from '@/components/project-form';
import { Screen } from '@/components/screen';
import { hasPrefill, parsePrefillParams } from '@/features/ideation/prefill';
import { createNote } from '@/features/notes/api';
import { createProject } from '@/features/projects/api';

// 프로젝트 생성 — 이름 1칸 + "Add details" 펼침, 저장 후 목록 복귀 (PROJECT_SYSTEM §2). 폼은 components/project-form.
// 발상 도구에서 오면 파라미터로 미리 채워진다(IDEATION_SYSTEM §6) — 그때는 펼친 채 시작하고, 노트는 저장 직후 추가.
export default function NewProjectScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<Record<string, string | string[]>>();

  const prefill = useMemo(() => parsePrefillParams(params), [params]);
  const prefilled = hasPrefill(prefill);
  const initial = useMemo<ProjectFormValues>(
    () => ({
      ...EMPTY_PROJECT_FORM,
      name: prefill.name ?? '',
      coreIdea: prefill.coreIdea ?? '',
      problem: prefill.problem ?? '',
      targetUser: prefill.targetUser ?? '',
      approach: prefill.approach ?? 'none',
      tags: prefill.tags ?? [],
    }),
    [prefill],
  );

  return (
    <Screen hasHeader scroll contentStyle={styles.body}>
      <ProjectForm
        mode="create"
        initial={initial}
        startExpanded={prefilled}
        submitLabel={t('common.save')}
        onSubmit={(values) => {
          const project = createProject(toProjectInput(values));
          prefill.notes?.forEach((n) => createNote(project.id, n));
          router.back();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, gap: 16, paddingBottom: 24 },
});
