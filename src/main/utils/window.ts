import { is } from "@electron-toolkit/utils"
import { BrowserWindow, shell } from "electron"
import path from "path"
import icon from '../../../resources/logo.png?asset'

export const DEFAULT_DEV_URL = process.env['ELECTRON_RENDERER_URL']!
export const DEFAUL_URL = path.join(__dirname, '../renderer/index.html')

export function createWindow(options?: { devUrl?: string, url?: string }) {
  const defaultOptions = {
    devUrl: DEFAULT_DEV_URL,
    url: DEFAUL_URL,
  }
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  }

  const win = new BrowserWindow({
    width: 900,
    height: 600,
    icon: path.join(__dirname, '../../resources/logo.png'),
    show: false,
    autoHideMenuBar: true,
    titleBarOverlay: false,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
    }
  })

  win.on('ready-to-show', () => {
    win.show()
  })

  // win.webContents.openDevTools()

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const loadPromise = is.dev
    ? win.loadURL(mergedOptions.devUrl ?? mergedOptions.url)
    : win.loadFile(mergedOptions.url)

  return {
    win,
    loadPromise
  }
}