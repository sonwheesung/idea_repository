/**
 * OTA 설정 드리프트 검사 — `npm run check:ota` (LinkMemo scripts/check-ota.mjs 승계, 2026-09-01)
 *
 * 🔴 OTA의 실패는 **조용하다**. 배구명가에서 두 번 데였고 둘 다 "게시는 성공, 아무도 못 받음"이었다:
 *   ① 로컬 gradle 빌드는 eas.json의 channel을 못 받는다 → app.json requestHeaders가 유일한 통로
 *   ② fingerprint runtimeVersion이 .gitignore 한 줄에도 드리프트해 OTA가 고아가 됐다
 *   그래서 빌드·게시 전에 사람이 아니라 스크립트가 본다. 상세는 docs/OTA_SYSTEM.md.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
// app.json은 tools/build-aab.ps1(PowerShell Set-Content)이 BOM을 붙여 쓴다 — JSON.parse 전에 벗긴다
const app = JSON.parse(readFileSync(join(ROOT, 'app.json'), 'utf8').replace(/^﻿/, '')).expo;
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const failures = [];

if (!pkg.dependencies?.['expo-updates']) {
  failures.push('expo-updates가 dependencies에 없다 — OTA 자체가 안 돈다');
}
if (!pkg.dependencies?.['expo-application']) {
  failures.push(
    'expo-application이 없다 — lib/app-version.ts가 네이티브 버전을 못 읽어 OTA 뒤 버전 게이트가 오염된다(OTA_SYSTEM §6)',
  );
}

const u = app.updates;
if (!u) {
  failures.push('app.json에 updates 블록이 없다');
} else {
  if (typeof u.url !== 'string' || !u.url.startsWith('https://u.expo.dev/')) {
    failures.push(`updates.url이 이상하다: ${JSON.stringify(u.url)}`);
  }
  const pid = app.extra?.eas?.projectId;
  if (pid && u.url !== `https://u.expo.dev/${pid}`) {
    failures.push(
      `updates.url이 extra.eas.projectId(${pid})와 다른 프로젝트를 가리킨다 — 남의 앱 번들을 받게 된다`,
    );
  }
  // 🔴 이게 없으면 기기가 채널을 안 보내고, 게시는 성공으로 보이는데 아무도 못 받는다
  const ch = u.requestHeaders?.['expo-channel-name'];
  if (ch !== 'production') {
    failures.push(
      `updates.requestHeaders["expo-channel-name"]가 "production"이 아니다(현재 ${JSON.stringify(ch)}) — ` +
        '로컬 gradle 빌드는 eas.json의 channel을 못 받으므로 여기가 유일한 통로다',
    );
  }
  if (u.checkAutomatically !== 'ON_LOAD') {
    failures.push(
      `updates.checkAutomatically가 ON_LOAD가 아니다(현재 ${JSON.stringify(u.checkAutomatically)})`,
    );
  }
}

const rv = app.runtimeVersion;
if (typeof rv !== 'string') {
  // policy 객체({ policy: 'fingerprint' } 등)는 이 프로젝트에서 금지다 — 로컬 빌드에서 드리프트한다
  failures.push(
    `runtimeVersion이 고정 문자열이 아니다: ${JSON.stringify(rv)} — fingerprint 정책은 쓰지 않는다(OTA_SYSTEM §2)`,
  );
} else if (rv === app.version) {
  // 🔴 "버전이랑 안 맞네" 하고 맞추는 순간 기존 빌드가 전부 OTA 고아가 된다
  failures.push(
    `runtimeVersion("${rv}")을 version("${app.version}")과 같게 맞췄다 — ` +
      'runtimeVersion은 네이티브 세대 번호이고 앱 버전과 무관하다. 맞추면 기존 빌드가 OTA에서 고아가 된다(OTA_SYSTEM §2)',
  );
}

// 버전을 읽는 곳이 lib/app-version.ts 하나인지 — expoConfig.version을 직접 읽으면 OTA 뒤 오염(§6)
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}
for (const dir of ['app', 'components', 'features']) {
  for (const file of walk(join(ROOT, dir))) {
    if (/expoConfig\??\.version/.test(readFileSync(file, 'utf8'))) {
      failures.push(
        `${file.slice(ROOT.length + 1)}이(가) Constants.expoConfig.version을 직접 읽는다 — lib/app-version.ts의 APP_VERSION을 쓸 것(OTA_SYSTEM §6)`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(`\nOTA 설정 검사 실패 ${failures.length}건:\n`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  console.error('');
  process.exit(1);
}
console.log(
  `OTA 설정 OK — runtimeVersion ${rv} · channel production · ${app.updates.url} · 버전 읽기 단일화`,
);
