import React, { FC, useEffect, useRef, useState } from 'react'
import './Player.scss'
import usePlaylistStore from '@renderer/store/playlistStore'
import { useNavigate, useSearchParams } from 'react-router-dom'
import classnames from 'classnames'
import { useAsyncEffect, useFavicon, useFullscreen, useMemoizedFn } from 'ahooks'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import { Left } from '@icon-park/react'
import { useImmer } from 'use-immer'
import usePeerStore from '@renderer/store/peerStore'
import { MediaConnection } from 'peerjs'
import Modal from 'react-modal'
import CopyToClipboard from 'react-copy-to-clipboard'

const Player: FC = () => {
  const playlistStore = usePlaylistStore()
  const videoRef = useRef<HTMLVideoElement & { captureStream: HTMLCanvasElement['captureStream'] }>(null)
  const trackRef = useRef<HTMLTrackElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const navgiate = useNavigate()
  const peerStore = usePeerStore()
  const peer = peerStore.getPeer()
  const [params, _setSearchParams] = useSearchParams()
  const { filePath, folderPath } = Object.fromEntries(params)
  const [remotePeerId, setRemotePeerId] = useState('')

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

  const sendSubtitle = useMemoizedFn(() => {
    const textTrack = trackRef.current?.track.activeCues?.[0]
    if (textTrack) {
      //@ts-ignore
      //  获取 track 当前展示文字
      const subtitle = textTrack.text
      if (peerStore.dataConnection) {
        peerStore.dataConnection.send(subtitle)
      }
    }
  })

  useEffect(() => {
    // 建立数据连接
    peer.on('connection', (connection) => {
      peerStore.setDataConnection(connection)
    });

    trackRef.current?.addEventListener('cuechange', sendSubtitle);

    return () => {
      trackRef.current?.removeEventListener('cuechange', sendSubtitle);
    }
  }, [])

  //  视图相关 State
  const [controlsVisible, setControlsVisible] = useState(true)
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
          onContextMenu={() => { togglePlayState() }}
        >
          <source src={`local-file://${filePath}`} />
          {subtitleFilePaths.map((subtitlePath, index) => {
            return (
              <track
                ref={trackRef}
                key={subtitlePath}
                default={index === 0}
                label='Deutsch'
                kind='subtitles'
                src={`local-file://${subtitlePath}`}
              />
            )
          })}
          {/* <track
            ref={trackRef}
            src={`local-file://D:\\bc\\content\\git clone\\video-player\\src\\renderer\\src\\assets\\subtitle.vtt`}
            kind="subtitles"
            label="Deutsch"
            default
          /> */}
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
            <button className="left-buttons"
              onClick={() => {
                setShareModalVisible(true)
              }}
            >
              分享画面
            </button>
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
              <button
                onClick={() => { setSubtitleFileVisible(true) }}
              >
                选择字幕
              </button>
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

      <Modal
        // style={{ content: { inset: 'auto' } }}
        isOpen={shareModalVisible}
        shouldCloseOnEsc={true}
      >
        <div>复制id或链接，将当前画面分享给ta。</div>
        <div>
          {peerStore.localPeerId}
          <CopyToClipboard
            text={peerStore.localPeerId}
            onCopy={() => {
              setShareModalVisible(false)
            }}
          >
            <button>点击复制</button>
          </CopyToClipboard>
        </div>
        <div>
          http://localhost:5173/video/follower?remotePeerId={peerStore.localPeerId}
          <CopyToClipboard
            text={`http://localhost:5173/video/follower?remotePeerId=${peerStore.localPeerId}`}
            onCopy={() => {
              setShareModalVisible(false)
            }}
          >
            <button>
              点击复制
            </button>
          </CopyToClipboard>
        </div>
        <button
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