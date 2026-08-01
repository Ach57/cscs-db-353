import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // or 'localhost'
    port: 3000,        // choose your preferred port
    strictPort: true,  // fail instead of picking another port
  },
})
