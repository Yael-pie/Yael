import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/Yael/', 
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about_me: resolve(__dirname, 'src/about_me/index.html'),
      },
    },
  },
})