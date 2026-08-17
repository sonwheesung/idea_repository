// 도메인 enum — DB에는 코드값만, 표시명은 i18n(status.* / priority.*). docs/PROJECT_SYSTEM.md §3.3

export const STATUSES = ['idea', 'planned', 'in_progress', 'on_hold', 'cancelled', 'completed'] as const;
export type Status = (typeof STATUSES)[number];

// 정렬 순서 High→Medium→Low→None (CLAUDE.md §5)
export const PRIORITIES = ['high', 'medium', 'low', 'none'] as const;
export type Priority = (typeof PRIORITIES)[number];

export interface Project {
  id: string;
  name: string;
  summary: string | null;
  description: string | null;
  categoryId: string | null;
  problem: string | null;
  goal: string | null;
  coreIdea: string | null;
  targetUser: string | null;
  progress: number;
  status: Status;
  priority: Priority;
  startDate: string | null; // 'YYYY-MM-DD'
  targetEndDate: string | null;
  createdAt: number;
  updatedAt: number;
}

/** 카드 표시용 — 카테고리명·태그를 함께 든다 */
export interface ProjectCard extends Project {
  categoryName: string | null;
  tags: string[];
}

/** 생성/수정 입력 — 이름만 필수, 나머지는 선택 (기둥 1) */
export interface ProjectInput {
  name: string;
  summary?: string | null;
  description?: string | null;
  categoryId?: string | null;
  problem?: string | null;
  goal?: string | null;
  coreIdea?: string | null;
  targetUser?: string | null;
  progress?: number;
  status?: Status;
  priority?: Priority;
  startDate?: string | null;
  targetEndDate?: string | null;
  /** 태그 이름 배열('#' 없이) — 저장 시 tags/project_tags 교체 */
  tags?: string[];
}

/** 빈 문자열은 NULL로 저장 — 빈 필드는 "없음"이지 빈 텍스트가 아니다 */
export function nullIfBlank(v: string | null | undefined): string | null {
  const t = v?.trim() ?? '';
  return t.length === 0 ? null : t;
}
