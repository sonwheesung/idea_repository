// idearepository용 Play 접근 진단 — diary/scripts/check-play-access.mjs 패턴 축약.
// 키·토큰은 절대 출력하지 않는다. HTTP 상태만 본다. 대조군(조각)을 함께 둬서 키 문제/인가 문제를 가른다.
import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';

const KEY_PATH = 'C:/project/secrets/play-service-account.json';
const PACKAGES = [
  ['IdeaRepo', 'com.vivacegames.idearepository'],
  ['조각(대조군)', 'com.son0925.jogak'],
];
const API = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications';

const sa = JSON.parse(readFileSync(KEY_PATH, 'utf8'));
const now = Math.floor(Date.now() / 1000);
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const claim =
  b64({ alg: 'RS256', typ: 'JWT' }) +
  '.' +
  b64({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/androidpublisher',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  });
const signature = createSign('RSA-SHA256').update(claim).end().sign(sa.private_key, 'base64url');
const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: `${claim}.${signature}`,
  }),
});
const token = await tokenRes.json();
if (!token.access_token) {
  console.error(`토큰 발급 실패: ${token.error}`);
  process.exit(1);
}
console.log(`서비스 계정 ${sa.client_email}`);
for (const [name, pkg] of PACKAGES) {
  const res = await fetch(`${API}/${pkg}/subscriptions`, {
    headers: { authorization: `Bearer ${token.access_token}` },
  });
  console.log(`${name.padEnd(14)}${pkg.padEnd(36)}카탈로그 ${res.ok ? '✅' : '❌'} ${res.status}`);
}
