// i18n 키 검사 — LinkMemo·조각 규약 승계 (docs/I18N_SYSTEM.md §4)
// ① en 기준 키 누락·잉여 ② 비한국어 로케일의 한글 잔존 ③ {{보간}} 플레이스홀더 일치
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['en', 'ko'];
const REFERENCE = 'en';

function flatten(obj, prefix = '') {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object') Object.assign(out, flatten(value, path));
    else out[path] = String(value);
  }
  return out;
}

const locales = Object.fromEntries(
  LANGS.map((lang) => [
    lang,
    flatten(JSON.parse(readFileSync(join(root, 'locales', `${lang}.json`), 'utf8'))),
  ]),
);

const refKeys = Object.keys(locales[REFERENCE]).sort();
const errors = [];

// 언어 자기표기 라벨은 코드 상수(lib/i18n.ts LANGUAGE_LABELS)라 로케일 파일에 없다 — 예외 없음
const HANGUL = /[가-힣]/;
// 고유 변수명 집합만 비교 — {{x, josa(pair: 이/가)}}(ko 조사 포매터, I18N_SYSTEM §2) ↔ {{x}}(en),
// “{{w}}”{{w, josaPick(...)}}처럼 같은 변수를 두 번 쓰는 것도 일치로 본다
const placeholdersOf = (s) =>
  [...new Set([...s.matchAll(/\{\{\s*(\w+)/g)].map((m) => m[1]))].sort().join(',');

for (const lang of LANGS) {
  const keys = Object.keys(locales[lang]).sort();
  for (const k of refKeys) if (!keys.includes(k)) errors.push(`[${lang}] 누락 키: ${k}`);
  for (const k of keys) if (!refKeys.includes(k)) errors.push(`[${lang}] 잉여 키: ${k}`);

  if (lang !== 'ko') {
    for (const [k, v] of Object.entries(locales[lang])) {
      if (HANGUL.test(v)) errors.push(`[${lang}] 한글 잔존: ${k} = "${v}"`);
    }
  }

  if (lang !== REFERENCE) {
    for (const k of refKeys) {
      const ref = placeholdersOf(locales[REFERENCE][k] ?? '');
      const cur = placeholdersOf(locales[lang][k] ?? '');
      if (locales[lang][k] !== undefined && ref !== cur) {
        errors.push(`[${lang}] 보간 불일치: ${k} (en: ${ref || '없음'} / ${lang}: ${cur || '없음'})`);
      }
    }
  }
}

// ④ 코드에서 쓰는 정적 키(t('a.b') · throw new Error('a.b'))가 en에 존재하는지 (2026-08-17 추가 — Phase 4 점검에서 누락 1건 발견)
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}
const refKeySet = new Set(refKeys);
for (const dir of ['app', 'components', 'features', 'lib']) {
  for (const file of walk(join(root, dir))) {
    const src = readFileSync(file, 'utf8');
    const found = new Set();
    for (const m of src.matchAll(/t\(\s*'([^']+)'/g)) found.add(m[1]);
    for (const m of src.matchAll(/new Error\('([a-z]+\.[A-Za-z.]+)'\)/g)) found.add(m[1]);
    for (const k of found)
      if (!refKeySet.has(k)) errors.push(`[code] 리소스에 없는 키: ${k} (${file.replace(root, '')})`);
  }
}

if (errors.length > 0) {
  console.error(`check:i18n FAIL — ${errors.length}건`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`check:i18n OK — ${LANGS.length}개 언어 · ${refKeys.length}개 키`);
