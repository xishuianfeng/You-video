import { BrowserWindow } from "electron";
import { ipcMain } from 'electron-better-ipc'

const closeWindow = async (
  callback: (
    data: AppIpc.CloseWindowReq,
    win?: BrowserWindow
  ) => Promise<AppIpc.CloseWindowRes>
) => {
  return ipcMain.answerRenderer('close-window', callback)
}

const appIpc = {
  closeWindow
}

export default appIpc