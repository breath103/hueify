const path = require('path')
const { app, BrowserWindow, Tray } = require('electron')
const Positioner = require('electron-positioner')

// app.dock.hide()
app.on('ready', () => {
  const view = new BrowserWindow({
    width: 300,
    height: 400,
  })
  view.loadURL(`file://${__dirname}/static/index.html`)
})
