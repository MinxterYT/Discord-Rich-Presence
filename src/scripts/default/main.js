/* eslint-disable no-console */

const path = require('path');
const url = require('url');
const DiscordRPC = require('discord-rpc');
const config = require('../../../config.json');
const fs = require('fs');
const moment = require('moment');
const {BrowserWindow} = require('electron');
const {app} = require('electron');
const ClientId = config.clientID;
let mainWindow;

function createWindow() {
  var width = 500 //500
  var height = 480 //480
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    resizable: false,
    titleBarStyle: 'hidden',
    vibrancy: 'dark',
    hasShadow: false,
    frame: true,
    show: false
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null)
    createWindow();
});

DiscordRPC.register(ClientId);

const rpc = new DiscordRPC.Client({
  transport: 'ipc'
});

async function setActivity() {
  if (!rpc || !mainWindow)
    return;

  var ltext = await mainWindow.webContents.executeJavaScript('var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("ltext")[text];')
  var details = await mainWindow.webContents.executeJavaScript('var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("details")[text];')
  var state = await mainWindow.webContents.executeJavaScript('var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("state")[text];')
  var stext = await mainWindow.webContents.executeJavaScript('var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("stext")[text];')
  var lkey = await mainWindow.webContents.executeJavaScript('var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("lkey")[text];')
  var skey = await mainWindow.webContents.executeJavaScript('var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("skey")[text];')

  var activity = {
    details: details,
    state: state,
    largeImageKey: lkey,
    largeImageText: ltext,
    instance: false
  }

  if (skey !== 'none') {
    activity.smallImageKey = skey
    activity.smallImageText = stext
  }
  rpc.setActivity(activity);
}

rpc.on('ready', () => {
  setActivity();

  setInterval(() => {
    setActivity();
  }, 15e3);
});

rpc.login({clientId: ClientId}).catch(console.error);