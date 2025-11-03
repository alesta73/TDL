import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initDB() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasklists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      date TEXT,
      FOREIGN KEY (list_id) REFERENCES lists(id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tasklist_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      FOREIGN KEY (tasklist_id) REFERENCES tasklists(id)
    );
  `);

  return db;
}
