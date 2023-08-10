import React from 'react'
import './PlaylistDetail.scss'
import { useNavigate, useParams } from 'react-router-dom'
import usePlaylistStore from '@renderer/store/playlistStore'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import { useAsyncEffect } from 'ahooks'


interface IProps { }
const PlaylistDetail: React.FunctionComponent<IProps> = (props) => {
  const navigate = useNavigate()
  const playlistStore = usePlaylistStore()
  const pathParams = useParams<{ folderPath: string }>()

  const folderPath = pathParams.folderPath
  useAsyncEffect(async () => {
    if (!folderPath) { return }

    const playlistDetail = playlistStore.playlists[folderPath]
    if (playlistDetail) { return }

    //const playlist = await window.api.fileIpc.emitGetPlaylistAs({ folderPath })
    //未完成

    //if (playlist === null) { return }
    //playlistStore.addPlaylist(playlist)
  })

  return (
    <div className='playlist-detail'>
      <NavigationBar />
      <h1 className='folder-path'>{pathParams.folderPath}</h1>
    </div>
  )
}

export default PlaylistDetail