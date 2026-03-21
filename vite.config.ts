import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  define: {
    'process.env': {} // process.env desteği için
  },
  server: {
    allowedHosts: [
    '.loca.lt',
    '.ngrok-free.dev',
    '.trycloudflare.com',
    'localhost',
    '127.0.0.1'
  ],
    host: true,
    port: 5173,
    strictPort: true,
    cors: true,
    hmr: {
      host: 'darwin-visibility-comp-suitable.trycloudflare.com',
      protocol: 'wss',
      clientPort: 443
    }
  },
  preview: {
    allowedHosts: [
      'unrhythmical-unsawed-pat.ngrok-free.dev',
      'darwin-visibility-comp-suitable.trycloudflare.com',
      '.ngrok-free.dev',
      '.trycloudflare.com',
      'localhost',
      '127.0.0.1'
    ],
    host: true,
    port: 5173,
    strictPort: true,
    cors: true
  }
})