import { app, BrowserWindow, shell, protocol, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { __dirname, __static, RENDERER_DIST, VITE_DEV_SERVER_URL } from './common/constant'
import { main } from './browsers/index';
import commonConst from './utils/commonConst'

const require = createRequire(import.meta.url)

// Import iohook-raub in the main process where Node.js globals are available
let iohook: any = null;
let hmc: any = null
try {
  iohook = require('iohook-raub');
  hmc = require('hmc-win32');
} catch (error) {
  console.error('Failed to load iohook-raub:', error);
}
// 以下变量设置放到common/constant.ts中
// const __dirname = path.dirname(fileURLToPath(import.meta.url))
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
  private systemPlugins: any;
  private panelServer: any;

  constructor() {
    protocol.registerSchemesAsPrivileged([
      { scheme: 'app', privileges: { secure: true, standard: true } },
    ]);
    this.windowCreator = main();
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
  }
  onReady() {
    const readyFunction = async () => {
      // checkVersion();
      // await localConfig.init();
      this.createWindow();
      const mainWindow = this.windowCreator.getWindow();
      // API.init(mainWindow);
      // createTray(this.windowCreator.getWindow());
      // registerHotKey(this.windowCreator.getWindow());
      // this.systemPlugins.triggerReadyHooks(
      //   Object.assign(electron, {
      //     mainWindow: this.windowCreator.getWindow(),
      //     API,
      //   })
      // );
      // 启动express服务， 监听19876端口
      const express = require('express');
      const cors = require('cors');
      const panelApp = express();
      panelApp.use(cors());
      console.log('__static: ', path.join(__static, './panel_detach'));
      panelApp.use(express.static(path.join(__static, './panel_detach')));
      panelApp.get('/test', (req, res) => {
        res.send('success');
      });
      this.panelServer = panelApp.listen(19875, () => {
        console.log('Panel Server is running on port 19876');
      });
      
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

    if (this.panelServer) {
      this.panelServer.close(() => {
        console.log('Panel Server has been stopped.');
      });
    }

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
