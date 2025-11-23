import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbFile = path.join(process.cwd(), "data.db");
const migrationsDir = path.join(process.cwd(), "db", "migrations");

const db = new Database(dbFile);

db.exec(`
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    run_at TEXT NOT NULL
  );
`);

function runMigrations() {
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const alreadyRun = db.prepare("SELECT 1 FROM migrations WHERE name = ?").get(file);
    if (alreadyRun) continue;

    const fullPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(fullPath, "utf8");

    console.log(`Running migration: ${file}`);
    db.exec(sql);

    db.prepare("INSERT INTO migrations (name, run_at) VALUES (?, datetime('now'))")
      .run(file);
  }
}

runMigrations();

export default db;
