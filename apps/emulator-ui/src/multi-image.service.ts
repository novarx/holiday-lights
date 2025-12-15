import { type Imager, AllScenesLoader } from '@holiday-lights/imager-core';

export interface SceneInfo {
  id: string;
  name: string;
  imager: Imager;
}

/**
 * Service that provides multiple matrix imagers for the slideshow display.
 * Uses AllScenesLoader from imager-core to load all available scenes.
 */
export class MultiImageService {
  private readonly sceneLoader: AllScenesLoader;
  private readonly scenes: SceneInfo[];

  constructor() {
    this.sceneLoader = new AllScenesLoader();
    const imagers = this.sceneLoader.getImagers();

    // Create scene info for each imager
    this.scenes = imagers.map((imager, index) => ({
      id: `scene-${index}`,
      name: this.getSceneName(imager),
      imager
    }));
  }

  /**
   * Gets all available scene info.
   */
  getAllScenes(): SceneInfo[] {
    return this.scenes;
  }

  /**
   * Gets imagers for selected scene IDs.
   * @param selectedIds - Array of scene IDs to include, or empty array for all scenes
   */
  getImagers(selectedIds: string[] = []): Imager[] {
    if (selectedIds.length === 0) {
      return this.scenes.map(s => s.imager);
    }

    return this.scenes
      .filter(scene => selectedIds.includes(scene.id))
      .map(s => s.imager);
  }

  /**
   * Extracts a friendly name from the imager's constructor name.
   */
  private getSceneName(imager: Imager): string {
    const className = imager.constructor.name;
    // Convert "BubblegumScene" to "Bubblegum", "DefaultScene" to "Default", etc.
    return className.replace(/Scene$/, '');
  }
}

