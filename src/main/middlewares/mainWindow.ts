import { app } from "electron";
import { AppMiddleware } from "./types";
import { createWindow } from "@main/utils/window";
import videoIpc from "@main/ipc-events/video";

const mainWindowMiddleware: AppMiddleware = {
  when: 'all',
  apply() {
    const pendingFiles: Array<{ url: string }> = []
    app.on('will-finish-launching', () => {
      app.on('open-file', (event, url) => {
        event.preventDefault()
        pendingFiles.push({ url })
      })
    })
    app.whenReady().then(async () => {
      const { loadPromise, win } = createWindow()
      await loadPromise
      const file = pendingFiles.shift()
      if (file) {
        videoIpc.emitOpenFile(win, { url: file.url })
      }
    })
  }
}

export default mainWindowMiddleware