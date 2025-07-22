export default {
  linux(): boolean {
    return process.platform === 'linux';
  },
  macOS(): boolean {
    return process.platform === 'darwin';
  },
  windows(): boolean {
    return process.platform === 'win32';
  },
  production(): boolean {
    return process.env.VSCODE_DEBUG !== 'true';
  },
  dev(): boolean {
    return process.env.VSCODE_DEBUG === 'true';
  },
};
