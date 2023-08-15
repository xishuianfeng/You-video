import { app, dialog, shell } from 'electron'
import type { AppMiddleware } from './types'
import localFileIpc from '@main/ipc-events/localFile'
import systemInfoIpc from '@main/ipc-events/systemInfo'
import appDataDb, { appConfigDbPath } from '@main/untls/lowdb'
import { SUPPORTED_VIDEO_EXTENSIONS } from '@main/consts'
import fileUtils from '@main/untls/file'
import videoIpc from '@main/ipc-events/video'
import path from 'path'

const tempDir = path.join(app.getPath('temp'), app.name)

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

      localFileIpc.getPlaylistAt(async (location) => {
        if (!location.folderPath) { return null }

        return fileUtils.getVideosStatsIn(
          location.folderPath,
          SUPPORTED_VIDEO_EXTENSIONS,
        )
      })

    })

    videoIpc.onSubtitleGenerate(async (data, _win) => {
      const { videoFilePath, subtitleLength } = data
      const subtitleFilePaths = await fileUtils.generateSubtitle({
        filePath: videoFilePath,
        outDir: tempDir,
        subtitleLength,
      })
      return {
        subtitleFilePaths,
      }
    })

    systemInfoIpc.onPlatFrom((_data, _win) => {
      return process.platform
    })

  }
}

export default ipcMiddleware