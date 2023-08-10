import { ipcRenderer } from "electron-better-ipc";

const emitAddFolder = (
  data: FileIpc.AddLocalFolderReq,
): Promise<FileIpc.AddLocalFolderRes> => {
  return ipcRenderer.callMain('add-local-folder', data)
}
const emitRevealDbfile = (
  data: FileIpc.RevealDbfileReq,
): Promise<FileIpc.RevealDbfileRes> => {
  return ipcRenderer.callMain('reveral-db-file', data)
}
const emitDeletePlaylistLocation = (
  data: FileIpc.DeletePlaylistLocationReq,
): Promise<FileIpc.DeletePlaylistLocationRes> => {
  return ipcRenderer.callMain('delete-playlist-location', data)
}
const emitGetPlaylistLocations = (
  data: FileIpc.GetPlaylistsReq,
): Promise<FileIpc.GetPlaylistsRes> => {
  return ipcRenderer.callMain('get-playlists-location', data)
}
const emitGetPlaylistAt = (
  data: FileIpc.GetPlaylistAtReq,
): Promise<FileIpc.GetPlaylistAtRes> => {
  return ipcRenderer.callMain('get-playlist-at', data)
}

const fileIpc = {
  emitAddFolder,
  emitRevealDbfile,
  emitDeletePlaylistLocation,
  emitGetPlaylistLocations,
  emitGetPlaylistAt
}

export default fileIpc