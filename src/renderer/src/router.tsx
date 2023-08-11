import {
  RouteObject,
  createBrowserRouter,
  createHashRouter,
} from 'react-router-dom'
import Home from './pages/Home/Home'
import PlaylistDetail from './pages/PlaylistDetail/PlaylistDetail'
import Player from './pages/Player/Player'
import History from './pages/History/History'

const routes: Array<RouteObject> = [
  {
    element: <Home />,
    path: ''
  },
  {
    element: <PlaylistDetail />,
    path: 'playlist-detail/:folderPath'
  },
  {
    element: <Player />,
    path: 'video/player'
  },
  {
    element: <History />,
    path: 'video/history'
  },
]

type Router = ReturnType<typeof createBrowserRouter>
const router: Router = createHashRouter(routes)

export default router