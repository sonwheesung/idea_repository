import { Ionicons } from '@expo/vector-icons';
import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { useTheme } from '@/theme/use-theme';

export type ListRowIcon = keyof typeof Ionicons.glyphMap;

interface ListRowProps {
  title: string;
  /** 한 줄 설명(현재 값·개수·힌트). 한 목록 안에서는 전부 주거나 전부 비운다(UI_GUIDE §1) */
  description?: string;
  /** 왼쪽 아이콘 박스 — 목록 단위로 전부/전무 */
  icon?: ListRowIcon;
  /** 꼬리: 화살표(기본) · 외부 링크 · 없음 */
  trailing?: 'chevron' | 'external' | 'none';
  /** 제목 옆 알림 점(안 읽은 공지) */
  badge?: boolean;
  /** card = 독립 카드(기본) · flat = ListGroup 안에서 테두리 없이 */
  variant?: 'card' | 'flat';
  accessibilityRole?: 'button' | 'link';
  onPress: () => void;
}

/**
 * 탐색 행 — 설정·발상 도구 목록·About 링크가 같은 규격을 쓴다(docs/UI_GUIDE.md §5.1, 2026-08-23).
 * 높이는 minHeight 72로 고정해 설명이 비어도 줄지 않는다. 색은 토큰만.
 */
export function ListRow({
  title,
  description,
  icon,
  trailing = 'chevron',
  badge,
  variant = 'card',
  accessibilityRole = 'button',
  onPress,
}: ListRowProps) {
  const theme = useTheme();
  const flat = variant === 'flat';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      style={({ pressed }) => [
        styles.row,
        !flat && { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 },
        { opacity: pressed ? 0.85 : 1 },
      ]}>
      {icon ? (
        <View style={[styles.iconBox, { backgroundColor: theme.searchBar }]}>
          <Ionicons name={icon} size={20} color={theme.primary} />
        </View>
      ) : null}
      <View style={styles.texts}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {title}
          </Text>
          {badge ? <View style={[styles.badgeDot, { backgroundColor: theme.primary }]} /> : null}
        </View>
        {description ? (
          <Text style={[styles.description, { color: theme.textMuted }]} numberOfLines={1}>
            {description}
          </Text>
        ) : null}
      </View>
      {trailing === 'chevron' ? <Ionicons name="chevron-forward" size={18} color={theme.icon} /> : null}
      {trailing === 'external' ? <Ionicons name="open-outline" size={16} color={theme.textMuted} /> : null}
    </Pressable>
  );
}

/** 행 묶음 카드 — flat 행을 세로로 쌓고 사이에 hairline 구분선(UI_GUIDE §5.2). About 링크가 쓴다. */
export function ListGroup({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const items = Children.toArray(children);
  return (
    <Card style={styles.group}>
      {items.map((child, index) => (
        <Fragment key={index}>
          {index > 0 ? <View style={[styles.separator, { backgroundColor: theme.border }]} /> : null}
          {child}
        </Fragment>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 72,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
  },
  iconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 16, fontWeight: '600', flexShrink: 1 },
  badgeDot: { width: 8, height: 8, borderRadius: 4 },
  description: { fontSize: 13 },
  group: { padding: 0, gap: 0 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 14 },
});
