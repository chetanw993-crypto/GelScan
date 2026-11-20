import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// Check if SSL is enabled via environment variable USE_SSL=true
const enableSsl = process.env.USE_SSL === 'true'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Ensures relative assets work on GitHub Pages, Vercel, or local network
  plugins: [
    react(),
    tailwindcss(),
    ...(enableSsl ? [basicSsl()] : []),
  ],
  server: {
    host: true,
    port: 5173,
    cors: true,
  },
  preview: {
    host: true,
    port: 5173,
    cors: true,
  },
})
