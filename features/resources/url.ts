// 관련 자료 URL 정규화·제목 자동 제안 — 전부 오프라인 파싱 (PROJECT_SYSTEM §7). LinkMemo features/sites/url.ts 승계.
// RN의 URL 폴리필은 불완전하므로 정규식으로 파싱한다.

const HOSTNAME_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;

/** 스킴 보정 + 공백 제거. 형태가 URL이 아니면 null. */
export function normalizeUrl(input: string): string | null {
  let url = input.trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  const host = hostnameOf(url);
  if (!host || !HOSTNAME_RE.test(host)) return null;
  const m = url.match(/^(https?:\/\/)([^/?#]+)(.*)$/i);
  if (!m) return null;
  return `${m[1].toLowerCase()}${m[2].toLowerCase()}${m[3]}`;
}

export function hostnameOf(url: string): string | null {
  const m = url.match(/^https?:\/\/([^/:?#]+)/i);
  return m ? m[1].toLowerCase() : null;
}

/** 표시용 도메인 — www. 제거 */
export function displayDomain(url: string): string {
  const host = hostnameOf(url);
  return host ? host.replace(/^www\./, '') : url;
}

// 잘 알려진 도메인 → 공식 표기 (그 외에는 도메인 그대로 — 아이디어 자료는 출처가 그대로 보이는 편이 낫다)
const KNOWN_NAMES: Record<string, string> = {
  'github.com': 'GitHub',
  'notion.so': 'Notion',
  'google.com': 'Google',
  'trends.google.com': 'Google Trends',
  'docs.google.com': 'Google Docs',
  'youtube.com': 'YouTube',
  'youtu.be': 'YouTube',
  'x.com': 'X',
  'twitter.com': 'Twitter',
  'reddit.com': 'Reddit',
  'producthunt.com': 'Product Hunt',
  'news.ycombinator.com': 'Hacker News',
  'medium.com': 'Medium',
  'figma.com': 'Figma',
  'stackoverflow.com': 'Stack Overflow',
  'wikipedia.org': 'Wikipedia',
  'en.wikipedia.org': 'Wikipedia',
  'ko.wikipedia.org': '위키백과',
  'naver.com': 'NAVER',
  'blog.naver.com': 'NAVER Blog',
  'velog.io': 'velog',
  'tistory.com': 'Tistory',
  'apple.com': 'Apple',
  'play.google.com': 'Google Play',
};

/** URL에서 제목 제안. 알려진 도메인은 공식 표기, 아니면 www. 뗀 도메인. 파싱 실패 시 입력 그대로. */
export function suggestResourceTitle(input: string): string {
  const normalized = normalizeUrl(input);
  if (!normalized) return input.trim();
  const domain = displayDomain(normalized);
  return KNOWN_NAMES[domain] ?? domain;
}
