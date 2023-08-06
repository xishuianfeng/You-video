import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

const config = defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['lowdb', 'globby'],
      }),
    ],
    resolve: {
      alias: {
        '@main': resolve('./src/main'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // manualChunks(id) {
          //   const deps = ['lowdb']
          //   const dep = deps.find((dep) => id.includes(dep))
          //   if (dep) {
          //     return dep
          //   }
          //   return undefined
          // }
        },
      },
    },
  },
  preload: {
    resolve: {
      alias: {
        '@preload': resolve('./src/preload'),
      },
    },
    plugins: [
      externalizeDepsPlugin({
        exclude: ['lowdb'],
      }),
    ],
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [react()],
  },
})

export default config
