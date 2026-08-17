import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import i18n from '@/lib/i18n';

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat); // 'YYYY-MM-DD'를 로컬 자정으로 — 플러그인 없이 문자열을 넘기면 UTC로 파싱돼 하루가 밀린다

// 날짜 표기는 현재 UI 언어의 로케일 규칙(en: Aug 14, 2026 / ko: 2026년 8월 14일) — I18N_SYSTEM.md §3.
// 문자열 조합으로 날짜를 만들지 않는다.
function localeOf(): 'ko' | 'en' {
  return i18n.language.startsWith('ko') ? 'ko' : 'en';
}

/** epoch ms → 로케일 짧은 날짜 */
export function formatDate(epochMs: number): string {
  return dayjs(epochMs).locale(localeOf()).format('ll');
}

/** 'YYYY-MM-DD' → 로케일 날짜 (시간대 없이 그대로 파싱 — CLAUDE.md §14 D) */
export function formatDay(day: string): string {
  return dayjs(day, 'YYYY-MM-DD').locale(localeOf()).format('ll');
}
