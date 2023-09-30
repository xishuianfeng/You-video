import { create } from "zustand"
import { immer } from "zustand/middleware/immer"


interface PlaylistStore {
  playlistLocations: Array<Common.PlaylistLocation>
  setPlaylistLocations: (playlists: Array<Common.PlaylistLocation>) => void
  pushPlaylistLocations: (playlist: Common.PlaylistLocation) => void
  clearPlaylistLocations: () => void

  playlists: Record<string, Common.Playlist>
  setPlaylists: (playlists: Record<string, Common.Playlist>) => void
  addPlaylist: (playlist: Common.Playlist) => void
  clearPlaylists: () => void
}

const usePlaylistStore = create(
  immer<PlaylistStore>((set) => {
    return {
      playlistLocations: [],

      setPlaylistLocations(newPlaylists) {
        set((store) => {
          store.playlistLocations = newPlaylists
        })
      },

      pushPlaylistLocations(newPlaylist) {
        set(({ playlistLocations: playlists }) => {
          playlists.push(newPlaylist)
        })
      },

      clearPlaylistLocations() {
        set((store) => {
          store.playlistLocations = []
        })
      },


      playlists: {},

      setPlaylists(newPlaylists) {
        set((store) => {
          store.playlists = newPlaylists
        })
      },

      addPlaylist(newPlaylist) {
        set((store) => {
          if (!newPlaylist.folderPath) {
            return
          }
          store.playlists[newPlaylist.folderPath] = newPlaylist
        })
      },

      clearPlaylists() {
        set((store) => {
          store.playlists = {}
        })
      },
    }
  })
)

export default usePlaylistStore