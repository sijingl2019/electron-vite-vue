export {};

declare global {
  interface Window {
    QIKONOWConfig: any;
    resetSize: (height: number, width: number, initWidth: number, initHeight: number) => void;
    hideContent: () => boolean;
    qikoNowLogin: () => void;
    callRpa: (data: any) => void;
    getZeroTrustSettings: () => any;
    qikoNowOpenQiko: (url: string) => void;
    qikoNowForbidCurrent: () => void;
    qikoNowForbidGlobal: () => void;
  }
}

const { ipcRenderer } = require('electron');
const ipcSendSync = (type, data) => {
  const returnValue = ipcRenderer.sendSync('msg-trigger', {
    type,
    data,
  });
  if (returnValue instanceof Error) throw returnValue;
  return returnValue;
};
// window.addEventListener('DOMContentLoaded', () => {
//   const observer = new MutationObserver(() => {
//     const body = document.body;
//     const html = document.documentElement;
//     const width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
//     const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
//     // console.log('width', width, 'height', height);
//     const tabElement = document.querySelector('.qk-plugin-tab');
//     const tabWidth = tabElement?.offsetWidth || 0;
//     const tabHeight = tabElement?.offsetHeight || 0;

    
//     const contentElement = document.querySelector('.qk-plugin-content');
//     const contentWidth = contentElement?.offsetWidth || 0;
//     const contentHeight = contentElement?.offsetHeight || 0;
//     // 发送消息到主进程以调整窗口大小
//     ipcRenderer.send('adjust-window-size', { width, height, tabWidth, tabHeight, contentWidth, contentHeight });
//   });
//   observer.observe(document.body, { childList: true, subtree: true });
// });

// const dbdata = ipcSendSync('dbGet', { id: 'qiko-localhost-config' });
const dbdata = {}
console.log('dbdata', dbdata);
const defaultConfig = dbdata?.data || {};
const qiko_server = defaultConfig.qiko_server? defaultConfig.qiko_server.replace(/\/+$/, '') : 'https://chat.qkos.cn';
const qiko_plus_server = defaultConfig.qiko_plus_server? defaultConfig.qiko_plus_server.replace(/\/+$/, '') : 'https://agent.qkos.cn';
const dataset_select_options = defaultConfig.dataset_select_options? defaultConfig.dataset_select_options : ['qiko', 'qiko+'];
const qiko_now_server = defaultConfig.qiko_now_server? defaultConfig.qiko_now_server.replace(/\/+$/, '') : 'https://chat.qkos.cn/fsnode';


window.QIKONOWConfig = {
  host: qiko_server,
  jumpHost: qiko_server,
  deepseekId: defaultConfig.deepseek_id || 'fde60fa3-9f54-4a30-a17c-9979fb6c406c',
  qikoPlusHost: qiko_plus_server,
  qikoNowHost: qiko_now_server,
  datasetSelectOptions: dataset_select_options,
  qikoName: 'Qiko',
  qikoPlusName: 'Qiko+',
};

window.resetSize = (height, width, initWidth, initHeight) => {
  ipcRenderer.send('panel-reset-size', { width: width || 0, height: height || 0, initWidth: initWidth || 0, initHeight: initHeight || 56 });
};

window.hideContent = () => {
  const contentElement = document.querySelector('.qk-plugin-content');
  if (contentElement) {
    contentElement.style.display = 'none';
    return true;
  }
  return false;
};

window.qikoNowLogin = () => {
  ipcRenderer.send('msg-trigger', {
    // type: 'showQikoWindow'
    type: 'showQikoWindowDetach',
    isLogin: true,
  });
};

window.open = (url?: string | URL, target?: string, features?: string) => {
  window.qikoNowLogin();
  return null
};

window.callRpa = (data) => {
  ipcRenderer.send('msg-trigger', {
    type: 'dispatchRpaEvent',
    data: data,
  });
};

window.getZeroTrustSettings = () => {
  return ipcSendSync('getZeroTrustSettings', {});
};

window.qikoNowOpenQiko = (url) => {
  ipcRenderer.send('msg-trigger', {
    // type: 'showQikoWindo',
    type: 'showQikoWindowDetach',
    url,
  });
};

window.qikoNowForbidCurrent = () => {
  ipcRenderer.send('msg-trigger', {
    type: 'forbidCurrent',
  });
};

window.qikoNowForbidGlobal = () => {
  ipcRenderer.send('msg-trigger', {
    type: 'forbidGlobal',
  });
};