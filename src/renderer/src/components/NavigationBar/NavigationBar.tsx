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
    backButton = <Left style={{ fontSize: 20 }} />,
    style,
    backButtonVisible = true,
    extra,
  } = props
  const [opacity, setOpacity] = useState(1)

  const navigate = useNavigate()

  return (
    <div className="navigation-bar" style={{ opacity, ...style }}>
      {backButtonVisible ? (
        <div
          className="back-button"
          onClick={() => {
            navigate(-1)
          }}
        >
          {backButton}
        </div>
      ) : <div></div>}

      {extra}
      <div
        className='close-button'
        onClick={() => { }}
      >
        <Close theme="outline" size="24" fill="#ccc" />
      </div>
    </div>
  )
}

export default NavigationBar
