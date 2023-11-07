const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');


const expressApp = express();
expressApp.use(express.json());
expressApp.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(expressApp);
const wss = new WebSocket.Server({ server });

const JWT_SECRET = 'default_secret_key'; 





const usersDB = [
 
  { username: 'user', password: 'pass' }
];



server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle('login', async (event, credentials) => {
 
  const { username, password } = credentials;
 
  const user = usersDB.find(user => user.username === username && user.password === password);
  if (user) {
      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      
      return { success: true, token: token };
  } else {
      return { success: false, error: 'Invalid username or password.' };
  }
});


ipcMain.handle('register', async (event, credentials) => {
  
  const { username, password } = credentials;
  const existingUser = usersDB.find(user => user.username === username);
  if (existingUser) {
     
      return { success: false, error: 'Username already exists.' };
  }

  usersDB.push({ username, password }); 
  
  return { success: true };
});

ipcMain.on('navigate-to-board', (event, { boardId }) => {
  mainWindow.loadFile(path.join(__dirname, 'public', 'board.html'))
  .then(() => {
  
    mainWindow.webContents.send('board-loaded', { boardId });
})
.catch(err => {
    console.error(`Failed to load ${boardFilePath}:`, err);
});
});



if (require('electron-squirrel-startup')) {
  app.quit();
}
