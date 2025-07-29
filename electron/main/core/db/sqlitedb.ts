/* eslint-disable no-console */
import Database, { Statement } from 'better-sqlite3';
import { app } from 'electron';
import log from '../../utils/log';
import path from 'path';

const dbPath = path.join(app.getPath('userData'), 'qikonow.db');
const database = new Database(dbPath);

function createTableConfigs() {
  database
    .prepare(
      `
  CREATE TABLE IF NOT EXISTS "configs" (
    "id" text(31) NOT NULL,
    "data" text,
    "attachments" blob,
    PRIMARY KEY ("id")
  )`,
    )
    .run();
}

function createTableChats() {
  database
    .prepare(
      `
  CREATE TABLE IF NOT EXISTS "chats" (
    "id" text(31) NOT NULL,
    "folderId" text(31),
    "name" text,
    "provider" text,
    "model" text,
    "systemMessage" text,
    "temperature" real,
    "topP" real,
    "maxTokens" integer,
    "stream" integer(1) DEFAULT 1,
    "maxCtxMessages" integer DEFAULT 10,
    "prompt" TEXT,
    "input" TEXT,
    "createdAt" integer,
    "isFavorite" integer(1) DEFAULT 0,
    PRIMARY KEY ("id")
  )`,
    )
    .run();
}

function createTableMessages() {
  database
    .prepare(
      `CREATE TABLE IF NOT EXISTS "messages" (
      "id" text(31) NOT NULL,
      "parentId" text(31),
      "content" TEXT COLLATE NOCASE,
      "generating" integer(1),
      "reasoning" TEXT,
      "inputTokens" integer,
      "outputTokens" integer,
      "chatId" text(31),
      "role" text(16),
      "model" text,
      "memo" text,
      "createdAt" integer,
      "citedFiles"	TEXT,
      "citedChunks"	TEXT,
      PRIMARY KEY ("id"),
      CONSTRAINT "fk_messages_chats" FOREIGN KEY ("chatId") REFERENCES "chats" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`,
    )
    .run();
}

const initDatabase = database.transaction(() => {
  log.debug('Init database...');
  database.pragma('foreign_keys = ON');
  createTableConfigs();
  createTableChats();
  createTableMessages();
  log.info('Database initialized.');
});

database.pragma('journal_mode = WAL'); // performance reason
initDatabase();

export { database };
