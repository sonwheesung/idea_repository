/**
 * 오픈소스 고지 드리프트 검사 — `npm run check:licenses`
 *
 * 🔴 **이 고지의 유일한 실패 방식은 "조용히 낡는 것"이다.** 의존성을 하나 추가하고
 *   `licenses:build`를 안 돌리면 화면은 멀쩡히 뜨는데 목록만 빠진다 — 그게 라이선스 위반이다.
 *   그래서 화면을 보는 검사가 아니라 **생성 결과와 설치본을 값으로 대조**한다.
 *   (조각 이식 — 폰트 절 없음: 시스템 폰트만 쓴다. docs/LEGAL_SYSTEM.md §10.)
 *
 * ⚠ 문자열(바이트)로 비교하지 않는다 — prettier가 따옴표·줄바꿈을 바꾸므로 생성 직후에도
 *   안 맞는다(조각 실측). **값을 뽑아 값으로 비교**한다.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const failures = [];

/* ── ① 생성 파일이 지금 설치본과 같은가 ─────────────────────────────── */

function copyrightOf(dir) {
  let files;
  try {
    files = readdirSync(dir);
  } catch {
    return '';
  }
  for (const f of files.filter((x) => /^(LICENSE|LICENCE|COPYING|NOTICE)/i.test(x))) {
    let text;
    try {
      text = readFileSync(join(dir, f), 'utf8');
    } catch {
      continue;
    }
    for (const raw of text.split(/\r?\n/).slice(0, 40)) {
      const line = raw.trim();
      if (/^copyright\b/i.test(line) && /\d{4}|\(c\)|©/i.test(line)) return line.replace(/\s+/g, ' ');
    }
  }
  return '';
}

const root = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const deps = Object.keys(root.dependencies ?? {}).sort();

const generated = readFileSync(join(ROOT, 'lib/oss-packages.ts'), 'utf8');

function parseEntries(src) {
  const out = new Map();
  const re =
    /\{\s*name:\s*(['"])(.*?)\1,\s*version:\s*(['"])(.*?)\3,\s*license:\s*(['"])(.*?)\5,\s*copyright:\s*(['"])(.*?)\7\s*,?\s*\}/gs;
  for (const m of src.matchAll(re)) {
    out.set(m[2], { version: m[4], license: m[6], copyright: m[8] });
  }
  return out;
}

const listedEntries = parseEntries(generated);

for (const name of deps) {
  const dir = join(ROOT, 'node_modules', ...name.split('/'));
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  } catch {
    failures.push(`${name}: node_modules에 없다 — npm install 후 다시 돌린다`);
    continue;
  }
  const license = typeof pkg.license === 'string' ? pkg.license : (pkg.license?.type ?? '');
  const row = listedEntries.get(name);
  if (row === undefined) {
    failures.push(`${name}: 고지 목록에 없다 → npm run licenses:build`);
    continue;
  }
  const want = { version: pkg.version ?? '', license, copyright: copyrightOf(dir) };
  for (const key of ['version', 'license', 'copyright']) {
    if (row[key] !== want[key]) {
      failures.push(`${name}.${key}: 고지 "${row[key]}" ≠ 설치본 "${want[key]}" → npm run licenses:build`);
    }
  }
}

for (const name of listedEntries.keys()) {
  if (!deps.includes(name)) {
    failures.push(`${name}: 의존성에서 빠졌는데 고지에 남아 있다 → licenses:build`);
  }
}

/* ── ② 화면이 실제로 그리나 — 안 그리면 없는 것과 같다 ──────────────── */

const screen = readFileSync(join(ROOT, 'app/licenses.tsx'), 'utf8');
for (const needle of ['OSS_PACKAGES', 'copyright']) {
  if (!screen.includes(needle)) {
    failures.push(`app/licenses.tsx가 ${needle}를 그리지 않는다 — 고지가 화면에 안 나온다`);
  }
}

/* ── ③ About에서 갈 수 있나 — 못 가면 없는 것과 같다 ────────────────── */

const about = readFileSync(join(ROOT, 'app/about.tsx'), 'utf8');
if (!about.includes("'/licenses'")) {
  failures.push("정보(About)에 '/licenses'로 가는 행이 없다 — 화면만 있고 입구가 없다");
}

/* ── 결과 ──────────────────────────────────────────────────────────── */

if (failures.length > 0) {
  console.error(`\n오픈소스 고지 검사 실패 ${failures.length}건:\n`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  console.error('');
  process.exit(1);
}
console.log(`check:licenses OK — 패키지 ${deps.length} · 화면 · 입구`);
