import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      '.trycloudflare.com',
      '.cloudflareaccess.com',
      'realized-basin-titans-regular.trycloudflare.com',
      'use-poem-oct-colleague.trycloudflare.com'
    ],
  },
})


