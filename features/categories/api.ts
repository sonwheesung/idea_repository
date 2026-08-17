import { getDb } from '@/db';

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

interface CategoryRow {
  id: string;
  name: string;
  sort_order: number;
}

// 시드 순서 유지, 추가는 맨 아래 (PROJECT_SYSTEM §4.2). 추가·수정·삭제(선택지)는 카테고리 관리 화면과 함께.
export function listCategories(): Category[] {
  return getDb()
    .getAllSync<CategoryRow>('SELECT id, name, sort_order FROM categories ORDER BY sort_order ASC, created_at ASC')
    .map((r) => ({ id: r.id, name: r.name, sortOrder: r.sort_order }));
}
