import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  resolve: {
    alias: {
      '@holiday-lights/imager-core/browser': resolve(__dirname, '../../libs/imager-core/src/browser/index.ts'),
      '@holiday-lights/imager-core/node': resolve(__dirname, '../../libs/imager-core/src/node/index.ts'),
      '@holiday-lights/imager-core': resolve(__dirname, '../../libs/imager-core/src/index.ts')
    }
  },
  server: {
    fs: {
      // Allow serving files from the imager-core lib
      allow: ['..', '../..']
    },
    watch: {
      // Watch the imager-core lib for changes
      ignored: ['!**/libs/imager-core/**']
    }
  },
  publicDir: 'public',
  plugins: [
    {
      name: 'serve-imager-core-assets',
      configureServer(server) {
        const assetsPath = resolve(__dirname, '../../libs/imager-core/src/assets');
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/libs/imager-core/src/assets/')) {
            const fileName = req.url.replace('/libs/imager-core/src/assets/', '');
            const filePath = resolve(assetsPath, fileName);

            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'image/png');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
          next();
        });
      }
    }
  ]
});

