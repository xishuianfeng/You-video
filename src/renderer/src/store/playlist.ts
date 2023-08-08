import { create } from "zustand"
import { immer } from "zustand/middleware/immer"


interface PlaylistStore {
  playlistLocations: Array<Common.PlaylistLocation>
  setPlaylistLocations: (playlists: Array<Common.PlaylistLocation>) => void
  pushPlaylistLocations: (playlist: Common.PlaylistLocation) => void
  clearPlaylistLocations: () => void
}

const usePlaylistStore = create(
  immer<PlaylistStore>((set, get) => {
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
      }
    }
  })
)

export default usePlaylistStore