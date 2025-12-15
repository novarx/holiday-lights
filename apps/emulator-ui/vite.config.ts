import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@holiday-lights/imager-core/browser': resolve(__dirname, '../../libs/imager-core/src/browser/index.ts'),
      '@holiday-lights/imager-core/node': resolve(__dirname, '../../libs/imager-core/src/node/index.ts'),
      '@holiday-lights/imager-core': resolve(__dirname, '../../libs/imager-core/src/index.ts')
    }
  },
  publicDir: 'public',
  server: {
    watch: {
      // Watch the imager-core lib for changes
      ignored: ['!**/libs/imager-core/**']
    }
  },
  plugins: [
    {
      name: 'copy-imager-core-assets',
      buildStart() {
        // Copy assets from imager-core to public folder for dev server
        const srcAssetsPath = resolve(__dirname, '../../libs/imager-core/src/assets');
        const destAssetsPath = resolve(__dirname, 'public/assets');

        if (!existsSync(destAssetsPath)) {
          mkdirSync(destAssetsPath, { recursive: true });
        }

        if (existsSync(srcAssetsPath)) {
          const files = readdirSync(srcAssetsPath);
          files.forEach(file => {
            copyFileSync(
              resolve(srcAssetsPath, file),
              resolve(destAssetsPath, file)
            );
          });
          console.log(`Copied ${files.length} asset(s) from imager-core to public/assets`);
        }
      }
    }
  ]
});

