import React, { FC, useEffect, useRef, useState } from 'react'
import './Player.scss'
import usePlaylistStore from '@renderer/store/playlistStore'
import { useNavigate, useSearchParams } from 'react-router-dom'
import classnames from 'classnames'
import { useAsyncEffect, useFavicon, useFullscreen, useMemoizedFn } from 'ahooks'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import { FullScreenOne, Left, List, Pause, PlayOne, ShareOne } from '@icon-park/react'
import { useImmer } from 'use-immer'
import usePeerStore from '@renderer/store/peerStore'
import { MediaConnection } from 'peerjs'
import Modal from 'react-modal'
import CopyToClipboard from 'react-copy-to-clipboard'

const Player: FC = () => {
  const playlistStore = usePlaylistStore()
  const videoRef = useRef<HTMLVideoElement & { captureStream: HTMLCanvasElement['captureStream'] }>(null)
  const trackRef = useRef<Array<HTMLTrackElement>>([])
  const wrapperRef = useRef<HTMLDivElement>(null)
  const navgiate = useNavigate()
  const peerStore = usePeerStore()
  const peer = peerStore.getPeer()
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

  //  Peer监听 on 和 off
  useEffect(() => {
    const listener = (call: MediaConnection) => {
      const stream = videoRef.current?.captureStream()
      if (stream) {
        call.answer(stream)
      }
    }
    peer.on?.('call', listener)
    return () => {
      peer.off?.('call', listener)
    }
  }, [])

  //  监听进度条秒数 和 视频总秒数
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

  // 进度条转化为分钟，小于 10 前面加 0，大于 10 不加 0
  const invertSecond = (totalSeconds: number) => {
    const minute = totalSeconds / 60
    const second = totalSeconds % 60
    let minuteString = minute.toFixed()
    let secondString = second.toFixed()
    if (minute < 10) {
      minuteString = '0' + minute.toFixed()
    }
    if (second < 10) {
      secondString = '0' + second.toFixed()
    }
    return (minuteString + ':' + secondString)
  }

  //  字幕相关
  const [subtitleFilePaths, setSubtitleFilePaths] = useImmer<Array<string>>([])
  const playlist = playlistStore.playlists[folderPath]
  const currentFile = playlist?.file.find(({ path }) => path === filePath)

  useAsyncEffect(async () => {
    if (!currentFile) {
      return
    }

    const subtitleLength = currentFile?.subtitles.length
    if (subtitleLength !== undefined) {
      const paths = await window.api.videoIpc.emitSubtitleGenerate({
        subtitleLength,
        videoFilePath: filePath,
      })
      setSubtitleFilePaths(paths.subtitleFilePaths)
    }
  }, [])

  const onChangeSubtitle = (index: number) => {
    if (currentFile?.subtitles.length) {
      for (let i = 0; i < currentFile?.subtitles.length; i++) {
        if (i === index) {
          if (videoRef.current) {
            videoRef.current.textTracks[i].mode = 'showing'
          }
        } else {
          if (videoRef.current) {
            videoRef.current.textTracks[i].mode = 'hidden'
          }
        }
      }
    }
  }

  const sendSubtitle = useMemoizedFn((event: Event) => {
    // const textTrack = trackRef[selectTrack].current?.track.activeCues?.[0]
    const target = event.currentTarget as HTMLTrackElement
    const cue = target.track.activeCues?.[0]
    if (cue) {
      //@ts-ignore
      //  获取 track 当前展示文字
      const subtitle = cue.text

      if (peerStore.dataConnection) {
        peerStore.dataConnection.send(JSON.stringify({
          type: 'subtitle',
          subtitle
        }))
      }
    }
  })

  useEffect(() => {
    // 建立数据连接
    peer.on('connection', (connection) => {
      peerStore.setDataConnection(connection)
    });
  }, [])

  useEffect(() => {
    trackRef.current.forEach((r) => {
      r.addEventListener('cuechange', sendSubtitle);
    })

    return () => {
      trackRef.current.forEach((r) => {
        r.removeEventListener('cuechange', sendSubtitle);
      })
    }
  }, [subtitleFilePaths])


  //  监听 空格 方向键（← →） keydown事件 
  const keydownEvent = useMemoizedFn((event) => {
    if (event.defaultPrevented) {
      return;
    }
    switch (event.key) {
      case " ":
        togglePlayState()
        break;
      case "ArrowLeft":
        if (videoRef.current) {
          videoRef.current.currentTime -= 10
        }
        break;
      case "ArrowRight":
        if (videoRef.current) {
          videoRef.current.currentTime += 10
        }
        break;
      default:
        return;
    }
  })
  useEffect(() => {
    window.addEventListener('keydown', keydownEvent);
    return (() => window.addEventListener('keydown', keydownEvent))
  }, [])

  //  视图相关 State
  const [controlsVisible, setControlsVisible] = useState(false)
  const [hoverIndicatorVisible, setHoverIndicatorVisible] = useState(true)
  const [hoverIndicatorPercent, setHoverIndicatorPercent] = useState(0)
  const [shareModalVisible, setShareModalVisible] = useState(false)
  const [subtitleFileVisible, setSubtitleFileVisible] = useState(false)

  return (
    <div className='player' ref={wrapperRef}>
      {filePath ? (
        <video
          ref={videoRef}
          autoPlay
          loop={false}
          className={classnames()}
          onDoubleClick={() => {
            toggleFullscreen()
          }}

          style={{ viewTransitionName: 'fileAnimate' }}
          // onContextMenu={() => { togglePlayState() }}
          onClick={() => { togglePlayState() }}
        >
          <source src={`local-file://${filePath}`} />
          {subtitleFilePaths.map((subtitlePath, index) => {
            return (
              <track
                ref={(r) => {
                  if (r) {
                    trackRef.current[index] = r
                  }
                }}
                key={subtitlePath}
                default={index === 0}
                label='Deutsch'
                kind='subtitles'
                src={`local-file://${subtitlePath}`}
              />
            )
          })}
        </video>
      ) : '无视频地址'
      }

      <div className="control-layer">
        <header
          className="navigation-bar-wrapper"
          onMouseEnter={() => {
            setControlsVisible(true)
          }}
          onMouseLeave={() => {
            setControlsVisible(false)
          }}
          style={{
            opacity: controlsVisible ? 1 : 0,
          }}
        >
          <NavigationBar
            style={{ backgroundColor: 'rgba(38,40,52,0.5)' }}
            backButton={<Left style={{ color: 'whitesmoke' }} />}
          />
        </header>

        <footer
          onMouseEnter={() => {
            setControlsVisible(true)
          }}
          onMouseLeave={() => {
            setControlsVisible(false)
          }}
          className="control-bar"
          style={{
            opacity: controlsVisible ? 1 : 0,
          }}
        >

          <div className='row'>
            {peerStore.localPeerId
              ? <button className="left-buttons"
                onClick={() => {
                  setShareModalVisible(true)
                }}
              >
                <ShareOne className='icon' theme="outline" size="24" fill="#95979d" />
              </button>
              : <div className="left-buttons" />
            }

            <button onClick={() => togglePlayState()}>
              {videoRef.current?.paused
                ? <PlayOne className='icon' theme="outline" size="24" fill="#95979d" />
                : <Pause className='icon' theme="outline" size="24" fill="#95979d" />}
            </button>

            <div
              className='progress-wrapper'
              onMouseMove={(event) => {
                setHoverIndicatorVisible(true)
                const { left, width } =
                  event.currentTarget.getBoundingClientRect()
                const newPercent = (event.clientX - left) / width
                setHoverIndicatorPercent(newPercent)
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
              onMouseLeave={() => {
                setHoverIndicatorVisible(false)
              }}>
              <div className="progress">
                <div
                  className="done"
                  style={{
                    transform: `translateX(${(progress.currentTime / progress.duration) * 100}%)`,
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
              </div>
            </div>

            <div className='time'>
              {progress.currentTime
                ? invertSecond(progress.currentTime)
                : <div>00:00</div>}
              /
              {progress.duration
                ? invertSecond(progress.duration)
                : <div>00:00</div>}
            </div>

            <button
              onClick={() => { setSubtitleFileVisible(true) }}
            >
              <List className='icon' theme="two-tone" size="24" fill={['#95979d', '#2F88FF']} />
            </button>


            <button
              onClick={() => {
                toggleFullscreen()
              }}
            >
              <FullScreenOne className='icon' theme="two-tone" size="24" fill={['#95979d', '#2F88FF']} />
            </button>

          </div>
        </footer>
      </div>

      <Modal
        // style={{ content: { inset: 'auto' } }}
        isOpen={shareModalVisible}
        shouldCloseOnEsc={true}
      >
        <div className='share-title'>复制id或链接，将当前画面分享给ta。</div>
        <div>
          id：{peerStore.localPeerId}
          <CopyToClipboard
            text={peerStore.localPeerId}
            onCopy={() => {
              setShareModalVisible(false)
            }}
          >
            <button
              className='copy-button'>
              点击复制
            </button>
          </CopyToClipboard>
        </div>
        <div>
          链接：http://localhost:5173?remotePeerId={peerStore.localPeerId}
          <CopyToClipboard
            text={`http://localhost:5173?remotePeerId=${peerStore.localPeerId}`}
            onCopy={() => {
              setShareModalVisible(false)
            }}
          >
            <button
              className='copy-button'>
              点击复制
            </button>
          </CopyToClipboard>
        </div>
        <button
          className='close-button'
          onClick={() => {
            setShareModalVisible(false)
          }}
        >
          关闭弹窗
        </button>
      </Modal>

      <Modal
        isOpen={subtitleFileVisible}
        shouldCloseOnEsc={true}
      >
        <div>选择字幕文件</div>
        <div className='subtitle-wrapper'>
          {(subtitleFilePaths.length === 0)
            ? <div>暂无可供选择的字幕文件</div>
            : subtitleFilePaths.map((subtitlePath, index) => {
              return (
                <div
                  className='select-subtitle'
                  key={subtitlePath}
                  onClick={() => {
                    onChangeSubtitle(index)
                    setSubtitleFileVisible(false)
                  }}
                >
                  {subtitlePath}
                </div>
              )
            })}
        </div>
        <button
          className='close-button'
          onClick={() => {
            setSubtitleFileVisible(false)
          }}
        >
          关闭弹窗
        </button>
      </Modal>


    </div >
  )
}

export default Player