import { BrowserWindow } from "electron";
import { ipcMain } from "electron-better-ipc";

const emitOpenFile = async (
  win: BrowserWindow,
  data: VideoIpc.OpenFileReq
): Promise<VideoIpc.OpenFileRes> => {
  return ipcMain.callRenderer(win, 'open-file', data)
}
const onSubtitleGenerate = async (
  callback: (
    data: VideoIpc.SubtitleGenerateReq,
    win: BrowserWindow,
  ) => Promise<VideoIpc.SubtitleGenerateRes>,
) => {
  return ipcMain.answerRenderer('subtitle-generate', callback)
}


const videoIpc = {
  emitOpenFile,
  onSubtitleGenerate
}

export default videoIpc