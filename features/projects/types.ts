import { CARD_COLOR_VALUES, type CardColor } from '@/theme/palettes';

// 도메인 enum — DB에는 코드값만, 표시명은 i18n(status.* / priority.*). docs/PROJECT_SYSTEM.md §3.3

export const STATUSES = ['idea', 'planned', 'in_progress', 'on_hold', 'cancelled', 'completed'] as const;
export type Status = (typeof STATUSES)[number];

// 정렬 순서 High→Medium→Low→None (CLAUDE.md §5)
export const PRIORITIES = ['high', 'medium', 'low', 'none'] as const;
export type Priority = (typeof PRIORITIES)[number];

// 발상 방식 — 발상 도구 4종과 1:1 + 수동 other, 기본 none (docs/IDEATION_SYSTEM.md §7)
export const APPROACHES = ['combine', 'improve', 'problem', 'whatif', 'other', 'none'] as const;
export type Approach = (typeof APPROACHES)[number];

export function isApproach(v: unknown): v is Approach {
  return typeof v === 'string' && (APPROACHES as readonly string[]).includes(v);
}

// 카드 색상 — 키·hex 정본은 theme/palettes.ts(색 리터럴은 테마 파일만). null = 테마 기본 동작.
// DB에 CHECK가 없어 여기 검증이 방어선이다: 모르는 값은 읽을 때 null 취급(DATABASE §2.3).
export { CARD_COLOR_KEYS as CARD_COLORS } from '@/theme/palettes';
export type { CardColor };

export function isCardColor(v: unknown): v is CardColor {
  return typeof v === 'string' && v in CARD_COLOR_VALUES;
}

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
  approach: Approach;
  cardColor: CardColor | null; // null = 테마 기본 동작 (v4, 2026-09-14)
  startDate: string | null; // 'YYYY-MM-DD'
  targetEndDate: string | null;
  createdAt: number;
  updatedAt: number;
}

/** 카드 표시용 — 카테고리명·태그를 함께 든다 */
/** 검색 매치 힌트 대상 — 카드에 안 보이는 6필드만, 표시 순서 고정 (PROJECT_SYSTEM §9.1) */
export const MATCH_FIELDS = ['description', 'problem', 'goal', 'coreIdea', 'targetUser', 'notes'] as const;
export type MatchField = (typeof MATCH_FIELDS)[number];

export interface ProjectCard extends Project {
  categoryName: string | null;
  tags: string[];
  /** 검색어가 걸린 숨은 필드 — 검색어 없으면 빈 배열 */
  matchedFields: MatchField[];
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
  approach?: Approach;
  cardColor?: CardColor | null;
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
