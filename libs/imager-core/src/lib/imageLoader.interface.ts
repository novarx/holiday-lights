import { Dimensions } from './dimensions';

/**
 * Represents raw image data with RGBA pixels.
 */
export interface RawImageData {
  /** Raw pixel data in RGBA format (4 bytes per pixel) */
  data: Uint8ClampedArray;
  /** Width of the image in pixels */
  width: number;
  /** Height of the image in pixels */
  height: number;
}

/**
 * Interface for loading images in a platform-agnostic way.
 * Implementations handle the platform-specific image loading logic.
 */
export interface ImageLoader {
  /**
   * Loads an image from the specified path or URL and scales it to fit within maxDimensions.
   * @param imagePath - Path or URL to the image file
   * @param maxDimensions - Maximum dimensions to scale the image to
   * @returns Promise resolving to the loaded and scaled image data
   */
  loadImage(imagePath: string, maxDimensions: Dimensions): Promise<RawImageData>;
}

