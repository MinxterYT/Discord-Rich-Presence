/* eslint-disable no-console */

const path = require('path');
const url = require('url');
const DiscordRPC = require('discord-rpc');
const config = require('../../../config.json');
const fs = require('fs');
const moment = require('moment');
const {BrowserWindow} = require('electron');
const {app} = require('electron');
const custom = require('../../../custom/preset1.json');

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

  var activity = {
    details: custom.details,
    state: custom.state,
    largeImageKey: custom.lkey,
    largeImageText: custom.ltext,
    instance: custom.instance,
    smallImageKey: custom.skey,
    smallImageText: custom.stext
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