// 내보내기 — 7테이블 SELECT * → JSON → 캐시 파일 → OS 공유 시트 → 임시 파일 삭제 (docs/BACKUP_SYSTEM.md §3).
// 서버로 가는 것은 없다. 파일이 어디에 저장되는지는 공유 시트(사용자 선택)가 정하고 앱은 모른다.

import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { getDb } from '@/db';
import { APP_VERSION } from '@/lib/app-version';
import {
  BACKUP_FORMAT,
  BACKUP_FORMAT_VERSION,
  countsOf,
  type BackupData,
  type BackupFile,
  type Row,
} from '@/features/backup/format';

export type ExportResult = { ok: true; at: number } | { ok: false; error: 'unavailable' | 'failed' };

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** `IdeaRepository-backup-YYYYMMDD-HHmm.json` — 기기 로컬 시각 */
export function backupFileName(at: Date): string {
  const stamp = `${at.getFullYear()}${pad2(at.getMonth() + 1)}${pad2(at.getDate())}-${pad2(at.getHours())}${pad2(at.getMinutes())}`;
  return `IdeaRepository-backup-${stamp}.json`;
}

export function readUserVersion(): number {
  const row = getDb().getFirstSync<{ user_version: number }>('PRAGMA user_version');
  return row?.user_version ?? 0;
}

/** 현재 DB 전체를 백업 객체로 — 행은 snake_case 그대로(형식 §2) */
export function buildBackup(now: Date = new Date()): BackupFile {
  const db = getDb();
  const all = (table: string, order: string): Row[] =>
    db.getAllSync<Row>(`SELECT * FROM ${table} ORDER BY ${order}`);
  const data: BackupData = {
    categories: all('categories', 'sort_order, created_at'),
    projects: all('projects', 'created_at'),
    tags: all('tags', 'name'),
    projectTags: all('project_tags', 'project_id, tag_id'),
    notes: all('notes', 'project_id, created_at'),
    resources: all('resources', 'project_id, created_at'),
    ideationWords: all('ideation_words', 'lang, created_at, rowid'),
  };
  return {
    format: BACKUP_FORMAT,
    formatVersion: BACKUP_FORMAT_VERSION,
    dbVersion: readUserVersion(),
    app: { version: APP_VERSION, platform: Platform.OS },
    exportedAt: now.toISOString(),
    counts: countsOf(data),
    data,
  };
}

/**
 * 파일로 내보내기 — 공유 시트가 닫히면 임시 파일을 지운다(캐시에 평문 사본을 남기지 않는다).
 * 취소와 성공은 OS가 구분해 주지 않으므로 shareAsync 정상 반환 = "내보냈다"로 기록한다(§3).
 */
export async function exportBackup(dialogTitle: string): Promise<ExportResult> {
  if (!(await Sharing.isAvailableAsync())) return { ok: false, error: 'unavailable' };
  const now = new Date();
  const file = new File(Paths.cache, backupFileName(now));
  try {
    const json = JSON.stringify(buildBackup(now));
    if (file.exists) file.delete();
    file.create();
    file.write(json);
    await Sharing.shareAsync(file.uri, { mimeType: 'application/json', UTI: 'public.json', dialogTitle });
    return { ok: true, at: now.getTime() };
  } catch {
    return { ok: false, error: 'failed' };
  } finally {
    try {
      if (file.exists) file.delete();
    } catch {
      // 캐시 파일 — OS가 정리한다
    }
  }
}
