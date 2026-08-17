import { randomUUID } from 'expo-crypto';

import { getDb } from '@/db';
import { touchProject } from '@/features/projects/api';
import { nullIfBlank } from '@/features/projects/types';
import { normalizeUrl } from '@/features/resources/url';

export interface Resource {
  id: string;
  projectId: string;
  title: string | null; // NULL이면 UI가 도메인으로 대체 표시
  url: string;
  description: string | null;
  createdAt: number;
  updatedAt: number;
}

interface ResourceRow {
  id: string;
  project_id: string;
  title: string | null;
  url: string;
  description: string | null;
  created_at: number;
  updated_at: number;
}

function toResource(r: ResourceRow): Resource {
  return {
    id: r.id,
    projectId: r.project_id,
    title: r.title,
    url: r.url,
    description: r.description,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export interface ResourceInput {
  title?: string | null;
  url: string;
  description?: string | null;
}

// 추가 순 (PROJECT_SYSTEM §7)
export function listResources(projectId: string): Resource[] {
  return getDb()
    .getAllSync<ResourceRow>('SELECT * FROM resources WHERE project_id = ? ORDER BY created_at ASC', [
      projectId,
    ])
    .map(toResource);
}

/** URL만 필수 — 형태 검증만(오프라인). 실패 시 'resource.invalidUrl' */
function normalizeInput(input: ResourceInput): {
  url: string;
  title: string | null;
  description: string | null;
} {
  const url = normalizeUrl(input.url);
  if (!url) throw new Error('resource.invalidUrl');
  return { url, title: nullIfBlank(input.title), description: nullIfBlank(input.description) };
}

/** 자료 추가/수정/삭제는 프로젝트 updated_at을 갱신한다 (CLAUDE.md §14 E) */
export function createResource(projectId: string, input: ResourceInput): Resource {
  const { url, title, description } = normalizeInput(input);
  const now = Date.now();
  const id = randomUUID();
  const db = getDb();
  db.withTransactionSync(() => {
    db.runSync(
      'INSERT INTO resources (id, project_id, title, url, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, projectId, title, url, description, now, now],
    );
    touchProject(db, projectId, now);
  });
  return { id, projectId, title, url, description, createdAt: now, updatedAt: now };
}

export function updateResource(id: string, input: ResourceInput): void {
  const { url, title, description } = normalizeInput(input);
  const now = Date.now();
  const db = getDb();
  db.withTransactionSync(() => {
    db.runSync('UPDATE resources SET title = ?, url = ?, description = ?, updated_at = ? WHERE id = ?', [
      title,
      url,
      description,
      now,
      id,
    ]);
    const row = db.getFirstSync<{ project_id: string }>('SELECT project_id FROM resources WHERE id = ?', [
      id,
    ]);
    if (row) touchProject(db, row.project_id, now);
  });
}

export function deleteResource(id: string): void {
  const db = getDb();
  db.withTransactionSync(() => {
    const row = db.getFirstSync<{ project_id: string }>('SELECT project_id FROM resources WHERE id = ?', [
      id,
    ]);
    db.runSync('DELETE FROM resources WHERE id = ?', [id]);
    if (row) touchProject(db, row.project_id, Date.now());
  });
}
