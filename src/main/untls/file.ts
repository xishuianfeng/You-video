import log from "electron-log"
import ffmpeg from 'fluent-ffmpeg'
import { globby } from 'globby'
import path from "path"
import fsExtra from 'fs-extra'


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

const generateThumbnail = async (params: {
  filePath: string
  filename: string
  outputDir: string
  timestamps: string[]
}) => {
  const { filePath, filename, outputDir, timestamps } = params
  return new Promise<void>((resolve, rejects) => {
    ffmpeg(filePath)
      .thumbnail({
        filename,
        count: timestamps.length,
        timestamps,
        folder: outputDir
      })
      .once('error', (error) => {
        rejects(error);
      })
      .once('end', () => {
        resolve()
      })
  })
}

const generateSubtitle = async (params: {
  filePath: string
  subtitleLength: number
  outDir: string
}) => {
  const { filePath, subtitleLength, outDir } = params
  const promises: Array<Promise<string>> = []
  for (let i = 0; i < subtitleLength; i++) {
    const parsedFilePath = path.join(filePath)
    const outputPath = path.join(outDir, `${parsedFilePath}_${i}.vtt`)
    const isExist = fsExtra.pathExistsSync(outputPath)
    if (isExist) {
      console.log('字幕文件已生成,跳过', outputPath);
      promises.push(Promise.resolve(outputPath))
      continue
    }
    const promise = new Promise<string>((resolve, rejects) => {
      ffmpeg(filePath)
        .outputOption(`map 0:s:${i}`)
        .output(outputPath)
        .once('error', (err) => {
          console.log('err => ', err);
          rejects(err)
        })
        .once('end', () => {
          resolve(outputPath)
        })
        .run()
    })
    promises.push(promise)
  }
  return Promise.allSettled(promises)
    .then((settledPromises) => {
      return settledPromises.filter(({ status }) => status === 'fulfilled')
    })
    .then((result) => {
      const fulfilledResult = result as Array<PromiseFulfilledResult<string>>
      return fulfilledResult.map(({ value }) => value)
    })
}



const fileUtils = {
  globbyVideosIn,
  getVideosStatsIn,
  generateThumbnail,
  generateSubtitle
}
export default fileUtils