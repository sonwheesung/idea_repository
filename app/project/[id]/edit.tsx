import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import { ProjectForm, toProjectInput, type ProjectFormValues } from '@/components/project-form';
import { Screen } from '@/components/screen';
import { getProjectCard, updateProject } from '@/features/projects/api';
import { useTheme } from '@/theme/use-theme';

// 프로젝트 편집 — 전 필드 펼침. 노트·자료는 상세 화면에서 인라인(여기 없음). (PROJECT_SYSTEM §12)
export default function EditProjectScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const initial = useMemo<ProjectFormValues | null>(() => {
    const p = getProjectCard(id);
    if (!p) return null;
    return {
      name: p.name,
      summary: p.summary ?? '',
      description: p.description ?? '',
      categoryId: p.categoryId,
      tags: p.tags,
      problem: p.problem ?? '',
      goal: p.goal ?? '',
      coreIdea: p.coreIdea ?? '',
      targetUser: p.targetUser ?? '',
      progress: p.progress,
      status: p.status,
      priority: p.priority,
      startDate: p.startDate,
      targetEndDate: p.targetEndDate,
    };
  }, [id]);

  return (
    <Screen hasHeader scroll contentStyle={styles.body}>
      <Stack.Screen options={{ title: t('project.edit') }} />
      {initial ? (
        <ProjectForm
          mode="edit"
          initial={initial}
          submitLabel={t('common.save')}
          onSubmit={(values) => {
            updateProject(id, toProjectInput(values));
            router.back();
          }}
        />
      ) : (
        <Text style={{ color: theme.textMuted }}>{t('project.notFound')}</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, gap: 16, paddingBottom: 24 },
});
