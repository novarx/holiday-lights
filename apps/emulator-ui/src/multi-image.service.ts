import { type Imager, AllScenesLoader } from '@holiday-lights/imager-core';

/**
 * Service that provides multiple matrix imagers for the slideshow display.
 * Uses AllScenesLoader from imager-core to load all available scenes.
 */
export class MultiImageService {
  private readonly sceneLoader: AllScenesLoader;

  constructor() {
    this.sceneLoader = new AllScenesLoader();
  }

  /**
   * Gets all configured imagers.
   */
  getImagers(): Imager[] {
    return this.sceneLoader.getImagers();
  }
}

