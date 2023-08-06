import ffmpeg from 'fluent-ffmpeg'
import path from 'path'

const videoFilePath =
  "C:\\Users\\chenyitao\\Downloads\\迅雷\\BanG Dream! It’s MyGO!!!!!\\[Nekomoe kissaten&LoliHouse] BanG Dream! It's MyGO!!!!! - 02 [WebRip 1080p HEVC-10bit AAC ASSx2].mkv"
const { name, dir } = path.parse(videoFilePath)
const outputPath = path.join(dir, `${name}.vtt`)
const outputPath2 = path.join(dir, `${name}2.vtt`)
console.log('outputPath ==========>', outputPath)
console.log('outputPath2 ==========>', outputPath2)
ffmpeg(videoFilePath)
  .outputOption(['-map 0:s:1'])
  .output(outputPath)
  .once('error', (error) => {
    console.log('error ==========>', error)
  })
  .once('end', (result) => {
    console.log('result ==========>', result)
  })
  .run()
