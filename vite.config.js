import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // ✅ Transmettre tous les headers dont Authorization
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Transmettre le token JWT
            if (req.headers['authorization']) {
              proxyReq.setHeader('Authorization', req.headers['authorization'])
            }
            // Transmettre le content-type
            if (req.headers['content-type']) {
              proxyReq.setHeader('Content-Type', req.headers['content-type'])
            }
          })
        }
      }
    }
  }
})