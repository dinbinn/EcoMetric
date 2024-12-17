// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'global': {}
  },
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      input: 'src/main.jsx',
    },
  },
});
