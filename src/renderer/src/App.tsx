import { FC, PropsWithChildren } from "react"

const App: FC<PropsWithChildren> = ({ children }) => {
  return <div id="container">{children}</div>
}

export default App
