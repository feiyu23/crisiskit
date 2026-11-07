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
          includeAssets: ['icon.svg', 'robots.txt', 'sitemap.xml', 'og-image.png', 'offline.html'],
          manifest: {
            name: 'Sparks Beacon · 星火应急信标',
            short_name: 'SparksBeacon',
            description: '纯公益全天候极境离线防灾求生站与备灾互助平台。支持完全离线运行：72h家庭备灾物资计算器、避难所余缺互助调剂板、地震火山防灾手册、零流量卫星呼救与声光信标。',
            theme_color: '#dc2626',
            background_color: '#070a12',
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
                name: 'Emergency SOS',
                short_name: 'SOS',
                description: 'Quick emergency submission & satellite SMS',
                url: '/#/submit',
                icons: [{ src: 'icon.svg', sizes: '192x192' }]
              },
              {
                name: 'Stockpile Calculator',
                short_name: 'Stockpile',
                description: 'Family disaster stockpile checklist',
                url: '/#/',
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
          external: [],
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('leaflet')) return 'vendor-map';
                if (id.includes('@google/generative-ai')) return 'vendor-ai';
                if (id.includes('lucide-react')) return 'vendor-icons';
                if (id.includes('@supabase') || id.includes('dexie')) return 'vendor-db';
                return 'vendor';
              }
            }
          }
        }
      },
      optimizeDeps: {
        exclude: []
      }
    };
});
