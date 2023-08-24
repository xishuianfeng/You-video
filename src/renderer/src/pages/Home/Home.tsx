import React, { useMemo, useState } from 'react'
import './Home.scss'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import useSystemInfoStore from '@renderer/store/systemInfoStore'
import usePlaylistStore from '@renderer/store/playlistStore'
import usePeerStore from '@renderer/store/peerStore'
import { Connection, FolderOpen, LinkInterrupt } from '@icon-park/react'

interface IProps { }

const Home: React.FunctionComponent<IProps> = (props) => {
  const navigator = useNavigate()
  const playlistStore = usePlaylistStore()
  const systemInfoStore = useSystemInfoStore()
  const peerStore = usePeerStore()
  const gotoPlaylistDetailPage = (folderPath: string) => {
    navigator(`/playlist-detail/${encodeURIComponent(folderPath)}`)
  }

  const [remotePeerId, setRemotePeerId] = useState('')
  const [joinSessionModalVisible, setJoinSessionModalVisible] = useState(false)
  const onJoinSessionClick = () => {
    setJoinSessionModalVisible(true)
  }

  return (
    <div className='home'>
      <NavigationBar backButtonVisible={false} />
      {peerStore.localPeerId === ''
        ? <div className='connection-status'>
          <LinkInterrupt theme="outline" size="24" fill="#ccc" />
          未连接,无法共享视频(或加入视频)
        </div>
        : <div className='connection-status'>
          <Connection className='top-icon' theme="outline" size="24" fill="#ccc" />
          Peer已连接
        </div>}

      <button
        className='topButton'
        onClick={async () => {
          const addedPlaylistLocation = await window.api.fileIpc.emitAddFolder()
          if (addedPlaylistLocation !== null && addedPlaylistLocation !== undefined) {
            playlistStore.pushPlaylistLocations(addedPlaylistLocation)
          }
        }}>
        添加文件夹
      </button>

      {systemInfoStore.isDev && (
        <button
          className='topButton'
          onClick={() => {
            window.api.fileIpc.emitRevealDbfile()
          }}>
          打开db文件
        </button>
      )}

      <button
        className='topButton'
        onClick={() => { onJoinSessionClick() }}>
        观看他人视频
      </button>


      <main className='playlists'>
        {playlistStore.playlistLocations.map((location) => {
          const { folderPath } = location
          return (
            <article
              className='playlist'
              key={folderPath}>
              <div
                onClick={() => {
                  if (folderPath) {
                    gotoPlaylistDetailPage(folderPath)
                  }
                }} className='folder-path'>
                <FolderOpen className='folder-icon' theme="outline" size="24" fill="#fff" />
                <div className='path-text'>
                  {folderPath}
                </div>
                <button
                  className='delete-button'
                  onClick={async (event) => {
                    event.stopPropagation()
                    if (!folderPath) {
                      return
                    }
                    await window.api.fileIpc.emitDeletePlaylistLocation(location)
                    const { playlistLocations: latestPlaylistLocations } = await window.api.fileIpc.emitGetPlaylistLocations()
                    playlistStore.setPlaylistLocations(
                      latestPlaylistLocations
                    )
                  }}>
                  删除
                </button>
              </div>
            </article>
          )
        })}
      </main>

      <Modal
        isOpen={joinSessionModalVisible}
        shouldCloseOnEsc={true}
      >
        <input
          className='remote-peer-id-input'
          type='text'
          value={remotePeerId}
          onChange={(event) => {
            const peerId = event.target.value
            setRemotePeerId(peerId)
          }}
        />
        <div>
          <button
            className='modalButton'
            onClick={() => {
              const search = new URLSearchParams({
                remotePeerId
              }).toString()
              navigator({
                pathname: '/video/follower',
                search
              })
            }}
          >
            加入
          </button>

          <button
            className='modalButton'
            onClick={() => {
              setJoinSessionModalVisible(false)
            }}
          >
            取消
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Home

