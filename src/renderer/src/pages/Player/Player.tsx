import React, { FC, useRef } from 'react'
import './Player.scss'
import usePlaylistStore from '@renderer/store/playlistStore'
import { useNavigate, useSearchParams } from 'react-router-dom'
import classnames from 'classnames'
import { useFavicon, useFullscreen, useMemoizedFn } from 'ahooks'

const Player: FC = () => {
  const playlistStore = usePlaylistStore()
  const videoRef = useRef<HTMLVideoElement & { captureStream: HTMLCanvasElement['captureStream'] }>(null)
  const wrapperRef = useRef<HTMLDivElement>(null!)
  const navgiate = useNavigate()

  const [params, _setSearchParams] = useSearchParams()
  const { filePath, folderPath } = Object.fromEntries(params)

  const [isFullscreen, { toggleFullscreen }] = useFullscreen(wrapperRef.current, {})
  const togglePlayState = useMemoizedFn(() => {
    if (videoRef.current?.paused) {
      videoRef.current?.play()
    } else {
      videoRef.current?.pause()
    }
  })

  return (
    <div ref={wrapperRef}>
      {filePath ? (
        <video
          ref={videoRef}
          autoPlay
          loop={false}
          className={classnames()}
          onDoubleClick={() => { toggleFullscreen() }}
          onContextMenu={() => { togglePlayState() }}
        >
          <source src={`local-file://${filePath}`} />
        </video>
      ) : '无视频地址'
      }
    </div >
  )
}

export default Player