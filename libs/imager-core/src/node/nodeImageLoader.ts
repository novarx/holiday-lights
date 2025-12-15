import type { Dimensions } from '../lib/model/dimensions';
import type { ImageLoader, RawImageData } from '../lib/model/imageLoader.interface';
import { join, isAbsolute } from 'path';

/**
 * Node.js-specific implementation of ImageLoader using sharp.
 * Note: Requires 'sharp' to be installed as a dependency.
 */
export class NodeImageLoader implements ImageLoader {
  private basePath: string = join(__dirname, 'assets');

  /**
   * Creates a NodeImageLoader with an optional base path.
   * @param basePath - Base directory for resolving relative image paths (defaults to './assets' relative to current directory)
   */
  constructor(basePath?: string) {
    if (basePath) {
      this.basePath = basePath;
    }
  }

  /**
   * Sets the base path for resolving relative image paths.
   */
  setBasePath(basePath: string): void {
    this.basePath = basePath;
  }

  /**
   * Resolves the image path to an absolute path.
   * If the path is relative, it's resolved relative to the basePath (assets folder).
   */
  private resolvePath(imagePath: string): string {
    // If it's already an absolute path or a URL, return as-is
    if (isAbsolute(imagePath) || imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, resolve relative to the assets folder
    return join(this.basePath, imagePath);
  }

  /**
   * Loads an image from the specified path using sharp.
   */
  async loadImage(imagePath: string, maxDimensions: Dimensions): Promise<RawImageData> {
    // Dynamic import to avoid bundling sharp in browser builds
    const sharp = await import('sharp');
    const resolvedPath = this.resolvePath(imagePath);
    const image = sharp.default(resolvedPath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error(`Unable to read image dimensions: ${resolvedPath}`);
    }

    const scaledDimensions = this.calculateScaledDimensions(
      metadata.width,
      metadata.height,
      maxDimensions
    );

    const { data, info } = await image
      .resize(scaledDimensions.width, scaledDimensions.height, {
        fit: 'fill',
      })
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    return {
      data: new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength),
      width: info.width,
      height: info.height,
    };
  }

  /**
   * Calculates scaled dimensions while maintaining aspect ratio.
   */
  private calculateScaledDimensions(
    originalWidth: number,
    originalHeight: number,
    maxDimensions: Dimensions
  ): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight;
    let width: number;
    let height: number;

    if (originalWidth > originalHeight) {
      width = Math.min(originalWidth, maxDimensions.width);
      height = Math.round(width / aspectRatio);

      if (height > maxDimensions.height) {
        height = maxDimensions.height;
        width = Math.round(height * aspectRatio);
      }
    } else {
      height = Math.min(originalHeight, maxDimensions.height);
      width = Math.round(height * aspectRatio);

      if (width > maxDimensions.width) {
        width = maxDimensions.width;
        height = Math.round(width / aspectRatio);
      }
    }

    return { width, height };
  }
}

