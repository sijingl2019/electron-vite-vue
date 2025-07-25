import { LocalDb } from '../core';
import { app } from 'electron';

const dbInstance = new LocalDb(app.getPath('userData'));
dbInstance.init();

export default class DBInstance {
  private DBKEY = 'QIKO_DB_DEFAULT';
  public async dbPut({ data }) {
    return dbInstance.put(this.DBKEY, data.data);
  }

  public dbGet({ data }) {
    return dbInstance.get(this.DBKEY, data.id);
  }

  public dbRemove({ data }) {
    return dbInstance.remove(this.DBKEY, data.doc);
  }

  public dbBulkDocs({ data }) {
    return dbInstance.bulkDocs(this.DBKEY, data.docs);
  }

  public dbAllDocs({ data }) {
    return dbInstance.allDocs(this.DBKEY, data.key);
  }

  public dbDump({ data }) {
    return dbInstance.dumpDb(data.target);
  }

  public dbImport({ data }) {
    return dbInstance.importDb(data.target);
  }

  public dbPostAttachment({ data }) {
    const { docId, attachment, type } = data;
    return dbInstance.postAttachment(this.DBKEY, docId, attachment, type);
  }

  public dbGetAttachment({ data }) {
    return dbInstance.getAttachment(this.DBKEY, data.docId);
  }

  public async dbGetAttachmentType({ data }) {
    const res: any = await this.dbGet(data.docId);
    if (!res || !res._attachments) return null;
    const result = res._attachments[0];
    return result ? result.content_type : null;
  }
}
