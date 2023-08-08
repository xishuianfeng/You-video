import React, { useMemo, useState } from 'react'
import './Home.scss'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import useSystemInfoStore from '@renderer/store/systemInfoStore'
import usePlaylistStore from '@renderer/store/playlistStore'

interface IProps { }

const Home: React.FunctionComponent<IProps> = (props) => {
  const navigator = useNavigate()
  const playlistStore = usePlaylistStore()
  const systemInfoStore = useSystemInfoStore()
  const gotoPlaylistDetailPage = (folderPath: string) => {
    navigator(`/playlist-detail/${encodeURIComponent(folderPath)}`)
  }

  return (
    <div className='home'>
      <NavigationBar backButtonVisible={false} />

      <main className='playlists'>
        {playlistStore.playlistLocations.map((location) => {
          const { folderPath } = location
          console.log(location);
          console.log(folderPath);


          return (
            <article
              className='playlist'
              onClick={() => {
                if (folderPath) {
                  gotoPlaylistDetailPage(folderPath)
                }
              }}
              key={folderPath}>
              <div className='folder-path'>
                <div className='path-text'>{folderPath}</div>
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

      <button
        onClick={async () => {
          const addedPlaylistLocation = await window.api.fileIpc.emitAddFolder()
          if (addedPlaylistLocation !== null && addedPlaylistLocation !== undefined) {
            playlistStore.pushPlaylistLocations(addedPlaylistLocation)
          }
        }}>
        选择文件夹
      </button>

      {systemInfoStore.isDev && (
        <button
          onClick={() => {
            window.api.fileIpc.emitRevealDbfile()
          }}>
          打开db文件
        </button>
      )}

    </div>
  )
}

export default Home

