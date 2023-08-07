import React, { useMemo, useState } from 'react'
import './Home.scss'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import useSystemInfoStore from '@renderer/store/systemInfoStore'

interface IProps { }

const Home: React.FunctionComponent<IProps> = (props) => {
  const navigator = useNavigate()
  const systemInfoStore = useSystemInfoStore()
  return (
    <div className='home'>
      <NavigationBar backButtonVisible={false} />


      <button
        onClick={async () => {
          console.log(window.api);
          const addedPlaylistLocation = await window.api.fileIpc.emitAddFolder()
          if (addedPlaylistLocation !== null && addedPlaylistLocation !== undefined) {

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

