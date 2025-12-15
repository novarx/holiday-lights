import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@holiday-lights/imager-core/browser': resolve(__dirname, '../../libs/imager-core/src/browser/index.ts'),
      '@holiday-lights/imager-core/node': resolve(__dirname, '../../libs/imager-core/src/node/index.ts'),
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

