import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', 'VITE_');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['icon.svg', 'robots.txt', 'offline.html'],
          manifest: {
            name: 'CrisisKit - 10-Second Crisis Management',
            short_name: 'CrisisKit',
            description: 'Ultra-fast crisis response for emergencies. Submit incidents, coordinate responses, and manage disasters in 10 seconds or less.',
            theme_color: '#dc2626',
            background_color: '#ffffff',
            display: 'standalone',
            orientation: 'portrait',
            start_url: '/',
            scope: '/',
            icons: [
              {
                src: 'icon.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              }
            ],
            shortcuts: [
              {
                name: 'Emergency Submit',
                short_name: 'SOS',
                description: 'Quick emergency submission',
                url: '/#/submit',
                icons: [{ src: 'icon.svg', sizes: '192x192' }]
              }
            ]
          },
          workbox: {
            // App Shell - Cache First Strategy
            globPatterns: ['**/*.{js,css,html,ico,svg,png,jpg,jpeg,woff,woff2}'],
            runtimeCaching: [
              {
                // Map tiles caching
                urlPattern: /^https:\/\/.*\.openstreetmap\.org.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'map-tiles',
                  expiration: {
                    maxEntries: 200,
                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                // Leaflet assets
                urlPattern: /^https:\/\/unpkg\.com\/leaflet.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'leaflet-assets',
                  expiration: {
                    maxEntries: 30,
                    maxAgeSeconds: 60 * 60 * 24 * 30
                  }
                }
              },
              {
                // API requests - Network First with offline fallback
                urlPattern: /\/api\/.*/i,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'api-cache',
                  networkTimeoutSeconds: 10,
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 5 // 5 minutes
                  }
                }
              }
            ],
            // Offline fallback
            navigateFallback: 'offline.html',
            navigateFallbackDenylist: [/^\/api/]
          },
          devOptions: {
            enabled: true,
            type: 'module'
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          external: []
        }
      },
      optimizeDeps: {
        exclude: []
      }
    };
});
