import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['../tests/frontend/setup.js'],
    include: ['../tests/frontend/**/*.test.{js,jsx}'],
    server: {
      fs: { allow: ['..'] },
    },
  },
});
