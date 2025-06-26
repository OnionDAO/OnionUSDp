import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      stream: 'stream-browserify',
      util: 'util',
    },
  },
  optimizeDeps: {
    include: [
      'buffer', 
      'process',
      'stream-browserify',
      'util',
      '@solana/web3.js',
      '@solana/spl-token',
      '@solana/pay'
    ],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
})
