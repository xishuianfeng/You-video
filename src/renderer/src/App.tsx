import { FC, PropsWithChildren, useEffect } from "react"
import usePlaylistStore from "./store/playlistStore"
import { useAsyncEffect } from 'ahooks'
import './App.scss'
import Modal from 'react-modal'

Modal.setAppElement('#root')
Modal.defaultStyles.content = {
  inset: 'auto',
  top: 0,
  left: 0,
  backgroundColor: '#ffffff',
  borderRadius: 4,
  padding: 10,
}
Modal.defaultStyles.overlay = {
  position: 'fixed',
  zIndex: 1,
  left: 0,
  top: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(255, 255, 255, .3)',
}

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
