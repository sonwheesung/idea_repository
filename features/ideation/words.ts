// 발상 단어 — DB v3 `ideation_words` CRUD (docs/IDEATION_SYSTEM.md §3.5·§4, DATABASE.md §2.2).
// 언어별 목록. 내장 단어도 일반 행. 그룹 순서는 풀(POOL_GROUP_KEYS) + 'mine' 맨 뒤.

import { randomUUID } from 'expo-crypto';

import { getDb, seedIdeationWords } from '@/db';
import { getPool, POOL_GROUP_KEYS, type WordGroup } from '@/db/ideation-pool';
import { listCategories } from '@/features/categories/api';
import { MINE_GROUP_KEY } from '@/features/ideation/shuffle';
import { listAllTags } from '@/features/tags/api';
import type { AppLanguage } from '@/lib/i18n';

export interface IdeationWord {
  id: string;
  lang: AppLanguage;
  group: string;
  word: string;
}

export interface WordSection {
  key: string;
  words: IdeationWord[];
}

interface Row {
  id: string;
  lang: AppLanguage;
  group_key: string;
  word: string;
}

/** 관리 화면·섞기용 그룹 키 전체(풀 15 + 내 단어) */
export const WORD_GROUP_KEYS: readonly string[] = [...POOL_GROUP_KEYS, MINE_GROUP_KEY];

export function toWordLang(lang: string): AppLanguage {
  return lang.startsWith('ko') ? 'ko' : 'en';
}

export function normalizeWord(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ');
}

const groupRank = (key: string): number => {
  const i = WORD_GROUP_KEYS.indexOf(key);
  return i < 0 ? WORD_GROUP_KEYS.length : i; // 모르는 그룹(미래 풀 변경)은 맨 뒤
};

export function listWords(lang: string): IdeationWord[] {
  return getDb()
    .getAllSync<Row>(
      'SELECT id, lang, group_key, word FROM ideation_words WHERE lang = ? ORDER BY created_at ASC, rowid ASC',
      [toWordLang(lang)],
    )
    .map((r) => ({ id: r.id, lang: r.lang, group: r.group_key, word: r.word }));
}

/** 그룹별 섹션 — 빈 그룹은 생략(관리 화면 표시·섞기 공용) */
export function listWordSections(lang: string): WordSection[] {
  const map = new Map<string, IdeationWord[]>();
  for (const w of listWords(lang)) {
    const arr = map.get(w.group);
    if (arr) arr.push(w);
    else map.set(w.group, [w]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => groupRank(a) - groupRank(b))
    .map(([key, words]) => ({ key, words }));
}

/**
 * 섞기용 그룹 — 현재 언어 단어가 2개 미만이면 내장 풀로 대체(전부 지워도 도구가 죽지 않게, §4).
 */
export function listShuffleGroups(lang: string): WordGroup[] {
  const sections = listWordSections(lang);
  const total = sections.reduce((n, s) => n + s.words.length, 0);
  if (total < 2) return getPool(lang).groups;
  return sections.map((s) => ({ key: s.key, words: s.words.map((w) => w.word) }));
}

function findDuplicate(lang: AppLanguage, word: string, excludeId?: string): boolean {
  const row = excludeId
    ? getDb().getFirstSync<{ id: string }>(
        'SELECT id FROM ideation_words WHERE lang = ? AND word = ? COLLATE NOCASE AND id != ?',
        [lang, word, excludeId],
      )
    : getDb().getFirstSync<{ id: string }>(
        'SELECT id FROM ideation_words WHERE lang = ? AND word = ? COLLATE NOCASE',
        [lang, word],
      );
  return Boolean(row);
}

/** 에러는 i18n 키를 message로 던진다(카테고리 API와 같은 규약) */
export function addWord(lang: string, rawWord: string, group: string): IdeationWord {
  const l = toWordLang(lang);
  const word = normalizeWord(rawWord);
  if (!word) throw new Error('ideation.words.errorEmpty');
  if (findDuplicate(l, word)) throw new Error('ideation.words.errorDuplicate');
  const now = Date.now();
  const id = randomUUID();
  getDb().runSync(
    'INSERT INTO ideation_words (id, lang, group_key, word, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, l, group, word, now, now],
  );
  return { id, lang: l, group, word };
}

export function updateWord(id: string, lang: string, rawWord: string, group: string): void {
  const l = toWordLang(lang);
  const word = normalizeWord(rawWord);
  if (!word) throw new Error('ideation.words.errorEmpty');
  if (findDuplicate(l, word, id)) throw new Error('ideation.words.errorDuplicate');
  getDb().runSync('UPDATE ideation_words SET word = ?, group_key = ?, updated_at = ? WHERE id = ?', [
    word,
    group,
    Date.now(),
    id,
  ]);
}

export function deleteWord(id: string): void {
  getDb().runSync('DELETE FROM ideation_words WHERE id = ?', [id]);
}

/** 내 태그·카테고리 이름을 `mine` 그룹에 추가 — 이미 있으면 건너뜀. 추가된 개수 반환 */
export function importMineWords(lang: string): number {
  const l = toWordLang(lang);
  const names = [...listAllTags(), ...listCategories().map((c) => c.name)];
  const now = Date.now();
  let added = 0;
  getDb().withTransactionSync(() => {
    for (const raw of names) {
      const word = normalizeWord(raw);
      if (!word || findDuplicate(l, word)) continue;
      getDb().runSync(
        'INSERT INTO ideation_words (id, lang, group_key, word, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [randomUUID(), l, MINE_GROUP_KEY, word, now, now],
      );
      added++;
    }
  });
  return added;
}

/** 기본 단어 복원 — 현재 언어 행 전부 삭제 후 내장 재시드(사용자 단어도 지워진다 — 화면에서 Alert 확인) */
export function resetWords(lang: string): void {
  const l = toWordLang(lang);
  const db = getDb();
  db.withTransactionSync(() => {
    db.runSync('DELETE FROM ideation_words WHERE lang = ?', [l]);
    seedIdeationWords(db, l);
  });
}
