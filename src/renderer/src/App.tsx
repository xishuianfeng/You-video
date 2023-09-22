import { FC, PropsWithChildren, useEffect } from "react"
import usePlaylistStore from "./store/playlistStore"
import { useAsyncEffect, usePrevious } from 'ahooks'
import './App.scss'
import Modal from 'react-modal'
import { useLocation } from "react-router-dom"
import usePeerStore from "./store/peerStore"

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
  const peerStore = usePeerStore()
  const location = useLocation()
  const previousLocation = usePrevious(location)

  useEffect(() => {
    if ( // 从列表页 进入 播放页
      location.pathname === '/video/player' &&
      previousLocation?.pathname.search('/playlist-detail/') === 0
    ) {
      console.log(1);
      if (peerStore.dataConnection) {
        peerStore.dataConnection.send(JSON.stringify({
          type: 'goPlayer'
        }))
      }
    } else if ( //  从播放页 进入 列表页
      previousLocation?.pathname === '/video/player' &&
      location.pathname.search('/playlist-detail/') === 0
    ) {
      console.log(2);
      if (peerStore.dataConnection) {
        peerStore.dataConnection.send(JSON.stringify({
          type: 'leavePlayer'
        }))
      }
    }
  }, [previousLocation, location])

  useAsyncEffect(async () => {
    const { playlistLocations: latestPlaylistLocations } =
      await window.api.fileIpc.emitGetPlaylistLocations()
    playlistStore.setPlaylistLocations(latestPlaylistLocations)
  }, [])

  return <div id="container">{children}</div>
}

export default App
