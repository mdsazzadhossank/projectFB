import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base so the build works at the domain root OR in a subfolder
  // (e.g. cPanel public_html/subfolder). API calls stay absolute (/api) which
  // must match where the PHP backend is deployed.
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Split heaviest vendor libraries so the main bundle stays lean and
        // each library can be cached independently.
        manualChunks: {
          charts: ['recharts'],
          realtime: ['pusher-js'],
        },
      },
    },
  },
});
