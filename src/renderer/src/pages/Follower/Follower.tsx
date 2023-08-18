import usePeerStore from '@renderer/store/peerStore'
import './Follower.scss'
import React, { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import { useMemoizedFn } from 'ahooks'
import { createEmptyMediaStream } from '@renderer/utils/peer'

interface IProps { }

const Follower: React.FunctionComponent<IProps> = (props) => {
  const [params, setSearchParams] = useSearchParams()
  const peerStore = usePeerStore()
  const serachParams = Object.fromEntries(params) as { remotePeerId: string }
  const videoRef = useRef<
    HTMLVideoElement & { captureStream: HTMLCanvasElement['captureStream'] }
  >(null!)

  const connectPeer = useMemoizedFn((remotePeerId: string) => {
    return new Promise<void>((resolve, reject) => {
      const call = peerStore
        .getPeer()
        .call(remotePeerId, createEmptyMediaStream())

      call.once('stream', (stream) => {
        console.log('remoteStream', stream);
        videoRef.current.srcObject = stream
        resolve()
      })
      call.once('error', (error) => {
        console.log('error => ', error);
        reject()
      })
      call.once('close', () => {
        console.log('远程连接关闭');
        reject()
      })
    })
  })

  useEffect(() => {
    const remotePeerId = serachParams.remotePeerId

    if (!remotePeerId) { return }

    connectPeer(remotePeerId)
      .then(() => {
        setSearchParams((prev) => {
          prev.delete('remotePeerId')
          return prev
        })
        console.log('连接成功');
      })
      .catch(() => { })
  }, [])


  return (
    <div className='follower'>
      <div className='nav-wrapper'>
        <NavigationBar />
      </div>
      <video className='follower-video' ref={videoRef} autoPlay></video>
    </div>
  )
}

export default Follower