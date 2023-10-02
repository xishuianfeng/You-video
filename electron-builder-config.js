/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  directories: {
    output: 'dist',
    buildResources: 'build',
  },
  appId: 'com.You-video-player.app',
  productName: 'You-video-player',
  files: {
    filter: [
      '!**/.vscode/*',
      '!assets/*',
      '!resources/ffmpeg-binaries/*',
      '!src/*',
      '!electron.vite.config.{js,ts,mjs,cjs}',
      '!{.eslintignore,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}',
      '!{.env,.env.*,.npmrc,pnpm-lock.yaml}',
      '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}',
      '!electron-builder-config.{js,ts,mjs,cjs}',
    ],
  },
  fileAssociations: {
    ext: ['mp4', 'mkv'],
    name: 'Vidoe',
    role: 'Viewer',
  },
  asarUnpack: ['resources/*'],
  afterSign: 'build/notarize.js',
  icon: './resources/logo.png',
  win: {
    executableName: 'You-video-player',
    target: 'nsis',
    extraResources: [
      {
        from: 'resources/ffmpeg-binaries/ffmpeg.exe',
        to: 'ffmpeg.exe',
      },
      {
        from: 'resources/ffmpeg-binaries/ffprobe.exe',
        to: 'ffprobe.exe',
      },
    ],
  },
  nsis: {
    artifactName: '${name}-${version}-setup.${ext}',
    shortcutName: '${productName}',
    uninstallDisplayName: '${productName}',
    createDesktopShortcut: 'always',
    installerIcon: './resources/logo.ico',
    uninstallerIcon:'./resources/logo.ico',
    installerHeaderIcon:'./resources/logo.ico'
  },
  mac: {
    target: {
      target: 'default',
      arch: [
        // 'arm64',
        'x64',
      ],
    },
    entitlementsInherit: 'build/entitlements.mac.plist',
    extendInfo: {
      NSCameraUsageDescription:
        "Application requests access to the device's camera.",
      NSMicrophoneUsageDescription:
        "Application requests access to the device's microphone.",
      NSDocumentsFolderUsageDescription:
        "Application requests access to the user's Documents folder.",
      NSDownloadsFolderUsageDescription:
        "Application requests access to the user's Downloads folder.",
    },
    extraResources: [
      {
        from: 'resources/ffmpeg-binaries/ffmpeg-universal',
        to: 'ffmpeg-universal',
      },
      {
        from: 'resources/ffmpeg-binaries/ffprobe-universal',
        to: 'ffprobe-universal',
      },
    ],
  },
  dmg: {
    artifactName: '${name}-${version}-${arch}.${ext}',
  },
  linux: {
    target: ['AppImage', 'snap', 'deb'],
    maintainer: 'electronjs.org',
    category: 'Utility',
  },
  appImage: {
    artifactName: '${name}-${version}.${ext}',
  },
  npmRebuild: false,
  publish: {
    provider: 'generic',
    url: 'https://example.com/auto-updates',
  },
  electronVersion: '24.0.0',
}

module.exports = config
