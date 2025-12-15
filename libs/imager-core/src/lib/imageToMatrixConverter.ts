import { Dimensions } from './dimensions';
import type { ImageLoader, RawImageData } from './imageLoader.interface';

/**
 * Converts an image file to a matrix representation with pixel color data.
 * Platform-agnostic implementation that uses an ImageLoader for loading images.
 */
export class ImageToMatrixConverter {
  private imageData: RawImageData | null = null;
  private loadPromise: Promise<void> | null = null;

  /**
   * Creates an ImageToMatrixConverter with the specified image loader.
   * @param imageLoader - Platform-specific image loader implementation
   * @param imagePath - Path to the image file
   * @param maxDimensions - Maximum dimensions to scale the image
   */
  constructor(
    private readonly imageLoader: ImageLoader,
    private readonly imagePath: string,
    private readonly maxDimensions: Dimensions
  ) {
    this.loadPromise = this.loadImage();
  }

  /**
   * Loads the image using the provided image loader.
   */
  private async loadImage(): Promise<void> {
    try {
      this.imageData = await this.imageLoader.loadImage(this.imagePath, this.maxDimensions);
    } catch (error) {
      console.error(`Failed to load image: ${this.imagePath}`, error);
      this.imageData = null;
    }
  }

  /**
   * Waits for the image to be loaded.
   * @returns Promise that resolves when the image is loaded
   */
  async waitForLoad(): Promise<boolean> {
    if (this.loadPromise) {
      await this.loadPromise;
    }
    return this.imageData !== null;
  }

  /**
   * Gets whether the image is loaded.
   */
  isLoaded(): boolean {
    return this.imageData !== null;
  }

  /**
   * Gets the pixel color from the loaded image data.
   * @param x - X coordinate in the matrix
   * @param y - Y coordinate in the matrix
   * @returns RGB values as [r, g, b] or null if out of bounds or not loaded
   */
  getPixelColor(x: number, y: number): [number, number, number] | null {
    if (!this.imageData) {
      return null;
    }

    if (x < 0 || x >= this.imageData.width || y < 0 || y >= this.imageData.height) {
      return null;
    }

    const index = (y * this.imageData.width + x) * 4;
    const r = this.imageData.data[index];
    const g = this.imageData.data[index + 1];
    const b = this.imageData.data[index + 2];

    return [r, g, b];
  }

  /**
   * Gets the scaled dimensions of the loaded image.
   */
  getScaledDimensions(): Dimensions | null {
    if (!this.imageData) {
      return null;
    }
    return new Dimensions(this.imageData.width, this.imageData.height);
  }
}

