"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var win = null;
var args = process.argv.slice(1), serve = args.some(function (val) { return val === '--serve'; });
function createWindow() {
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
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
    win.setMenuBarVisibility(false);
    win.center();
    electron_1.ipcMain.on('resize', function (event, arg) {
        win.resizable = true;
        win.setFullScreen(false);
        win.setSize(arg.width, arg.height);
        win.resizable = false;
        win.center();
        win.setMenuBarVisibility(false);
    });
    electron_1.ipcMain.on('fullscreen', function (event, arg) {
        win.resizable = true;
        win.setFullScreen(arg);
        win.resizable = false;
        win.center();
        win.setMenuBarVisibility(false);
    });
    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/node_modules/electron")
        });
        win.loadURL('http://localhost:4200');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    win.on('closed', function () {
        win = null;
    });
    return win;
}
try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    electron_1.app.on('ready', function () { return setTimeout(createWindow, 400); });
    electron_1.app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
}
//# sourceMappingURL=main.js.map