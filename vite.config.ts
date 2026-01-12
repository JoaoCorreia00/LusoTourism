import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  //base: '/Teste-Build',
  server: {
    proxy: {
      '/api': {
        target: 'https://servergeo.sgeconomia.gov.pt',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      }
    }
  }
})
