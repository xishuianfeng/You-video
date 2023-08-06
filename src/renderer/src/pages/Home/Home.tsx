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
      123
    </div>
  )
}

export default Home

