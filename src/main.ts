import { createApp } from 'vue'
import Vue3Lottie from 'vue3-lottie';
import {
  ConfigProvider,
  Button,
  Divider,
  Row,
  Col,
  Dropdown,
  Menu,
  Form,
  Input,
  Radio,
  Select,
  Switch,
  Avatar,
  Collapse,
  List,
  Tooltip,
  Alert,
  Drawer,
  Modal,
  Result,
  Spin,
} from 'ant-design-vue';
import App from './App.vue'
import router from './router/index';
import store from './store/index';
import 'ant-design-vue/dist/antd.variable.min.css';
import registerI18n from './languages/i18n';
import localConfig from './confOp';

import './style.css'

import './demos/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

// // Listen for iohook events from main process
// window.iohook?.onKeydown((msg) => {
//   console.log('keydown from main process', msg);
// });

// window.iohook?.onMousewheel((msg) => {
//   console.log('mousewheel from main process', msg);
// });

// window.iohook?.onMousedrag(() => {
//   console.log('mousedrag from main process');
// });

// window.iohook?.onMousedown((msg) => {
//   console.log('mousedown from main process', msg);
// });

// window.iohook?.onMouseup((msg) => {
//   console.log('mouseup from main process', msg);
// });

createApp(App)
  .use(registerI18n)
  .use(store)
  .use(Button)
  .use(Divider)
  .use(Row)
  .use(Col)
  .use(Dropdown)
  .use(Menu)
  .use(Form)
  .use(Input)
  .use(Radio)
  .use(Select)
  .use(Switch)
  .use(Avatar)
  .use(Collapse)
  .use(List)
  .use(Tooltip)
  .use(Alert)
  .use(Drawer)
  .use(Modal)
  .use(Result)
  .use(Spin)
  .use(router)
  .use(Vue3Lottie)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
