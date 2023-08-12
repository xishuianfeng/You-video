import { ipcRenderer } from "electron-better-ipc"

const openFile = (
  callback: (data: VideoIpc.OpenFileReq) => VideoIpc.OpenFileRes
) => {
  return ipcRenderer.answerMain('open-file', callback)
}

const videoIpc = {
  openFile
}

export default videoIpc