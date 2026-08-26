# PROJECT_SYSTEM — 프로젝트·카테고리·태그·노트·자료·탐색 (도메인 정본)

> Idea Repository의 핵심 도메인. 정책 요약과 기둥은 [`../CLAUDE.md`](../CLAUDE.md) §5·§8, 여기는 상세.
> 2026-08-17 기획서 확정 내용을 옮긴 것 — ~~구현 0%~~ → 구현 현황표 참조(Phase 1~3 완료). 스키마는 [`DATABASE.md`](./DATABASE.md).

## 구현 현황

| 영역 | 상태 |
|---|---|
| 프로젝트 생성(이름만) · 상세 · 수정 · 삭제 | ✅ 2026-08-17 — 생성 · 상세(카드 탭) · 수정(공용 폼) · 삭제(카드 길게 / 상세 헤더) |
| 기본 정보(요약·설명·카테고리·태그) | ✅ 2026-08-17 — 생성/편집 공용 폼 |
| 아이디어 정보(문제점·목표·핵심 아이디어·타겟) | ✅ 2026-08-17 — 폼(여러 줄) + 상세 표시/플레이스홀더 |
| 진행 관리(진행률·상태·우선순위·시작일·마감일) | ✅ 2026-08-17 — 진행률 슬라이더(1%) · 날짜 피커(`YYYY-MM-DD` 저장) · 마감<시작 경고만 |
| 카테고리 관리(시드 7종 + CRUD + 삭제 시 처리) | ✅ 2026-08-17 — `app/categories.tsx`(설정 → 카테고리). 추가·이름 변경 다이얼로그(중복 NOCASE 거부), 삭제 시 사용 중이면 라디오 "없음으로 / 이동: 카테고리 목록" |
| 태그(자유 생성 · 자동완성 · 자동 정리) | ✅ 2026-08-17 — `components/tag-input.tsx` + `features/tags/api.ts`(replaceProjectTags 트랜잭션·고아 정리) |
| 아이디어 노트 CRUD | ✅ 2026-08-17 — 상세 인라인, 작성 순, 수정 시 '수정됨' 표기 |
| 관련 자료 CRUD + 외부 브라우저 | ✅ 2026-08-17 — `components/resource-dialog.tsx`, `features/resources/url.ts`(LinkMemo 정규화 승계) |
| 메인(카드 목록 · 검색 · 필터/정렬 시트) | ✅ 2026-08-17 Phase 3 · 2026-08-18 상태 칩 → 필터 시트 Select |
| 검색 9필드 | ✅ 2026-08-17 — `features/projects/query.ts` · 매치 힌트(§9.1) ✅ 2026-08-26 |
| 필터 3축 · 정렬 6종 | ✅ 2026-08-17 — 필터 시트(상태·카테고리·우선순위 Select — 2026-08-18) + 정렬 시트, `filter-store` persist |

---

## 1. 핵심 컨셉

> "아이디어를 프로젝트로 저장하고, 시간이 지나면서 필요한 정보를 덧붙여 발전시킨다."

```
AI Game Balancer                         ← 프로젝트명 (유일한 필수값)
 ├─ Summary   : Game balance analysis tool
 ├─ Category  : Game        Tags: #AI #Game
 ├─ Status    : In Progress   Progress: 35%   Priority: High
 ├─ Problem / Goal / Core Idea / Target User
 ├─ Start 2026-08-14 → Target End 2026-12-31
 ├─ Idea Notes
 │    Aug 14  MVP에서는 AI 기능을 넣지 않는다.
 │    Aug 20  프로젝트 평가 기능을 추가하면 좋을 것 같다.
 └─ Resources
      Google Trends — https://trends.google.com — 시장 조사 자료
```

일반 메모 앱과 달리 **하나의 프로젝트에 이 정보들이 구조적으로 연결**된다(기둥 4). Todo가 아니라
"내가 만들고 싶은 것"의 단위가 프로젝트다.

---

## 2. 프로젝트 생성 — 프로젝트명만 (기둥 1)

| 항목 | 필수 | 설명 |
|---|---|---|
| Project Name | **O** | 유일한 필수값. 앞뒤 공백 제거 후 1자 이상 |
| 그 외 15개 항목 | X | 한 줄 요약 · 설명 · 카테고리 · 태그 · 문제점 · 목표 · 핵심 아이디어 · 타겟 사용자 · 진행률 · 상태 · 우선순위 · 시작일 · 마감 예정일 · 노트 · 자료 |

### 생성 화면 (2026-08-17 위임 판단 — CLAUDE.md §14 I)

