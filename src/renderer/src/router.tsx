import {
  RouteObject,
  createBrowserRouter,
  createHashRouter,
} from 'react-router-dom'
import Home from './pages/Home/Home'
import PlaylistDetail from './pages/PlaylistDetail/PlaylistDetail'

const routes: Array<RouteObject> = [
  {
    element: <Home />,
    path: ''
  },
  {
    element: <PlaylistDetail />,
    path: 'playlist-detail/:folderPath'
  },
]

type Router = ReturnType<typeof createBrowserRouter>
const router: Router = createHashRouter(routes)

export default router