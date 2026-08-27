import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { THEMES, THEME_IDS, type ThemeId, type ThemePalette } from '@/theme/palettes';
import { useThemeStore } from '@/theme/store';
import { useTheme } from '@/theme/use-theme';

// 미리보기는 이미지가 아니라 토큰으로 그린 홈 미니어처 — 팔레트를 추가하면 미리보기도 따라온다 (THEME_SYSTEM §3)
function ThemePreview({ palette }: { palette: ThemePalette }) {
  return (
    <View style={[preview.frame, { backgroundColor: palette.background, borderColor: palette.border }]}>
      <View style={preview.header}>
        <View style={[preview.brand, { backgroundColor: palette.text }]} />
        <View style={preview.headerIcons}>
          <View style={[preview.headerIcon, { backgroundColor: palette.icon }]} />
          <View style={[preview.headerIcon, { backgroundColor: palette.primary }]} />
        </View>
      </View>
      <View
        style={[preview.searchBar, { backgroundColor: palette.searchBar, borderColor: palette.border }]}
      />
      <View style={preview.chips}>
        <View style={[preview.chip, { backgroundColor: palette.primary }]} />
        {[0, 1].map((i) => (
          <View key={i} style={[preview.chip, { backgroundColor: palette.badge }]} />
        ))}
      </View>
      {[0, 1, 2].map((i) => (
        <View key={i} style={[preview.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
          {palette.cardAccents ? (
            <View
              style={[
                preview.accent,
                { backgroundColor: palette.cardAccents[i % palette.cardAccents.length] },
              ]}
            />
          ) : null}
          <View style={preview.cardBody}>
            <View style={[preview.line, { backgroundColor: palette.text, width: '55%' }]} />
            <View style={[preview.line, { backgroundColor: palette.textMuted, width: '80%' }]} />
            <View style={[preview.track, { backgroundColor: palette.progressTrack }]}>
              <View
                style={[preview.fill, { backgroundColor: palette.progressFill, width: `${35 + i * 20}%` }]}
              />
            </View>
          </View>
        </View>
      ))}
      <View style={[preview.banner, { backgroundColor: palette.surface, borderColor: palette.border }]} />
    </View>
  );
}

export default function ThemeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const setting = useThemeStore((s) => s.setting);
  const setSetting = useThemeStore((s) => s.setSetting);

  // ~~['system', ...THEME_IDS]~~ → 12종만(2026-08-27 사용자 지시 "시스템(자동) 제거 — 바로 매핑")
  const nameOf = (s: ThemeId) => t(`theme.names.${s}`);

  return (
    <Screen hasHeader scroll contentStyle={styles.list}>
      <Text style={[styles.current, { color: theme.textMuted }]}>
        {t('theme.current')} · {nameOf(setting)}
      </Text>
      <View style={styles.grid}>
        {THEME_IDS.map((id) => {
          const selected = id === setting;
          const paletteId: ThemeId = id;
          return (
            <Pressable
              key={id}
              onPress={() => setSetting(id)}
              accessibilityLabel={nameOf(id)}
              style={[
                styles.item,
                { borderColor: selected ? theme.primary : theme.border, backgroundColor: theme.card },
                selected && styles.itemSelected,
              ]}>
              <ThemePreview palette={THEMES[paletteId]} />
              <View style={styles.nameRow}>
                <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                  {nameOf(id)}
                </Text>
                {selected ? <Ionicons name="checkmark-circle" size={16} color={theme.primary} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 32 },
  current: { fontSize: 13, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  item: { width: '47%', borderWidth: 1.5, borderRadius: 14, padding: 8, gap: 8 },
  itemSelected: { borderWidth: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  name: { fontSize: 13, fontWeight: '600', flexShrink: 1 },
});

const preview = StyleSheet.create({
  frame: { borderRadius: 10, borderWidth: 1, padding: 8, gap: 6, aspectRatio: 0.62 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { width: 42, height: 8, borderRadius: 3, opacity: 0.9 },
  headerIcons: { flexDirection: 'row', gap: 4 },
  headerIcon: { width: 8, height: 8, borderRadius: 4 },
  searchBar: { height: 12, borderRadius: 6, borderWidth: StyleSheet.hairlineWidth },
  chips: { flexDirection: 'row', gap: 4 },
  chip: { width: 20, height: 8, borderRadius: 4 },
  card: {
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accent: { width: 3 },
  cardBody: { flex: 1, padding: 5, gap: 3 },
  line: { height: 3, borderRadius: 2 },
  track: { height: 3, borderRadius: 2, overflow: 'hidden', marginTop: 1 },
  fill: { height: '100%' },
  banner: { marginTop: 'auto', height: 14, borderRadius: 4, borderWidth: StyleSheet.hairlineWidth },
});
