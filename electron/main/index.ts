import { app, BrowserWindow, shell, protocol, ipcMain, session } from 'electron'
import path from 'node:path'
import os from 'node:os'
import { __dirname, __static } from './common/constant'
import { main, panel } from './browsers/index';
import commonConst from './utils/commonConst'
import CursorMonitor from './utils/cursorMonitor'

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)


// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

class App {
  public windowCreator: { init: () => void; getWindow: () => BrowserWindow };
  public panelWindowCreator: {
    init: () => void;
    getWindow: () => BrowserWindow;
    loadUrl: (url: string) => void;
    setCursorPos: (pos: {x: number, y: number}) => void;
    getOriWidth: () => number;
    getOriHeight: () => number;
    destroy: () => void;
  }
  public cursorMonitor: CursorMonitor;

  constructor() {
    protocol.registerSchemesAsPrivileged([
      { scheme: 'app', privileges: { secure: true, standard: true } },
    ]);
    this.windowCreator = main();
    this.panelWindowCreator = panel();
    this.cursorMonitor = new CursorMonitor(this.panelWindowCreator);
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.quit();
    } else {
      this.beforeReady();
      this.onReady();
      this.onRunning();
      this.onQuit();
    }
  }
  beforeReady() {
    // 系统托盘
    if (commonConst.macOS()) {
      // macBeforeOpen();
      if (commonConst.production() && !app.isInApplicationsFolder()) {
        app.moveToApplicationsFolder();
      } else {
        app.dock.hide();
      }
    } else {
      app.disableHardwareAcceleration();
    }
  }

  createWindow() {
    this.windowCreator.init();
    // this.panelWindowCreator.init();
    this.cursorMonitor.startMonitor();
  }
  onReady() {
    const readyFunction = async () => {
      // checkVersion();
      // await localConfig.init();
      
      this.createWindow();
      const mainWindow = this.windowCreator.getWindow();
      session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Content-Security-Policy': [
              "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'"
            ]
          }
        })
      })
      // API.init(mainWindow);
      // createTray(this.windowCreator.getWindow());
      // registerHotKey(this.windowCreator.getWindow());
      // this.systemPlugins.triggerReadyHooks(
      //   Object.assign(electron, {
      //     mainWindow: this.windowCreator.getWindow(),
      //     API,
      //   })
      // );
    };
    if (!app.isReady()) {
      app.on('ready', readyFunction);
    } else {
      readyFunction();
    }
  }

  onRunning() {
    app.on('second-instance', async (event, commandLine, workingDirectory) => {
      // const commandInfo = getCommandLineInfos(commandLine, workingDirectory);
      // const win = this.windowCreator.getWindow();
      // // 当运行第二个实例时,将会聚焦到myWindow这个窗口
      // // 如果有文件列表作为参数，说明是命令行启动
      // if (win) {
      //   if (win.isMinimized()) {
      //     win.restore();
      //   }
      //   win.focus();
      //   if (commandInfo.cmd !== 'login' && commandInfo.files.length > 0) {
      //     const { x: wx, y: wy } = winPosition.getPosition();
      //     win.setPosition(wx, wy);
      //     win.show();
      //     putFileToQiko(win.webContents, commandInfo.files, commandInfo.cmd);
      //   } else if (commandInfo.cmd === 'login') {
      //     console.log('token: ', commandInfo.token);
      //     await setQikoUserInfo(commandInfo.token)
      //     win.webContents.executeJavaScript(
      //       `window.qiko && window.qiko.openMenu && window.qiko.openMenu({ code: "settings" })`
      //     );
      //     const { x: wx, y: wy } = winPosition.getPosition();
      //     win.setPosition(wx, wy);
      //     win.show();
      //   }
      // }
    });
    app.on('activate', () => {
      if (!this.windowCreator.getWindow()) {
        this.createWindow();
      }
    });
    if (commonConst.windows()) {
      // app.setAppUserModelId(pkg.build.appId)
    }
  }

  onQuit() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('will-quit', () => {
      // globalShortcut.unregisterAll();
    });

    this.panelWindowCreator.destroy();

    if (commonConst.dev()) {
      if (process.platform === 'win32') {
        process.on('message', (data) => {
          if (data === 'graceful-exit') {
            app.quit();
          }
        });
      } else {
        process.on('SIGTERM', () => {
          app.quit();
        });
      }
    }
  }
}

export default new App();

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
