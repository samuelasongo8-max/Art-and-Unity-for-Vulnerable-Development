import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    /* Must match the port server/index.js listens on (PORT, default 5000).
       This is what makes http://localhost:5173/api/admin/... reach the REAL
       Vercel handler instead of a 404. */
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
