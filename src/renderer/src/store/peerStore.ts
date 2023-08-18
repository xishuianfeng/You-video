import Peer, { PeerErrorType } from 'peerjs'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface PeerStore {
  getPeer: () => Peer
  localPeerId: string
  setLocalPeerId: (id: string) => void
}

const usePeerStore = create(
  immer<PeerStore>((set, get) => {
    return {
      getPeer: () => peer,
      localPeerId: '',
      setLocalPeerId(id) {
        set((store) => {
          store.localPeerId = id
        })
      },
    }
  }),
)

const peer = new Peer()
const store = usePeerStore.getState()
const onOpen = (id: string) => {
  store.setLocalPeerId(id)
  console.log('信令服务器连接建立成功', id)
}
const onDisconnected = () => {
  peer.reconnect()
}
const onError = (error: Error) => {
  const errorWithType = error as PeerJSError
  console.log('peerjs 错误', error)
}
peer.on('open', onOpen)
peer.on('disconnected', onDisconnected)
peer.on('error', onError)

type PeerJSError = Error & { type: PeerErrorType }

export default usePeerStore
