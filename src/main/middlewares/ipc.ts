import { app, dialog, shell } from 'electron'
import type { AppMiddleware } from './types'
import localFileIpc from '@main/ipc-events/localFile'
import systemInfoIpc from '@main/ipc-events/systemInfo'
import appDataDb, { appConfigDbPath } from '@main/untls/lowdb'

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
        const isDuplicate = appDataDb.data.playlistLocations.some(
          (location) => { location.folderPath === folderPath }
        )
        if (!isDuplicate) {
          appDataDb.data.playlistLocations.push({ folderPath })
          await appDataDb.write()
          return { folderPath }
        }
        return null
      })

      localFileIpc.reveralDbFile(async () => {
        shell.showItemInFolder(appConfigDbPath)
      })

      localFileIpc.deletePlaylistLocation(async ({ folderPath }) => {
        await appDataDb.read()
        const playlistLocations = appDataDb.data.playlistLocations
        const index = playlistLocations.findIndex(
          (location) => location.folderPath === folderPath
        )
        if (index === -1) {
          return
        }
        playlistLocations.splice(index, 1)
        await appDataDb.write()
      })

      localFileIpc.getPlaylistLocations(async () => {
        await appDataDb.read()
        const locations = appDataDb.data.playlistLocations ?? []
        return {
          playlistLocations: locations
        }
      })


    })

    systemInfoIpc.onPlatFrom((_data, _win) => {
      return process.platform
    })

  }
}

export default ipcMiddleware