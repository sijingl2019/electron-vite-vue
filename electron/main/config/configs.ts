import defaultLocalConfig from '../common/defaultConfig';
import DBInstance from '../common/db';
import { DB_IDS } from '../common/constant';

const db = new DBInstance();

class Config {
  private db_key: string;
  private default_config: any;
  constructor(db_key: string, default_config: any) {
    this.db_key = db_key;
    this.default_config = default_config;
  }

  async init(): Promise<any> {
    const localConfig: any = await db.dbGet({ data: { id: this.db_key } });
    if (
      !localConfig ||
      !localConfig.data ||
      localConfig.data.version !== this.default_config.version
    ) {
      const data: any = {
        _id: this.db_key,
        data: this.default_config,
      };
      if (localConfig && localConfig._rev) {
        data._rev = localConfig._rev;
      }
      await db.dbPut({
        data: { data },
      });
    }
  }

  async getConfig(): Promise<any> {
    const data: any =
      (await db.dbGet({ data: { id: this.db_key } })) || {};
    return data.data;
  }

  async setConfig(data) {
    const localConfig: any =
      (await db.dbGet({ data: { id: this.db_key } })) || {};
    await db.dbPut({
      data: {
        data: {
          _id: this.db_key,
          _rev: localConfig._rev,
          data: {
            ...localConfig.data,
            ...data,
          },
        },
      },
    });
  }
}

export default {
  localConfig: new Config(DB_IDS.LOCAL, defaultLocalConfig),
  localhostConfig: new Config(DB_IDS.LOCALHOST, {}),
}
