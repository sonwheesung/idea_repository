import { randomUUID } from 'expo-crypto';
import * as SQLite from 'expo-sqlite';

import { POOLS } from '@/db/ideation-pool';

// 마이그레이션 규약: 배열에 추가만 한다(Expand-only). 상세는 docs/DATABASE.md.
// v1 — projects · categories · tags · project_tags · notes · resources + 기본 카테고리 7종 시드
// v2 — projects.approach(발상 방식, 2026-08-18 — docs/IDEATION_SYSTEM.md §7)
// v3 — ideation_words(발상 단어, 언어별 내장 시드 + 사용자 CRUD, 2026-08-19 — docs/DATABASE.md §2.2)
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
  (database) => {
    database.execSync(
      `ALTER TABLE projects ADD COLUMN approach TEXT NOT NULL DEFAULT 'none'
         CHECK (approach IN ('combine','improve','problem','whatif','other','none'))`,
    );
  },
  (database) => {
    database.execSync(`
CREATE TABLE ideation_words (
  id         TEXT PRIMARY KEY,
  lang       TEXT NOT NULL,
  group_key  TEXT NOT NULL,
  word       TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (lang, word COLLATE NOCASE)
);
CREATE INDEX idx_ideation_words_lang ON ideation_words(lang, group_key);`);
    seedIdeationWords(database, null);
  },
];

/**
 * 내장 단어 시드 — `lang`이 null이면 모든 언어(v3 마이그레이션), 아니면 그 언어만("기본 단어 복원").
 * 내장 단어도 일반 행 — 특별 취급 없음(IDEATION_SYSTEM §3.5). 삽입 순서 = 풀 순서(rowid로 보존).
 */
export function seedIdeationWords(database: SQLite.SQLiteDatabase, lang: string | null): void {
  const now = Date.now();
  const stmt = database.prepareSync(
    'INSERT OR IGNORE INTO ideation_words (id, lang, group_key, word, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
  );
  try {
    for (const [poolLang, pool] of Object.entries(POOLS)) {
      if (lang && poolLang !== lang) continue;
      for (const g of pool.groups)
        for (const w of g.words) stmt.executeSync([randomUUID(), poolLang, g.key, w, now, now]);
    }
  } finally {
    stmt.finalizeSync();
  }
}

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
