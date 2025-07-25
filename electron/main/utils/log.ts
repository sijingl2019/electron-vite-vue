import { createRequire } from 'node:module'
import commonConst from './commonConst'
const require = createRequire(import.meta.url)

const log = require('electron-log');
log.transports.file.fileName = 'main.log';
log.transports.console.level = commonConst.dev() ? 'debug' : 'info';

export default log;