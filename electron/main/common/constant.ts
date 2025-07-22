import { fileURLToPath } from 'node:url'
import path from 'node:path'

export const WINDOW_WIDTH = 800;
export const WINDOW_HEIGHT = 60;
export const WINDOW_PLUGIN_HEIGHT = 600;

export const GUIDE_WIDTH = 800;
export const GUIDE_HEIGHT = 600;

export const WINDOW_MIN_HEIGHT = 60;
export const CURSOR_IBEAM = "65543";
export const DECODE_KEY = {
    Backspace: 'Backspace',
    Tab: 'Tab',
    Enter: 'Enter',
    MediaPlayPause: 'MediaPlayPause',
    Escape: 'Escape',
    Space: 'Space',
    PageUp: 'PageUp',
    PageDown: 'PageDown',
    End: 'End',
    Home: 'Home',
    ArrowLeft: 'Left',
    ArrowUp: 'Up',
    ArrowRight: 'Right',
    ArrowDown: 'Down',
    PrintScreen: 'PrintScreen',
    Insert: 'Insert',
    Delete: 'Delete',
    Digit0: '0',
    Digit1: '1',
    Digit2: '2',
    Digit3: '3',
    Digit4: '4',
    Digit5: '5',
    Digit6: '6',
    Digit7: '7',
    Digit8: '8',
    Digit9: '9',
    KeyA: 'A',
    KeyB: 'B',
    KeyC: 'C',
    KeyD: 'D',
    KeyE: 'E',
    KeyF: 'F',
    KeyG: 'G',
    KeyH: 'H',
    KeyI: 'I',
    KeyJ: 'J',
    KeyK: 'K',
    KeyL: 'L',
    KeyM: 'M',
    KeyN: 'N',
    KeyO: 'O',
    KeyP: 'P',
    KeyQ: 'Q',
    KeyR: 'R',
    KeyS: 'S',
    KeyT: 'T',
    KeyU: 'U',
    KeyV: 'V',
    KeyW: 'W',
    KeyX: 'X',
    KeyY: 'Y',
    KeyZ: 'Z',
    F1: 'F1',
    F2: 'F2',
    F3: 'F3',
    F4: 'F4',
    F5: 'F5',
    F6: 'F6',
    F7: 'F7',
    F8: 'F8',
    F9: 'F9',
    F10: 'F10',
    F11: 'F11',
    F12: 'F12',
    Semicolon: ';',
    Equal: '=',
    Comma: ',',
    Minus: '-',
    Period: '.',
    Slash: '/',
    Backquote: '`',
    BracketLeft: '[',
    Backslash: '\\',
    BracketRight: ']',
    Quote: "'",
  };

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
export const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '../..')
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL
export const __static = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST
process.env.VITE_PUBLIC = __static