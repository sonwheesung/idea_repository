import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { useTheme } from '@/theme/use-theme';

// 프로젝트 생성 골격 — 이름 1칸 + "Add details" 펼침 (docs/PROJECT_SYSTEM.md §2). 실제 폼·저장은 Phase 1.
export default function NewProjectScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Screen edges={[]}>
      <View style={styles.body}>
        <Text style={[styles.label, { color: theme.textMuted }]}>{t('project.name')}</Text>
        <Text style={[styles.hint, { color: theme.textMuted }]}>{t('project.addDetails')}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, gap: 12 },
  label: { fontSize: 14 },
  hint: { fontSize: 13 },
});
