import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const moduleId = id.replace(/\\/g, "/");
          if (!moduleId.includes("/node_modules/")) return;

          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(moduleId)) {
            return "vendor";
          }
          if (/\/node_modules\/(react-router|react-router-dom)\//.test(moduleId)) {
            return "router";
          }
          if (/\/node_modules\/(i18next|react-i18next|i18next-browser-languagedetector)\//.test(moduleId)) {
            return "i18n";
          }
          if (/\/node_modules\/react-icons\//.test(moduleId)) {
            return "icons";
          }
          if (/\/node_modules\/(react-quill-new|quill|parchment|quill-delta)\//.test(moduleId)) {
            return "editor";
          }
        },
      },
    },
  },
  server: {
    /* Must match the port server/index.js listens on (PORT, default 5000).
       This is what makes http://localhost:5173/api/admin/... reach the REAL
       Vercel handler instead of a 404. */
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
