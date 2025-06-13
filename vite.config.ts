import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom')
      }
    },
    css: {
      modules: {
        scopeBehaviour: 'local'
      },
      devSourcemap: true
    },
    build: {
      sourcemap: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境移除 console
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    server: {
      port: Number(env.VITE_port)
      // proxy: {
      //     '/api': {
      //         target: process.env.baseURL,
      //         changeOrigin: true,
      //         rewrite: (path) => path.replace(/^\/api/, ''),
      //     },
      // },
    },
    esbuild: {
      jsxDev: mode === 'development'
    }
  }
})
