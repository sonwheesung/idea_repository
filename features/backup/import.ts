// 가져오기 — 파일 선택 → 검증 → (화면이 방식을 고른 뒤) 병합/교체를 한 트랜잭션으로 (docs/BACKUP_SYSTEM.md §4).
// 행의 "아는 컬럼만" 골라 넣는다 — 모르는 컬럼은 무시, 빠진 컬럼은 DB DEFAULT. enum·FK 위반은 DB가 거부 → 통째로 롤백.

import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import type { SQLiteDatabase } from 'expo-sqlite';

import { getDb } from '@/db';
import { readUserVersion } from '@/features/backup/export';
import {
  BACKUP_MAX_BYTES,
  parseBackup,
  type BackupFile,
  type BackupValidationError,
  type Row,
} from '@/features/backup/format';
import { cleanupOrphanTags } from '@/features/tags/api';

export type PickResult =
  { ok: true; file: BackupFile } | { ok: false; error: BackupValidationError | 'canceled' | 'readFailed' };

export type ImportMode = 'merge' | 'replace';

export interface ImportSummary {
  inserted: number;
  updated: number;
  skipped: number;
}

export type ImportResult = { ok: true; summary: ImportSummary } | { ok: false; error: 'failed' };

/** 파일 선택 + 읽기 + 검증. 적용은 하지 않는다(화면이 미리보기·방식 선택 후 `applyBackup`). */
export async function pickBackupFile(): Promise<PickResult> {
  const picked = await DocumentPicker.getDocumentAsync({
    // 일부 파일 앱이 .json을 text/plain·octet-stream으로 보고하므로 타입은 넓게 받고 내용으로 거른다
    type: ['application/json', 'text/plain', 'application/octet-stream', '*/*'],
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (picked.canceled) return { ok: false, error: 'canceled' };
  const asset = picked.assets[0];
  if (!asset) return { ok: false, error: 'canceled' };
  if (typeof asset.size === 'number' && asset.size > BACKUP_MAX_BYTES)
    return { ok: false, error: 'invalidFile' };

  let text: string;
  const file = new File(asset.uri);
  try {
    text = await file.text();
  } catch {
    return { ok: false, error: 'readFailed' };
  } finally {
    try {
      if (file.exists) file.delete(); // copyToCacheDirectory 사본 — 평문을 캐시에 남기지 않는다
    } catch {
      // 무시
    }
  }
  const parsed = parseBackup(text, readUserVersion());
  return parsed.ok ? { ok: true, file: parsed.file } : { ok: false, error: parsed.error };
}

// ---- 컬럼 명세(아는 컬럼만) — DATABASE.md 스키마와 1:1. 컬럼을 추가하면 여기에도 적는다.
const COLS = {
  categories: ['id', 'name', 'sort_order', 'created_at'],
  projects: [
    'id',
    'name',
    'summary',
    'description',
    'category_id',
    'problem',
    'goal',
    'core_idea',
    'target_user',
    'progress',
    'status',
    'priority',
    'approach',
    'start_date',
    'target_end_date',
    'created_at',
    'updated_at',
  ],
  tags: ['id', 'name', 'created_at'],
  notes: ['id', 'project_id', 'content', 'created_at', 'updated_at'],
  resources: ['id', 'project_id', 'title', 'url', 'description', 'created_at', 'updated_at'],
  ideation_words: ['id', 'lang', 'group_key', 'word', 'created_at', 'updated_at'],
} as const;

type Table = keyof typeof COLS;
type Param = string | number | null;

function toParam(v: unknown): Param {
  if (typeof v === 'string' || typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  return null;
}

/** 행에서 아는 컬럼 중 파일에 있는 것만 — 빠진 컬럼은 DB DEFAULT에 맡긴다 */
function present(table: Table, row: Row): { cols: string[]; values: Param[] } {
  const cols: string[] = [];
  const values: Param[] = [];
  for (const c of COLS[table]) {
    if (c in row) {
      cols.push(c);
      values.push(toParam(row[c]));
    }
  }
  return { cols, values };
}

function insertRow(db: SQLiteDatabase, table: Table, row: Row): void {
  const { cols, values } = present(table, row);
  db.runSync(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`, values);
}

function updateRow(db: SQLiteDatabase, table: Table, row: Row, id: string): void {
  const { cols, values } = present(table, row);
  const sets = cols.filter((c) => c !== 'id');
  if (sets.length === 0) return;
  db.runSync(`UPDATE ${table} SET ${sets.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`, [
    ...sets.map((c) => values[cols.indexOf(c)] as Param),
    id,
  ]);
}

const str = (v: unknown): string => (typeof v === 'string' ? v : String(v ?? ''));
const num = (v: unknown): number => (typeof v === 'number' ? v : Number(v ?? 0));

/** 병합/교체 적용 — 한 트랜잭션. 실패하면 아무것도 바뀌지 않는다. */
export function applyBackup(file: BackupFile, mode: ImportMode): ImportResult {
  const db = getDb();
  const summary: ImportSummary = { inserted: 0, updated: 0, skipped: 0 };
  try {
    db.withTransactionSync(() => {
      if (mode === 'replace') replaceAll(db, file, summary);
      else mergeAll(db, file, summary);
      cleanupOrphanTags(db);
    });
    return { ok: true, summary };
  } catch {
    return { ok: false, error: 'failed' };
  }
}

/** §4.4 교체 — FK 역순 DELETE 후 FK 순서 INSERT */
function replaceAll(db: SQLiteDatabase, file: BackupFile, s: ImportSummary): void {
  for (const t of [
    'project_tags',
    'notes',
    'resources',
    'projects',
    'tags',
    'categories',
    'ideation_words',
  ]) {
    db.runSync(`DELETE FROM ${t}`);
  }
  const d = file.data;
  for (const r of d.categories) insertRow(db, 'categories', r);
  for (const r of d.projects) insertRow(db, 'projects', r);
  for (const r of d.tags) insertRow(db, 'tags', r);
  for (const r of d.projectTags) {
    db.runSync('INSERT OR IGNORE INTO project_tags (project_id, tag_id) VALUES (?, ?)', [
      str(r.project_id),
      str(r.tag_id),
    ]);
  }
  for (const r of d.notes) insertRow(db, 'notes', r);
  for (const r of d.resources) insertRow(db, 'resources', r);
  for (const r of d.ideationWords) insertRow(db, 'ideation_words', r);
  s.inserted = d.projects.length + d.notes.length + d.resources.length;
}

/** §4.3 병합 — id 일치는 updated_at 승자, 이름형 테이블은 NOCASE 재매핑 */
function mergeAll(db: SQLiteDatabase, file: BackupFile, s: ImportSummary): void {
  const d = file.data;

  // 카테고리: id 있으면 유지, 없으면 이름(NOCASE) 재매핑 또는 삽입
  const categoryMap = new Map<string, string>();
  let nextSort =
    num(db.getFirstSync<{ m: number | null }>('SELECT MAX(sort_order) AS m FROM categories')?.m ?? -1) + 1;
  for (const r of d.categories) {
    const id = str(r.id);
    if (db.getFirstSync('SELECT 1 FROM categories WHERE id = ?', [id])) {
      categoryMap.set(id, id);
      continue;
    }
    const byName = db.getFirstSync<{ id: string }>(
      'SELECT id FROM categories WHERE name = ? COLLATE NOCASE',
      [str(r.name)],
    );
    if (byName) {
      categoryMap.set(id, byName.id);
      continue;
    }
    insertRow(db, 'categories', { ...r, sort_order: nextSort++ });
    categoryMap.set(id, id);
  }

  // 태그: 같은 규칙
  const tagMap = new Map<string, string>();
  for (const r of d.tags) {
    const id = str(r.id);
    if (db.getFirstSync('SELECT 1 FROM tags WHERE id = ?', [id])) {
      tagMap.set(id, id);
      continue;
    }
    const byName = db.getFirstSync<{ id: string }>('SELECT id FROM tags WHERE name = ? COLLATE NOCASE', [
      str(r.name),
    ]);
    if (byName) {
      tagMap.set(id, byName.id);
      continue;
    }
    insertRow(db, 'tags', r);
    tagMap.set(id, id);
  }

  // 프로젝트: 파일 updated_at이 더 크면 덮어쓰기, 없으면 삽입. 태그 집합은 삽입·덮어쓴 프로젝트만 교체
  const touched = new Set<string>();
  for (const r of d.projects) {
    const id = str(r.id);
    const remapped: Row = {
      ...r,
      category_id: r.category_id == null ? null : (categoryMap.get(str(r.category_id)) ?? null),
    };
    const local = db.getFirstSync<{ updated_at: number }>('SELECT updated_at FROM projects WHERE id = ?', [
      id,
    ]);
    if (!local) {
      insertRow(db, 'projects', remapped);
      touched.add(id);
      s.inserted++;
    } else if (num(r.updated_at) > local.updated_at) {
      updateRow(db, 'projects', remapped, id);
      touched.add(id);
      s.updated++;
    } else {
      s.skipped++;
    }
  }
  for (const id of touched) db.runSync('DELETE FROM project_tags WHERE project_id = ?', [id]);
  for (const r of d.projectTags) {
    const pid = str(r.project_id);
    if (!touched.has(pid)) continue;
    const tid = tagMap.get(str(r.tag_id));
    if (!tid) continue;
    db.runSync('INSERT OR IGNORE INTO project_tags (project_id, tag_id) VALUES (?, ?)', [pid, tid]);
  }

  // 노트·자료: 부모가 있을 때만. 파일 updated_at이 더 크면 덮어쓰기
  const mergeChild = (table: 'notes' | 'resources', rows: Row[]) => {
    for (const r of rows) {
      const id = str(r.id);
      const parent = db.getFirstSync('SELECT 1 FROM projects WHERE id = ?', [str(r.project_id)]);
      if (!parent) {
        s.skipped++;
        continue;
      }
      const local = db.getFirstSync<{ updated_at: number }>(`SELECT updated_at FROM ${table} WHERE id = ?`, [
        id,
      ]);
      if (!local) {
        insertRow(db, table, r);
        s.inserted++;
      } else if (num(r.updated_at) > local.updated_at) {
        updateRow(db, table, r, id);
        s.updated++;
      } else {
        s.skipped++;
      }
    }
  };
  mergeChild('notes', d.notes);
  mergeChild('resources', d.resources);

  // 발상 단어: (lang, word NOCASE) 없을 때만 삽입
  for (const r of d.ideationWords) {
    const exists = db.getFirstSync(
      'SELECT 1 FROM ideation_words WHERE lang = ? AND word = ? COLLATE NOCASE',
      [str(r.lang), str(r.word)],
    );
    if (exists || db.getFirstSync('SELECT 1 FROM ideation_words WHERE id = ?', [str(r.id)])) continue;
    insertRow(db, 'ideation_words', r);
  }
}
