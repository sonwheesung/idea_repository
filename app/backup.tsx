import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { exportBackup } from '@/features/backup/export';
import type { BackupFile } from '@/features/backup/format';
import { applyBackup, pickBackupFile, type ImportMode } from '@/features/backup/import';
import { useBackupStore } from '@/features/backup/store';
import { formatDate } from '@/lib/date';
import { useTheme } from '@/theme/use-theme';

type Busy = 'export' | 'import' | null;

// 백업 — 내보내기(공유 시트) · 가져오기(파일 선택 → 미리보기 → 병합/교체) · 마지막 내보내기 (docs/BACKUP_SYSTEM.md §5).
// 서버 없음. 광고 없음(설정 하위). 파일은 평문 JSON — 화면에서 고지한다.
export default function BackupScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const lastExportedAt = useBackupStore((s) => s.lastExportedAt);
  const markExported = useBackupStore((s) => s.markExported);
  const [busy, setBusy] = useState<Busy>(null);

  const onExport = async () => {
    setBusy('export');
    try {
      const result = await exportBackup(t('backup.export'));
      if (result.ok) markExported(result.at);
      else
        Alert.alert(
          t('backup.title'),
          t(result.error === 'unavailable' ? 'backup.shareUnavailable' : 'backup.exportFailed'),
        );
    } finally {
      setBusy(null);
    }
  };

  const onImport = async () => {
    setBusy('import');
    try {
      const picked = await pickBackupFile();
      if (!picked.ok) {
        if (picked.error !== 'canceled') {
          const key = picked.error === 'newerApp' ? 'backup.import.newerApp' : 'backup.import.invalidFile';
          Alert.alert(t('backup.import.title'), t(key));
        }
        return;
      }
      askMode(picked.file);
    } finally {
      setBusy(null);
    }
  };

  const askMode = (file: BackupFile) => {
    const c = file.counts;
    const exported = file.exportedAt ? formatDate(Date.parse(file.exportedAt)) : '?';
    Alert.alert(
      t('backup.import.title'),
      t('backup.import.preview', {
        projects: c.projects,
        notes: c.notes,
        resources: c.resources,
        categories: c.categories,
        tags: c.tags,
        words: c.ideationWords,
        exported,
        version: file.app.version,
      }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('backup.import.replace'), style: 'destructive', onPress: () => confirmReplace(file) },
        { text: t('backup.import.merge'), onPress: () => run(file, 'merge') },
      ],
    );
  };

  const confirmReplace = (file: BackupFile) => {
    Alert.alert(t('backup.import.replaceConfirmTitle'), t('backup.import.replaceConfirmBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('backup.import.replace'), style: 'destructive', onPress: () => run(file, 'replace') },
    ]);
  };

  const run = (file: BackupFile, mode: ImportMode) => {
    const result = applyBackup(file, mode);
    if (!result.ok) {
      Alert.alert(t('backup.import.title'), t('backup.import.failed'));
      return;
    }
    const { inserted, updated, skipped } = result.summary;
    Alert.alert(t('backup.import.title'), t('backup.import.done', { inserted, updated, skipped }), [
      { text: t('common.done'), onPress: () => router.back() },
    ]);
  };

  return (
    <Screen hasHeader scroll contentStyle={styles.body}>
      <View style={[styles.card, { backgroundColor: theme.searchBar, borderColor: theme.border }]}>
        <Text style={[styles.intro, { color: theme.text }]}>{t('backup.intro')}</Text>
      </View>

      <Button
        label={t('backup.export')}
        onPress={() => void onExport()}
        disabled={busy !== null}
        icon={busy === 'export' ? <ActivityIndicator size="small" color={theme.buttonText} /> : undefined}
      />
      <Text style={[styles.meta, { color: theme.textMuted }]}>
        {t('backup.lastExport')}: {lastExportedAt ? formatDate(lastExportedAt) : t('backup.never')}
      </Text>

      <Button
        label={t('backup.import.button')}
        variant="ghost"
        onPress={() => void onImport()}
        disabled={busy !== null}
        icon={busy === 'import' ? <ActivityIndicator size="small" color={theme.text} /> : undefined}
      />

      <Text style={[styles.caution, { color: theme.textMuted }]}>{t('backup.caution')}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, gap: 14, paddingBottom: 24 },
  card: { borderWidth: 1, borderRadius: 10, padding: 14 },
  intro: { fontSize: 15, lineHeight: 22 },
  meta: { fontSize: 13, marginTop: -4, marginLeft: 4 },
  caution: { fontSize: 13, lineHeight: 19, marginTop: 8 },
});
