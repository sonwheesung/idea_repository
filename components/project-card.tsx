import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import type { ProjectCard as ProjectCardData } from '@/features/projects/types';
import { formatDate } from '@/lib/date';
import { useTheme } from '@/theme/use-theme';

interface ProjectCardProps {
  project: ProjectCardData;
  /** 목록 인덱스 — 컬러 포인트 테마의 카드 포인트 컬러 순환용 */
  index?: number;
  onPress?: () => void;
  onLongPress?: () => void;
}

const MAX_TAGS = 3;

// 카드 = 이름 · 한 줄 요약 · 상태 · 진행률 · 우선순위 · 카테고리 · 태그 · 마지막 수정일 (PROJECT_SYSTEM §8)
export function ProjectCard({ project, index = 0, onPress, onLongPress }: ProjectCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const shownTags = project.tags.slice(0, MAX_TAGS);
  const extraTags = project.tags.length - shownTags.length;
  const meta = [project.categoryName, ...shownTags.map((tag) => `#${tag}`)].filter(Boolean).join(' · ');

  const accent = theme.cardAccents ? theme.cardAccents[index % theme.cardAccents.length] : null;

  return (
    <Card onPress={onPress} onLongPress={onLongPress} style={accent ? styles.accentCard : undefined}>
      {accent ? <View style={[styles.accentBar, { backgroundColor: accent }]} /> : null}
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
        {project.name}
      </Text>
      {project.summary ? (
        <Text style={[styles.summary, { color: theme.textMuted }]} numberOfLines={2}>
          {project.summary}
        </Text>
      ) : null}

      <View style={styles.row}>
        <Badge label={t(`status.${project.status}`)} />
        {project.priority !== 'none' ? <Badge label={t(`priority.${project.priority}`)} accent /> : null}
        <Text style={[styles.progressText, { color: theme.text }]}>{project.progress}%</Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.progressTrack }]}>
        <View style={[styles.fill, { backgroundColor: theme.progressFill, width: `${project.progress}%` }]} />
      </View>

      <View style={styles.row}>
        <Text style={[styles.meta, { color: theme.textMuted }]} numberOfLines={1}>
          {meta}
          {extraTags > 0 ? ` +${extraTags}` : ''}
        </Text>
        <Text style={[styles.meta, { color: theme.textMuted }]}>
          {t('project.updated', { date: formatDate(project.updatedAt) })}
        </Text>
      </View>
    </Card>
  );
}

function Badge({ label, accent }: { label: string; accent?: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: accent ? theme.primary : theme.badge }]}>
      <Text style={[styles.badgeText, { color: accent ? theme.buttonText : theme.badgeText }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  accentCard: { overflow: 'hidden' },
  accentBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  name: { fontSize: 17, fontWeight: '600' },
  summary: { fontSize: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 12, fontWeight: '500' },
  progressText: { marginLeft: 'auto', fontSize: 13, fontWeight: '600' },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  meta: { fontSize: 12, flexShrink: 1 },
});
