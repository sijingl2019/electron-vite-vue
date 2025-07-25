import { createRequire } from 'node:module'
import { screen } from 'electron';
import commonConst from './commonConst';
import log from './log';
import winDll from './winDll';
const require = createRequire(import.meta.url)
const iohook = require('iohook-raub');
const hmc = require('hmc-win32');
class CursorMonitor {
    private panelInstance: any;
    private windowName: string;
    private windowPopPanel: string;
    private startX: any;
    private startY: any;
    private preX: any;
    private preY: any;
    private isDragged = false;
    private currentProductName = `QikoNow.exe`;
    private exclude_apps = new Set([
        'snipaste.exe',
        'pixpin.exe',
        'screentool.exe',
        'pwsh.exe',
        'cmd.exe',
        'tabby.exe',
        'xshell.exe',
        'termius.exe',
        'windterm.exe',
        'windowsterminal.exe',
        'mobaxterm.exe',
        'putty.exe',
        'securecrt.exe',
        // 'word.exe',
        // 'onenote.exe',
        'ksolaunch.exe',
        'mstsc.exe',
        'sunloginclient.exe',
        'electron.exe',
        'explorer.exe',
        this.currentProductName,
      ]);
    constructor(pannel: any) {
        this.panelInstance = pannel;
        this.init();
    }
    init() {
        // iohook.on('keydown', (msg) => {
        //     // log.info(msg);
        //     // if (msg.ctrlKey && (msg.keycode === 29 || msg.keycode === 46)) {
        //     //   if (msg.keycode === 46) {
        //     //     ctrlC = true;
        //     //   }
        //     //   return;
        //     // }
        //     log.info('keydown', msg);
        //     this.windowName = hmc.getPointWindowName();
          
        //     if (this.windowName && this.windowName !== 'electron.exe' && this.windowName.toLowerCase() !== this.currentProductName) {
        //       this.windowPopPanel = this.windowName;
        //       this.closeQikoPanel()
        //     }
        //   });
          
          iohook.on('mousewheel', (msg) => {
            this.windowName = hmc.getPointWindowName();
            if (this.windowName && this.windowName !== 'electron.exe' && this.windowName.toLowerCase() !== this.currentProductName) {
              this.closeQikoPanel();
            }
          });
          
          iohook.on('mousedrag', () => {
            // log.info('mousedrag', isDragged);
            this.isDragged = true;
          });
          
          iohook.on('mousedown', (msg) => {
            this.windowName = hmc.getPointWindowName();
            // log.info('windowName', windowName);
            // startClick = Date.now();
            this.startX = msg.x;
            this.startY = msg.y;
            this.isDragged = false;
          });
          
          iohook.on('mouseup', async (msg) => {
            // currentWindow = window.qiko.getPointWindow();
            // 不处理的工具
            if (this.exclude_apps.has(this.windowName.toLowerCase())) {
              this.isDragged = false;
              // ctrlC = false;
              return;
            }
            // log.info('mouseup', msg);
            // const endClick = Date.now();
            const endX = msg.x;
            const endY = msg.y;
            const nid = this.isDragged;
            this.isDragged = false;
            log.info('msg.clicks', msg.clicks, nid, this.windowName);
            if (msg.clicks >= 2 || nid) {
              if (msg.clicks >= 2) {
                const width = Math.abs(endX - (this.preX || endX));
                const height = Math.abs(endY - (this.preY || endY));
                if (width > 10 || height > 10) {
                  log.info('假双击', msg.clicks, this.preX, this.preY, endX, endY, width, height);
                  return;
                }
                this.preX = null;
                this.preY = null;
              }
          
              // 拖拽/双击标题栏或滚动条
              // const rect = currentWindow?.rect;
              // if (rect) {
              //   // log.info('rect', startX, startY, rect);
              //   // log.info('distance', `startY - rect.top: ${startY - rect.top}, rect.left - rect.width - startX: ${rect.left - rect.width - startX}, rect.top + Math.abs(rect.height) - endY: ${rect.top + Math.abs(rect.height) - endY}`);
              //   if (startY - rect.top <= 40 || rect.left + rect.width - startX <= 10 || endX <= 40 || rect.top + Math.abs(rect.height) - endY <= 8) {
              //     log.info('拖拽标题栏或滚动条');
              //     return;
              //   }
              // }
              await this.showQikoPanel({
                clicks: msg.clicks,
                // interval: endClick - startClick,
                isDragged: nid,
                endX: endX,
                endY: endY,
                startX: this.startX,
                startY: this.startY,
              })
            } else {
              this.preX = endX;
              this.preY = endY;
              this.closeQikoPanel();
            }
            // ctrlC = false;
          });
          
        //   ipcRenderer.on('forbid-current-app', async (event: any, arg) => {
        //     if (this.windowPopPanel) {
        //       this.exclude_apps.add(this.windowPopPanel.toLowerCase());
        //       ipcRenderer.sendSync('msg-trigger', {
        //         type: 'forbidApp',
        //         name: this.windowPopPanel,
        //       });
        //     }
        //   });
          
        //   ipcRenderer.on('reopen-app', async (event: any, name) => {
        //     this.exclude_apps.delete(name);
        //   });
          
        //   const config: any = localConfig.getConfig();
        //   if (config.perf.common.autoOpenPanel) {
        //     log.info('Hook started.');
        //     iohook.start();
        //   } else {
        //     log.info('Hook stopped.');
        //     iohook.stop();
        //   }
          
        //   if (config.panelForbidApps) {
        //     config.panelForbidApps.forEach((item) => {
        //       this.exclude_apps.add(item.code);
        //     });
        //   }
    }

