import { createApp } from 'vue'
import App from './App.vue'

import './style.css'

import './demos/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

// Listen for iohook events from main process
window.iohook?.onKeydown((msg) => {
  console.log('keydown from main process', msg);
});

window.iohook?.onMousewheel((msg) => {
  console.log('mousewheel from main process', msg);
});

window.iohook?.onMousedrag(() => {
  console.log('mousedrag from main process');
});

window.iohook?.onMousedown((msg) => {
  console.log('mousedown from main process', msg);
});

window.iohook?.onMouseup((msg) => {
  console.log('mouseup from main process', msg);
});

createApp(App)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
