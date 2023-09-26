import { AppMiddleware } from "./types";
import { app } from 'electron'
import { DEFAULT_DEV_URL, createWindow } from '@main/utils/window'



const devWindowMiddleware: AppMiddleware = {
  when: 'dev',
  apply() {
    const devUrl = new URL(DEFAULT_DEV_URL)
    devUrl.hash = '/'
    app.whenReady().then(() => {
      createWindow({
        devUrl: devUrl.toString()
      })
    })
  }
}

export default devWindowMiddleware