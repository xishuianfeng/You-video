declare namespace FileIpc {
  export type AddLocalFolderReq = {} | void
  export type AddLocalFolderRes = Common.PlaylistLocation | null

  export type RevealDbfileReq = {} | void
  export type RevealDbfileRes = void
}

declare namespace SystemInfoIpc {
  export type PlatformRes = NodeJs.platform
}