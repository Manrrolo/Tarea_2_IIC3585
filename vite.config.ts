import { defineConfig } from 'vite';
import path from 'path';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    wasm(),
    topLevelAwait(),
    VitePWA({
      registerType: 'autoUpdate',
      filename:'sw.js',
      includeAssets: ['favicon.svg', 'icon.png', 'icon2.png'],
      manifest: {
        name: 'WASM Image Editor',
        short_name: 'ImgEdit',
        start_url: '/wasm-image-pwa/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#333333',
        icons: [
          {
            src: '/wasm-image-pwa/icon2.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@wasm': path.resolve(__dirname, './rust-image/rust-image-filters/pkg'),
    },
  },
});
