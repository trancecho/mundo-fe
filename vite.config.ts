import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "VITE_");
    return{
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
            devSourcemap: true,
        },
        build:{
            sourcemap: true,
        },
        server: {
            port:env.VITE_port,
            // proxy: {
            //     '/api': {
            //         target: process.env.baseURL,
            //         changeOrigin: true,
            //         rewrite: (path) => path.replace(/^\/api/, ''),
            //     },
            // },
        },
        esbuild:{
            jsxDev:mode!=='production',
        }
    }
})
