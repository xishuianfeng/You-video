import { ipcRenderer } from "electron-better-ipc";

const emitCloseWindow = (
  data: AppIpc.CloseWindowReq
): Promise<AppIpc.CloseWindowRes> => {
  return ipcRenderer.callMain('close-window', data)
}

const appIpc = {
  emitCloseWindow
}

export default appIpc