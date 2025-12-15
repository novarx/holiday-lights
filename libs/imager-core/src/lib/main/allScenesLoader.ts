import type { Imager } from '../model/imager';
import { BubblegumScene } from '../../scenes/bubblegum.scene';
import { DefaultScene } from '../../scenes/default.scene';
import { RandomScene } from '../../scenes/random.scene';
import { TextScene } from '../../scenes/text.scene';

/**
 * Centralized loader for all scenes defined in imager-core.
 * This eliminates the need for platform-specific module loading.
 */
export class AllScenesLoader {
  private readonly imagers: Imager[];

  constructor() {
    this.imagers = this.loadAllScenes();
  }

  /**
   * Gets all loaded imagers/scenes.
   */
  getImagers(): Imager[] {
    return this.imagers;
  }

  /**
   * Loads and instantiates all available scenes.
   */
  private loadAllScenes(): Imager[] {
    const scenes: Imager[] = [];

    // Instantiate each scene with default parameters
    try {
      scenes.push(new BubblegumScene());
    } catch (error) {
      console.warn('Failed to instantiate BubblegumScene:', error);
    }

    try {
      scenes.push(new DefaultScene());
    } catch (error) {
      console.warn('Failed to instantiate DefaultScene:', error);
    }

    try {
      scenes.push(new RandomScene());
    } catch (error) {
      console.warn('Failed to instantiate RandomScene:', error);
    }

    try {
      scenes.push(new TextScene());
    } catch (error) {
      console.warn('Failed to instantiate TextScene:', error);
    }

    console.log(`Loaded ${scenes.length} scenes`);
    return scenes;
  }
}

