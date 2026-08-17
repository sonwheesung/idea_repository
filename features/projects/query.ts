import { getDb } from '@/db';
import { attachTags, toProject, type ProjectRow } from '@/features/projects/api';
import type { Priority, ProjectCard, Status } from '@/features/projects/types';

// 정렬 6종 (PROJECT_SYSTEM §11). 기본 Recently Updated.
export const SORT_KEYS = [
  'recentlyUpdated',
  'recentlyCreated',
  'name',
  'progress',
  'targetEndDate',
  'priority',
] as const;
export type SortKey = (typeof SORT_KEYS)[number];
export const DEFAULT_SORT: SortKey = 'recentlyUpdated';

export interface ProjectQuery {
  /** 검색어 — 9필드 LIKE (PROJECT_SYSTEM §9). 빈 문자열이면 무시 */
  q: string;
  /** null = All */
  status: Status | null;
  categoryId: string | null;
  priority: Priority | null;
  sort: SortKey;
}

const ORDER_BY: Record<SortKey, string> = {
  recentlyUpdated: 'p.updated_at DESC',
  recentlyCreated: 'p.created_at DESC',
  name: 'p.name COLLATE NOCASE ASC, p.updated_at DESC',
  progress: 'p.progress DESC, p.updated_at DESC',
  // 마감일 없는 것은 맨 뒤
  targetEndDate: 'p.target_end_date IS NULL, p.target_end_date ASC, p.updated_at DESC',
  // High → Medium → Low → None
  priority:
    "CASE p.priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 ELSE 3 END, p.updated_at DESC",
};

/** LIKE 특수문자 이스케이프 (`%` `_` `\`) */
function likeOf(q: string): string {
  return `%${q.replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
}

/**
 * 메인 목록 — 검색·필터·정렬을 한 쿼리로 (DATABASE.md §3). 검색은 프로젝트 7필드 + 노트 + 태그 EXISTS.
 * `#태그` 입력은 `#`을 벗겨 태그명과 비교하되 다른 필드도 같이 본다(별도 모드 아님).
 */
export function queryProjects(query: ProjectQuery): ProjectCard[] {
  const db = getDb();
  const where: string[] = [];
  const params: (string | number)[] = [];

  if (query.status) {
    where.push('p.status = ?');
    params.push(query.status);
  }
  if (query.categoryId) {
    where.push('p.category_id = ?');
    params.push(query.categoryId);
  }
  if (query.priority) {
    where.push('p.priority = ?');
    params.push(query.priority);
  }
  const q = query.q.trim();
  if (q.length > 0) {
    const like = likeOf(q);
    const tagLike = likeOf(q.replace(/^#+/, ''));
    where.push(`(
      p.name LIKE ? ESCAPE '\\' OR p.summary LIKE ? ESCAPE '\\' OR p.description LIKE ? ESCAPE '\\'
      OR p.problem LIKE ? ESCAPE '\\' OR p.goal LIKE ? ESCAPE '\\' OR p.core_idea LIKE ? ESCAPE '\\'
      OR p.target_user LIKE ? ESCAPE '\\'
      OR EXISTS (SELECT 1 FROM notes n WHERE n.project_id = p.id AND n.content LIKE ? ESCAPE '\\')
      OR EXISTS (SELECT 1 FROM project_tags pt JOIN tags t ON t.id = pt.tag_id
                 WHERE pt.project_id = p.id AND t.name LIKE ? ESCAPE '\\')
    )`);
    params.push(like, like, like, like, like, like, like, like, tagLike);
  }

  const sql = `SELECT p.*, c.name AS category_name
    FROM projects p LEFT JOIN categories c ON c.id = p.category_id
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY ${ORDER_BY[query.sort]}`;
  const rows = db.getAllSync<ProjectRow>(sql, params);
  const cards = attachTags(
    db,
    rows.map((r) => ({ ...toProject(r), categoryName: r.category_name ?? null, tags: [] })),
  );

  // 이름 정렬은 한글·영문 혼합의 로케일 순서를 위해 JS로 한 번 더 (SQLite NOCASE는 ASCII만)
  if (query.sort === 'name')
    cards.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  return cards;
}
