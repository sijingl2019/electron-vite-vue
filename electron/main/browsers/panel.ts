import { BrowserWindow, ipcMain, screen } from 'electron';
import path from 'node:path';
import { createRequire } from 'node:module'
import { __static, __dirname } from '../common/constant'
import log from '../utils/log'
import commonConst from '../utils/commonConst';
const require = createRequire(import.meta.url)
function getPos(screen, point) {
  return commonConst.macOS() ? point : screen.screenToDipPoint({x: point.x, y: point.y});
}
export default () => {
  let oriWidth = 332;
  let oriHeight = 42;
  let win: any;
  let currentVersion = getRandomInt(1, 1000000);
  let cursorX = 0;
  let cursorY = 0;
  let panelServer: any;
  const preload = path.join(__dirname, '../preload/panel.mjs')
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const init = async () => {
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
    panelServer = panelApp.listen(19875, () => {
      console.log('Panel Server is running on port 19875');
    });

    if (win === null || win === undefined) {
      createWindow();

      ipcMain.on("panel-reset-size", (event, { width, height, initWidth, initHeight  }) => {
          // console.log('size', width, height, initWidth, initHeight, win.getSize());
          width = parseInt(width) + 8;
          height = parseInt(height);
          if (height < initHeight) {
            height = initHeight;
          }

          if (width > initWidth || height > initHeight) {
            win.setSize(width, height + initHeight);
          }
          if (332 <= width) {
            oriWidth = width;
          }

          // const [x, y] = win.getPosition();
          const {x, y} = {x: cursorX, y: cursorY};
          // console.log('pos', x, y);
          const primaryScreen = screen.getDisplayNearestPoint({x: x, y: y});
          const { width: pscreenWidth, height: pscreenHeight, x: screenX } = primaryScreen.workArea;
          const scaleFactor = primaryScreen.scaleFactor;
          const {screenWidth, screenHeight} = {screenWidth: pscreenWidth * scaleFactor, screenHeight: pscreenHeight * scaleFactor}

          let newX = x;
          let newY = y;
          // if ((x - screenX) / scaleFactor + width * scaleFactor > screenWidth) {
          //   newX = screenX + (screenWidth - width) * scaleFactor;
          // }

          // if ((y + height) / scaleFactor > screenHeight) {
          //   newY = screenHeight * scaleFactor - height;
          // }
          if (x - screenX + width * scaleFactor > screenWidth) {
            newX = screenX + screenWidth - width * scaleFactor;
          }

          if (y + height * scaleFactor > screenHeight) {
            newY = screenHeight - height * scaleFactor;
            // console.log(`y: ${y}, newY: ${newY}, height: ${height}, scaleFactor: ${scaleFactor}, screenHeight: ${screenHeight}, screenWidth: ${screenWidth}`);
          }
          if (newX != x || newY != y) {
            // win.setPosition(Math.floor(newX), Math.floor(newY))
            // log.debug('reset pos', pos);
            const pos = getPos(screen, { x: newX, y: newY });
            win.setPosition(parseInt(pos.x), parseInt(pos.y));
          }
      });
    }
  };

  const createWindow = async () => {
    win = new BrowserWindow({
      frame: false,
      autoHideMenuBar: true,
      width: 332,
      height: 42,
      show: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      focusable: true,
      transparent: true, // 设置窗口背景透明
      webPreferences: {
        contextIsolation: false,
        webviewTag: true,
        webSecurity: false,
        backgroundThrottling: false,
        nodeIntegration: true,
        preload: preload,
      },
    });
    // win.webContents.openDevTools({ 'mode' : 'detach' })  
    win.on("closed", () => {
      win = undefined;
    });
    // 打包后，失焦隐藏
    win.on("blur", () => {
      win.hide();
    });
  };

  const loadUrl = async (text) => {
    const url = `http://localhost:19875#/page/QZeroTrustPlugin?value=${text}}&qikoToken=${(currentVersion++ % 1000000)}`;
    // const url = 'https://www.baidu.com'
    console.log(url);
    // win.loadURL('about:blank');
    // await new Promise(resolve => setTimeout(resolve, 5)) // 等待一点点时间
    win.loadURL(url);
  };

  const getWindow = () => win;

  const hideWindow = async () => {
    win.loadURL('about:blank');
    // await new Promise(resolve => setTimeout(resolve, 5))
    win.hide();
  };

  const getOriWidth = () => oriWidth;

  const getOriHeight = () => oriHeight;

  const setCursorPos = ({x, y}) => {
    cursorX = x;
    cursorY = y;
  }

  const destroy = () => {
    if (panelServer) {
      panelServer.close(() => {
        console.log('Panel Server has been stopped.');
      });
    }
  }

  return {
    init,
    getWindow,
    hideWindow,
    loadUrl,
    getOriWidth,
    getOriHeight,
    setCursorPos,
    destroy
  };
};
