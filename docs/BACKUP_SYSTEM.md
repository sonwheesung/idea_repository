# BACKUP_SYSTEM — 로컬 백업(내보내기·가져오기)

> 사용자의 모든 아이디어 데이터를 **기기 안에서 파일 하나로** 꺼내고(내보내기) 되돌리는(가져오기) 기능.
> 서버·클라우드·계정 없음 — 파일은 OS 공유 시트로 사용자가 고른 곳(Drive·Files·메일 …)에 놓이고, 앱은 그 뒤를 모른다.
> 결정 배경은 [`../CLAUDE.md`](../CLAUDE.md) §3 #23 · §14 P, 스키마는 [`DATABASE.md`](./DATABASE.md), 법무 문구는 [`LEGAL_SYSTEM.md`](./LEGAL_SYSTEM.md).
> 작성 2026-08-21(문서 선행 — 코드 착수 전). ~~MVP 제외·출시 후 P1 재검토(2026-08-17 미결정 #4)~~ → **2026-08-21 사용자 결정으로 착수·무료.**

## 구현 현황

| 영역 | 상태 |
|---|---|
| 문서(이 문서 · CLAUDE §3/§6/§14/§16 · README · DATABASE §4 · PLAN Phase 10 · 법무 문구) | ✅ 2026-08-21 |
| 패키지(expo-file-system · expo-sharing · expo-document-picker) | ❌ |
| `features/backup/{format,export,import,store}.ts` | ❌ |
| 화면 `/backup`(설정 행 → 내보내기 · 가져오기 · 마지막 내보내기) | ❌ |
| 에뮬레이터 실측(내보내기 → 공유 시트 · 가져오기 병합/교체 · 신규 설치 복원) | ❌ |

## 1. 결정 (2026-08-21 사용자)

| 결정 | 내용 · 근거 |
|---|---|
| **무료** — Remove Ads에 묶지 않는다 | 기둥 6 "무료 기능을 제한하지 않는다 · Remove Ads는 기능 해제가 아니다"(§7.1 구독/Pro/기능 해제 없음) 유지. 포지션 "Your device. Yours"와 기획서 §24 "사용자가 자기 데이터를 직접 관리한다"에 **자기 데이터를 꺼내는 데 돈을 받는 것**이 정면충돌. 백업은 수익원이 아니라 **이탈 방지 장치**(손실 경고만 있고 대책이 없던 구멍) — 정착 → 광고 누적 → 구매 전환이 순서. 묶어도 증분 매출은 헤비 유저(어차피 살 층)뿐. ⚠ **재검토 조건**: AdMob 계정 정지가 영구화돼 "광고 + Remove Ads" BM 자체를 다시 짤 때만(MONETIZATION_SYSTEM §3.1) |
| 서버 업로드 🚫 · 클라우드 동기화 🚫 | 기둥 2. 파일은 사용자 손에(기획서 §24 원칙 그대로) |
| 형식 = **JSON 한 파일**, 평문 | 단순·검증 가능·다른 도구로도 읽힌다. **암호화 없음(v1)** — 비밀번호 분실 = 영구 손실이라 첫 버전에선 넣지 않는다. 화면에서 "파일에 모든 아이디어가 그대로 들어 있다 — 안전한 곳에 보관"을 고지(§6). 암호화 옵션은 후보(§8) |
| 내보내기 = **OS 공유 시트** | expo-sharing. 저장 위치 선택·권한·SAF 처리를 OS에 맡긴다. 앱은 임시 파일을 캐시에 쓰고 공유가 끝나면 지운다 |
| 가져오기 = **파일 선택 → 미리보기 → 병합 / 교체** | expo-document-picker. 교체는 파괴적이라 2단계 확인. 전부 한 트랜잭션 — 중간 실패 시 아무것도 바뀌지 않는다 |
| 범위 = 사용자 콘텐츠 7테이블 | 아래 §2. 설정(테마·언어·필터)·웰컴 표시 여부·광고 동의·기기 subject·구매 캐시는 **제외**(기기 환경값이지 아이디어 데이터가 아니다. 구매는 스토어가 진실) |
| 자동 백업·알림 🚫 | MVP 제외 목록(알림/리마인더)과 같은 선. 설정 행에 **마지막 내보내기 날짜**만 보여 스스로 챙기게 한다 |

## 2. 파일 형식 (formatVersion 1)

```jsonc
{
  "format": "idearepository-backup",   // 고정 식별자 — 다른 JSON을 잘못 고르면 여기서 거른다
  "formatVersion": 1,                  // 파일 형식 버전(아래 표). 읽는 쪽이 모르는 값이면 거부
  "dbVersion": 3,                      // 내보낸 앱의 PRAGMA user_version — 읽는 앱보다 크면 "앱 업데이트 필요"
  "app": { "version": "1.0.4", "platform": "android" },
  "exportedAt": "2026-08-21T05:12:00.000Z",
  "counts": { "projects": 12, "notes": 30, "resources": 8, "categories": 7, "tags": 15, "ideationWords": 362 },
  "data": {
    "categories":    [ { "id", "name", "sort_order", "created_at" } ],
    "projects":      [ { /* projects 행 그대로 (snake_case, v3 컬럼 전부) */ } ],
    "tags":          [ { "id", "name", "created_at" } ],
    "projectTags":   [ { "project_id", "tag_id" } ],
    "notes":         [ { "id", "project_id", "content", "created_at", "updated_at" } ],
    "resources":     [ { "id", "project_id", "title", "url", "description", "created_at", "updated_at" } ],
    "ideationWords": [ { "id", "lang", "group_key", "word", "created_at", "updated_at" } ]
  }
}
```

- 행은 **DB 행 그대로(snake_case)** — `SELECT *` 결과를 그대로 직렬화한다. 매핑 계층이 없어 누락이 없고, 스키마 문서(DATABASE.md)가 곧 파일 명세다.
- 파일명 `IdeaRepository-backup-YYYYMMDD-HHmm.json`(기기 로컬 시각). MIME `application/json`.
- `formatVersion`은 **구조가 바뀔 때만** 올린다. 컬럼 추가(DB 마이그레이션)만으로는 올리지 않는다 — 가져오기가 **알려진 컬럼만 골라 넣고 모르는 컬럼은 무시, 없는 컬럼은 DEFAULT**로 채우므로(§4.3) 구/신 앱 간 호환이 유지된다.
- 크기 상한 20MB(JSON 문자열 기준) — 그 위는 거부(메모리 보호). 텍스트 앱이라 실사용은 수 MB 이내.

## 3. 내보내기 (`features/backup/export.ts`)

```
설정 → 백업 → [내보내기]
 → 7테이블 SELECT * (한 읽기 트랜잭션) → JSON.stringify
 → 캐시 디렉터리에 파일 쓰기(expo-file-system)
 → Sharing.shareAsync(uri, { mimeType: 'application/json', dialogTitle })
 → 시트가 닫히면 임시 파일 삭제 → lastExportedAt 저장(AsyncStorage, zustand persist)
```

- 공유 시트 취소도 "내보내기 완료"로 치지 않는다 — `lastExportedAt`은 shareAsync가 **정상 반환**했을 때만 갱신(OS가 성공/취소를 구분해 주지 않으므로 "시트를 열었다" 기준. 화면 문구는 "마지막 내보내기" — 보관 보장이 아님).
- 공유 불가 기기(`Sharing.isAvailableAsync()` false)는 버튼을 비활성화하고 사유 표시.
- 프로젝트 0개여도 내보내기는 허용(단어 목록·카테고리만 있는 파일도 유효).

## 4. 가져오기 (`features/backup/import.ts`)

### 4.1 흐름

```
[가져오기] → DocumentPicker(application/json, 캐시 복사) → 읽기 → 검증(§4.2)
 → 미리보기 Alert: "프로젝트 N · 노트 N · 자료 N · 카테고리 N · 태그 N · 단어 N (2026-08-21 내보냄, v1.0.4)"
 → 방식 선택: [병합] [교체] [취소]
 → 교체면 2차 확인("현재 기기의 모든 데이터가 파일 내용으로 바뀝니다 — 되돌릴 수 없습니다")
 → 한 트랜잭션 적용(§4.3/§4.4) → 결과 Alert(추가·갱신·건너뜀 수) → 뒤로 가면 메인이 포커스 재조회
```

### 4.2 검증 — 하나라도 틀리면 거부(메시지 키 괄호)

| 검사 | 실패 키 |
|---|---|
| 크기 ≤ 20MB · JSON 파싱 | `backup.import.invalidFile` |
| `format === 'idearepository-backup'` | `backup.import.invalidFile` |
| `formatVersion` ≤ 앱이 아는 최대(1) | `backup.import.newerApp` |
| `dbVersion` ≤ 앱의 현재 user_version | `backup.import.newerApp` |
| `data.*` 7배열 존재 · 각 행 `id`(또는 project_tags의 두 키) 문자열 | `backup.import.invalidFile` |

enum(status·priority·approach)·progress 범위·FK는 **DB CHECK/FK에 맡긴다** — 위반 시 트랜잭션이 통째로 롤백되고 `backup.import.failed`.

### 4.3 병합(Merge) 규칙 — 기본 선택지

id = UUID라 충돌이 없다는 전제(DATABASE §1 — 정수 id를 안 쓴 이유).

| 테이블 | 같은 id 있음 | id 없음 |
|---|---|---|
| categories | 로컬 유지(이름 충돌 회피·updated_at 없음) | 같은 이름(NOCASE)이 있으면 **파일 id → 로컬 id로 재매핑**, 없으면 삽입(sort_order = 로컬 최대+1부터) |
| tags | 로컬 유지 | 같은 이름(NOCASE) 있으면 재매핑, 없으면 삽입 |
| projects | **`updated_at`이 파일 쪽이 더 크면 덮어쓰기**(전 컬럼), 아니면 로컬 유지 | 삽입 |
| project_tags | 프로젝트가 **삽입·덮어쓰기된 경우만** 파일의 태그 집합으로 교체(재매핑 적용). 로컬 유지된 프로젝트는 로컬 태그 유지 | — |
| notes · resources | 파일 `updated_at`이 더 크면 덮어쓰기 | 부모 프로젝트가 (병합 후) 존재할 때만 삽입 |
| ideation_words | 로컬 유지 | `(lang, word NOCASE)`가 이미 있으면 건너뜀, 없으면 삽입 |

- 컬럼 처리: 파일 행에서 **앱이 아는 컬럼만** 골라 INSERT/UPDATE. 모르는 컬럼 무시, 없는 컬럼은 DB DEFAULT(NOT NULL 무DEFAULT 컬럼이 빠진 행은 거부 → 롤백).
- 끝에 고아 태그 정리(`DELETE FROM tags WHERE id NOT IN (SELECT tag_id FROM project_tags)`).
- 프로젝트 `updated_at`은 **파일 값을 보존**한다(가져오기는 아이디어 활동이 아니다 — CLAUDE §14 E의 "활동" 정의와 일관. 카테고리 이동 때와 같은 원칙).

### 4.4 교체(Replace)

한 트랜잭션에서 `project_tags → notes → resources → projects → tags → categories → ideation_words` 순으로 **전부 DELETE** 후 파일 내용을 `categories → projects → tags → project_tags → notes → resources → ideation_words` 순으로 삽입. 필터 스토어의 카테고리 선택은 기존 규칙(삭제된 카테고리 자동 해제)이 처리.

## 5. 화면 `/backup` (설정 → 백업)

```
백업
┌────────────────────────────────────────────┐
│ 아이디어는 이 기기에만 저장됩니다.            │
│ 파일로 내보내 두면 기기를 바꾸거나 앱을       │
│ 다시 설치해도 되돌릴 수 있습니다.             │
└────────────────────────────────────────────┘
[ 파일로 내보내기 ]
  마지막 내보내기: 2026. 8. 21.   ← 없으면 "아직 없음"
[ 파일에서 가져오기 ]
⚠ 내보낸 파일에는 모든 아이디어가 그대로(암호화 없이) 들어 있습니다.
  안전한 곳에 보관하세요. 파일은 회사 서버로 전송되지 않습니다.
```

- 설정 화면 행: `settings.backup` 라벨 + 값 부제 = 마지막 내보내기 날짜(로케일 `ll`) 또는 "아직 없음" — 행 문법은 기존 `SettingRow` 그대로(§14 M).
- 버튼은 공용 `Button`, 진행 중엔 비활성 + 스피너. 광고 없음(설정 하위 — 배너는 메인·상세만).
- 홈 빈 화면·About의 데이터 손실 안내(`data.notice.loss`)에 한 문장 덧붙인다: "설정 → 백업에서 파일로 내보내 둘 수 있습니다." — 경고만 있고 대책이 없던 문구를 닫는다(LEGAL_SYSTEM §3 노출 지점 갱신).

## 6. 프라이버시·법무 (2026-08-21)

- 파일은 **앱이 만들고 OS 공유 시트가 전달**한다 — 회사는 파일을 받지도 보지도 않는다. Play 데이터 보안 선언 변경 없음(수집·공유 항목이 늘지 않는다).
- 약관 §3/제5조의 "현재 클라우드 백업·**내보내기**·동기화 기능은 제공하지 않는다"는 거짓이 된다 → "클라우드 백업·동기화는 없고, **설정의 백업(내보내기/가져오기)** 으로 만든 파일의 보관 책임은 이용자에게 있다"로 개정(5차). 처리방침 §2에 "내보낸 백업 파일은 기기에서 생성되며 이용자가 고른 곳으로만 전달된다"는 한 문장 추가(4차). 정본 `docs/legal/*.md` + `pages/*.tsx` → 배구 서버 재게시는 LEGAL_SYSTEM §5(사용자 확인 후 `vercel --prod`).
- 정직 규칙(CLAUDE §6): "백업하면 절대 안전"(X). 파일 분실·노출은 사용자 영역 — 화면 문구도 그 선을 지킨다.

## 7. i18n 키

`settings.backup` · `backup.title` · `backup.intro` · `backup.export` · `backup.import` · `backup.lastExport` · `backup.never` · `backup.caution` · `backup.shareUnavailable` · `backup.export.failed` · `backup.import.{preview,merge,replace,replaceConfirmTitle,replaceConfirmBody,done,failed,invalidFile,newerApp}` · `data.notice.backupHint`.

## 8. 제외 · 후보

- 🚫 서버/클라우드 백업 · 자동 주기 백업 · 리마인더 · 여러 기기 동기화.
- 후보(결정 없음): 비밀번호 암호화 옵션 · Markdown/CSV 내보내기(읽기 전용 공유용) · OS 자동 백업(Android Auto Backup) 명시 설정(현재 기본값 — 처리방침 §2가 고지).
