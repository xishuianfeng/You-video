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

const localFileIpc = {
  onAddLocalFolder
}

export default localFileIpc