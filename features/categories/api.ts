import { randomUUID } from 'expo-crypto';

import { getDb } from '@/db';

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

/** 카드·관리 화면용 — 사용 프로젝트 수 포함 */
export interface CategoryWithCount extends Category {
  projectCount: number;
}

interface CategoryRow {
  id: string;
  name: string;
  sort_order: number;
  project_count?: number;
}

function toCategory(r: CategoryRow): Category {
  return { id: r.id, name: r.name, sortOrder: r.sort_order };
}

// 시드 순서 유지, 추가는 맨 아래 (PROJECT_SYSTEM §4.2). 기본 카테고리도 일반 행 — 특별 취급 없음(CLAUDE.md §14 #5).
export function listCategories(): Category[] {
  return getDb()
    .getAllSync<CategoryRow>(
      'SELECT id, name, sort_order FROM categories ORDER BY sort_order ASC, created_at ASC',
    )
    .map(toCategory);
}

export function listCategoriesWithCount(): CategoryWithCount[] {
  return getDb()
    .getAllSync<CategoryRow>(
      `SELECT c.id, c.name, c.sort_order,
              (SELECT COUNT(*) FROM projects p WHERE p.category_id = c.id) AS project_count
       FROM categories c ORDER BY c.sort_order ASC, c.created_at ASC`,
    )
    .map((r) => ({ ...toCategory(r), projectCount: r.project_count ?? 0 }));
}

export function normalizeCategoryName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

/** 대소문자 무시 중복 조회(수정 시 자기 자신 제외) */
export function findCategoryByName(name: string, excludeId?: string): Category | null {
  const n = normalizeCategoryName(name);
  const row = excludeId
    ? getDb().getFirstSync<CategoryRow>(
        'SELECT id, name, sort_order FROM categories WHERE name = ? COLLATE NOCASE AND id != ?',
        [n, excludeId],
      )
    : getDb().getFirstSync<CategoryRow>(
        'SELECT id, name, sort_order FROM categories WHERE name = ? COLLATE NOCASE',
        [n],
      );
  return row ? toCategory(row) : null;
}

/** 추가 — 맨 아래. 빈 이름·중복은 에러 코드(i18n 키)로 throw */
export function createCategory(name: string): Category {
  const n = normalizeCategoryName(name);
  if (n.length === 0) throw new Error('category.nameRequired');
  if (findCategoryByName(n)) throw new Error('category.duplicate');
  const db = getDb();
  const max = db.getFirstSync<{ m: number | null }>('SELECT MAX(sort_order) AS m FROM categories')?.m ?? -1;
  const id = randomUUID();
  db.runSync('INSERT INTO categories (id, name, sort_order, created_at) VALUES (?, ?, ?, ?)', [
    id,
    n,
    max + 1,
    Date.now(),
  ]);
  return { id, name: n, sortOrder: max + 1 };
}

export function renameCategory(id: string, name: string): void {
  const n = normalizeCategoryName(name);
  if (n.length === 0) throw new Error('category.nameRequired');
  if (findCategoryByName(n, id)) throw new Error('category.duplicate');
  getDb().runSync('UPDATE categories SET name = ? WHERE id = ?', [n, id]);
}

export function countProjectsInCategory(id: string): number {
  return (
    getDb().getFirstSync<{ n: number }>('SELECT COUNT(*) AS n FROM projects WHERE category_id = ?', [id])
      ?.n ?? 0
  );
}

/**
 * 삭제 — 사용 중이면 호출부가 선택지를 받아 넘긴다 (PROJECT_SYSTEM §4.3):
 *  moveTo 없음 → 프로젝트 category_id NULL (FK ON DELETE SET NULL이 처리하지만 명시 UPDATE)
 *  moveTo 있음 → 해당 카테고리로 일괄 이동 후 삭제. 한 트랜잭션.
 */
export function deleteCategory(id: string, moveTo?: string | null): void {
  const db = getDb();
  db.withTransactionSync(() => {
    if (moveTo) {
      // 카테고리 이동은 관리 작업 — 프로젝트 updated_at은 건드리지 않는다(아이디어 활동이 아니다)
      db.runSync('UPDATE projects SET category_id = ? WHERE category_id = ?', [moveTo, id]);
    } else {
      db.runSync('UPDATE projects SET category_id = NULL WHERE category_id = ?', [id]);
    }
    db.runSync('DELETE FROM categories WHERE id = ?', [id]);
  });
}
