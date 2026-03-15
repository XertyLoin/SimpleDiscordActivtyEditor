import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import DiscordRPC from 'discord-rpc';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let rpc;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 850,
    frame: false, // Custom title bar
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    icon: path.join(__dirname, 'public/icon.svg'),
    titleBarStyle: 'hiddenInset',
  });

  // Force external links to open in the system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.setMenu(null);

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // DevTools only in dev
    mainWindow.webContents.openDevTools(); 
  } else {
    // Relative path to dist/index.html
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  
  // Check for updates automatically
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify().catch(console.error);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Window Controls
ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.on('window-close', () => mainWindow.close());

// External Links via IPC
ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});

// RPC Logic
ipcMain.handle('set-activity', async (event, { clientId, activity }) => {
  try {
    // If clientId changed or RPC client died, recreate it
    if (!rpc || rpc.clientId !== clientId) {
      if (rpc) {
        await rpc.destroy().catch(() => {});
      }
      rpc = new DiscordRPC.Client({ transport: 'ipc' });
      rpc.clientId = clientId;
      
      await rpc.login({ clientId });
      // Small delay after login to ensure stability
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Prepare the raw packet for Discord
    // Using rpc.request directly allows us to set the 'type' field 
    // which the high-level rpc.setActivity() doesn't expose.
    const packet = {
      pid: process.pid,
      activity: {
        details: activity.details,
        state: activity.state,
        assets: {
          large_image: activity.largeImageKey,
          large_text: activity.largeImageText,
          small_image: activity.smallImageKey,
          small_text: activity.smallImageText,
        },
        buttons: activity.buttons,
        timestamps: {
          start: activity.startTimestamp
        },
        type: activity.type || 0,
        url: activity.url, // Twitch/YouTube URL for Streaming type
        instance: !!activity.instance
      }
    };

    // Clean up undefined/null values to keep Discord happy
    if (!packet.activity.assets.large_image) delete packet.activity.assets;
    else {
      if (!packet.activity.assets.small_image) delete packet.activity.assets.small_image;
      if (!packet.activity.assets.small_text) delete packet.activity.assets.small_text;
    }

    await rpc.request('SET_ACTIVITY', packet);
    return { success: true };
  } catch (error) {
    console.error('RPC Error:', error);
    // If it's a connection error, reset rpc so next try recreates it
    if (error.message.includes('connection closed') || error.message.includes('broken pipe')) {
      rpc = null;
    }
    return { success: false, error: error.message || 'Unknown RPC Error' };
  }
});
