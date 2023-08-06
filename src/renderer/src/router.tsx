import {
  RouteObject,
  createBrowserRouter,
  createHashRouter,
} from 'react-router-dom'
import Home from './pages/Home/Home'

const routes: Array<RouteObject> = [
  {
    element: <Home />,
    path: ''
  },
]

type Router = ReturnType<typeof createBrowserRouter>
const router: Router = createHashRouter(routes)

export default router