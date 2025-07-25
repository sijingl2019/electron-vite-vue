import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// let baseURL = 'http://172.21.43.254:3031/';
// let access_token = 'sk-807bd6f7db5641f68435bb80d4dedba7';
let baseURL = 'https://chat.qkos.cn/';
let access_token = 'sk-dc03257d22e3430bb52f1aa52758876a';
const translate_model = '7ec18dbc-27bb-4a8f-8f2d-24719bf2d4d2';
try {
  const dbdata = window.qikodb.get('qiko-localhost-config');
  baseURL = dbdata.data.qiko_server;
  access_token = dbdata.data.access_token;
} catch (e) {
  // ignore
}

const instance = axios.create({
  timeout: 4000,
  baseURL: baseURL || 'http://172.21.43.254:3031/',
  headers: {
    authorization: `Bearer ${
      access_token || 'sk-807bd6f7db5641f68435bb80d4dedba7'
    }`,
  },
});

const mcpServerInstance = axios.create({
  timeout: 1000,
  baseURL: 'https://mcpsvr.com/servers.json',
});


export default {
  async newChat(models: Array<string>, message: string) {
    const msgFirstId = uuidv4();
    const msgSecondId = uuidv4();
    const targetPath = 'api/v1/chats/new';
    const currentTimeMillis = Date.now();
    const currentSecond = Math.floor(currentTimeMillis / 1000);
    const res = await instance.post(targetPath, {
      chat: {
        id: '',
        title: '新对话',
        models: models,
        members: [],
        system: '',
        options: {},
        messages: [
          {
            id: msgFirstId,
            parentId: null,
            childrenIds: [ msgSecondId ],
            role: 'user',
            content: message,
            timestamp: currentSecond,
            models: models,
          },
          {
            parentId: msgFirstId,
            id: msgSecondId,
            childrenIds: [],
            role: 'assistant',
            content: '',
            model: models[0],
            userContext: null,
            timestamp: currentSecond,
          },
        ],
        history: {
          messages: {
            [msgFirstId]: {
              id: msgFirstId,
              parentId: null,
              childrenIds: [ msgSecondId ],
              role: 'user',
              content: message,
              timestamp: currentSecond,
              models: models
            },
            [msgSecondId]: {
              parentId: msgFirstId,
              id: msgSecondId,
              childrenIds: [],
              role: 'assistant',
              content: '',
              model: models[0],
              userContext: null,
              timestamp: currentSecond,
            },
          },
          currentId: msgSecondId,
        },
        tags: [],
        inputs: {},
        timestamp: currentTimeMillis,
      },
    });
    console.log('new result', res);
    return res.data;
  },

  async suggestPlugin(id: string, models: Array<string>, message: string, useStream = false, docs: Array<any> = []) {
    const targetPath = 'agent/chat-messages';
    return await instance.post(targetPath, {
      model: models[0],
      stream: useStream,
      inputs: {},
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      docs: docs,
      citations: false,
      chat_id: id,
    });
  },

  async doTranslate(chatId, message, type, sourceLanguage='', destLanguage='') {
    const targetPath = 'agent/chat-messages';
    const res = await instance.post(targetPath, {
      inputs: {
        source_language: sourceLanguage || '中文简体',
        target_language: destLanguage || '英语',
        application_type: type,
      },
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      translate_model,
      stream: false,
      citations: false,
      chat_id: chatId,
    });
    console.log('translate result', res);
    return res.data;
  },

  async sourceJudge(chatId, message) {
    return this.doTranslate(chatId, message, '找源端语言');
  },
  async translate(chatId, message, sourceLanguage, destLanguage) {
    return this.doTranslate(chatId, message, '文本翻译', sourceLanguage, destLanguage);
  },
  
  async getTotalMCPServers() {
    try {
      const res = await mcpServerInstance.get('');
      console.log('total servers:', res);
      return res && res.data || [];
    } catch(e) {
      return [];
    }
  },
};
