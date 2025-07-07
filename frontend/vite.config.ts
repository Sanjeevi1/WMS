import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Default backend URL if not set in env
  const BACKEND_URL = env.VITE_BACKEND_URL || 'http://localhost:4000'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/socket.io': {
          target: BACKEND_URL,
          ws: true,
          changeOrigin: true,
          secure: false
        },
        '/api': {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false
        }
      }
    },
    define: {
      'process.env.BACKEND_URL': JSON.stringify(BACKEND_URL)
    }
  }
})
