# ARCHITECTURE — 서버 경계와 연동

> 정책 요약은 [`../CLAUDE.md`](../CLAUDE.md) §10. LinkMemo `docs/ARCHITECTURE.md`의 틀을 승계 —
> Idea Vault도 **로그인 없음·전용 서버 없음**이라 같은 두께다. 2026-08-17 작성 — 연동 0%.

---

## 1. 전체 그림

```
Idea Vault 앱 (Expo RN)
 │
 ├── 로컬 (expo-sqlite / AsyncStorage / SecureStore)
 │     ← 프로젝트·노트·자료·카테고리·태그·필터/정렬 상태·설정 = 전부 여기. 진실의 전부
 │
 ├── HTTPS ──▶ common_server (https://common-server.vercel.app)
 │              ├─ GET  /api/v1/bootstrap?app=ideavault   ← 부팅 1회: 점검·강제업데이트·공지
 │              ├─ POST /api/v1/devices                    ← (미결정 #3 채택 시) 기기 subject 등록 → 세션 토큰
 │              ├─ POST /api/v1/tickets                    ← 문의(익명 또는 기기 귀속)
 │              └─ GET  /api/v1/tickets/mine               ← (기기 subject 시) 내 문의 목록·답변·상태
 │
 ├── OS 기본 브라우저 ← 관련 자료 URL 열기 (Linking.openURL)
 ├── AdMob SDK ← 광고 (테스트 단위로 개발 · EEA는 UMP 동의 폼)
 └── RevenueCat(익명) + 스토어 인앱결제 ← Remove Ads (서버 웹훅·미러 없음)

Idea Vault 전용 서버: 없음 (만들지 않는다)
```

**우리 서버(common_server)로 나가는 사용자 입력은 문의 본문뿐이다.** 프로젝트·노트·자료는 어떤 요청에도 실리지 않는다.
관련 자료 URL은 사용자가 탭할 때 **OS 브라우저가** 열 뿐, 앱이 fetch하지 않는다(favicon도 안 가져온다 — PROJECT_SYSTEM §7).

---

## 2. 왜 Idea Vault 전용 서버가 없는가 — ✅ 확정 (LinkMemo 2026-08-14 판단 승계)

**common_server 그대로, 튜닝조차 불필요.** 1배포 N앱 설계라 앱 추가 = `apps` seed 1행이며, Idea Vault가 쓰는
v1 기능(bootstrap·문의)은 이미 배포·검증 완료다(LinkMemo가 2026-08-14 같은 경로로 붙어 프로덕션 E2E까지 실측).
별도 서버는 Supabase 무료 티어 한도(활성 2프로젝트 — 배구 + common)를 깨고 운영만 이중이 된다.

