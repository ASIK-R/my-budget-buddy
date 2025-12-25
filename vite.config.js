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