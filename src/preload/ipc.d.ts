declare namespace FileIpc {
  export type AddLocalFolderReq = {} | void
  export type AddLocalFolderRes = Common.PlaylistLocation | null

  export type RevealDbfileReq = {} | void
  export type RevealDbfileRes = void

  export type GetPlaylistsReq = {} | void
  export type GetPlaylistsRes = {
    playlistLocations: Array<Common.PlaylistLocation>
  }

  export type DeletePlaylistLocationReq = Common.PlaylistLocation
  export type DeletePlaylistLocationRes = void

  export type GetPlaylistAtReq = Common.PlaylistLocation
  export type GetPlaylistAtRes = Common.Playlist | null
}

declare namespace SystemInfoIpc {
  export type PlatformRes = NodeJs.platform
}

declare namespace VideoIpc {
  export interface OpenFileReq {
    url: string
  }
  export type OpenFileRes = {} | void

  export interface SubtitleGenerateReq {
    videoFilePath: string
    subtitleLength: number
  }
  export interface SubtitleGenerateRes {
    subtitleFilePaths: string[]
  }
}

declare namespace AppIpc {
  export type CloseWindowReq = {} | void
  export type CloseWindowRes = void
}