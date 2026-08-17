# DATABASE — expo-sqlite 스키마·마이그레이션 규약

> 로컬 데이터 정본. 개요는 [`../CLAUDE.md`](../CLAUDE.md) §5·§6, 도메인 규칙은 [`PROJECT_SYSTEM.md`](./PROJECT_SYSTEM.md).
> 작성 2026-08-17(문서 선행 — Phase 1 착수 전). LinkMemo `docs/DATABASE.md` 규약 승계.

## 구현 현황

| 영역 | 상태 |
|---|---|
| DB 오픈·마이그레이션 러너(`db/index.ts`) | ❌ |
| v1 스키마(projects·categories·tags·project_tags·notes·resources) + 카테고리 시드 | ❌ |

## 1. 규약 (LinkMemo 승계)

- **파일**: `idearepository.db` (expo-sqlite, sync API — 로컬 소량 데이터라 충분).
- **마이그레이션**: `PRAGMA user_version` 기반. `db/index.ts`의 `MIGRATIONS` 배열에 **추가만** 한다
  (Expand-only — 배포된 버전의 마이그레이션을 수정·삭제하면 기존 사용자 DB가 깨진다).
  각 마이그레이션은 트랜잭션으로 적용 후 user_version을 올린다.
- **id**: UUID 문자열(expo-crypto `randomUUID`). 정수 자동증가 금지 — 향후 내보내기/가져오기·병합 시 충돌 방지.
- **시각**: `created_at`·`updated_at`은 epoch ms 정수. **날짜(시작일·마감일)는 `YYYY-MM-DD` TEXT** — 시각·시간대 없음
  (CLAUDE.md §14 D). 표기 현지화는 UI 층(dayjs).
- **FK**: `PRAGMA foreign_keys = ON`을 오픈 시마다 켠다(SQLite 기본 OFF).
- 컬럼명 snake_case, TS 인터페이스 camelCase — 매핑은 쿼리 AS로.
- 상태·우선순위는 TEXT enum(`CHECK`) — 표시명은 i18n, DB엔 코드값만.

## 2. v1 스키마

```sql
CREATE TABLE categories (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL COLLATE NOCASE UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE projects (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,                     -- 유일한 필수값 (trim 후 1자 이상은 앱 층에서)
  summary         TEXT,
  description     TEXT,
  category_id     TEXT REFERENCES categories(id) ON DELETE SET NULL,
  problem         TEXT,
  goal            TEXT,
  core_idea       TEXT,
  target_user     TEXT,
  progress        INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  status          TEXT NOT NULL DEFAULT 'idea'
                  CHECK (status IN ('idea','planned','in_progress','on_hold','cancelled','completed')),
  priority        TEXT NOT NULL DEFAULT 'none'
                  CHECK (priority IN ('high','medium','low','none')),
  start_date      TEXT,                              -- 'YYYY-MM-DD' | NULL
  target_end_date TEXT,                              -- 'YYYY-MM-DD' | NULL
  created_at      INTEGER NOT NULL,
  updated_at      INTEGER NOT NULL
);
CREATE INDEX idx_projects_updated  ON projects(updated_at DESC);
CREATE INDEX idx_projects_status   ON projects(status);
CREATE INDEX idx_projects_category ON projects(category_id);

CREATE TABLE tags (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL COLLATE NOCASE UNIQUE,   -- '#' 없이 저장
  created_at INTEGER NOT NULL
);

CREATE TABLE project_tags (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag_id     TEXT NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);
CREATE INDEX idx_project_tags_tag ON project_tags(tag_id);

CREATE TABLE notes (
  id         TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX idx_notes_project ON notes(project_id, created_at);

CREATE TABLE resources (
  id          TEXT PRIMARY KEY,
  project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       TEXT,                                 -- NULL이면 UI가 도메인으로 대체 표시
  url         TEXT NOT NULL,                        -- 정규화된 URL (https:// 보정 후)
  description TEXT,
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE INDEX idx_resources_project ON resources(project_id, created_at);
```

### v1 시드 (같은 마이그레이션 안에서)

```sql
INSERT INTO categories (id, name, sort_order, created_at) VALUES
  (uuid, 'App', 0, now), (uuid, 'Game', 1, now), (uuid, 'Web', 2, now), (uuid, 'Service', 3, now),
  (uuid, 'Business', 4, now), (uuid, 'Content', 5, now), (uuid, 'Other', 6, now);
```

영어 그대로 — 번역하지 않는다(CLAUDE.md §8). 시드는 v1 마이그레이션에서 1회만; 사용자가 지운 기본 카테고리를
다시 만들어 주지 않는다.

## 3. 조회 패턴

- **메인 목록**(검색·필터·정렬 결합):

  ```sql
  SELECT p.*, c.name AS category_name
  FROM projects p LEFT JOIN categories c ON c.id = p.category_id
  WHERE (:status IS NULL OR p.status = :status)
    AND (:category IS NULL OR p.category_id = :category)
    AND (:priority IS NULL OR p.priority = :priority)
    AND (:q IS NULL
         OR p.name LIKE :like ESCAPE '\' OR p.summary LIKE :like ESCAPE '\' OR p.description LIKE :like ESCAPE '\'
         OR p.problem LIKE :like ESCAPE '\' OR p.goal LIKE :like ESCAPE '\' OR p.core_idea LIKE :like ESCAPE '\'
         OR p.target_user LIKE :like ESCAPE '\'
         OR EXISTS (SELECT 1 FROM notes n WHERE n.project_id = p.id AND n.content LIKE :like ESCAPE '\')
         OR EXISTS (SELECT 1 FROM project_tags pt JOIN tags t ON t.id = pt.tag_id
                    WHERE pt.project_id = p.id AND t.name LIKE :tagLike ESCAPE '\'))
  ORDER BY <정렬 키 — PROJECT_SYSTEM §11>
  ```

  카드의 태그는 목록 조회 후 `project_id IN (...)`로 한 번에 가져와 붙인다(N+1 회피).
- **태그 자동완성**: `SELECT name FROM tags WHERE name LIKE :prefix || '%' ORDER BY name LIMIT 10`.
- **카테고리 사용 수**(삭제 다이얼로그): `SELECT COUNT(*) FROM projects WHERE category_id = ?`.
- **고아 태그 정리**(태그 해제·프로젝트 삭제 후 같은 트랜잭션):
  `DELETE FROM tags WHERE id NOT IN (SELECT DISTINCT tag_id FROM project_tags)`.
- **프로젝트 updated_at 갱신**은 노트·자료·태그 변경 시에도 앱 층에서 명시적으로(트리거 대신 — 의도가 코드에 보이게).
- FTS는 데이터 규모상 불요. 필요해지면 마이그레이션으로 FTS5 가상 테이블 추가.

## 4. 주의

- **스키마 변경은 새 마이그레이션으로만.** 출시 후에는 조각·배구·LinkMemo와 같은 체인 규약(v1→vN 순차 적용, 최신 점프 금지).
- 삭제는 즉시 삭제(휴지통 없음 — MVP). 프로젝트 삭제 확인에 "노트 N개·자료 M개도 함께 삭제"를 명시한다.
- `CHECK` 제약이 있으므로 enum 값을 추가하려면 마이그레이션이 필요하다 — 상태·우선순위 사용자 정의는 MVP 범위 밖이라 감수.
- 백업/내보내기(CLAUDE.md §14 미결정 #4)를 하게 되면 UUID id 덕에 파일 병합이 가능하다 — 그래서 정수 id를 안 쓴다.
