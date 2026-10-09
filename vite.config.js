import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// basicSsl only in dev: camera access needs HTTPS when opened from a phone on the LAN.
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss(), command === 'serve' && basicSsl()],
}))
