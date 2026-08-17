import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { ProjectForm, toProjectInput } from '@/components/project-form';
import { Screen } from '@/components/screen';
import { createProject } from '@/features/projects/api';

// 프로젝트 생성 — 이름 1칸 + "Add details" 펼침, 저장 후 목록 복귀 (PROJECT_SYSTEM §2). 폼은 components/project-form.
export default function NewProjectScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Screen hasHeader scroll contentStyle={styles.body}>
      <ProjectForm
        mode="create"
        submitLabel={t('common.save')}
        onSubmit={(values) => {
          createProject(toProjectInput(values));
          router.back();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, gap: 16, paddingBottom: 24 },
});
