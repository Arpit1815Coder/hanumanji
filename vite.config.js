import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose on 0.0.0.0 so mobile phones on local Wi-Fi can access http://<local-ip>:5173
    port: 5173
  }
})
