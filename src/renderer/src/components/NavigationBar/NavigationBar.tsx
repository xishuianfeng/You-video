import React, { CSSProperties, ReactNode, useEffect, useState } from 'react'
import './NavigationBar.scss'
import { Left } from '@icon-park/react'
import { useNavigate } from 'react-router-dom'

interface IProps {
  style?: CSSProperties,
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
    <div className='navigate-bar' style={{ opacity, ...style }}>
      {backButtonVisible ? (
        <div
          className='back-button'
          onClick={() => {
            console.log('返回了');
            navigate(-1)
          }}>
          {backButton}
        </div>
      ) : null}
      {extra}
    </div>
  )
}