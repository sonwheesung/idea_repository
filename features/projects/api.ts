import { randomUUID } from 'expo-crypto';

import type { SQLiteDatabase } from 'expo-sqlite';

import { getDb } from '@/db';
import { cleanupOrphanTags, listProjectTags, replaceProjectTags } from '@/features/tags/api';
import {
  nullIfBlank,
  type Priority,
  type Project,
  type ProjectCard,
  type ProjectInput,
  type Status,
} from '@/features/projects/types';

interface ProjectRow {
  id: string;
  name: string;
  summary: string | null;
  description: string | null;
  category_id: string | null;
  problem: string | null;
  goal: string | null;
  core_idea: string | null;
  target_user: string | null;
  progress: number;
  status: Status;
  priority: Priority;
  start_date: string | null;
  target_end_date: string | null;
  created_at: number;
  updated_at: number;
  category_name?: string | null;
}

function toProject(r: ProjectRow): Project {
  return {
    id: r.id,
    name: r.name,
    summary: r.summary,
    description: r.description,
    categoryId: r.category_id,
    problem: r.problem,
    goal: r.goal,
    coreIdea: r.core_idea,
    targetUser: r.target_user,
    progress: r.progress,
    status: r.status,
    priority: r.priority,
    startDate: r.start_date,
    targetEndDate: r.target_end_date,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// 메인 목록 — 기본 정렬 Recently Updated (PROJECT_SYSTEM §11). 검색·필터·정렬 결합은 Phase 3.
export function listProjects(): ProjectCard[] {
  const db = getDb();
  const rows = db.getAllSync<ProjectRow>(
    `SELECT p.*, c.name AS category_name
     FROM projects p LEFT JOIN categories c ON c.id = p.category_id
     ORDER BY p.updated_at DESC`,
  );
  if (rows.length === 0) return [];

  // 태그는 한 번에 가져와 붙인다 (N+1 회피 — DATABASE.md §3)
  const ids = rows.map((r) => r.id);
  const placeholders = ids.map(() => '?').join(',');
  const tagRows = db.getAllSync<{ project_id: string; name: string }>(
    `SELECT pt.project_id, t.name FROM project_tags pt JOIN tags t ON t.id = pt.tag_id
     WHERE pt.project_id IN (${placeholders}) ORDER BY t.name COLLATE NOCASE`,
    ids,
  );
  const tagsByProject = new Map<string, string[]>();
  for (const t of tagRows) {
    const list = tagsByProject.get(t.project_id) ?? [];
    list.push(t.name);
    tagsByProject.set(t.project_id, list);
  }

  return rows.map((r) => ({
    ...toProject(r),
    categoryName: r.category_name ?? null,
    tags: tagsByProject.get(r.id) ?? [],
  }));
}

export function getProject(id: string): Project | null {
  const row = getDb().getFirstSync<ProjectRow>('SELECT * FROM projects WHERE id = ?', [id]);
  return row ? toProject(row) : null;
}

/** 상세 화면용 — 카테고리명·태그 포함 */
export function getProjectCard(id: string): ProjectCard | null {
  const row = getDb().getFirstSync<ProjectRow>(
    'SELECT p.*, c.name AS category_name FROM projects p LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = ?',
    [id],
  );
  if (!row) return null;
  return { ...toProject(row), categoryName: row.category_name ?? null, tags: listProjectTags(id) };
}

/** 노트·자료·태그 변경 시 프로젝트 updated_at 갱신 — "아이디어 발전 = 활동" (CLAUDE.md §14 E) */
export function touchProject(db: SQLiteDatabase, id: string, at: number = Date.now()): void {
  db.runSync('UPDATE projects SET updated_at = ? WHERE id = ?', [at, id]);
}

/** 전 필드 수정 — 이름만 필수. 태그는 배열이 오면 통째로 교체(undefined면 손대지 않는다). */
export function updateProject(id: string, input: ProjectInput): Project {
  const name = input.name.trim();
  if (name.length === 0) throw new Error('project.nameRequired');
  const now = Date.now();
  const db = getDb();
  db.withTransactionSync(() => {
    db.runSync(
      `UPDATE projects SET
        name = ?, summary = ?, description = ?, category_id = ?, problem = ?, goal = ?, core_idea = ?, target_user = ?,
        progress = ?, status = ?, priority = ?, start_date = ?, target_end_date = ?, updated_at = ?
       WHERE id = ?`,
      [
        name,
        nullIfBlank(input.summary),
        nullIfBlank(input.description),
        input.categoryId ?? null,
        nullIfBlank(input.problem),
        nullIfBlank(input.goal),
        nullIfBlank(input.coreIdea),
        nullIfBlank(input.targetUser),
        Math.min(100, Math.max(0, Math.round(input.progress ?? 0))),
        input.status ?? 'idea',
        input.priority ?? 'none',
        input.startDate ?? null,
        input.targetEndDate ?? null,
        now,
        id,
      ],
    );
    if (input.tags) replaceProjectTags(db, id, input.tags);
  });
  const updated = getProject(id);
  if (!updated) throw new Error('project.notFound');
  return updated;
}

/** 이름만 필수. 빈 선택 필드는 NULL, 기본값 progress 0 · status idea · priority none. */
export function createProject(input: ProjectInput): Project {
  const name = input.name.trim();
  if (name.length === 0) throw new Error('project.nameRequired');
  const now = Date.now();
  const id = randomUUID();
  const db = getDb();
  db.withTransactionSync(() => {
    db.runSync(
      `INSERT INTO projects
      (id, name, summary, description, category_id, problem, goal, core_idea, target_user,
       progress, status, priority, start_date, target_end_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        nullIfBlank(input.summary),
        nullIfBlank(input.description),
        input.categoryId ?? null,
        nullIfBlank(input.problem),
        nullIfBlank(input.goal),
        nullIfBlank(input.coreIdea),
        nullIfBlank(input.targetUser),
        input.progress ?? 0,
        input.status ?? 'idea',
        input.priority ?? 'none',
        input.startDate ?? null,
        input.targetEndDate ?? null,
        now,
        now,
      ],
    );
    if (input.tags && input.tags.length > 0) replaceProjectTags(db, id, input.tags);
  });
  const created = getProject(id);
  if (!created) throw new Error('project.createFailed');
  return created;
}

/** 삭제 — 노트·자료는 FK CASCADE, 태그 연결 해제 후 고아 태그 정리 (PROJECT_SYSTEM §13) */
export function deleteProject(id: string): void {
  const db = getDb();
  db.withTransactionSync(() => {
    db.runSync('DELETE FROM projects WHERE id = ?', [id]);
    cleanupOrphanTags(db);
  });
}