```
New Project
┌──────────────────────────────┐
│ Project name                 │   ← 자동 포커스, 키보드 즉시
└──────────────────────────────┘
▸ Add details (optional)          ← 펼치면 요약·카테고리·태그·상태·우선순위 …
                     [ Save ]
```

- 이름만 치고 Save → 저장 → **목록으로 복귀**, 새 카드가 맨 위(Recently Updated). 상세로 자동 이동하지 않는다 —
  "빠른 기록 후 다음 아이디어"가 기본 흐름. 발전은 카드를 탭해서.
- **폼 형태 = Label + input**(2026-08-17 사용자 지시): `TextField`(라벨 위, 입력 아래) · 선택형은 `Select`(라벨 + 현재 값 → 옵션 모달).
  ~~"Add details" 펼침 안에는 요약 · 설명 · 카테고리 · 상태 · 우선순위만~~ → **생성·편집이 같은 폼(`components/project-form.tsx`)을 쓰므로 펼침 안에 전 필드**(요약·설명·카테고리·태그 / 문제점·목표·핵심 아이디어·타겟 / 상태·우선순위·진행률·시작일·마감일)를 둔다(2026-08-17 Phase 2). 접혀 있으면 이름 1칸뿐이라 기둥 1은 그대로.
- 이름 필드에서 키보드 완료(엔터) = 저장.
- 저장 버튼은 스크롤 콘텐츠 마지막(고정 footer 아님). 키보드 가림은 `Screen scroll`이 처리(2026-08-17 실기기 지적 → 조각 방식 승계).
- 이름 중복은 **허용**한다(같은 이름의 다른 아이디어가 있을 수 있다 — LinkMemo의 URL 중복 차단과 다르다).
- 기본값: 진행률 0 · 상태 Idea · 우선순위 None · 카테고리 없음.

---

## 3. 프로젝트 필드

### 3.1 기본 정보

| 필드 | 형태 | 비고 |
|---|---|---|
| name | 한 줄 텍스트 | 필수 |
| summary | 한 줄 텍스트 | 카드에 표시 |
| description | 여러 줄 텍스트 | 길이 제한 없음(SQLite TEXT) |
| categoryId | 카테고리 1개 또는 없음 | §4 |
| tags | 0..N | §5 |

### 3.2 아이디어 정보

| 필드 | 뜻 | 예 |
|---|---|---|
| problem | 프로젝트가 해결하려는 문제 | Existing project management tools are not suitable for storing undeveloped ideas. |
| goal | 달성하고자 하는 목표 | Allow users to capture and develop ideas over time. |
| coreIdea | 핵심 아이디어와 해결 방법 | |
| targetUser | 누구를 위한 프로젝트인가 | Indie developers who frequently come up with new project ideas. |

전부 여러 줄 텍스트, 선택.

- **발상 방식(approach)** — `combine · improve · problem · whatif · other · none`(기본 `none`). 표시명 i18n `approach.*`. Idea 섹션 Select. 발상 도구([`IDEATION_SYSTEM.md`](./IDEATION_SYSTEM.md))가 채우거나 수동 선택. 상세엔 none이 아닐 때만 표시. 카드·필터·검색 대상 아님(2026-08-18).

### 3.3 진행 관리

| 필드 | 값 | 기본 | 비고 |
|---|---|---|---|
| progress | 0~100 정수 | 0 | 슬라이더(1% 단위) + 숫자 표시 `35%` + 바 `███████░░░░░░░`. **수동만** — 상태와 자동 연동 없음 |
| status | `idea` `planned` `in_progress` `on_hold` `cancelled` `completed` | `idea` | 표시명은 i18n(`status.idea` …). 순서 고정 |
| priority | `high` `medium` `low` `none` | `none` | 표시명은 i18n. 정렬 High→Medium→Low→None |
| startDate | `YYYY-MM-DD` 또는 null | null | 실제로 시작한 날짜 |
| targetEndDate | `YYYY-MM-DD` 또는 null | null | 목표 완료 날짜. startDate보다 앞이어도 **막지 않는다**(경고만 — 아이디어 단계의 일정은 느슨하다) |

상태 의미(기획서 §9.2): Idea=아이디어만 저장 · Planned=진행하기로 결정 · In Progress=진행 중 · On Hold=일시 중단 ·
Cancelled=진행하지 않기로 결정 · Completed=완료.

날짜 저장을 `YYYY-MM-DD` 문자열로 하는 이유는 CLAUDE.md §5 — 시간대 하루 밀림 방지. 표기는 dayjs + 기기 로케일
(`2026.08.14` / `08/14/2026` / `2026/08/14`).

