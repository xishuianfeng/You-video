import { ipcRenderer } from 'electron-better-ipc'

const emitPlatform = (): Promise<SystemInfoIpc.PlatformRes> => {
  return ipcRenderer.callMain('platform')
}

const systemInfoIpc = {
  emitPlatform
}

export default systemInfoIpc