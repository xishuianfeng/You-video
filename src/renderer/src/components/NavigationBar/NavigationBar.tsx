import React, { CSSProperties, ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './NavigationBar.scss'
import { Close, Left } from '@icon-park/react'

interface IProps {
  style?: CSSProperties
  backButton?: ReactNode
  backButtonVisible?: boolean
  extra?: ReactNode
}

const NavigationBar: React.FunctionComponent<IProps> = (props) => {
  const {
    backButton = <Left style={{ fontSize: 20 }} fill="#65c7bf" />,
    style,
    backButtonVisible = true,
    extra,
  } = props
  const [opacity, setOpacity] = useState(1)

  const navigate = useNavigate()

  return (
    <div className="navigation-bar" style={{ opacity, ...style }}>
      <div className='nav-left'>
        {backButtonVisible ? (
          <div
            className="back-button"
            onClick={() => {
              navigate(-1)
            }}
          >
            {backButton}
          </div>) : <div></div>}
        <div className='nav-bar-text'>
          侑影音，可分享的视频播放器
        </div>
      </div>

      <div
        className='close-button'
        onClick={() => { window.api.appIpc.emitCloseWindow() }}
      >
        <Close theme="outline" size="24" fill="#65c7bf" />
      </div>
    </div>
  )
}

export default NavigationBar
