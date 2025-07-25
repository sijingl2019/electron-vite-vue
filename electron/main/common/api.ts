import {
  BrowserWindow,
  ipcMain,
  dialog,
  app,
  Notification,
  nativeImage,
  clipboard,
  screen,
  shell,
} from 'electron';
import fs from 'node:fs';
import os from 'node:os';
import plist from 'plist';
import DBInstance from './db';
import getWinPosition from './getWinPosition'
import commonConst from '../utils/commonConst';
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const log = require('electron-log')
const isMacOS = commonConst.macOS()
function getPos(screen, point) {
  return isMacOS ? point : screen.screenToDipPoint({x: point.x, y: point.y});
}
let currentCopyText = '';

class API extends DBInstance {
  async init(mainWindow: BrowserWindow) {
    // 响应 preload.js 事件
    ipcMain.on('msg-trigger', async (event, arg) => {
      const window = arg.winId ? BrowserWindow.fromId(arg.winId) : mainWindow;
      const data = await this[arg.type](arg, window, event);
      event.returnValue = data;
    });
  }

  public hideMainWindow(arg, window) {
    window.hide();
  }

  public showMainWindow(arg, window) {
    const { x: wx, y: wy } = getWinPosition.getPosition();
    window.setPosition(wx, wy);
    window.show();
  }

  public showOpenDialog({ data }, window) {
    return dialog.showOpenDialogSync(window, data);
  }

  public showSaveDialog({ data }, window) {
    return dialog.showSaveDialogSync(window, data);
  }

  public getPath({ data }) {
    return app.getPath(data.name);
  }

  public copyImage = ({ data }) => {
    const image = nativeImage.createFromDataURL(data.img);
    clipboard.writeImage(image);
  };

  public copyText({ data }) {
    clipboard.writeText(String(data.text));
    return true;
  }

  public readClipboardText() {
    return clipboard.readText();
  }

  public copyFile({ data }) {
    if (data.file && fs.existsSync(data.file)) {
      clipboard.writeBuffer(
        'NSFilenamesPboardType',
        Buffer.from(plist.build([data.file]))
      );
      return true;
    }
    return false;
  }

  public getLocalId() {
    return encodeURIComponent(app.getPath('home'));
  }

  public shellShowItemInFolder({ data }) {
    shell.showItemInFolder(data.path);
    return true;
  }

  public async getFileIcon({ data }) {
    const nativeImage = await app.getFileIcon(data.path, { size: 'normal' });
    return nativeImage.toDataURL();
  }

  public shellBeep() {
    shell.beep();
    return true;
  }

  public addLocalStartPlugin({ data: { plugin } }, window) {
    window.webContents.executeJavaScript(
      `window.addLocalStartPlugin(${JSON.stringify({
        plugin,
      })})`
    );
  }

  public removeLocalStartPlugin({ data: { plugin } }, window) {
    window.webContents.executeJavaScript(
      `window.removeLocalStartPlugin(${JSON.stringify({
        plugin,
      })})`
    );
  }

  public async showQikoWindowDetach({ url, isLogin }) {
    const dbdata = await this.dbGet({
      data: {
        id: 'qiko-localhost-config',
      },
    });
    let qiko_server = url || dbdata?.data.qiko_server || 'https://chat.qkos.cn';
    if (isLogin) {
      qiko_server = `${qiko_server}/qikonowAuthorization`;
    }
    shell.openExternal(qiko_server);
  }

  public async dispatchRpaEvent({ data }) {
    const dbdata = await this.dbGet({
      data: {
        id: 'qiko-localhost-config',
      },
    });
    const qiko_server = dbdata?.data.qiko_server || 'https://chat.qkos.cn';
    shell.openExternal(`${qiko_server}/chain/page/#/page/qkex.RpaCall?${data}`);
  }

  public getCurrentCopyText() {
    return currentCopyText;
  }

  public async openExternal(arg) {
    shell.openExternal(arg.data.url);
  }

  public getProductName() {
    return "QikoNow";
  }
}

export default new API();
