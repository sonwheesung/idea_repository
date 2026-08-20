// 한국어 조사 처리 — es-hangul 래퍼 (docs/I18N_SYSTEM.md §2, 2026-08-20).
// 마지막 글자가 완성형 한글일 때만 es-hangul에 맡기고, 아니면(영어·숫자·'…') 병기로 폴백한다
// — es-hangul은 비한글에서 무받침형('Zoom를')으로 기울어 병기가 더 안전하다.

import { josa } from 'es-hangul';

export type JosaPair = '이/가' | '을/를' | '은/는' | '와/과' | '으로/로';

const endsWithHangul = (word: string): boolean => /[가-힣]$/.test(word);

/** 단어 + 알맞은 조사. 비한글 끝은 "단어을(를)" 병기 */
export function koJosa(word: string, pair: JosaPair): string {
  if (endsWithHangul(word)) return josa(word, pair);
  return `${word}${koJosaPick(word, pair)}`;
}

/** 조사만. 비한글 끝은 "을(를)" 병기 — 따옴표 뒤(“{{word}}”을) 등 단어와 분리해 쓸 때 */
export function koJosaPick(word: string, pair: JosaPair): string {
  if (endsWithHangul(word)) return josa.pick(word, pair);
  const [withBatchim, without] = pair.split('/');
  return `${withBatchim}(${without})`;
}
