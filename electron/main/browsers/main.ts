import { BrowserWindow, nativeTheme, protocol  } from 'electron'
import path from 'node:path'
import { WINDOW_WIDTH, WINDOW_HEIGHT, WINDOW_MIN_HEIGHT, WINDOW_MIN_WIDTH } from '../common/constant'
import { __static, __dirname, RENDERER_DIST, VITE_DEV_SERVER_URL } from '../common/constant'

export default () => {

  const init = async () => {
    createWindow();
    // require('@electron/remote/main').enable(win.webContents);
  };

  let win: BrowserWindow | null = null
  const preload = path.join(__dirname, '../preload/index.mjs')
  const indexHtml = path.join(RENDERER_DIST, 'index.html')

  const createWindow = async () => {
    win = new BrowserWindow({
      height: WINDOW_HEIGHT,
      minHeight: WINDOW_MIN_HEIGHT,
      width: WINDOW_WIDTH,
      minWidth: WINDOW_MIN_WIDTH,
      useContentSize: true,
      resizable: true,
      frame: true,
      title: 'Qiko Now',
      autoHideMenuBar: true,
      show: true,
      skipTaskbar: false,
      backgroundColor: nativeTheme.shouldUseDarkColors ? '#1c1c28' : '#fff',
      webPreferences: {
        webSecurity: false,
        backgroundThrottling: false,
        contextIsolation: true,
        webviewTag: true,
        nodeIntegration: false,
        preload: preload,
        spellcheck: false,
      },
    });
    win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": ["default-src 'self'; script-src 'self' 'unsafe-eval';"]
        }
      });
    });
    if (VITE_DEV_SERVER_URL) { // #298
      win.loadURL(VITE_DEV_SERVER_URL)
      // Open devTool if the app is not packaged
      win.webContents.openDevTools()
    } else {
      win.loadFile(indexHtml)
    }
    protocol.interceptFileProtocol('image', (req, callback) => {
      const url = req.url.substr(8);
      callback(decodeURI(url));
    });
    win.on('closed', () => {
      win = undefined;
    });

    win.on('show', () => {
      win.webContents.executeJavaScript(
        `window.qiko && window.qiko.hooks && typeof window.qiko.hooks.onShow === "function" && window.qiko.hooks.onShow()`
      );
      // versonHandler.checkUpdate();
      // win.webContents.openDevTools();
    });

    win.on('hide', () => {
      win.webContents.executeJavaScript(
        `window.qiko && window.qiko.hooks && typeof window.qiko.hooks.onHide === "function" && window.qiko.hooks.onHide()`
      );
    });

    // 判断失焦是否隐藏
    // win.on('blur', async () => {
    //   win.hide();
    // });
  };

  const getWindow = () => win;

  return {
    init,
    getWindow,
  };
};
// const require = createRequire(import.meta.url)
// const __dirname = path.dirname(fileURLToPath(import.meta.url))

// // Import iohook-raub in the main process where Node.js globals are available
// let iohook: any = null;
// let hmc: any = null
// try {
//   iohook = require('iohook-raub');
//   hmc = require('hmc-win32');
// } catch (error) {
//   console.error('Failed to load iohook-raub:', error);
// }

// // The built directory structure
// //
// // ├─┬ dist-electron
// // │ ├─┬ main
// // │ │ └── index.js    > Electron-Main
// // │ └─┬ preload
// // │   └── index.mjs   > Preload-Scripts
// // ├─┬ dist
// // │ └── index.html    > Electron-Renderer
// //
// process.env.APP_ROOT = path.join(__dirname, '../..')

// export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
// export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
// export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

// process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
//   ? path.join(process.env.APP_ROOT, 'public')
//   : RENDERER_DIST

// // Disable GPU Acceleration for Windows 7
// if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// // Set application name for Windows 10+ notifications
// if (process.platform === 'win32') app.setAppUserModelId(app.getName())

// if (!app.requestSingleInstanceLock()) {
//   app.quit()
//   process.exit(0)
// }

// let win: BrowserWindow | null = null
// const preload = path.join(__dirname, '../preload/index.mjs')
// const indexHtml = path.join(RENDERER_DIST, 'index.html')

// async function createWindow() {
//   win = new BrowserWindow({
//     title: 'Main window',
//     icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
//     webPreferences: {
//       webSecurity: false,
//       backgroundThrottling: false,
//       contextIsolation: true,
//       webviewTag: true,
//       nodeIntegration: false,
//       spellcheck: false,
//       preload,
//       // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
//       // nodeIntegration: true,

//       // Consider using contextBridge.exposeInMainWorld
//       // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
//       // contextIsolation: false,
//     },
//   })

//   if (VITE_DEV_SERVER_URL) { // #298
//     win.loadURL(VITE_DEV_SERVER_URL)
//     // Open devTool if the app is not packaged
//     win.webContents.openDevTools()
//   } else {
//     win.loadFile(indexHtml)
//   }

//   // Test actively push message to the Electron-Renderer
//   win.webContents.on('did-finish-load', () => {
//     win?.webContents.send('main-process-message', new Date().toLocaleString())
//   })

//   // Make all links open with the browser, not with the application
//   win.webContents.setWindowOpenHandler(({ url }) => {
//     if (url.startsWith('https:')) shell.openExternal(url)
//     return { action: 'deny' }
//   })
//   // win.webContents.on('will-navigate', (event, url) => { }) #344
// }

// // Setup iohook event listeners
// function setupIohook() {
//   if (!iohook) {
//     console.warn('iohook-raub not available');
//     return;
//   }

//   iohook.on('keydown', (msg: any) => {
//     console.log('keydown', msg);
//     // Send keyboard events to renderer process
//     if (win) {
//       win.webContents.send('iohook-keydown', msg);
//     }
//   });

//   iohook.on('mousewheel', (msg: any) => {
//     console.log('mousewheel', msg);
//     if (win) {
//       win.webContents.send('iohook-mousewheel', msg);
//     }
//   });

//   iohook.on('mousedrag', () => {
//     console.log('mousedrag');
//     if (win) {
//       win.webContents.send('iohook-mousedrag');
//     }
//   });

//   iohook.on('mousedown', (msg: any) => {
//     console.log('mousedown', msg);
//     if (win) {
//       win.webContents.send('iohook-mousedown', msg);
//     }
//   });

//   iohook.on('mouseup', (msg: any) => {
//     console.log('mouseup', msg);
//     if (win) {
//       win.webContents.send('iohook-mouseup', msg);
//     }
//   });

//   // Start listening for events
//   iohook.start();
// }

// app.whenReady().then(() => {
//   createWindow();
//   setupIohook();
// })

// app.on('window-all-closed', () => {
//   win = null
//   if (process.platform !== 'darwin') app.quit()
// })

// app.on('second-instance', () => {
//   if (win) {
//     // Focus on the main window if the user tried to open another
//     if (win.isMinimized()) win.restore()
//     win.focus()
//   }
// })

// app.on('activate', () => {
//   const allWindows = BrowserWindow.getAllWindows()
//   if (allWindows.length) {
//     allWindows[0].focus()
//   } else {
//     createWindow()
//   }
// })

// // New window example arg: new windows url
// ipcMain.handle('open-win', (_, arg) => {
//   const childWindow = new BrowserWindow({
//     webPreferences: {
//       preload,
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   })

//   if (VITE_DEV_SERVER_URL) {
//     childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
//   } else {
//     childWindow.loadFile(indexHtml, { hash: arg })
//   }
// })
