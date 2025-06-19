import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/_redirects',
          dest: '.', // copy to root of dist
        },
      ],
    }),
  ],
  build: {
    outDir: 'dist', // Render deploys this folder
  },
  server: {
    port: 5173,
  },
});
