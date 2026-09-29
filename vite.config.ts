import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon_Med.png'],
      manifest: {
        name: 'MedBCRG',
        short_name: 'MedBCRG',
        description: 'Gestion Médicale & Pharmacie de la BCRG',
        theme_color: '#1b3b31',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icon_Med.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon_Med.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icon_Med.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
