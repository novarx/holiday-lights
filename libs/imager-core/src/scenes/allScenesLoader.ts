import type { Imager } from '../lib/model/imager';
import { SceneRegistry } from '../lib/main/sceneRegistry';

// Import all scenes to trigger their registration
// The scenes will self-register when their modules are loaded
import './default.scene';
import './rotating-square.scene';
import './tetris.scene';
import './pulsating'

/**
 * Centralized loader for all scenes defined in imager-core.
 * Uses SceneRegistry for dynamic scene loading - scenes self-register at module load time.
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
   * Loads all registered scenes from the SceneRegistry.
   */
  private loadAllScenes(): Imager[] {
    const scenes = SceneRegistry.getAll();
    console.log(`Loaded ${scenes.length} scenes from registry`);
    return scenes;
  }
}

