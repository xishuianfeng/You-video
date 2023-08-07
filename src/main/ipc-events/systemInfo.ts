import { BrowserWindow } from "electron";
import { ipcMain } from "electron-better-ipc"

const onPlatFrom = (
  callback: (data: void, win: BrowserWindow) => SystemInfoIpc.PlatformRes,
) => {
  return ipcMain.answerRenderer('platform', callback)
}

const systemInfoIpc = {
  onPlatFrom
}

export default systemInfoIpc