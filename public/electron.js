const { app, BrowserWindow, ipcMain, Menu, Tray, nativeTheme, session } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');

let mainWindow;
let tray;

// Data directory setup
const userDataPath = app.getPath('userData');
const dataDir = path.join(userDataPath, 'data');
const backupDir = path.join(userDataPath, 'backup');

// Ensure data directories exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    frame: true,
    backgroundColor: '#ffffff',
    show: false,
  });
  
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self';",
          "script-src 'self' 'unsafe-eval';", // 'unsafe-eval' is needed for React's dev server
          "style-src 'self' 'unsafe-inline';", // 'unsafe-inline' is often needed for CSS-in-JS or frameworks
          "connect-src 'self' http://localhost:3000 ws://localhost:3000;", // Allow connection to the dev server
          "img-src 'self' data:;"
        ].join(' ')
      }
    });
  });

  // Load app
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Task',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-task');
          }
        },
        { type: 'separator' },
        {
          label: 'Export Data',
          click: () => {
            mainWindow.webContents.send('menu-export');
          }
        },
        {
          label: 'Import Data',
          click: () => {
            mainWindow.webContents.send('menu-import');
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
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
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Dark Mode',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            mainWindow.webContents.send('menu-toggle-theme');
          }
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Navigate',
      submenu: [
        {
          label: 'Home',
          accelerator: 'CmdOrCtrl+H',
          click: () => {
            mainWindow.webContents.send('menu-navigate', 'home');
          }
        },
        {
          label: 'Calendar',
          accelerator: 'CmdOrCtrl+K',
          click: () => {
            mainWindow.webContents.send('menu-navigate', 'calendar');
          }
        },
        {
          label: 'Archive',
          accelerator: 'CmdOrCtrl+A',
          click: () => {
            mainWindow.webContents.send('menu-navigate', 'archive');
          }
        },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.send('menu-navigate', 'settings');
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            mainWindow.webContents.send('menu-about');
          }
        },
        {
          label: 'Keyboard Shortcuts',
          click: () => {
            mainWindow.webContents.send('menu-shortcuts');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../assets/icon.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Quick Add Task',
      click: () => {
        mainWindow.show();
        mainWindow.webContents.send('menu-new-task');
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip("Carter's Personal Notes");
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    mainWindow.show();
  });
}

// IPC Handlers for file operations
ipcMain.handle('read-file', async (event, filename) => {
  const filePath = path.join(dataDir, filename);
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
});

ipcMain.handle('write-file', async (event, filename, data) => {
  const filePath = path.join(dataDir, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error writing file:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('backup-data', async () => {
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupPath = path.join(backupDir, `backup-${timestamp}.json`);
    
    const files = fs.readdirSync(dataDir);
    const backupData = {};
    
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const data = fs.readFileSync(path.join(dataDir, file), 'utf8');
        backupData[file] = JSON.parse(data);
      }
    });
    
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    return { success: true, path: backupPath };
  } catch (error) {
    console.error('Error creating backup:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-theme', () => {
  return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  createTray();

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

// Handle app updates
app.on('ready', () => {
  // Auto-updater logic can be added here
});