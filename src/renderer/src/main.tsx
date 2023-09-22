import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import App from './App'
import router from './router'
import { RouterProvider, useLocation } from 'react-router-dom'

window.api.videoIpc.openFile(({ url }) => {
  const searchParams = new URLSearchParams({
    filePath: encodeURIComponent(url)
  })
  router.navigate({ pathname: `/video/player?${searchParams.toString()}` })
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App>
    <RouterProvider router={router} />
  </App>
)
