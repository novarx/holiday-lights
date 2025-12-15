import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@holiday-lights/imager-core': resolve(__dirname, '../../libs/imager-core/src/index.ts')
    }
  }
});

