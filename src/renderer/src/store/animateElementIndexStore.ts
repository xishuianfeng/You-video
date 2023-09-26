import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface animateElementIndexStore {
  playlistLocationIndex: number
  setPlaylistLocationIndex: (index: number) => void

  playlistIndex: number
  setPlaylistIndex: (index: number) => void
}

const useAnimateElementIndexStore = create(
  immer<animateElementIndexStore>((set) => {
    return {
      playlistLocationIndex: 0,
      setPlaylistLocationIndex(index) {
        set((store) => {
          store.playlistLocationIndex = index
        })
      },

      playlistIndex: 0,
      setPlaylistIndex(index) {
        set((store) => {
          store.playlistIndex = index
        })
      },
    }
  })
)

export default useAnimateElementIndexStore