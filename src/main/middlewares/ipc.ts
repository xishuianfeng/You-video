import { app, dialog } from 'electron'
import type { AppMiddleware } from './types'
import localFileIpc from '@main/ipc-events/localFile'
import systemInfoIpc from '@main/ipc-events/systemInfo'

const ipcMiddleware: AppMiddleware = {
  when: 'all',
  apply() {
    app.whenReady().then(() => {
      localFileIpc.onAddLocalFolder(async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
          title: '添加一个带有视频文件的文件夹',
          properties: ['openDirectory'],
        })
        if (canceled) {
          return null
        }
        const folderPath = filePaths[0]
        console.log(folderPath);

      })
    })

    systemInfoIpc.onPlatFrom((_data, _win) => {
      return process.platform
    })

  }
}

export default ipcMiddleware