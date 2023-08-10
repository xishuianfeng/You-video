declare namespace Common {
  export interface PlaylistLocation {
    folderPath?: string
  }

  export interface Playlist {
    folderPath?: string
    folderName?: string
    file: Array<{
      path?: string
      filename?: string
      bitrate?: number
      video: {
        codec?: string
        width?: number
        height?: number
        bitrate?: number
      }
      audio: {
        codec?: string
      }
      subscribe: Array<{
        codec?: string
      }>
    }>
  }
}