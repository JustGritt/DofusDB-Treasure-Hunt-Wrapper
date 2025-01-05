import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { BrowserWindow, app, ipcMain } from 'electron';
import { createWindowPositionStore, createWindowSizeStore } from './store.js';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let win = null;

const cssPath = join(__dirname, 'style.css');
const jsPath = join(__dirname, 'ui.js');
const TARGET_URL = process.env.TARGET_URL || 'https://dofusdb.fr/fr/tools/treasure-hunt';

function createWindow() {
  const positionStore = createWindowPositionStore();
  const sizeStore = createWindowSizeStore();

  const { x = 0, y = 120 } = positionStore.store;
  const { width = 400, height = 500 } = sizeStore.store;

  win = new BrowserWindow({
    x,
    y,
    width,
    height,
    minWidth: 400,
    minHeight: 500,
    webPreferences: {
      preload: join(app.getAppPath(), 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    },
    hasShadow: false,
    roundedCorners: false,
    alwaysOnTop: true,
    alwaysOnTopLevel: 'screen-saver',
    frame: false,
    transparent: true,
    acceptFirstMouse: true,
    show: false,
  });

  win.on('moved', () => {
    if (!win) return;

    const [newX, newY] = win.getPosition();
    positionStore.set({ x: newX, y: newY });
  });

  win.on('resized', () => {
    if (!win) return;

    const [newWidth, newHeight] = win.getSize();
    sizeStore.set({ width: newWidth, height: newHeight });
  });

  win.on('blur', () => {
    if (win) {
      win.setAlwaysOnTop(true, 'screen-saver');
      win.focus();
    }
  });

  loadUrl();

  win.webContents.on('did-finish-load', async () => {
    try {
      const [css, js] = await Promise.all([
        fs.readFile(cssPath, 'utf-8'),
        fs.readFile(jsPath, 'utf-8'),
      ]);

      await Promise.all([
        win.webContents.insertCSS(css),
        win.webContents.executeJavaScript(js),
      ]);

      win.show();
    } catch (err) {
      console.error('Error loading external files:', err);
      app.quit();
    }
  });

  win.on('closed', () => {
    win = null;
  });

  ipcMain.handle('quit', () => {
    win?.close();
  });

  async function loadUrl() {
    try {
      await win.loadURL(TARGET_URL, { userAgent: 'Chrome' });
    } catch (err) {
      console.error('Failed to load URL:', err);
      app.quit();
    }
  }
}

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', createWindow);
