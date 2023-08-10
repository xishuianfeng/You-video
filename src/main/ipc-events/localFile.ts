import { BrowserWindow } from "electron";
import { ipcMain } from 'electron-better-ipc'

const onAddLocalFolder = async (
  callback: (
    data: FileIpc.AddLocalFolderReq,
    win?: BrowserWindow
  ) => Promise<FileIpc.AddLocalFolderRes>
) => {
  return ipcMain.answerRenderer('add-local-folder', callback)
}

const reveralDbFile = async (
  callback: (
    data: FileIpc.RevealDbfileReq,
    win?: BrowserWindow
  ) => Promise<FileIpc.RevealDbfileRes>
) => {
  return ipcMain.answerRenderer('reveral-db-file', callback)
}

const getPlaylistLocations = async (
  callback: (
    data: FileIpc.GetPlaylistsReq,
    win?: BrowserWindow
  ) => Promise<FileIpc.GetPlaylistsRes>
) => {
  return ipcMain.answerRenderer('get-playlists-location', callback)
}

const deletePlaylistLocation = async (
  callback: (
    data: FileIpc.DeletePlaylistLocationReq,
    win?: BrowserWindow
  ) => Promise<FileIpc.DeletePlaylistLocationRes>
) => {
  return ipcMain.answerRenderer('delete-playlist-location', callback)
}

const getPlaylistAt = async (
  callback: (
    data: FileIpc.GetPlaylistAtReq,
    win?: BrowserWindow,
  ) => Promise<FileIpc.GetPlaylistAtRes>,
) => {
  return ipcMain.answerRenderer('get-playlist-at', callback)
}

const localFileIpc = {
  onAddLocalFolder,
  reveralDbFile,
  getPlaylistLocations,
  deletePlaylistLocation,
  getPlaylistAt
}

export default localFileIpc