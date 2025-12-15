import './style.css';
import { configurePlatform } from '@holiday-lights/imager-core';
import { BrowserImageLoader, BrowserTextRenderer } from '@holiday-lights/imager-core/browser';
import { Emulator } from './emulator';
import { MultiMatrixEmulator } from './multi-matrix-emulator';
import { MultiImageService } from './multi-image.service';
import { Router } from './router';

// Configure platform-specific implementations
// Use the assets folder that Vite copies to the public directory
configurePlatform({
  imageLoader: new BrowserImageLoader('/assets'),
  textRenderer: new BrowserTextRenderer(),
});

const app = document.querySelector<HTMLDivElement>('#app')!;

const router = new Router(app);

router.addRoute({
  path: '/',
  title: 'Single Matrix',
  render: (container) => {
    const emulator = new Emulator(container);
    emulator.start();
    return { stop: () => emulator.stop() };
  }
});

router.addRoute({
  path: '/slideshow',
  title: 'Matrix Slideshow',
  render: (container) => {
    const multiImageService = new MultiImageService();
    const emulator = new MultiMatrixEmulator(
      container,
      multiImageService.getImagers(),
      100
    );
    emulator.start();
    return { stop: () => emulator.stop() };
  }
});

router.start();

