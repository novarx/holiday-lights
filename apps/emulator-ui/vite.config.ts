import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@holiday-lights/imager-core': resolve(__dirname, '../../libs/imager-core/src/index.ts')
    }
  },
  server: {
    watch: {
      // Watch the imager-core lib for changes
      ignored: ['!**/libs/imager-core/**']
    }
  }
});

