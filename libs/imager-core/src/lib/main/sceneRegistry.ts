import type { Imager } from '../model/imager';

/**
 * Factory function type for creating scene instances.
 */
export type SceneFactory = () => Imager;

/**
 * Global registry for scenes to self-register.
 * Scenes register themselves by calling SceneRegistry.register() at module load time.
 */
export class SceneRegistry {
  private static scenes: SceneFactory[] = [];

  /**
   * Registers a scene factory function.
   * @param factory - Function that creates a new instance of the scene
   */
  static register(factory: SceneFactory): void {
    this.scenes.push(factory);
  }

  /**
   * Gets all registered scene instances.
   * Creates a new instance of each scene by calling its factory function.
   */
  static getAll(): Imager[] {
    return this.scenes.map(factory => {
      try {
        return factory();
      } catch (error) {
        console.warn('Failed to instantiate scene:', error);
        return null;
      }
    }).filter((scene): scene is Imager => scene !== null);
  }

  /**
   * Gets the number of registered scenes.
   */
  static count(): number {
    return this.scenes.length;
  }

  /**
   * Clears all registered scenes (useful for testing).
   */
  static clear(): void {
    this.scenes = [];
  }
}

