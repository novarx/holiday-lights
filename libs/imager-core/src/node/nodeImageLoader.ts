import type { Dimensions } from '../lib/dimensions';
import type { ImageLoader, RawImageData } from '../lib/imageLoader.interface';

/**
 * Node.js-specific implementation of ImageLoader using sharp.
 * Note: Requires 'sharp' to be installed as a dependency.
 */
export class NodeImageLoader implements ImageLoader {
  /**
   * Loads an image from the specified path using sharp.
   */
  async loadImage(imagePath: string, maxDimensions: Dimensions): Promise<RawImageData> {
    // Dynamic import to avoid bundling sharp in browser builds
    const sharp = await import('sharp');
    const image = sharp.default(imagePath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error(`Unable to read image dimensions: ${imagePath}`);
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

