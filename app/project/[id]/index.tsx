import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ResourceDialog } from '@/components/resource-dialog';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { createNote, deleteNote, listNotes, updateNote, type Note } from '@/features/notes/api';
import { deleteProject, getProjectCard } from '@/features/projects/api';
import type { ProjectCard } from '@/features/projects/types';
import {
  createResource,
  deleteResource,
  listResources,
  updateResource,
  type Resource,
} from '@/features/resources/api';
import { displayDomain } from '@/features/resources/url';
import { formatDate, formatDay } from '@/lib/date';
import { useTheme } from '@/theme/use-theme';

// 프로젝트 상세 (PROJECT_SYSTEM §12) — 전 항목 표시, 빈 항목은 "Add …" 플레이스홀더(탭 → 편집).
// 노트·자료는 여기서 인라인 추가/수정/삭제. 하단 배너 자리(읽기 화면 — CLAUDE.md §7).
export default function ProjectDetailScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [project, setProject] = useState<ProjectCard | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [noteDraft, setNoteDraft] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [resourceDialog, setResourceDialog] = useState<{ open: boolean; editing: Resource | null }>({
    open: false,
    editing: null,
  });

  const reload = useCallback(() => {
    setProject(getProjectCard(id));
    setNotes(listNotes(id));
    setResources(listResources(id));
  }, [id]);
  useFocusEffect(reload);

  const goEdit = () => router.push({ pathname: '/project/[id]/edit', params: { id } });

  const confirmDeleteProject = () => {
    if (!project) return;
    Alert.alert(
      t('project.deleteTitle', { name: project.name }),
      t('project.deleteDetail', { notes: notes.length, resources: resources.length }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            deleteProject(id);
            router.back();
          },
        },
      ],
    );
  };

  const submitNote = () => {
    const content = noteDraft.trim();
    if (!content) return;
    if (editingNote) updateNote(editingNote.id, content);
    else createNote(id, content);
    setNoteDraft('');
    setEditingNote(null);
    reload();
  };

  const noteActions = (note: Note) => {
    Alert.alert(t('note.title'), formatDate(note.createdAt), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.edit'),
        onPress: () => {
          setEditingNote(note);
          setNoteDraft(note.content);
        },
      },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          deleteNote(note.id);
          if (editingNote?.id === note.id) {
            setEditingNote(null);
            setNoteDraft('');
          }
          reload();
        },
      },
    ]);
  };

  const openResource = async (r: Resource) => {
    try {
      await Linking.openURL(r.url);
    } catch {
      Alert.alert(t('resource.openFailed'));
    }
  };

  const resourceActions = (r: Resource) => {
    Alert.alert(r.title ?? displayDomain(r.url), r.url, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.edit'), onPress: () => setResourceDialog({ open: true, editing: r }) },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          deleteResource(r.id);
          reload();
        },
      },
    ]);
  };

  if (!project) {
    return (
      <Screen hasHeader>
        <Stack.Screen options={{ title: '' }} />
        <Text style={[styles.notFound, { color: theme.textMuted }]}>{t('project.notFound')}</Text>
      </Screen>
    );
  }

  const meta = [project.categoryName, ...project.tags.map((tag) => `#${tag}`)].filter(Boolean).join(' · ');

  return (
    <Screen hasHeader scroll contentStyle={styles.body} footer={<AdBanner />}>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable
                hitSlop={8}
                onPress={goEdit}
                accessibilityLabel={t('common.edit')}
                style={styles.headerBtn}>
                <Ionicons name="pencil-outline" size={20} color={theme.icon} />
              </Pressable>
              <Pressable
                hitSlop={8}
                onPress={confirmDeleteProject}
                accessibilityLabel={t('common.delete')}
                style={styles.headerBtn}>
                <Ionicons name="trash-outline" size={20} color={theme.danger} />
              </Pressable>
            </View>
          ),
        }}
      />

      {/* 헤더 블록 — 이름·상태·우선순위·진행률 */}
      <Text style={[styles.name, { color: theme.text }]}>{project.name}</Text>
      {meta ? <Text style={[styles.meta, { color: theme.textMuted }]}>{meta}</Text> : null}
      <View style={styles.badges}>
        <Badge label={t(`status.${project.status}`)} />
        {project.priority !== 'none' ? <Badge label={t(`priority.${project.priority}`)} accent /> : null}
        <Text style={[styles.progressText, { color: theme.text }]}>{project.progress}%</Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.progressTrack }]}>
        <View style={[styles.fill, { backgroundColor: theme.progressFill, width: `${project.progress}%` }]} />
      </View>

      <Field label={t('project.summary')} value={project.summary} onAdd={goEdit} />
      <Field label={t('project.description')} value={project.description} onAdd={goEdit} />

      <Divider />
      <Field label={t('project.problem')} value={project.problem} onAdd={goEdit} />
      <Field label={t('project.goal')} value={project.goal} onAdd={goEdit} />
      <Field label={t('project.coreIdea')} value={project.coreIdea} onAdd={goEdit} />
      <Field label={t('project.targetUser')} value={project.targetUser} onAdd={goEdit} />
      {project.approach !== 'none' ? (
        <Field label={t('project.approach')} value={t(`approach.${project.approach}`)} onAdd={goEdit} />
      ) : null}

      <Divider />
      <View style={styles.dates}>
        <Field
          label={t('project.startDate')}
          value={project.startDate ? formatDay(project.startDate) : null}
          onAdd={goEdit}
          compact
        />
        <Field
          label={t('project.targetEndDate')}
          value={project.targetEndDate ? formatDay(project.targetEndDate) : null}
          onAdd={goEdit}
          compact
        />
      </View>

      {/* 아이디어 노트 — 작성 순, 인라인 추가/수정/삭제 (PROJECT_SYSTEM §6) */}
      <Divider />
      <SectionTitle label={t('project.notes')} count={notes.length} />
      {notes.map((note) => (
        <Card key={note.id} onPress={() => noteActions(note)}>
          <Text style={[styles.noteDate, { color: theme.textMuted }]}>
            {formatDate(note.createdAt)}
            {note.updatedAt !== note.createdAt ? ` · ${t('note.edited')}` : ''}
          </Text>
          <Text style={[styles.noteBody, { color: theme.text }]}>{note.content}</Text>
        </Card>
      ))}
      <TextField
        label={editingNote ? t('note.edit') : t('note.add')}
        value={noteDraft}
        onChangeText={setNoteDraft}
        placeholder={t('note.placeholder')}
        multiline
      />
      <View style={styles.noteActions}>
        {editingNote ? (
          <View style={styles.flex}>
            <Button
              label={t('common.cancel')}
              variant="ghost"
              onPress={() => {
                setEditingNote(null);
                setNoteDraft('');
              }}
            />
          </View>
        ) : null}
        <View style={styles.flex}>
          <Button
            label={editingNote ? t('common.save') : t('note.addButton')}
            onPress={submitNote}
            disabled={noteDraft.trim().length === 0}
          />
        </View>
      </View>

      {/* 관련 자료 — 탭 = 외부 브라우저, 길게 = 수정/삭제 (PROJECT_SYSTEM §7) */}
      <Divider />
      <SectionTitle label={t('project.resources')} count={resources.length} />
      {resources.map((r) => (
        <Card key={r.id} onPress={() => openResource(r)} onLongPress={() => resourceActions(r)}>
          <View style={styles.resourceRow}>
            <Ionicons name="link-outline" size={18} color={theme.primary} />
            <View style={styles.flex}>
              <Text style={[styles.resourceTitle, { color: theme.text }]} numberOfLines={1}>
                {r.title ?? displayDomain(r.url)}
              </Text>
              <Text style={[styles.resourceUrl, { color: theme.textMuted }]} numberOfLines={1}>
                {r.url}
              </Text>
              {r.description ? (
                <Text style={[styles.resourceDesc, { color: theme.textMuted }]} numberOfLines={2}>
                  {r.description}
                </Text>
              ) : null}
            </View>
            <Ionicons name="open-outline" size={16} color={theme.textMuted} />
          </View>
        </Card>
      ))}
      <Button
        label={t('resource.add')}
        variant="ghost"
        onPress={() => setResourceDialog({ open: true, editing: null })}
        icon={<Ionicons name="add" size={18} color={theme.text} />}
      />

      {resourceDialog.open ? (
        <ResourceDialog
          initial={resourceDialog.editing}
          onCancel={() => setResourceDialog({ open: false, editing: null })}
          onSubmit={(input) => {
            try {
              if (resourceDialog.editing) updateResource(resourceDialog.editing.id, input);
              else createResource(id, input);
            } catch (e) {
              return e instanceof Error ? t(e.message) : t('resource.invalidUrl');
            }
            setResourceDialog({ open: false, editing: null });
            reload();
            return null;
          }}
        />
      ) : null}
    </Screen>
  );
}

