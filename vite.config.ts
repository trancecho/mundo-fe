import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react-router-dom": path.resolve(__dirname, "node_modules/react-router-dom")
    },
  },
  css: {
    modules: {
      scopeBehaviour: 'local',
    },
  },
  server: {
    proxy: {
        '/api': {
            target: 'http://116.198.207.159:12349/api',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
        },
    },
},
})