---

## 4. 카테고리

프로젝트당 0 또는 1개. 사용자가 관리한다.

### 4.1 기본 카테고리 (첫 실행 시드)

`App` · `Game` · `Web` · `Service` · `Business` · `Content` · `Other` — **영어 그대로, 일반 데이터 행으로** 시드
(글로벌 대상. 번역하지 않는다 — 기획서 §6.1). 시드는 첫 실행(DB v1 마이그레이션) 시 1회.
기본 카테고리도 **수정·삭제 허용**(2026-08-17 확정 — 일반 행과 동일 취급). 지운 기본값은 재생성하지 않는다.

### 4.2 관리 화면 (Settings → Categories)

```
Categories
  App        ⋮
  Game       ⋮
  …
  Other      ⋮
+ Add Category
```

- 추가: 이름 1칸. 대소문자 무시 중복 거부(`category.duplicate`).
- 수정: 이름 변경. 프로젝트 쪽은 FK라 자동 반영.
- 순서: `sortOrder`(시드 순서 유지, 추가는 맨 아래). MVP는 수동 정렬 없음.
- 관리 화면 각 행에 사용 프로젝트 수를 표시한다(삭제 전에 영향 범위가 보이도록 — 2026-08-17 구현).

### 4.3 삭제 — 사용 중이면 선택지 (기획 확정)

```
Delete "AI"?
This category is used by 3 projects.

( ) Remove category from these projects   ← 프로젝트 categoryId = NULL
( ) Move them to:  [ Other ▾ ]            ← 다른 카테고리로 일괄 이동
                         [Cancel] [Delete]
```

- 사용 프로젝트 0개면 확인만 하고 삭제.
- 구현(2026-08-17): 이동이면 `UPDATE projects SET category_id=? WHERE category_id=?` 후 DELETE — 한 트랜잭션.
  없음이면 명시 `UPDATE … SET category_id = NULL`(FK SET NULL과 이중 안전). "이동" 목록은 중첩 Modal을 피하려고
  Select가 아니라 다이얼로그 안 라디오 목록으로 그린다. **카테고리 이동은 프로젝트 `updatedAt`을 갱신하지 않는다**(관리 작업 ≠ 아이디어 활동).

---

## 5. 태그

- 사용자가 자유 생성. 입력은 `#` 있든 없든 받고, **저장은 `#` 없이**, 표시는 `#AI`.
- 유일성: 대소문자 무시(`COLLATE NOCASE`). `ai`와 `AI`는 같은 태그.
- 입력 UX: 칩 입력. 타이핑 중 기존 태그 자동완성(prefix LIKE, 이미 고른 것 제외, 최대 8개). **공백·쉼표·엔터·포커스 아웃으로 확정.**
  ~~태그 안 공백은 안내하거나 거부~~ → **공백 = 구분자로 확정**(2026-08-17 구현): `Solo Developer`를 치면 `Solo`·`Developer` 두 태그가 된다
  (해시태그 입력의 일반 관행 — 별도 안내 문구 없음). 붙여넣기한 `#AI, #Mobile`도 같은 규칙으로 쪼개진다.
- **자동 정리**: 프로젝트에서 태그를 빼거나 프로젝트를 삭제해 사용처가 0이 되면 `tags` 행을 지운다(CLAUDE.md §14 G).
  자동완성에 유령 태그가 남지 않는다. 별도 "태그 관리" 화면은 MVP에 없다.

---

## 6. 아이디어 노트

프로젝트당 N개. **아이디어의 발전 과정을 시간순으로 기록**하는 용도.

| 필드 | 필수 | 비고 |
|---|---|---|
| content | O | 빈 노트는 저장하지 않는다 |
| createdAt / updatedAt | 자동 | 목록에 작성일 표시(`Aug 14`), 수정되면 수정일 병기 |

- 상세 화면의 Idea Notes 섹션에서 인라인 추가(입력창 + 추가). 노트 탭 → 수정/삭제.
- 정렬: **오래된 것이 위(작성 순)** — 발전 과정을 위에서 아래로 읽는다(기획서 §12 예시 순서). 최신이 맨 아래.
- 노트 추가/수정/삭제는 프로젝트 `updatedAt`을 갱신한다(CLAUDE.md §14 E).

---

## 7. 관련 자료

프로젝트당 N개. 외부 자료 링크.

