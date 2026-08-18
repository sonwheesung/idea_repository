import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { useTheme } from '@/theme/use-theme';

type ToolKey = 'combine' | 'improve' | 'problem' | 'whatif';

const TOOLS: { key: ToolKey; icon: keyof typeof Ionicons.glyphMap; href: Href }[] = [
  { key: 'combine', icon: 'git-merge-outline', href: '/idea-lab/combine' },
  { key: 'improve', icon: 'construct-outline', href: '/idea-lab/improve' },
  { key: 'problem', icon: 'alert-circle-outline', href: '/idea-lab/problem' },
  { key: 'whatif', icon: 'help-circle-outline', href: '/idea-lab/whatif' },
];

// 발상 도구 홈 — 도구 4종 목록(아이콘 · 제목 · 한 줄 설명). docs/IDEATION_SYSTEM.md §3. 광고 없음(작성 흐름).
export default function IdeaLabScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  return (
    <Screen hasHeader scroll contentStyle={styles.body}>
      <Text style={[styles.intro, { color: theme.textMuted }]}>{t('ideation.intro')}</Text>
      {TOOLS.map((tool) => (
        <Pressable
          key={tool.key}
          onPress={() => router.push(tool.href)}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.row,
            { backgroundColor: theme.card, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
          ]}>
          <View style={[styles.iconBox, { backgroundColor: theme.searchBar }]}>
            <Ionicons name={tool.icon} size={20} color={theme.primary} />
          </View>
          <View style={styles.texts}>
            <Text style={[styles.title, { color: theme.text }]}>{t(`ideation.tools.${tool.key}.title`)}</Text>
            <Text style={[styles.desc, { color: theme.textMuted }]}>
              {t(`ideation.tools.${tool.key}.desc`)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.icon} />
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, gap: 12 },
  intro: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  iconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, gap: 2 },
  title: { fontSize: 16, fontWeight: '600' },
  desc: { fontSize: 12 },
});
