import { LocalDb } from '../core';
import log from '../utils/log';

const dbInstance = new LocalDb();
dbInstance.init();

export default class ConifgDBInstance {
  readonly docMaxByteLength = 2 * 1024 * 1024; // 2MB
  readonly docAttachmentMaxByteLength = 20 * 1024 * 1024; // 20MB

  public async dbPut({ data }) {
    try {
      const config = await dbInstance.sqliteGet('SELECT * FROM configs WHERE id = ?', data.id);
      log.info('fetch config', config);
      if (config) {
        await dbInstance.sqliteDbRun('UPDATE configs SET data = ? WHERE id = ?', [JSON.stringify(data.data), data.id]); // 更新
      } else {
        await dbInstance.sqliteDbRun('INSERT INTO configs (id, data) VALUES (?, ?)', [data.id, JSON.stringify(data.data)]); // 插入
      }
      return data
    } catch (e: any) {
      return { id: data.id, name: e.name, error: !0, message: e.message };
    };
  }

  public async dbGet({ data }) {
    const config = await dbInstance.sqliteGet('SELECT * FROM configs WHERE id = ?', data.id);
    return (config && config.data) ? JSON.parse(config.data) : null;
  }

  public async dbRemove({ data }) {
    return await dbInstance.sqliteDbRun('DELETE FROM configs WHERE id = ?', [data.id]);
  }

  public async dbBulkDocs({ data }) {
    return await dbInstance.sqliteDbTransaction('INSERT INTO configs (id, data) VALUES (?, ?)', data.docs);
  }

  public async dbAllDocs() {
    return await dbInstance.sqliteDbRun('SELECT * FROM configs', []);
  }

  public async dbPostAttachment({ data }) {
    const { id, attachment } = data;
    const buffer = Buffer.from(attachment);
    if (buffer.byteLength > this.docAttachmentMaxByteLength)
      return {
        error: true,
        name: 'exception',
        message: 'attachment data up to ' + this.docAttachmentMaxByteLength / 1024 / 1024 + 'M'
      };
    await dbInstance.sqliteDbRun('INSERT INTO configs (id, attachments) VALUES (?, ?)', [id, attachment]);
    return data;
  }

  public async dbGetAttachment({ data }) {
    const config = await dbInstance.sqliteGet('SELECT * FROM configs WHERE id = ?', data.id);
    return config ? config.attachments : null;
  }
}
