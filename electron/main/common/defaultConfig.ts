import { __static } from './constant';
export default {
  version: 7,
  perf: {
    custom: {
      theme: 'QIKO',
      primaryColor: '#355fc7',
      errorColor: '#ed6d46',
      warningColor: '#e5a84b',
      successColor: '#c0d695',
      infoColor: '#355fc7',
      logo: `file://${__static}/logo.png`,
      placeholder: '你好，Qiko！请输入模型关键词',
      username: 'Qiko',
      monitor: true,
    },
    shortCut: {
      showAndHidden: 'Option+R',
      openPanel: 'Option+T',
      separate: 'Ctrl+D',
      quit: 'Shift+Escape',
      capture: 'Ctrl+Shift+A',
    },
    common: {
      start: true,
      space: true,
      hideOnBlur: true,
      autoOpenPanel: true,
      autoPast: false,
      darkMode: false,
      guide: false,
      history: true,
      lang: 'zh-CN',
    },
    local: {
      search: true,
    },
  },
  loginInfo: {
    // accessToken: 'sk-dc03257d22e3430bb52f1aa52758876a',
    // accessToken: 'sk-dc03257d22e3430bb52f1aa52758876a',
    accessToken: '',
    appToken: '',
    userInfo: {},
  },
  global: [
    { key: 'Option+N', value: '对话' },
    { key: 'Option+U', value: '智能体宇宙' },
  ],
  panelForbidApps: [],
};
