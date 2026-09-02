#!/usr/bin/env bash
# ⚠ 트랙을 건드리지 않는다 — 번들 라이브러리에만 올린다. 릴리스 생성·노트·검토 전송은 콘솔에서 한다.
#    (서비스 계정에 "프로덕션으로 출시" 권한을 주지 않는다는 규칙을 지키기 위한 설계다.)
# 왜 필요한가: eas submit은 출시 노트를 못 넣고, 브라우저 업로드 도구는 10MB 한도라 68MB AAB를 못 올린다.
# Play Developer API로 AAB를 '번들 라이브러리'에만 올린다(트랙 변경 없음 → 프로덕션 출시 권한 불필요).
set -euo pipefail
KEY_JSON="C:/project/secrets/play-service-account.json"
PKG="com.vivacegames.idearepository"
AAB="${1:?사용법: bash scripts/play-upload-bundle.sh <파일.aab>}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

EMAIL=$(node -p "require('$KEY_JSON').client_email")
node -e "process.stdout.write(require('$KEY_JSON').private_key)" > "$TMP/key.pem"
echo "서비스 계정: $EMAIL"

b64url() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }
NOW=$(date +%s); EXP=$((NOW+3600))
HEADER=$(printf '{"alg":"RS256","typ":"JWT"}' | b64url)
CLAIM=$(printf '{"iss":"%s","scope":"https://www.googleapis.com/auth/androidpublisher","aud":"https://oauth2.googleapis.com/token","exp":%s,"iat":%s}' "$EMAIL" "$EXP" "$NOW" | b64url)
SIG=$(printf '%s.%s' "$HEADER" "$CLAIM" | openssl dgst -sha256 -sign "$TMP/key.pem" -binary | b64url)
JWT="$HEADER.$CLAIM.$SIG"

TOKEN=$(curl -s -X POST https://oauth2.googleapis.com/token \
  -d grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer \
  --data-urlencode "assertion=$JWT" | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).access_token || ''")
[ -n "$TOKEN" ] || { echo "❌ 토큰 발급 실패"; exit 1; }
echo "액세스 토큰 발급 OK (길이 ${#TOKEN})"

EDIT=$(curl -s -X POST "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/$PKG/edits" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Length: 0" | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).id || ''")
[ -n "$EDIT" ] || { echo "❌ edit 생성 실패"; exit 1; }
echo "edit id: $EDIT"

echo "번들 업로드 중 ($(ls -la "$AAB" | awk '{print $5}') bytes)..."
RES=$(curl -s -X POST "https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/$PKG/edits/$EDIT/bundles?uploadType=media" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/octet-stream" --data-binary "@$AAB")
echo "$RES" | node -p "const r=JSON.parse(require('fs').readFileSync(0,'utf8')); r.error? '❌ '+JSON.stringify(r.error): '업로드 OK — versionCode '+r.versionCode+' sha256 '+(r.sha256||'').slice(0,16)"
echo "$RES" | grep -q '"versionCode"' || exit 1

curl -s -X POST "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/$PKG/edits/$EDIT:commit" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Length: 0" \
  | node -p "const r=JSON.parse(require('fs').readFileSync(0,'utf8')); r.error? '❌ commit '+JSON.stringify(r.error): '✅ commit OK — 번들이 라이브러리에 등록됐다'"
