import { BrowserWindow } from "electron";
import { ipcMain } from "electron-better-ipc";

const emitOpenFile = async (
  win: BrowserWindow,
  data: VideoIpc.OpenFileRes
): Promise<VideoIpc.OpenFileRes> => {
  return ipcMain.callRenderer(win, 'open-file', data)
}

const videoIpc = {
  emitOpenFile
}

export default videoIpc