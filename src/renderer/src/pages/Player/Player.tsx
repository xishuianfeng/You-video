import React, { FC, useEffect, useRef, useState } from 'react'
import './Player.scss'
import usePlaylistStore from '@renderer/store/playlistStore'
import { useNavigate, useSearchParams } from 'react-router-dom'
import classnames from 'classnames'
import { useFavicon, useFullscreen, useMemoizedFn } from 'ahooks'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import { Left } from '@icon-park/react'
import { useImmer } from 'use-immer'

const Player: FC = () => {
  const playlistStore = usePlaylistStore()
  const videoRef = useRef<HTMLVideoElement & { captureStream: HTMLCanvasElement['captureStream'] }>(null)
  const wrapperRef = useRef<HTMLDivElement>(null!)
  const navgiate = useNavigate()

  const [params, _setSearchParams] = useSearchParams()
  const { filePath, folderPath } = Object.fromEntries(params)

  const [isFullscreen, { enterFullscreen, exitFullscreen, toggleFullscreen }] = useFullscreen(wrapperRef.current, {})
  const togglePlayState = useMemoizedFn(() => {
    if (videoRef.current?.paused) {
      videoRef.current?.play()
    } else {
      videoRef.current?.pause()
    }
  })

  const [progress, setProgress] = useImmer({
    duration: 0,
    currentTime: 0,
  })

  useEffect(() => {
    const onTimeUpdate = () => {
      setProgress((p) => {
        if (videoRef.current?.currentTime) {
          p.currentTime = videoRef.current.currentTime
        }
        if (videoRef.current?.duration) {
          p.duration = videoRef.current.duration
        }
      })
    }
    videoRef.current?.addEventListener('timeupdate', onTimeUpdate)

    return () => {
      videoRef.current?.removeEventListener('timeupdate', onTimeUpdate)
    }
  }, [])
  //  视图相关 State
  const [controlsVisible, setControlsVisible] = useState(true)
  const [hoverIndicatorVisible, setHoverIndicatorVisible] = useState(true)
  const [hoverIndicatorPercent, setHoverIndicatorPercent] = useState(0)

  return (
    <div className='player' ref={wrapperRef}>
      {filePath ? (
        <video
          ref={videoRef}
          autoPlay
          loop={false}
          className={classnames()}
          onDoubleClick={() => {
            toggleFullscreen(), console.log(1);
          }}
          onContextMenu={() => { togglePlayState() }}
        >
          <source src={`local-file://${filePath}`} />
        </video>
      ) : '无视频地址'
      }

      <div className="control-layer">
        <header
          className="navigation-bar-wrapper"
          style={{
            opacity: controlsVisible ? 1 : 0,
            pointerEvents: controlsVisible ? 'all' : 'none',
          }}
        >
          <NavigationBar
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
            backButton={<Left style={{ color: 'whitesmoke' }} />}
          />
        </header>

        <footer
          className="control-bar"
          style={{
            opacity: controlsVisible ? 1 : 0,
            pointerEvents: controlsVisible ? 'all' : 'none',
          }}
        >
          <div className="first-row">
            <div className="left-buttons">
              分享画面
            </div>
            <div className="center-buttons">
              <button>上一集</button>
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime -= 10
                  }
                }}
              >
                快退
              </button>
              <button onClick={() => togglePlayState()}>
                {videoRef.current?.paused ? '播放' : '暂停'}
              </button>
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime += 10
                  }
                }}
              >
                快进
              </button>
              <button>下一集</button>
            </div>
            <div className="right-buttons">
              <button
                onClick={() => {
                  toggleFullscreen()
                }}
              >
                全屏
              </button>
            </div>
          </div>

          <div className="second-row">
            <div
              className="progress"
              onMouseMove={(event) => {
                setHoverIndicatorVisible(true)
                const { left, width } =
                  event.currentTarget.getBoundingClientRect()
                const newPercent = (event.clientX - left) / width
                setHoverIndicatorPercent(newPercent)
              }}
              onMouseLeave={() => {
                setHoverIndicatorVisible(false)
              }}
              onClick={(event) => {
                setHoverIndicatorVisible(false)
                const { width, left } =
                  event.currentTarget.getBoundingClientRect()
                const percent = (event.clientX - left) / width
                if (videoRef.current) {
                  const currentTime = videoRef.current.duration * percent
                  videoRef.current.currentTime = currentTime
                  setProgress((p) => {
                    p.currentTime = currentTime
                  })
                }
              }}
            >
              <div
                className="done"
                style={{
                  transform: `translateX(${(progress.currentTime / progress.duration) * 100
                    }%)`,
                }}
              />
              {hoverIndicatorVisible && (
                <div
                  className='hover-indicator'
                  style={{
                    transform: `translateX(${hoverIndicatorPercent * 100}%)`,
                  }}
                />
              )}
              <div className='current-time'>
                {progress.currentTime.toFixed(0)}
              </div>
              <div className="total-time">{progress.duration.toFixed(0)}</div>
            </div>
          </div>
        </footer>
      </div>


    </div >
  )
}

export default Player