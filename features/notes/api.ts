import { randomUUID } from 'expo-crypto';

import { getDb } from '@/db';
import { touchProject } from '@/features/projects/api';

export interface Note {
  id: string;
  projectId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface NoteRow {
  id: string;
  project_id: string;
  content: string;
  created_at: number;
  updated_at: number;
}

function toNote(r: NoteRow): Note {
  return {
    id: r.id,
    projectId: r.project_id,
    content: r.content,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// 작성 순(오래된 것이 위) — 발전 과정을 위에서 아래로 읽는다 (PROJECT_SYSTEM §6)
export function listNotes(projectId: string): Note[] {
  return getDb()
    .getAllSync<NoteRow>('SELECT * FROM notes WHERE project_id = ? ORDER BY created_at ASC', [projectId])
    .map(toNote);
}

/** 빈 노트는 저장하지 않는다. 노트 변경은 프로젝트 updated_at을 갱신한다(CLAUDE.md §14 E) */
export function createNote(projectId: string, content: string): Note {
  const c = content.trim();
  if (c.length === 0) throw new Error('note.contentRequired');
  const now = Date.now();
  const id = randomUUID();
  const db = getDb();
  db.withTransactionSync(() => {
    db.runSync('INSERT INTO notes (id, project_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', [
      id,
      projectId,
      c,
      now,
      now,
    ]);
    touchProject(db, projectId, now);
  });
  return { id, projectId, content: c, createdAt: now, updatedAt: now };
}

export function updateNote(id: string, content: string): void {
  const c = content.trim();
  if (c.length === 0) throw new Error('note.contentRequired');
  const now = Date.now();
  const db = getDb();
  db.withTransactionSync(() => {
    db.runSync('UPDATE notes SET content = ?, updated_at = ? WHERE id = ?', [c, now, id]);
    const row = db.getFirstSync<{ project_id: string }>('SELECT project_id FROM notes WHERE id = ?', [id]);
    if (row) touchProject(db, row.project_id, now);
  });
}

export function deleteNote(id: string): void {
  const db = getDb();
  db.withTransactionSync(() => {
    const row = db.getFirstSync<{ project_id: string }>('SELECT project_id FROM notes WHERE id = ?', [id]);
    db.runSync('DELETE FROM notes WHERE id = ?', [id]);
    if (row) touchProject(db, row.project_id, Date.now());
  });
}
