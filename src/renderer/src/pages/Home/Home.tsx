import React, { useMemo, useState } from 'react'
import './Home.scss'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'

interface IProps { }

const Home: React.FunctionComponent<IProps> = (props) => {

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
    </div>
  )
}

export default Home

