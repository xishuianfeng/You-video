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
}

declare namespace SystemInfoIpc {
  export type PlatformRes = NodeJs.platform
}