import path from 'node:path';
import fs from 'node:fs';
import log from '../../utils/log';
import * as sqlite from './sqlitedb';
import Database, { Statement } from 'better-sqlite3';
import { isOneDimensionalArray } from '../../utils/util';


import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export default class DB {
  private database: any;

  async init(): Promise<void> {
    this.database = sqlite.database;
  }

  public async sqliteDbAll(sql, params) {
    log.debug('db-all', sql, params);
    try {
      return this.database.prepare(sql).all(params);
    } catch (err: any) {
      log.error(err);
    }
  }

  public async sqliteDbRun(sql, params) {
    log.debug('db-run', sql, params);
    try {
      this.database.prepare(sql).run(params);
      return true;
    } catch (err: any) {
      log.error(err);
      return false;
    }
  }

  public async sqliteDbTransaction(sql, data: any[]) {
    log.debug('db-transaction', JSON.stringify(data, null, 2));
    const tasks: { statement: Statement; params: any[] }[] = [];
    for (const params of data) {
      tasks.push({
        statement: this.database.prepare(sql),
        params,
      });
    }
    return new Promise((resolve) => {
      try {
        this.database.transaction(() => {
          for (const { statement, params } of tasks) {
            if (isOneDimensionalArray(params)) {
              statement.run(params);
            } else {
              for (const param of params) {
                statement.run(param);
              }
            }
          }
        })();
        resolve(true);
      } catch (err: any) {
        log.error(err);
        resolve(false);
      }
    });
  }

  public async sqliteGet(sql, id) {
    log.debug('db-get', sql, id);
    try {
      return this.database.prepare(sql).get(id);
    } catch (err: any) {
      log.error(err);
    }
  }

}
