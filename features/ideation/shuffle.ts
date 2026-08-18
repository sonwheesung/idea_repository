// 섞기 규칙 — docs/IDEATION_SYSTEM.md §5.
// 1) 두 슬롯은 서로 다른 그룹 2) 최근 20쌍 회피(모듈 메모리, 순서 무관) 3) 내 태그·카테고리는 가상 그룹 mine 4) Math.random.

import type { WordGroup } from '@/features/ideation/pool';

export type WordSource = 'builtin' | 'builtinAndMine' | 'mineOnly';
export const WORD_SOURCES: WordSource[] = ['builtin', 'builtinAndMine', 'mineOnly'];

export const MINE_GROUP_KEY = 'mine';
const RECENT_LIMIT = 20;
const MAX_TRIES = 20;

const recentPairs: string[] = [];

function pairKey(a: string, b: string): string {
  return [a, b].sort((x, y) => x.localeCompare(y)).join('\u0000');
}

function remember(a: string, b: string): void {
  recentPairs.push(pairKey(a, b));
  if (recentPairs.length > RECENT_LIMIT) recentPairs.shift();
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** 출처에 따라 실제로 뽑을 그룹 목록. 내 것이 2개 미만이면 내장으로 보충(§3.1). */
export function resolveGroups(source: WordSource, builtin: WordGroup[], mine: string[]): WordGroup[] {
  const mineGroup: WordGroup | null =
    mine.length > 0 ? { key: MINE_GROUP_KEY, words: Array.from(new Set(mine)) } : null;
  if (source === 'builtin') return builtin;
  if (source === 'mineOnly') return mineGroup && mineGroup.words.length >= 2 ? [mineGroup] : builtin;
  return mineGroup ? [...builtin, mineGroup] : builtin;
}

export interface WordPick {
  word: string;
  group: string;
}

/** 한 단어 — `avoidGroup`과 다른 그룹에서(가능하면). mine 그룹은 자기들끼리도 허용(§5-3). */
export function pickWord(groups: WordGroup[], avoidGroup?: string): WordPick {
  const candidates =
    avoidGroup && avoidGroup !== MINE_GROUP_KEY ? groups.filter((g) => g.key !== avoidGroup) : groups;
  const pool = candidates.length > 0 ? candidates : groups;
  const g = pick(pool);
  return { word: pick(g.words), group: g.key };
}

/** 두 단어 — 다른 그룹 + 최근 쌍 회피. */
export function pickPair(groups: WordGroup[]): [WordPick, WordPick] {
  let a = pickWord(groups);
  let b = pickWord(groups, a.group);
  for (
    let i = 0;
    i < MAX_TRIES && (a.word === b.word || recentPairs.includes(pairKey(a.word, b.word)));
    i++
  ) {
    a = pickWord(groups);
    b = pickWord(groups, a.group);
  }
  remember(a.word, b.word);
  return [a, b];
}

/** 한쪽 고정, 다른 쪽만 — 고정 단어의 그룹을 피하고 최근 쌍 회피. */
export function pickPartner(groups: WordGroup[], fixed: WordPick): WordPick {
  let b = pickWord(groups, fixed.group);
  for (
    let i = 0;
    i < MAX_TRIES && (b.word === fixed.word || recentPairs.includes(pairKey(fixed.word, b.word)));
    i++
  ) {
    b = pickWord(groups, fixed.group);
  }
  remember(fixed.word, b.word);
  return b;
}
