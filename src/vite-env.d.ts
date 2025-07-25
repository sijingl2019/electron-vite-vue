/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer;
}

declare global {
  interface Window {
    ipcRenderer: {
      on: (channel: string, func: (...args: any[]) => void) => void;
      off: (channel: string, func?: (...args: any[]) => void) => void;
      send: (channel: string, ...args: any[]) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
    iohook: {
      onKeydown: (callback: (msg: any) => void) => void;
      onMousewheel: (callback: (msg: any) => void) => void;
      onMousedrag: (callback: () => void) => void;
      onMousedown: (callback: (msg: any) => void) => void;
      onMouseup: (callback: (msg: any) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
    qikodb: {
      put: (data) => any,
      get: (id) => any,
      remove: (doc) => any,
      bulkDocs: (docs) => any,
      allDocs: (key) => any,
      postAttachment: (docId, attachment, type) => any,
      getAttachment: (docId) => any,
      getAttachmentType: (docId) => any
    };
  }
}

export {}
