import log from "electron-log"
import ffmpeg from 'fluent-ffmpeg'
import path from "path"


const setFfmpegAndFfprobePath = () => {
  const ffmpegBinName =
    process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg-universal'
  const ffmpegBinPath =
    process.env.NODE_ENV === 'development'
      ? path.join(process.cwd(), `resources/ffmpeg-binaries/${ffmpegBinName}`)
      : path.join(process.resourcesPath, ffmpegBinName)

  const ffprobeBinName =
    process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe-universal'
  const ffprobeBinPath =
    process.env.NODE_ENV === 'development'
      ? path.join(process.cwd(), `resources/ffmpeg-binaries/${ffprobeBinName}`)
      : path.join(process.resourcesPath, ffprobeBinName)

  log.info(`
NODE_ENV: ${process.env.NODE_ENV},
ffmpeg路径: ${ffmpegBinPath},
ffprobe路径: ${ffprobeBinPath},
  `)
  ffmpeg.setFfmpegPath(ffmpegBinPath)
  ffmpeg.setFfprobePath(ffprobeBinPath)
}

setFfmpegAndFfprobePath()