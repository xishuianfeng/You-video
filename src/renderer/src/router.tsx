import {
  RouteObject,
  createBrowserRouter,
  createHashRouter,
} from 'react-router-dom'
import Home from './pages/Home/Home'
import PlaylistDetail from './pages/PlaylistDetail/PlaylistDetail'
import Player from './pages/Player/Player'
import Follower from './pages/Follower/Follower'
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
  {
    element: <Follower />,
    path: 'video/Follower'
  },
]

type Router = ReturnType<typeof createBrowserRouter>
const router: Router = createHashRouter(routes)

export default router