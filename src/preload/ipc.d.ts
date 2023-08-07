declare namespace FileIpc {
  export type AddLocalFolderReq = {} | void
  export type AddLocalFolderRes = Common.PlaylistLocation | null
}

declare namespace SystemInfoIpc {
  export type PlatformRes = NodeJs.platform
}