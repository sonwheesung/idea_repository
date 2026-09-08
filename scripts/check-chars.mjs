// 제어문자 검사 — 텍스트·실행 파일에 보이지 않는 제어 바이트가 박히는 것을 막는다
// (2026-09-08: check-i18n.mjs의 \b가 0x08로 박혀 19일간 검사가 헛돌았다 — I18N_SYSTEM §2)
// 허용은 TAB(9)·LF(10)·CR(13) 셋뿐. ⚠ 9~13 구간 통짜 허용 금지 — VT(11)·FF(12)가 그 틈으로 빠진다
// (2026-09-08 형제 프로젝트 실측: 스캐너가 있었는데 허용 범위가 넓어 0x0b를 통과시켰다).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = ['app', 'components', 'features', 'lib', 'db', 'theme', 'locales', 'scripts', 'tools', 'docs', '.claude'];
const FILES = ['CLAUDE.md', 'package.json', 'app.json'];
const TEXT = /\.(ts|tsx|mjs|js|json|md|py|sh|ps1|yml|yaml)$/;
const ALLOWED = new Set([9, 10, 13]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (TEXT.test(name)) out.push(p);
  }
  return out;
}

// 자가 검증 — 판정 함수가 실제로 본다는 것을 매 실행 증명(0x08·0x0b 둘 다)
const offenders = (s) => {
  const out = [];
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 32 && !ALLOWED.has(c)) out.push(c);
  }
  return out;
};
{
  const probe = offenders('a\tb\nc\rd' + String.fromCharCode(8) + String.fromCharCode(11));
  if (probe.join(',') !== '8,11') {
    console.error(`check:chars SELF-TEST FAIL — 판정 함수가 망가졌다 (감지: ${probe.join(',')})`);
    process.exit(1);
  }
}

const errors = [];
const targets = FILES.map((f) => join(root, f));
for (const d of DIRS) targets.push(...walk(join(root, d)));
for (const file of targets) {
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');
  for (let ln = 0; ln < lines.length; ln++) {
    for (const c of offenders(lines[ln])) {
      errors.push(`${file.replace(root, '')}:${ln + 1} — 제어문자 0x${c.toString(16).padStart(2, '0')}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`check:chars FAIL — ${errors.length}건`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`check:chars OK — ${targets.length}개 파일`);
