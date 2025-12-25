import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react({
      // Enable faster refreshes
      fastRefresh: true,
      // Optimize runtime performance
      jsxRuntime: 'automatic'
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'pwa-192x192.svg', 'pwa-512x512.svg'],
      manifest: {
        name: 'Expense Tracker',
        short_name: 'Expense Tracker',
        description: 'Money Management Web App',
        theme_color: '#6366f1',
        background_color: '#ffffff',
        display: 'standalone',
        icon: 'public/pwa-512x512.svg',
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-apis-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7 // <== 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  server: {
    port: 3000,
    open: true,
    // Enable compression for faster loading
    headers: {
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    }
  },
  publicDir: 'public',
  build: {
    // Improve build performance
    chunkSizeWarningLimit: 1000, // Increased from default 500kB to 1000kB
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Enable rollup options for better optimization
    rollupOptions: {
      output: {
        // Optimize chunking strategy
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
          animation: ['framer-motion'],
          icons: ['lucide-react'],
          utils: ['date-fns'],
          // Split pages into separate chunks for better caching
          dashboard: ['./src/pages/Dashboard.jsx'],
          analysis: ['./src/pages/Analysis.jsx'],
          ai: ['./src/pages/AI.jsx'],
          wallets: ['./src/pages/Wallets.jsx'],
          planning: ['./src/pages/FinancialPlanning.jsx'],
          profile: ['./src/pages/Profile.jsx']
        },
        // Optimize asset filenames for better caching
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1)
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img'
          } else if (/woff|woff2/.test(extType)) {
            extType = 'fonts'
          }
          return `assets/${extType}/[name]-[hash][extname]`
        },
        // Optimize chunk filenames
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    // Enable minification
    minify: 'esbuild',
    // Enable CSS minification
    cssMinify: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'date-fns', 'chart.js', 'react-chartjs-2', 'lucide-react'],
    // Enable esbuild for faster builds
    esbuildOptions: {
      // Enable tree shaking
      treeShaking: true,
      // Enable minification during dev
      minify: false
    }
  }
})