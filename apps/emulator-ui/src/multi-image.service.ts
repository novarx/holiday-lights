import { type Imager, SceneLoader, type ImagerModule } from '@holiday-lights/imager-core';

// Vite-specific module loader for browser environment
const browserModuleLoader = () =>
  import.meta.glob('./scenes/*.scene.ts', { eager: true }) as Record<string, ImagerModule>;

/**
 * Service that provides multiple matrix imagers for the slideshow display.
 * Uses SceneLoader from imager-core with browser-specific module loading.
 */
export class MultiImageService {
  private readonly sceneLoader: SceneLoader;

  constructor() {
    this.sceneLoader = new SceneLoader(browserModuleLoader);
  }

  /**
   * Gets all configured imagers.
   */
  getImagers(): Imager[] {
    return this.sceneLoader.getImagers();
  }
}

