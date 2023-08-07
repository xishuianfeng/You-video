import { BrowserWindow } from "electron";
import { ipcMain } from 'electron-better-ipc'

const onAddLocalFolder = async (
  callback: (
    data: FileIpc.AddLocalFolderReq,
    win?: BrowserWindow
  ) => Promise<FileIpc.AddLocalFolderRes>
) => {
  return ipcMain.answerRenderer('add-local-folder', callback)
}

const reveralDbFile = async (
  callback: (
    data: FileIpc.RevealDbfileReq,
    win?: BrowserWindow
  ) => Promise<FileIpc.RevealDbfileRes>
) => {
  return ipcMain.answerRenderer('reveral-db-file', callback)
}

const localFileIpc = {
  onAddLocalFolder,
  reveralDbFile
}

export default localFileIpc