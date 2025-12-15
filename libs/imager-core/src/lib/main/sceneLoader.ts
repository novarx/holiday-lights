import { type Imager } from '../model/imager';

/**
 * Type representing a module that exports Imager classes.
 */
export type ImagerModule = Record<string, new () => Imager>;

/**
 * Type for a function that loads imager modules.
 * Platform-specific implementations provide this function.
 */
export type ImagerModuleLoader = () => Record<string, ImagerModule>;

/**
 * Service that dynamically loads and manages multiple imagers.
 * Platform-agnostic - requires a module loader to be provided.
 */
export class SceneLoader {
  private readonly imagers: Imager[];

  /**
   * Creates a new SceneLoader.
   * @param moduleLoader - Platform-specific function that returns loaded modules
   * @param classNamePattern - Optional pattern to match class names (default: ends with 'Scene')
   */
  constructor(
    moduleLoader: ImagerModuleLoader,
    private readonly classNamePattern: RegExp = /Scene$/
  ) {
    this.imagers = this.loadAllScenes(moduleLoader);
  }

  /**
   * Gets all loaded imagers.
   */
  getImagers(): Imager[] {
    return this.imagers;
  }

  /**
   * Dynamically loads and instantiates all scene classes.
   */
  private loadAllScenes(moduleLoader: ImagerModuleLoader): Imager[] {
    const imagers: Imager[] = [];
    const modules = moduleLoader();

    for (const path in modules) {
      const module = modules[path];
      for (const exportName in module) {
        if (this.classNamePattern.test(exportName)) {
          const SceneClass = module[exportName];
          if (typeof SceneClass === 'function') {
            try {
              imagers.push(new SceneClass());
            } catch (error) {
              console.warn(`Failed to instantiate ${exportName}:`, error);
            }
          }
        }
      }
    }

    return imagers;
  }
}

