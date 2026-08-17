import { randomUUID } from 'expo-crypto';
import * as SQLite from 'expo-sqlite';

// 마이그레이션 규약: 배열에 추가만 한다(Expand-only). 상세는 docs/DATABASE.md.
// v1 — projects · categories · tags · project_tags · notes · resources + 기본 카테고리 7종 시드
const V1_SCHEMA = `
CREATE TABLE categories (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL COLLATE NOCASE UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE projects (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
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
  start_date      TEXT,
  target_end_date TEXT,
  created_at      INTEGER NOT NULL,
  updated_at      INTEGER NOT NULL
);
CREATE INDEX idx_projects_updated  ON projects(updated_at DESC);
CREATE INDEX idx_projects_status   ON projects(status);
CREATE INDEX idx_projects_category ON projects(category_id);

CREATE TABLE tags (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL COLLATE NOCASE UNIQUE,
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
  title       TEXT,
  url         TEXT NOT NULL,
  description TEXT,
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE INDEX idx_resources_project ON resources(project_id, created_at);
`;

// 기본 카테고리 — 영어 그대로, 일반 데이터 행 (CLAUDE.md §8). v1 시드 1회, 지운 것은 재생성하지 않는다.
const DEFAULT_CATEGORIES = ['App', 'Game', 'Web', 'Service', 'Business', 'Content', 'Other'];

type Migration = (database: SQLite.SQLiteDatabase) => void;

const MIGRATIONS: Migration[] = [
  (database) => {
    database.execSync(V1_SCHEMA);
    const now = Date.now();
    const stmt = database.prepareSync(
      'INSERT INTO categories (id, name, sort_order, created_at) VALUES (?, ?, ?, ?)',
    );
    try {
      DEFAULT_CATEGORIES.forEach((name, i) => stmt.executeSync([randomUUID(), name, i, now]));
    } finally {
      stmt.finalizeSync();
    }
  },
];

let db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (db) return db;
  const opened = SQLite.openDatabaseSync('idearepository.db');
  opened.execSync('PRAGMA foreign_keys = ON'); // SQLite 기본 OFF — CASCADE·SET NULL이 이 줄에 달려 있다
  migrate(opened);
  db = opened;
  return opened;
}

function migrate(database: SQLite.SQLiteDatabase) {
  const row = database.getFirstSync<{ user_version: number }>('PRAGMA user_version');
  const current = row?.user_version ?? 0;
  for (let v = current; v < MIGRATIONS.length; v++) {
    database.withTransactionSync(() => {
      MIGRATIONS[v](database);
      database.execSync(`PRAGMA user_version = ${v + 1}`);
    });
  }
}