    public async showQikoPanel(arg: {clicks: any, isDragged: boolean, startX: number, startY: number, endX: number, endY: number, manual?: boolean}) {
        const clicks = arg.clicks;
        // const interval = arg.interval;
        const startX = arg.startX;
        const startY = arg.startY;
        const endX = arg.endX;
        const endY = arg.endY;
        const isDragged = arg.isDragged;
        const manual = arg.manual;

        // log.info('arg: ', arg)
        const win = this.panelInstance.getWindow();
        try {
        // 执行模拟复制
        // const copyResult = await this.simulateCopy(clipboard);
        const copyResult = winDll.get_text();
        const currentCopyText = copyResult;
        log.debug(`get selection text: ${copyResult}`);
        if (copyResult && copyResult.trim()) {
            if (!manual) {
            if (clicks === 2 && copyResult[copyResult.length] === '\n') {
                return;
            }
            if ((isDragged || clicks === 2) 
                && copyResult[copyResult.length-1] === '\n'
                && copyResult.indexOf('\n') === copyResult.length - 1) {
                return;
            }
            }
            await this.panelInstance.loadUrl(copyResult);
            let x = startX < endX ? startX : endX;
            let y = startY;
            this.panelInstance.setCursorPos({x, y});
            let winWidth = this.panelInstance.getOriWidth();
            if (winWidth == 0) {
                winWidth = win.getSize()[0] || 332;
            }
            let winHeight = this.panelInstance.getOriHeight();
            if (winHeight == 0) {
                winHeight = win.getSize()[1] || 42;
            }

            const primaryScreen = screen.getDisplayNearestPoint({x: x, y: y});
            const { width: pscreenWidth, height: pscreenHeight, x: screenX } = primaryScreen.workArea;
            const scaleFactor = primaryScreen.scaleFactor;
            const {screenWidth, screenHeight} = {screenWidth: pscreenWidth * scaleFactor, screenHeight: pscreenHeight * scaleFactor}
            // 检查窗口是否超出屏幕边界，并进行调整
            // if (x - screenX + winWidth > screenWidth * scaleFactor ) {
            //   x = screenX + screenWidth * scaleFactor - winWidth;
            // }

            // if ((y + winHeight + 10) / scaleFactor > screenHeight) {
            //   y = screenHeight * scaleFactor - winHeight;
            // }
            if (x - screenX + winWidth * scaleFactor > screenWidth) {
                x = screenX + screenWidth - winWidth * scaleFactor;
            }

            if (y + winHeight * scaleFactor > screenHeight) {
                y = screenHeight - winHeight * scaleFactor;
            }
            const pos = this.getPos(screen, { x: x, y: y + 10 });
            // 设置窗口始终在最上层
            win.setAlwaysOnTop(true, 'screen-saver');
            // log.info('x, y, w, h', x, y, win.getSize());
            win.setPosition(parseInt(pos.x), parseInt(pos.y));
            // 显示窗口但保持原应用焦点
            win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

            if (manual) {
                win.show();
            } else {
                win.showInactive();
            }
            // win.webContents.send('reset-select-text', { selectText: copyResult });
        }
        } catch (error) {
            console.error('showQikoPanel error:', error);
        }
    }

    public closeQikoPanel() {
        this.panelInstance.hideWindow();
        // win && win.setPosition(-1000, -1000);
    }

    getPos(screen, point) {
        return commonConst.macOS() ? point : screen.screenToDipPoint({x: point.x, y: point.y});
    }

    startMonitor() {
        iohook.start();
    }

    stopMonitor() {
        iohook.stop();
    }
}

export default CursorMonitor;
