import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { electron } from 'process';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 1200,
    height: 600,
    show: true,
    center: true,
    transparent: true,
    resizable: false,
    icon: './assets/pikachu.png',
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      enableRemoteModule: false
    },
  });
  win.setMenuBarVisibility(false)
  win.center();

  ipcMain.on('resize', (event, arg) => {
    win.resizable = true
    win.setFullScreen(false)
    win.setSize(arg.width, arg.height)
    win.resizable = false
    win.center();
    win.setMenuBarVisibility(false)
  })

  ipcMain.on('fullscreen', (event, arg) => {
    win.resizable = true
    win.setFullScreen(arg)
    win.resizable = false
    win.center();
    win.setMenuBarVisibility(false)
  })

  if (serve) {

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }



  win.on('closed', () => {
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
}
