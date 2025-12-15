import './style.css';
import { Emulator } from './emulator';
import { MultiMatrixEmulator } from './multi-matrix-emulator';
import { MultiImageService } from './multi-image.service';
import { Router } from './router';

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

