import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'

interface SystemInfoStore {
  platform: NodeJS.Platform
  setPlatform: (platform: NodeJS.Platform) => void
  isDev: boolean
}

const useSystemInfoStore = create(
  immer<SystemInfoStore>((set) => {
    return {
      isDev: process.env.NODE_ENV === 'development',
      platform: 'win32',
      setPlatform(newPlatform) {
        set((store) => {
          store.platform = newPlatform
        })
      }
    }
  })
)

const store = useSystemInfoStore.getState()
window.api.systemInfoIpc.emitPlatform().then((platform) => {
  store.setPlatform(platform)
})

export default useSystemInfoStore