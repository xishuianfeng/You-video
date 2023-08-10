import log from "electron-log"
import ffmpeg from 'fluent-ffmpeg'
import { globby } from 'globby'
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

const ffprobe = (filePath: string) => {
  return new Promise<ffmpeg.FfprobeData>((resolve, rejects) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) {
        rejects(err)
        return
      }
      resolve(data)
    })
  })
}

const globbyVideosIn = async (folderPath: string, extensions: string[]) => {
  return globby([`**/*.{${extensions.join(',')}}`], {
    cwd: folderPath,
    absolute: true
  }).then((filePaths) => {
    console.log(filePaths);

    return filePaths.map((p) => path.join(p))
  })
}

const getVideosStatsIn = async (folderPath: string, extensions: string[]) => {
  const videoFiles = await globbyVideosIn(folderPath, extensions)
  const res = await Promise.all(videoFiles.map((filePath) => ffprobe(filePath)))

  const result: Common.Playlist = {
    folderPath,
    folderName: path.basename(folderPath),
    file: res.map((stat) => {
      const videoStream = stat.streams.find(
        (stream) => stream.codec_type === 'video',
      )
      const audioStream = stat.streams.find(
        (stream) => stream.codec_type === 'audio',
      )
      const subtitleStreams = stat.streams.filter(
        (stream) => stream.codec_type === 'subtitle',
      )
      return {
        filename: path.basename(stat.format.filename ?? ''),
        bitrate: stat.format.bit_rate,
        path: stat.format.filename,
        video: {
          codec: videoStream?.codec_name,
          width: 0,
          height: 0,
        },
        audio: {
          codec: audioStream?.codec_name,
        },
        subtitles: subtitleStreams.map(({ codec_name }) => {
          return {
            codec: codec_name,
          }
        }),
      }
    }),
  }
  return result
}

const fileUtils = {
  globbyVideosIn,
  getVideosStatsIn
}
export default fileUtils