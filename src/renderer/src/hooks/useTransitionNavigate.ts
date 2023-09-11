import { flushSync } from "react-dom"
import { NavigateFunction, useNavigate } from "react-router-dom"

const useTransitionNavigate = () => {
  const navigate = useNavigate()

  const transitionNavigate = (...args: unknown[]) => {
    document.startViewTransition(() => {
      // flushSync(() => {
      //   // @ts-expect-error xxx
      //   navigate(...args)
      // })
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          flushSync(() => {
            // @ts-expect-error xxx
            navigate(...args)
            console.log("===>")
          })
          resolve()
        }, 1000)
      })
    })
  }

  return transitionNavigate as NavigateFunction
}

export default useTransitionNavigate

declare global {
  interface Document {
    startViewTransition: (domMutator: () => void) => void
  }
}
