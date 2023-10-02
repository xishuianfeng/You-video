import { app, BrowserWindow } from 'electron'
import { electronApp, is } from '@electron-toolkit/utils'
import ipcMiddleware from '@main/middlewares/ipc'
import { AppMiddleware } from './middlewares/types'
import protocolMiddleware from './middlewares/protocol'
import mainWindowMiddleware from './middlewares/mainWindow'
import { createWindow } from './utils/window'

// import electronDebug from 'electron-debug'
// import devWindowMiddleware from './middlewares/devWindow'


const applyMiddleware = ({ apply, when }: AppMiddleware) => {
  if (is.dev && (when === 'dev' || when === 'all')) {
    apply()
  } else if (!is.dev && (when === 'production' || when === 'all')) {
    apply()
  }
}

applyMiddleware(ipcMiddleware)
applyMiddleware(protocolMiddleware)
applyMiddleware(mainWindowMiddleware)
// applyMiddleware(devWindowMiddleware)

// if (is.dev) {
//   electronDebug()
// }


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('peer-video-player')

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
