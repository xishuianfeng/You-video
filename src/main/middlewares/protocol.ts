import { app, protocol, shell } from "electron";
import { AppMiddleware } from "./types";
import path from "path";
import fsExtra from 'fs-extra'
import fileUtils from "@main/utils/file";

const thumbnailOutputDir = path.join(app.getPath('temp'), app.name)
fsExtra
  .pathExists(thumbnailOutputDir)
  .then((isExist) => {
    if (!isExist) {
      fsExtra.ensureDir(thumbnailOutputDir)
      return
    }
  })
  .finally(() => {
    shell.openPath(thumbnailOutputDir)
  })

const protocolMiddleware: AppMiddleware = {
  when: 'all',
  apply() {
    app.whenReady().then(() => {
      protocol.registerFileProtocol('local-file', (request, callback) => {
        const requestedFilePath = decodeURIComponent(
          request.url.replace(/^local-file:(\/\/)?/, ''),
        )
        callback({
          path: requestedFilePath,
        })
      })

      protocol.registerFileProtocol('thumbnail', async (request, callback) => {
        const url = new URL(request.url)
        const searchParams = Object.fromEntries(url.searchParams)
        const timestamps = searchParams.timestamps
          ? JSON.parse(searchParams.timestamps)
          : ['50%']
        const videoFilePath = decodeURIComponent(url.host)
        const outputFilePath = path.join(
          thumbnailOutputDir,
          `${path.basename(videoFilePath)}.png`
        )
        const isExist = await fsExtra.pathExists(outputFilePath)
        if (isExist) {
          callback({
            path: outputFilePath
          })
          return
        }
        fileUtils.generateThumbnail({
          filePath: videoFilePath,
          outputDir: thumbnailOutputDir,
          timestamps,
          filename: '%f'
        }).then(() => {
          callback({
            path: outputFilePath,
          })
        }).catch(() => {
          callback('')
        })
      })
    })
  }
}

export default protocolMiddleware