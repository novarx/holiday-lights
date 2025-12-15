import type { ImageLoader } from '../model/imageLoader.interface';
import type { TextRenderer } from '../imagers/textRenderer.interface';

/**
 * Platform-specific implementations that must be provided.
 */
export interface PlatformProviders {
  imageLoader: ImageLoader;
  textRenderer: TextRenderer;
}

let platformProviders: PlatformProviders | null = null;

/**
 * Configures the platform-specific providers.
 * Must be called once at application startup before using platform-dependent imagers.
 *
 * @example
 * // Browser
 * import { configurePlatform } from '@holiday-lights/imager-core';
 * import { BrowserImageLoader, BrowserTextRenderer } from '@holiday-lights/imager-core/browser';
 *
 * configurePlatform({
 *   imageLoader: new BrowserImageLoader(),
 *   textRenderer: new BrowserTextRenderer(),
 * });
 *
 * @example
 * // Node.js
 * import { configurePlatform } from '@holiday-lights/imager-core';
 * import { NodeImageLoader, NodeTextRenderer } from '@holiday-lights/imager-core/node';
 *
 * configurePlatform({
 *   imageLoader: new NodeImageLoader(),
 *   textRenderer: new NodeTextRenderer(),
 * });
 */
export function configurePlatform(providers: PlatformProviders): void {
  platformProviders = providers;
}

/**
 * Gets the configured image loader.
 * @throws Error if platform has not been configured
 */
export function getImageLoader(): ImageLoader {
  if (!platformProviders) {
    throw new Error(
      'Platform not configured. Call configurePlatform() at application startup.'
    );
  }
  return platformProviders.imageLoader;
}

/**
 * Gets the configured text renderer.
 * @throws Error if platform has not been configured
 */
export function getTextRenderer(): TextRenderer {
  if (!platformProviders) {
    throw new Error(
      'Platform not configured. Call configurePlatform() at application startup.'
    );
  }
  return platformProviders.textRenderer;
}

/**
 * Checks if the platform has been configured.
 */
export function isPlatformConfigured(): boolean {
  return platformProviders !== null;
}

/**
 * Resets the platform configuration. Mainly useful for testing.
 */
export function resetPlatform(): void {
  platformProviders = null;
}

