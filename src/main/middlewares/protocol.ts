import { app, protocol } from "electron";
import { AppMiddleware } from "./types";


const protocolMiddleware: AppMiddleware = {
  when: 'all',
  apply() {
    app.whenReady().then(() => {
      protocol.registerFileProtocol('local-file', (request, callback) => {
        const requestedFilePath = decodeURIComponent(
          request.url.replace(/^local-file:(\/\/)?/, ''),
        )
        callback({
          path: requestedFilePath,
        })
      })
    })
  }
}

export default protocolMiddleware