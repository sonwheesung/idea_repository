/**
 * 오픈소스 고지 데이터 생성 — `npm run licenses:build` (검사는 `npm run check:licenses`)
 *
 * 🔴 **왜 생성하나**: 번들에 들어가는 패키지 목록은 반드시 낡는다. 손으로 적은 고지는
 *   의존성을 하나 추가한 날 조용히 거짓이 된다 — 그리고 고지의 거짓은 라이선스 위반이다.
 *   (조각 `diary/scripts/make-licenses.mjs` 2026-08-31 이식 — 폰트 절 제거: 이 앱은 시스템 폰트만 쓴다.
 *   설계는 docs/LEGAL_SYSTEM.md §10.)
 *
 * ⚠ **런타임 의존성만** 담는다(`dependencies`). `devDependencies`는 번들에 안 들어가므로
 *   고지 의무가 없다. 생성 후 `npx prettier --write lib/oss-packages.ts`를 같이 돌린다(스크립트가 한다).
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const OUT = join(ROOT, 'lib/oss-packages.ts');

/** 패키지 폴더에서 저작권 한 줄을 찾는다. 없으면 빈 문자열 — 지어내지 않는다 */
function copyrightOf(dir) {
  let files;
  try {
    files = readdirSync(dir);
  } catch {
    return '';
  }
  const cand = files.filter((f) => /^(LICENSE|LICENCE|COPYING|NOTICE)/i.test(f));
  for (const f of cand) {
    let text;
    try {
      text = readFileSync(join(dir, f), 'utf8');
    } catch {
      continue;
    }
    for (const raw of text.split(/\r?\n/).slice(0, 40)) {
      const line = raw.trim();
      // "Copyright (c) 2021 Someone" — 연도나 (c)가 있어야 실제 고지다.
      if (/^copyright\b/i.test(line) && /\d{4}|\(c\)|©/i.test(line)) {
        return line.replace(/\s+/g, ' ');
      }
    }
  }
  return '';
}

function licenseOf(pkg) {
  if (typeof pkg.license === 'string') return pkg.license;
  if (pkg.license && typeof pkg.license.type === 'string') return pkg.license.type;
  if (Array.isArray(pkg.licenses)) return pkg.licenses.map((l) => l.type).join(' / ');
  return '';
}

const root = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const names = Object.keys(root.dependencies ?? {}).sort();

const rows = [];
const missing = [];
for (const name of names) {
  const dir = join(ROOT, 'node_modules', ...name.split('/'));
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  } catch {
    missing.push(name);
    continue;
  }
  const license = licenseOf(pkg);
  if (license === '') missing.push(name);
  rows.push({ name, version: pkg.version ?? '', license, copyright: copyrightOf(dir) });
}

if (missing.length > 0) {
  // 🔴 라이선스를 모르는 패키지를 조용히 빠뜨리지 않는다. 모르면 사람이 확인해야 한다.
  console.error(`\n라이선스를 못 읽은 패키지 ${missing.length}개: ${missing.join(', ')}`);
  console.error('node_modules가 설치돼 있는지 확인하고, 그래도 없으면 그 패키지를 직접 본다.\n');
  process.exit(1);
}

const body = rows
  .map(
    (r) =>
      `  { name: ${JSON.stringify(r.name)}, version: ${JSON.stringify(r.version)}, ` +
      `license: ${JSON.stringify(r.license)}, copyright: ${JSON.stringify(r.copyright)} },`,
  )
  .join('\n');

const file = `/**
 * 번들에 들어가는 오픈소스 패키지 — **생성 파일이다. 손으로 고치지 마라.**
 *
 * 만드는 곳: \`scripts/make-licenses.mjs\` (\`npm run licenses:build\`)
 * 어긋남 검사: \`npm run check:licenses\` — 의존성을 더하고 이 파일을 안 만들면 실패한다
 */

export interface OssPackage {
  name: string;
  version: string;
  license: string;
  copyright: string;
}

export const OSS_PACKAGES: readonly OssPackage[] = [
${body}
];
`;

writeFileSync(OUT, file, 'utf8');
execSync('npx prettier --write lib/oss-packages.ts', { cwd: ROOT, stdio: 'ignore' });
console.log(`오픈소스 목록 ${rows.length}개 생성 — lib/oss-packages.ts (prettier 적용)`);
