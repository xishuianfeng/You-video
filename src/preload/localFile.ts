import { ipcRenderer } from "electron-better-ipc";

const emitAddFolder = (
  data: FileIpc.AddLocalFolderReq,
): Promise<FileIpc.AddLocalFolderRes> => {
  return ipcRenderer.callMain('add-local-folder',data)
}

const fileIpc = {
  emitAddFolder
}

export default fileIpc