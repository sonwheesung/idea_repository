import { randomUUID } from 'expo-crypto';
import type { SQLiteDatabase } from 'expo-sqlite';

import { getDb } from '@/db';

/**
 * 태그 정규화 — '#' 제거, 앞뒤 공백 제거. 공백은 구분자라 태그 안에 들어오지 않는다(PROJECT_SYSTEM §5).
 * 빈 문자열이면 null.
 */
export function normalizeTag(raw: string): string | null {
  const t = raw.replace(/^#+/, '').trim();
  return t.length === 0 ? null : t;
}

/** 입력 문자열을 구분자(공백·쉼표·#)로 쪼개 태그 배열로 — 대소문자 무시 중복 제거(첫 표기 유지) */
export function splitTags(raw: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const part of raw.split(/[\s,#]+/)) {
    const n = normalizeTag(part);
    if (!n) continue;
    const key = n.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(n);
  }
  return out;
}

/** 자동완성 — prefix 일치, 이미 고른 것 제외 */
export function suggestTags(prefix: string, exclude: string[] = [], limit = 8): string[] {
  const p = normalizeTag(prefix);
  if (!p) return [];
  const rows = getDb().getAllSync<{ name: string }>(
    "SELECT name FROM tags WHERE name LIKE ? ESCAPE '\\' COLLATE NOCASE ORDER BY name COLLATE NOCASE LIMIT ?",
    [`${p.replace(/[%_\\]/g, (m) => `\\${m}`)}%`, limit + exclude.length],
  );
  const ex = new Set(exclude.map((e) => e.toLowerCase()));
  return rows
    .map((r) => r.name)
    .filter((n) => !ex.has(n.toLowerCase()))
    .slice(0, limit);
}

/** 전체 태그 이름(발상 도구 "내 태그" 출처) */
export function listAllTags(): string[] {
  return getDb()
    .getAllSync<{ name: string }>('SELECT name FROM tags ORDER BY name COLLATE NOCASE')
    .map((r) => r.name);
}

export function listProjectTags(projectId: string): string[] {
  return getDb()
    .getAllSync<{ name: string }>(
      'SELECT t.name FROM project_tags pt JOIN tags t ON t.id = pt.tag_id WHERE pt.project_id = ? ORDER BY t.name COLLATE NOCASE',
      [projectId],
    )
    .map((r) => r.name);
}

/**
 * 프로젝트의 태그 집합을 통째로 교체 — 없는 태그는 만들고, 연결을 갈아끼우고, 고아 태그를 정리한다.
 * 트랜잭션은 호출부(프로젝트 저장)와 합칠 수 있도록 db를 받는다.
 */
export function replaceProjectTags(db: SQLiteDatabase, projectId: string, names: string[]): void {
  const now = Date.now();
  const ids: string[] = [];
  for (const raw of names) {
    const n = normalizeTag(raw);
    if (!n) continue;
    const existing = db.getFirstSync<{ id: string }>('SELECT id FROM tags WHERE name = ? COLLATE NOCASE', [
      n,
    ]);
    if (existing) {
      ids.push(existing.id);
    } else {
      const id = randomUUID();
      db.runSync('INSERT INTO tags (id, name, created_at) VALUES (?, ?, ?)', [id, n, now]);
      ids.push(id);
    }
  }
  db.runSync('DELETE FROM project_tags WHERE project_id = ?', [projectId]);
  for (const tagId of new Set(ids)) {
    db.runSync('INSERT OR IGNORE INTO project_tags (project_id, tag_id) VALUES (?, ?)', [projectId, tagId]);
  }
  cleanupOrphanTags(db);
}

/** 사용처 0인 태그 삭제 — 자동완성에 유령 태그가 남지 않게(CLAUDE.md §14 G) */
export function cleanupOrphanTags(db: SQLiteDatabase = getDb()): void {
  db.runSync('DELETE FROM tags WHERE id NOT IN (SELECT DISTINCT tag_id FROM project_tags)');
}
