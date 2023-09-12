import React from 'react'
import './PlaylistDetail.scss'
import { useNavigate, useParams } from 'react-router-dom'
import usePlaylistStore from '@renderer/store/playlistStore'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import { useAsyncEffect } from 'ahooks'
import { flushSync } from 'react-dom'
import useAnimateElementIndexStore from '@renderer/store/animateElementIndexStore'


interface IProps { }
const PlaylistDetail: React.FunctionComponent<IProps> = (props) => {
  const navigate = useNavigate()
  const animateElementIndexStore = useAnimateElementIndexStore()
  const playlistStore = usePlaylistStore()
  const pathParams = useParams<{ folderPath: string }>()

  const folderPath = pathParams.folderPath
  useAsyncEffect(async () => {
    if (!folderPath) { return }

    const playlistDetail = playlistStore.playlists[folderPath]
    if (playlistDetail) { return }

    const playlist = await window.api.fileIpc.emitGetPlaylistAt({ folderPath })

    if (playlist === null) { return }
    playlistStore.addPlaylist(playlist)
  }, [])

  const gotoPlayerPage = (filePath: string) => {
    const searchParams = new URLSearchParams({
      filePath,
      folderPath: folderPath ?? ''
    })

    navigate(`/video/player?${searchParams.toString()}`)
  }
  if (!folderPath) { return null }
  const files = playlistStore.playlists[folderPath]?.file ?? []


  return (
    <div className='playlist-detail'>
      <NavigationBar router={'/'} />
      <div className='playlist-top'></div>
      <h1 className='folder-path'>{pathParams.folderPath}</h1>
      <div className='playlist'>
        {[...files].sort((a, b) => {
          const afileName = a.filename ?? ''
          const bfileName = b.filename ?? ''
          if (afileName === bfileName) {
            return 0
          } else if (afileName > bfileName) {
            return 1
          } else {
            return -1
          }
        })
          .map((file, index) => {
            return <div
              onClick={() => {
                animateElementIndexStore.setPlaylistIndex(index)
                document.startViewTransition(() => {
                  flushSync(() => {
                    if (file.path) {
                      gotoPlayerPage(file.path)
                    }
                  })
                })
              }}
              className={`video-item ${index === animateElementIndexStore.playlistIndex
                ? 'fileAnimate'
                : undefined}`}
              key={file.filename}>
              <img
                className='video-thumbnail'
                src={`thumbnail://${encodeURIComponent(
                  file.path ?? '',
                )}?${new URLSearchParams({ timestamp: JSON.stringify(['50%']) })}`}
              />
              <div className='filename'>{file.filename}</div>
            </div>
          })}
      </div>
    </div >
  )
}

export default PlaylistDetail