| 필드 | 필수 | 비고 |
|---|---|---|
| url | **O** | `https://` 보정 + 호스트명 형태 검증(LinkMemo `features/sites/url.ts` 규칙 재사용). 네트워크 확인 안 함 |
| title | X | 미입력 시 도메인으로 자동 제안(`trends.google.com` → `Google Trends`는 못 만든다 — 알려진 도메인 표 없으면 `trends.google.com` 그대로) |
| description | X | 한 줄 |

- 탭 → `Linking.openURL`로 외부 기본 브라우저. 앱 내 WebView 없음. 실패 시 알림.
- favicon fetch **하지 않는다**(MVP) — 아이콘 없이 제목·도메인만. 필요해지면 LinkMemo 방식(사이트 직접 fetch)으로.
- 순서: 추가 순(createdAt). MVP 수동 정렬 없음.
- 추가/수정/삭제는 프로젝트 `updatedAt`을 갱신한다.

---

## 8. 메인 화면

```
Idea Repository
┌ Search ─────────────────────┐  [＋] [⚙]
└─────────────────────────────┘
[Filter ▾ Status · Category · Priority]  [Sort ▾ Recently Updated]     ← 상태 칩 줄 없음(2026-08-18)

┌─────────────────────────────┐
│ AI Game Balancer            │
│ Game balance analysis tool  │
│ In Progress       35%       │
│ ███████░░░░░░░              │
│ High · Game · #AI #Game     │
│ Updated Aug 14              │
└─────────────────────────────┘
…
[ Banner Ad ]                     ← 광고 미수신 시 자리 미점유
```

- 카드 = 이름 · 한 줄 요약(없으면 생략) · 상태 배지 · 진행률(숫자+바) · 우선순위 배지(None이면 생략) ·
  카테고리(없으면 생략) · 태그(최대 3개 + `+N`) · 마지막 수정일(로케일).
- 빈 목록: 첫 실행 안내 — 데이터 손실 안내(CLAUDE.md §6) + "Add your first idea" 유도.
- 검색 결과 0건 / 필터 결과 0건은 다른 문구(`search.empty` / `filter.empty`).
- **하드웨어 뒤로가기(Android) = 종료 확인**(2026-08-19 사용자 지시 "뒤로가기 누르니 그냥 닫히던데 confirm 추가"): 메인이 포커스된 상태에서 뒤로가기 → Alert(`home.exitTitle`·`home.exitBody`, 취소 / 종료) → 종료는 `BackHandler.exitApp()`. 메인 위에 시트·모달이 떠 있으면 그 모달의 `onRequestClose`가 먼저 먹는다(RN Modal 기본). 다른 화면(스택 위)에서는 평소대로 pop.

---

## 9. 검색

대상 9필드(기획서 §15): 프로젝트명 · 한 줄 요약 · 설명 · 문제점 · 목표 · 핵심 아이디어 · 타겟 사용자 · 아이디어 노트 · 태그.

- LIKE `%q%` (대소문자 무시). 250ms 디바운스(LinkMemo 승계).
- 노트·태그는 서브쿼리 EXISTS로 — 프로젝트 행이 중복되지 않게.
- `#`로 시작하는 질의는 `#`을 벗겨 태그명과 비교(다른 필드도 같이 본다 — 별도 모드 아님).
- 검색은 필터·정렬과 **동시에** 적용된다(검색 중에도 필터 유효).
- ~~매치된 필드 힌트("in notes")는 P1 — MVP는 카드만.~~ → **§9.1 Phase 11(2026-08-26 구현)**.

### 9.1 검색 매치 힌트 (2026-08-23 설계 — PLAN Phase 11)

- 검색어가 있을 때만, 카드 메타 줄 아래 12px muted 한 줄: `search.matchIn` — en "Found in: {{fields}}" / ko "일치: {{fields}}". `fields`는 걸린 필드 라벨을 " · "로 이은 문자열.
- 대상은 **카드에 안 보이는 필드만**: 설명 · 문제점 · 목표 · 핵심 아이디어 · 타겟 사용자 · 노트(6종). 이름·요약·태그·카테고리는 카드에 이미 보이므로 제외.
- 구현: `features/projects/query.ts`가 검색 시 SELECT에 `(p.description LIKE :like ESCAPE '\\') AS m_description` 등 5개 + `EXISTS(notes …) AS m_notes` 플래그를 붙여 `ProjectCard.matchedFields: MatchField[]`로 매핑(검색어 없으면 `[]`, 추가 비용 0). LIKE 조건은 WHERE와 같은 파라미터.
- 라벨은 기존 `project.description` … `project.notes` 키 재사용 — 새 키는 `search.matchIn` 하나.
- 엣지: 여러 필드 동시 매치 → 순서 고정(설명 → 문제점 → 목표 → 핵심 아이디어 → 타겟 → 노트). 힌트가 길어도 한 줄(`numberOfLines 1`).
- 구현(2026-08-17): 검색어는 **세션 한정**(저장 안 함), 250ms 디바운스, 툴바에 결과 개수 표시. 검색 0건 / 필터 0건 문구를 나누고 "검색·필터 초기화" 링크를 둔다.

