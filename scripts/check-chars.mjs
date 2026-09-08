// 제어문자 검사 — 텍스트·실행 파일에 보이지 않는 제어 바이트가 박히는 것을 막는다
// (2026-09-08: check-i18n.mjs의 \b가 0x08로 박혀 19일간 검사가 헛돌았다 — I18N_SYSTEM §2)
// 허용은 TAB(9)·LF(10)·"줄 끝 CR"(CRLF의 일부)뿐.
// ⚠ 9~13 구간 통짜 허용 금지 — VT(11)·FF(12)가 그 틈으로 빠진다(형제 프로젝트 실측).
// ⚠ CR 통짜 허용도 금지 — "줄 중간 CR"(문자열이 조용히 틀리는 결함)이 빠진다. 같은 바이트인데
//   위치가 의미를 가르므로 판정에 위치가 들어간다(2026-09-08 공통서버 세션 정정 — Re:Read 실사고).
//   CR 통짜 금지도 답이 아니다: autocrlf 체크아웃이 온통 오탐이 돼 가드가 꺼진다.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = ['app', 'components', 'features', 'lib', 'db', 'theme', 'locales', 'scripts', 'tools', 'docs', '.claude'];
const FILES = ['CLAUDE.md', 'package.json', 'app.json'];
const TEXT = /\.(ts|tsx|mjs|js|json|md|py|sh|ps1|yml|yaml)$/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (TEXT.test(name)) out.push(p);
  }
  return out;
}

// 판정: LF로 자른 각 줄에서, 줄 끝 CR 하나만 벗긴 뒤 남는 32 미만 문자(TAB 제외)는 전부 결함
const scan = (src) => {
  const out = [];
  const lines = src.split('\n');
  for (let ln = 0; ln < lines.length; ln++) {
    let line = lines[ln];
    if (line.endsWith('\r')) line = line.slice(0, -1); // 줄 끝 CR = CRLF의 일부 — 허용
    for (let i = 0; i < line.length; i++) {
      const c = line.charCodeAt(i);
      if (c < 32 && c !== 9) out.push({ ln: ln + 1, c });
    }
  }
  return out;
};

// 자가 검증 — 가드가 자기 구멍을 자기 샘플로는 못 본다: 사고 문자(0x08·0x0b)만이 아니라
// "정상 CRLF는 통과·줄 중간 CR은 결함"의 위치 판정까지 매 실행 증명한다
{
  const BS = String.fromCharCode(8);
  const VT = String.fromCharCode(11);
  const cases = [
    ['정상 CRLF 문서', 'a\tb\r\nc\r\n', ''],
    ['줄 중간 CR', 'D:/emulators\reread\n', '13'],
    ['0x08(백스페이스)', 'x' + BS + 't\n', '8'],
    ['0x0b(VT)', 'a' + VT + 'b', '11'],
  ];
  for (const [name, input, want] of cases) {
    const got = scan(input).map((f) => f.c).join(',');
    if (got !== want) {
      console.error(`check:chars SELF-TEST FAIL — ${name}: 감지 "${got}" · 기대 "${want}"`);
      process.exit(1);
    }
  }
}

const errors = [];
const targets = FILES.map((f) => join(root, f));
for (const d of DIRS) targets.push(...walk(join(root, d)));
for (const file of targets) {
  for (const f of scan(readFileSync(file, 'utf8'))) {
    errors.push(`${file.replace(root, '')}:${f.ln} — 제어문자 0x${f.c.toString(16).padStart(2, '0')}`);
  }
}

if (errors.length > 0) {
  console.error(`check:chars FAIL — ${errors.length}건`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`check:chars OK — ${targets.length}개 파일`);
