// 발상 문장 틀 치환 — {X}와 바로 뒤 조사를 단어 받침에 맞춰 채운다 (docs/IDEATION_SYSTEM.md §3.4, 2026-08-20).
// ko 틀의 '{X}를'류만 형태가 변하고, '{X}에'·'{X}에서'와 en 틀의 맨 {X}는 평문 치환된다.

import { koJosa, type JosaPair } from '@/lib/josa';

const PARTICLE_PAIRS: Record<string, JosaPair> = {
  이: '이/가',
  가: '이/가',
  을: '을/를',
  를: '을/를',
  은: '은/는',
  는: '은/는',
  와: '와/과',
  과: '와/과',
  으로: '으로/로',
  로: '으로/로',
};

// '으로'가 '로'보다 먼저 매칭되도록 길이순
const PARTICLE_PATTERN = /\{X\}(으로|이|가|을|를|은|는|와|과|로)?/g;

export function fillTemplate(template: string, word: string): string {
  return template.replace(PARTICLE_PATTERN, (_match, particle?: string) =>
    particle ? koJosa(word, PARTICLE_PAIRS[particle]) : word,
  );
}
