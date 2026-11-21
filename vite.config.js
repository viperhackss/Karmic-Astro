import { defineConfig } from 'vite';

// Relative base so the built site works from any sub-path (GitHub Pages, Netlify, S3…).
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
  },
});
