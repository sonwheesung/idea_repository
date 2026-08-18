// 발상 도구 → /project/new 미리 채움 파라미터 (docs/IDEATION_SYSTEM.md §6). 전부 문자열(expo-router params).

import { isApproach, type Approach } from '@/features/projects/types';

export interface ProjectPrefill {
  name?: string;
  coreIdea?: string;
  problem?: string;
  targetUser?: string;
  approach?: Approach;
  tags?: string[];
  /** 저장 직후 순서대로 노트로 추가 */
  notes?: string[];
}

export type PrefillParams = Record<string, string>;

export function toPrefillParams(p: ProjectPrefill): PrefillParams {
  const out: PrefillParams = {};
  if (p.name) out.name = p.name;
  if (p.coreIdea) out.coreIdea = p.coreIdea;
  if (p.problem) out.problem = p.problem;
  if (p.targetUser) out.targetUser = p.targetUser;
  if (p.approach) out.approach = p.approach;
  if (p.tags && p.tags.length > 0) out.tags = JSON.stringify(p.tags);
  if (p.notes && p.notes.length > 0) out.notes = JSON.stringify(p.notes);
  return out;
}

function str(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v && v.length > 0 ? v : undefined;
}

function strList(v: string | string[] | undefined): string[] | undefined {
  const raw = str(v);
  if (!raw) return undefined;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed))
      return parsed.filter((x): x is string => typeof x === 'string' && x.length > 0);
  } catch {
    // 잘못된 파라미터는 무시 — 빈 폼으로
  }
  return undefined;
}

export function parsePrefillParams(params: Record<string, string | string[] | undefined>): ProjectPrefill {
  const approach = str(params.approach);
  return {
    name: str(params.name),
    coreIdea: str(params.coreIdea),
    problem: str(params.problem),
    targetUser: str(params.targetUser),
    approach: isApproach(approach) ? approach : undefined,
    tags: strList(params.tags),
    notes: strList(params.notes),
  };
}

export function hasPrefill(p: ProjectPrefill): boolean {
  return Boolean(
    p.name || p.coreIdea || p.problem || p.targetUser || p.approach || p.tags?.length || p.notes?.length,
  );
}