## 10. 필터

| 축 | 값 | 기본 |
|---|---|---|
| 상태 | All · Idea · Planned · In Progress · On Hold · Cancelled · Completed (단일 선택) | All |
| 카테고리 | 없음 / 사용자가 등록한 모든 카테고리 (단일 선택) | 없음(전체) |
| 우선순위 | 없음 / High · Medium · Low · None (단일 선택) | 없음(전체) |

- 세 축 **AND**. 활성 필터 수(상태 포함)를 필터 버튼에 배지로.
- 필터 시트는 **상태·카테고리·우선순위 세 개의 `Select`**(라벨 + 현재 값 → 옵션 시트)로 그린다 — ~~메인의 상태 칩 줄 + 시트 안 칩 그룹~~ → 2026-08-18 사용자 지시("필터에 넣고 select로")로 통일. 시트(Modal) 위에 OptionSheet(Modal)가 겹쳐 뜨는 구조(RN 중첩 Modal — Android·iOS 모두 지원). 저장된 카테고리 필터의 카테고리가 삭제되면 자동 해제.
- 칩(`Chip`)은 이제 어디에도 쓰지 않는다 — 태그 입력의 칩은 `TagInput` 자체 스타일.
- 필터·정렬 상태는 zustand persist로 유지(CLAUDE.md §14 J). "Reset" 한 번으로 전부 초기화.

## 11. 정렬

| 키 | 방향 | SQL 요지 |
|---|---|---|
| Recently Updated(기본) | 최신 먼저 | `updated_at DESC` |
| Recently Created | 최신 먼저 | `created_at DESC` |
| Name | A→Z | `name COLLATE NOCASE ASC` — 한글·영문 혼합의 로케일 정렬이 필요하면 JS `localeCompare`로 후처리 |
| Progress | 높은 것 먼저 | `progress DESC, updated_at DESC` |
| Target End Date | 가까운 것 먼저, **없는 것은 맨 뒤** | `target_end_date IS NULL, target_end_date ASC` |
| Priority | High→Medium→Low→None | `CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 ELSE 3 END, updated_at DESC` |

---

## 12. 프로젝트 상세

기획서 §18 레이아웃. 위에서부터: 이름 · 상태 배지 · 우선순위 배지 · 진행률 → 한 줄 요약 · 설명 → 문제점 · 목표 ·
핵심 아이디어 · 타겟 사용자 → 시작일 · 마감 예정일 → Idea Notes → Related Resources.

- **모든 항목은 선택** — 비어 있는 항목은 **섹션 제목 + "Add …" 링크**로 표시한다(숨기지 않는다 —
  "여기에 이런 걸 채울 수 있다"가 발전을 유도한다. 2026-08-17 위임 판단. 숨김 옵션은 P1). 탭하면 편집 화면으로.
- 우상단 ✏️ → 편집 화면(전 필드 폼, modal). 🗑 → 삭제(확인: "노트 N개·자료 M개도 함께 삭제"). (2026-08-17 구현)
- 노트·자료는 상세 화면 안에서 인라인 추가/수정/삭제 — 편집 화면으로 가지 않는다.
- 하단 배너(광고) — 상세는 읽기 화면이라 허용(CLAUDE.md §7). 편집 화면엔 없음.

---

## 13. 엣지 케이스

| 상황 | 처리 |
|---|---|
| 이름을 공백만 입력 | 저장 거부(`project.nameRequired`) |
| 마감일 < 시작일 | 저장 허용, 경고 표기만 |
| 카테고리 삭제 중 사용 프로젝트 존재 | §4.3 선택지. 취소 가능 |
| 태그 대소문자 다른 중복 입력 | 기존 태그로 합쳐진다(NOCASE) |
| 자료 URL 형태 불량 | 저장 거부(`resource.invalidUrl`). 존재 여부는 확인 안 함(오프라인) |
| 프로젝트 삭제 | 노트·자료 CASCADE, 태그 연결 해제 → 고아 태그 정리 |
| 검색어에 `%`·`_` | LIKE 이스케이프 |
| 앱 첫 실행 | 카테고리 7종 시드, 프로젝트 0 → 빈 화면 안내 |
