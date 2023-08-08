import { FC, PropsWithChildren, useEffect } from "react"
import usePlaylistStore from "./store/playlistStore"
import { useAsyncEffect } from 'ahooks'

const App: FC<PropsWithChildren> = ({ children }) => {
  const playlistStore = usePlaylistStore()
  useAsyncEffect(async () => {
    const { playlistLocations: latestPlaylistLocations } =
      await window.api.fileIpc.emitGetPlaylistLocations()
    playlistStore.setPlaylistLocations(latestPlaylistLocations)
  }, [])
  return <div id="container">{children}</div>
}

export default App
