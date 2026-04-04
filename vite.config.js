import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/forecast-hourly': {
        target: 'https://ncu-niag-weather-detect.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/forecast-hourly/, '/api/forecast-hourly'),
      },
    },
  },
})
