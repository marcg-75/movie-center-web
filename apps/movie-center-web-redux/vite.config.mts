/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/movie-center-web-redux',
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  test: {
    name: 'movie-center-web-redux',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    passWithNoTests: true,
    setupFiles: ['./src/setupTests.js'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/movie-center-web-redux',
      provider: 'v8' as const,
    },
  },
}));
