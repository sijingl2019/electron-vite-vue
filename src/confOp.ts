const LOCAL_CONFIG_KEY = 'qiko-local-config';

const localConfig = {
  getConfig(): Promise<any> {
    const data: any = window.qikodb.get(LOCAL_CONFIG_KEY) || {};
    return data.data;
  },

  setConfig(data: any) {
    const localConfig: any = window.qikodb.get(LOCAL_CONFIG_KEY) || {};
    window.qikodb.put({
      _id: LOCAL_CONFIG_KEY,
      _rev: localConfig._rev,
      data: {
        ...localConfig.data,
        ...data,
      },
    });
  },
};

export default localConfig;
