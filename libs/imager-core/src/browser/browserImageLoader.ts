import type { Dimensions } from '../lib/model/dimensions';
import type { ImageLoader, RawImageData } from '../lib/model/imageLoader.interface';

/**
 * Browser-specific implementation of ImageLoader using HTMLCanvasElement.
 */
export class BrowserImageLoader implements ImageLoader {
  private basePath: string = '/assets';

  /**
   * Creates a BrowserImageLoader with an optional base path.
   * @param basePath - Base directory for resolving relative image paths (defaults to '/assets')
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
   * Resolves the image path to a full URL.
   * If the path is relative, it's resolved relative to the basePath (assets folder).
   */
  private resolvePath(imagePath: string): string {
    // If it's already an absolute URL or starts with /, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
      return imagePath;
    }
    // Otherwise, resolve relative to the assets folder
    const normalizedBasePath = this.basePath.endsWith('/') ? this.basePath : `${this.basePath}/`;
    return `${normalizedBasePath}${imagePath}`;
  }

  /**
   * Loads an image from the specified path using browser APIs.
   */
  async loadImage(imagePath: string, maxDimensions: Dimensions): Promise<RawImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const scaledDimensions = this.calculateScaledDimensions(
          img.width,
          img.height,
          maxDimensions
        );

        const canvas = document.createElement('canvas');
        canvas.width = scaledDimensions.width;
        canvas.height = scaledDimensions.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, scaledDimensions.width, scaledDimensions.height);
        const imageData = ctx.getImageData(0, 0, scaledDimensions.width, scaledDimensions.height);

        resolve({
          data: imageData.data,
          width: scaledDimensions.width,
          height: scaledDimensions.height,
        });
      };

      img.onerror = () => {
        const resolvedPath = this.resolvePath(imagePath);
        reject(new Error(`Failed to load image: ${imagePath} (resolved to: ${resolvedPath})`));
      };

      img.src = this.resolvePath(imagePath);
    });
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