- 기둥 2(로컬 온리)가 기획의 정체성이다 — 서버가 생기는 순간 "not uploaded to our servers" 포지셔닝이 흐려진다.
- 조각이 전용 서버를 판 이유(E2EE 백업 저장 · AI 프록시)에 해당하는 기능이 Idea Vault엔 없다.
  로컬 백업/내보내기(미결정 #4)도 서버가 필요 없다.
- 공지·문의·점검 게이트는 이미 있는 common_server에 태우면 된다 — 한계비용 0.

## 3. 무엇을 어디에 두는가

| 데이터 | 위치 | 비고 |
|---|---|---|
| 프로젝트·노트·자료·카테고리·태그 | 기기 로컬(expo-sqlite) | 유일본. 손실 안내 필수(CLAUDE.md §6) |
| 필터/정렬 상태·언어·(다크 모드) 설정 | 기기 로컬(AsyncStorage via zustand persist) | |
| 기기 subject deviceId · 세션 토큰 | 기기 로컬(SecureStore) | 미결정 #3 채택 시. 무작위 UUID — 개인정보 아님 |
| 광고 제거 구매 상태 | 스토어(진실) + 로컬 캐시 | 조회 실패에 캐시를 지우지 않는다 |
| 공지·점검·버전 게이트 | common_server DB | 앱은 읽기만 |
| 공지 읽음 여부 | 기기 로컬(AsyncStorage) | 서버에 읽음 테이블을 두지 않는다(common 규약) |
| 문의 | common_server DB | platform·appVersion만 동봉. IP는 레이트리밋 키로만 쓰고 버림 |

## 4. 신원 — 로그인은 없다 (기기 토큰은 미결정)

- 구글/애플 로그인·계정 없음(CLAUDE.md §4). Play "계정 삭제 URL" 요건 해당 없음.
- 문의 귀속 방식(CLAUDE.md §14 미결정 #3):

| | (a) 완전 익명 단방향 | (b) 기기 subject — **제안** |
|---|---|---|
| 흐름 | `sendInquiry()`만 | 최초 문의 진입 시 UUID 생성(SecureStore) → `registerDevice()` → 세션 → 이후 문의 자동 귀속 → `fetchMyInquiries()` |
| 사용자가 보는 것 | 보냈다는 확인만 | 문의 목록·상태(접수됨/답변 완료/해결됨)·답변 본문 |
| 서버가 아는 것 | platform·appVersion | + 무작위 UUID(이메일·이름 없음) |
| 한계 | 답변을 볼 길이 없다 | 앱 삭제·기기 변경 시 연결 끊김(화면에 고지) |
| 서버 준비 | 완료 | 완료(2026-08-14 `POST /v1/devices` 배포·LinkMemo E2E 실측, SDK 2026-08-14) |

  (b)를 택해도 **계정이 아니다** — 사용자는 아무것도 입력하지 않는다. LinkMemo가 사용자 요구("답변이 보여야 한다")로
  (a)→(b)로 바꾼 이력이 있어 처음부터 (b)를 제안한다.

---

## 5. common_server 연동 계약

절차 정본은 `common_server/docs/ONBOARDING.md`("새 앱 붙이기") — **위에서 아래로, 확인 명령 출력을 증거로.**

### 5.1 시작 전 확정값

| 항목 | 값 | 변경 가능? |
|---|---|---|
| `app_code` | **`ideavault` 제안**(CLAUDE.md §14 미결정 #1 — 앱 최종명과 함께 확정) | ❌ 등록 후 사실상 불가 |
| 표시 이름 | Idea Vault | ✅ 콘솔에서 |
| 로그인 | **없음** | ✅ 나중에 추가 가능(subject는 덧붙이는 구조) |
| 구독 | **없음** (일회성 IAP뿐 · 서버 무관) | ✅ |

### 5.2 연동 순서 (ONBOARDING 승계 — 로그인·구독 절 건너뜀)

1. **앱 등록(서버)**: `node --env-file=.env.local tools/seed.ts ideavault "Idea Vault"` →
   확인: `curl "https://common-server.vercel.app/api/v1/bootstrap?app=ideavault&platform=android&appVersion=0.1.0"` **200**
   (404 = 미등록/비활성. "했다"가 아니라 출력을 남긴다)
2. **SDK 복사(앱)**: `common_server/client/{index,types}.ts` → `lib/common-server/`. 복사본 상단에 `SDK_VERSION` 주석
   (현재 `2026-08-14`). **수정 금지, 갱신은 재복사.** 확인: `BASE_URL=... APP=ideavault node tools/_dv_sdk.ts`
3. **부팅 게이트(앱)**: `fetchBootstrap()` 1회. **실패해도 앱을 막지 않는다** — 로컬 앱이 서버 때문에 못 열리면
   기둥 2 위반. 성공 시에만: 점검 화면 / min 미만 강제 업데이트 / latest 미만 소프트 안내 / 공지 배지.
   ⚠ **차단 화면에 반드시 출구를 둔다** — 스토어 URL이 비어 있으면 안내문이라도(my_word 실제 사고).
4. **문의(앱)**: `sendInquiry(category, content)`. 본문 5~2000자, 24h 앱별 캡(기본 30) 초과 시 `rate-limited`.
   (b) 채택 시 전송 전 `registerDevice(uuid)`로 세션 확보(실패하면 익명 폴백 — LinkMemo 방식).
5. **디스코드 알림(서버·선택)**: `DISCORD_TICKET_WEBHOOK_URL_IDEAVAULT` env + **재배포** —
   연동 전 과정에서 유일하게 재배포가 필요한 지점. 없으면 "문의는 들어오는데 알림만 없는" 상태다(고장 아님).
   ⚠ LinkMemo 등록 때 `.env.local` 마지막 줄 무개행 + append로 `SESSION_JWT_SECRET`이 오염된 사고가 있었다 —
   env 추가 전 파일 끝 개행을 확인한다.

### 5.3 반드시 지킬 것 (common 핸드오프 규약 승계)

- bootstrap 게이트는 **서버 응답으로만** 판정 — 앱 로컬 신뢰 금지.
- SDK 모듈은 **throw 하지 않는다** — 실패를 타입으로 반환.
- 고정(pinned) 공지 홈 팝업은 LinkMemo가 2026-08-17 추가한 앱 쪽 규칙(서버 변경 없음) — Idea Vault도 같은 규칙으로
  가려면 "전면 광고 종료 후·메인 포커스 중·안 읽은 pinned만 1회". 기획서엔 없으므로 채택 여부는 구현 시 결정.
- 서버 세션에 상태를 넘길 때는 확인 명령의 **출력을 붙여넣는다**(ONBOARDING §9 표).

---

## 6. 구현 현황

| 항목 | 상태 |
|---|---|
| `apps`에 `ideavault` 등록 | ❌ — app_code 확정 후 |
| SDK 복사 | ❌ |
| 부팅 게이트 | ❌ |
| 공지 화면 + 읽음 배지 | ❌ |
| 문의 화면(+ 기기 subject·내역) | ❌ — 방식 미결정 #3 |
| 디스코드 웹훅 env | ❌ |

## 7. 열린 질문

- app_code(#1) · 문의 귀속 방식(#3) — CLAUDE.md §14. 확정되면 여기와 §5.1을 갱신한다.
