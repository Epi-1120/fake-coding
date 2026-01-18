const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: '#1e1e1e', // VS Code dark background
        title: 'Visual Studio Code',
        icon: path.join(__dirname, 'assets/icon.png'), // Will assume icon exists or fallback
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true, // Hide the default file menu for realism
    });

    // Remove the default menu completely for maximum immersion
    Menu.setApplicationMenu(null);

    // Load the index.html of the app.
    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
