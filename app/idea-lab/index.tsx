import { useRouter, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import { ListRow, type ListRowIcon } from '@/components/list-row';
import { Screen } from '@/components/screen';
import { useTheme } from '@/theme/use-theme';

type ToolKey = 'combine' | 'improve' | 'problem' | 'whatif';

const TOOLS: { key: ToolKey; icon: ListRowIcon; href: Href }[] = [
  { key: 'combine', icon: 'git-merge-outline', href: '/idea-lab/combine' },
  { key: 'improve', icon: 'construct-outline', href: '/idea-lab/improve' },
  { key: 'problem', icon: 'alert-circle-outline', href: '/idea-lab/problem' },
  { key: 'whatif', icon: 'help-circle-outline', href: '/idea-lab/whatif' },
];

// 발상 도구 홈 — 도구 4종 목록(아이콘 · 제목 · 한 줄 설명) = 설정과 같은 ListRow(docs/UI_GUIDE.md §5.1, 2026-08-23).
// docs/IDEATION_SYSTEM.md §3. 광고 없음(작성 흐름).
export default function IdeaLabScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  return (
    <Screen hasHeader scroll contentStyle={styles.body}>
      <Text style={[styles.intro, { color: theme.textMuted }]}>{t('ideation.intro')}</Text>
      {TOOLS.map((tool) => (
        <ListRow
          key={tool.key}
          icon={tool.icon}
          title={t(`ideation.tools.${tool.key}.title`)}
          description={t(`ideation.tools.${tool.key}.desc`)}
          onPress={() => router.push(tool.href)}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, gap: 12 },
  intro: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
});
