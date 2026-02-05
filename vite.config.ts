import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/count/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192x192.svg', 'pwa-512x512.svg'],
      manifest: {
        name: 'Card Counter Pro',
        short_name: 'CardCounter',
        description: 'Learn and practice card counting with the Hi-Lo system',
        theme_color: '#0d5c2e',
        background_color: '#111827',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: '/count/index.html',
        navigateFallbackDenylist: [/^\/count\/api/, /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/jxv210016\.github\.io\/count\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'count-app-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          }
        ]
      }
    })
  ],
})