/** 항목 — 값이 없으면 "Add …" 플레이스홀더(숨기지 않는다 — 채울 수 있음을 보여 발전을 유도) */
function Field({
  label,
  value,
  onAdd,
  compact,
}: {
  label: string;
  value: string | null;
  onAdd: () => void;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <View style={[styles.field, compact && styles.flex]}>
      <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>{label}</Text>
      {value ? (
        <Text style={[styles.fieldValue, { color: theme.text }]}>{value}</Text>
      ) : (
        <Pressable onPress={onAdd} accessibilityRole="button" style={styles.addRow}>
          <Ionicons name="add-circle-outline" size={16} color={theme.primary} />
          <Text style={[styles.addText, { color: theme.primary }]}>
            {t('project.addField', { field: label })}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function SectionTitle({ label, count }: { label: string; count: number }) {
  const theme = useTheme();
  return (
    <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
      {label} · {count}
    </Text>
  );
}

function Divider() {
  const theme = useTheme();
  return <View style={[styles.divider, { backgroundColor: theme.border }]} />;
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
  flex: { flex: 1 },
  body: { padding: 16, gap: 12, paddingBottom: 32 },
  notFound: { padding: 24, textAlign: 'center' },
  headerActions: { flexDirection: 'row', gap: 4 },
  headerBtn: { padding: 6 },
  name: { fontSize: 24, fontWeight: '700' },
  meta: { fontSize: 13 },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '500' },
  progressText: { marginLeft: 'auto', fontSize: 14, fontWeight: '600' },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 8 },
  field: { gap: 4 },
  fieldLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  fieldValue: { fontSize: 15, lineHeight: 22 },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 2 },
  addText: { fontSize: 14 },
  dates: { flexDirection: 'row', gap: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  noteDate: { fontSize: 12 },
  noteBody: { fontSize: 15, lineHeight: 22 },
  noteActions: { flexDirection: 'row', gap: 10 },
  resourceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  resourceTitle: { fontSize: 15, fontWeight: '600' },
  resourceUrl: { fontSize: 12 },
  resourceDesc: { fontSize: 13, marginTop: 2 },
});
