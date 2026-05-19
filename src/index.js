const fs = require('fs');
const path = require('path');

const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const startedBySquirrel = require('electron-squirrel-startup');

if (startedBySquirrel) {
  app.quit();
}

// Disable GPU vsync warnings on systems without hardware acceleration
app.commandLine.appendSwitch('disable-gpu-vsync');

const NOTION_USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const WINDOW_STATE_FILE = 'window-state.json';
const NOTION_REPO_URL = 'https://github.com/notyorch/Notion-for-Linux';
const NOTION_URL = 'https://www.notion.so/';

// Persist window bounds in userData so the app remembers the last desktop layout.
const getWindowStatePath = () => path.join(app.getPath('userData'), WINDOW_STATE_FILE);

const readWindowState = () => {
  const filePath = getWindowStatePath();

  if (!fs.existsSync(filePath)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error('Failed to read window state:', error);
    return {};
  }
};

const saveWindowState = (win) => {
  const bounds = win.isMaximized() || win.isFullScreen() ? win.getNormalBounds() : win.getBounds();
  const state = {
    ...bounds,
    isMaximized: win.isMaximized(),
    isFullScreen: win.isFullScreen(),
  };

  try {
    fs.writeFileSync(getWindowStatePath(), JSON.stringify(state, null, 2));
  } catch (error) {
    console.error('Failed to save window state:', error);
  }
};

const isInternalNotionUrl = (url) => {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === 'notion.so' ||
      parsed.hostname.endsWith('.notion.so') ||
      parsed.hostname === 'notion.site' ||
      parsed.hostname.endsWith('.notion.site') ||
      parsed.hostname === 'notion.com' ||
      parsed.hostname.endsWith('.notion.com')
    );
  } catch {
    return false;
  }
};

// Build the native application menu for Linux desktop environments.
const buildAppMenu = (createWindow) => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Window',
          accelerator: 'CmdOrCtrl+N',
          click: () => createWindow(),
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', accelerator: 'CmdOrCtrl+R' },
        {
          label: 'Force Reload',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: (_, focusedWindow) => {
            focusedWindow?.webContents.reloadIgnoringCache();
          },
        },
        { type: 'separator' },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          click: (_, focusedWindow) => {
            const webContents = focusedWindow?.webContents;
            if (!webContents) {
              return;
            }

            webContents.setZoomLevel(webContents.getZoomLevel() + 0.5);
          },
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: (_, focusedWindow) => {
            const webContents = focusedWindow?.webContents;
            if (!webContents) {
              return;
            }

            webContents.setZoomLevel(webContents.getZoomLevel() - 0.5);
          },
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: (_, focusedWindow) => {
            focusedWindow?.webContents?.setZoomLevel(0);
          },
        },
        { type: 'separator' },
        { role: 'togglefullscreen', accelerator: 'F11' },
        {
          label: 'Toggle DevTools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: (_, focusedWindow) => {
            focusedWindow?.webContents.toggleDevTools();
          },
        },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        {
          label: 'Maximize',
          click: (_, focusedWindow) => {
            if (!focusedWindow) {
              return;
            }

            if (focusedWindow.isMaximized()) {
              focusedWindow.restore();
            } else {
              focusedWindow.maximize();
            }
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Notion for Linux',
          click: async () => {
            await dialog.showMessageBox({
              type: 'info',
              buttons: ['OK'],
              defaultId: 0,
              title: 'About Notion for Linux',
              message: 'Notion for Linux',
              detail: [
                `Version: ${app.getVersion()}`,
                'Author: jorgeenrique_vp',
                `Repository: ${NOTION_REPO_URL}`,
              ].join('\n'),
            });
          },
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

const createWindow = () => {
  const state = readWindowState();
  const win = new BrowserWindow({
    width: state.width || 1200,
    height: state.height || 800,
    x: Number.isInteger(state.x) ? state.x : undefined,
    y: Number.isInteger(state.y) ? state.y : undefined,
    minWidth: 800,
    minHeight: 600,
    title: 'Notion',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      spellcheck: true,
    },
  });

  // Match the browser fingerprint expected by Notion's web app.
  win.webContents.setUserAgent(NOTION_USER_AGENT);

  win.webContents.on('will-navigate', (event, url) => {
    // Redirect landing page to login
    if (url === 'https://www.notion.so/' || url === 'https://www.notion.so') {
      event.preventDefault();
      win.webContents.loadURL('https://www.notion.so/login');
      return;
    }

    if (isInternalNotionUrl(url)) {
      return;
    }

    event.preventDefault();
    shell.openExternal(url);
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isInternalNotionUrl(url)) {
      return { action: 'allow' };
    }

    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.loadURL(NOTION_URL);

  win.on('close', () => {
    saveWindowState(win);
  });

  if (state.isMaximized) {
    win.maximize();
  }

  if (state.isFullScreen) {
    win.setFullScreen(true);
  }

  return win;
};

app.whenReady().then(() => {
  buildAppMenu(createWindow);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
