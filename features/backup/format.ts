// 백업 파일 형식 v1 — docs/BACKUP_SYSTEM.md §2. 7테이블의 DB 행(snake_case)을 그대로 담는다.
// 읽기 쪽은 "아는 컬럼만 골라 넣고, 모르는 컬럼은 무시" — 컬럼 추가 마이그레이션만으로는 formatVersion을 올리지 않는다.

export const BACKUP_FORMAT = 'idearepository-backup';
export const BACKUP_FORMAT_VERSION = 1;
/** JSON 문자열 기준 상한(메모리 보호) — 텍스트 앱이라 실사용은 수 MB 이내 */
export const BACKUP_MAX_BYTES = 20 * 1024 * 1024;

export type Row = Record<string, unknown>;

export interface BackupData {
  categories: Row[];
  projects: Row[];
  tags: Row[];
  projectTags: Row[];
  notes: Row[];
  resources: Row[];
  ideationWords: Row[];
}

export const DATA_KEYS = [
  'categories',
  'projects',
  'tags',
  'projectTags',
  'notes',
  'resources',
  'ideationWords',
] as const satisfies readonly (keyof BackupData)[];

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  formatVersion: number;
  dbVersion: number;
  app: { version: string; platform: string };
  exportedAt: string;
  counts: Record<keyof BackupData, number>;
  data: BackupData;
}

/** 검증 실패 사유 — i18n 키 `backup.import.*`와 1:1 (BACKUP_SYSTEM §4.2) */
export type BackupValidationError = 'invalidFile' | 'newerApp';

export type ParseResult = { ok: true; file: BackupFile } | { ok: false; error: BackupValidationError };

function isRow(v: unknown): v is Row {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isRowArray(v: unknown, idKeys: readonly string[]): v is Row[] {
  return Array.isArray(v) && v.every((r) => isRow(r) && idKeys.every((k) => typeof r[k] === 'string'));
}

/**
 * 문자열 → 검증된 BackupFile. enum·범위·FK는 보지 않는다(DB CHECK/FK가 트랜잭션째 거부한다 — §4.2).
 * @param currentDbVersion 앱의 PRAGMA user_version — 파일이 더 새 앱에서 나왔으면 newerApp
 */
export function parseBackup(text: string, currentDbVersion: number): ParseResult {
  if (text.length > BACKUP_MAX_BYTES) return { ok: false, error: 'invalidFile' };
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'invalidFile' };
  }
  if (!isRow(raw) || raw.format !== BACKUP_FORMAT) return { ok: false, error: 'invalidFile' };

  const formatVersion = raw.formatVersion;
  const dbVersion = raw.dbVersion;
  if (typeof formatVersion !== 'number' || typeof dbVersion !== 'number')
    return { ok: false, error: 'invalidFile' };
  if (formatVersion > BACKUP_FORMAT_VERSION || dbVersion > currentDbVersion)
    return { ok: false, error: 'newerApp' };

  const data = raw.data;
  if (!isRow(data)) return { ok: false, error: 'invalidFile' };
  const idKeysOf = (key: keyof BackupData): readonly string[] =>
    key === 'projectTags' ? ['project_id', 'tag_id'] : ['id'];
  for (const key of DATA_KEYS) {
    if (!isRowArray(data[key], idKeysOf(key))) return { ok: false, error: 'invalidFile' };
  }
  const typed = data as unknown as BackupData;

  const app = isRow(raw.app) ? raw.app : {};
  return {
    ok: true,
    file: {
      format: BACKUP_FORMAT,
      formatVersion,
      dbVersion,
      app: {
        version: typeof app.version === 'string' ? app.version : '?',
        platform: typeof app.platform === 'string' ? app.platform : '?',
      },
      exportedAt: typeof raw.exportedAt === 'string' ? raw.exportedAt : '',
      counts: countsOf(typed),
      data: typed,
    },
  };
}

export function countsOf(data: BackupData): Record<keyof BackupData, number> {
  return {
    categories: data.categories.length,
    projects: data.projects.length,
    tags: data.tags.length,
    projectTags: data.projectTags.length,
    notes: data.notes.length,
    resources: data.resources.length,
    ideationWords: data.ideationWords.length,
  };
}
