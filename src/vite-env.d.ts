/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer
}

declare global {
  interface Window {
    iohook: {
      onKeydown: (callback: (msg: any) => void) => void;
      onMousewheel: (callback: (msg: any) => void) => void;
      onMousedrag: (callback: () => void) => void;
      onMousedown: (callback: (msg: any) => void) => void;
      onMouseup: (callback: (msg: any) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}

export {}
