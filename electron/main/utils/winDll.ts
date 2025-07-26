import path from 'path';
import log from './log'
import { createRequire } from 'node:module'
import commonConst from './commonConst'
import { __static } from '../common/constant'
const require = createRequire(import.meta.url)
const koffi = require('koffi');

// 加载动态库
// const libPath = process.platform === 'win32' ? path.join(__static, './dll/get_text.dll') : path.join(__static, './dll/get_text.so');
const exeDir = path.dirname(process.execPath);
const libPath =  commonConst.dev() ? path.join(__static, './dll/window_utils.dll') : ( 
  commonConst.windows() ? path.join(exeDir, './public/dll/window_utils.dll') : 
    path.join(exeDir, './public/dll/window_utils.so'));
log.info('libPath: ', libPath);
const lib = commonConst.windows() ? koffi.load(libPath) : null;

// 定义函数签名
const get_text = commonConst.windows() ? lib.func('get_text', 'str', []) : () => {return 'it is not implemented'};

export default {
  get_text
};
