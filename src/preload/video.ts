import { ipcRenderer } from "electron-better-ipc"

const openFile = (
  callback: (data: VideoIpc.OpenFileReq) => VideoIpc.OpenFileRes
) => {
  return ipcRenderer.answerMain('open-file', callback)
}

const emitSubtitleGenerate = (
  data: VideoIpc.SubtitleGenerateReq,
): Promise<VideoIpc.SubtitleGenerateRes> => {
  return ipcRenderer.callMain('subtitle-generate', data)
}

const videoIpc = {
  openFile,
  emitSubtitleGenerate
}

export default videoIpc