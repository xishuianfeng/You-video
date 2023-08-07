import { ipcRenderer } from "electron-better-ipc";

const emitAddFolder = (
  data: FileIpc.AddLocalFolderReq,
): Promise<FileIpc.AddLocalFolderRes> => {
  return ipcRenderer.callMain('add-local-folder', data)
}
const emitRevealDbfile = (
  data: FileIpc.RevealDbfileReq,
): Promise<FileIpc.RevealDbfileRes> => {
  return ipcRenderer.callMain('reveral-db-file', data)
}

const fileIpc = {
  emitAddFolder,
  emitRevealDbfile
}

export default fileIpc