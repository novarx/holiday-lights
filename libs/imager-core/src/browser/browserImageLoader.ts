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
   * Implements fallback logic to try alternative paths if the primary path fails.
   */
  async loadImage(imagePath: string, maxDimensions: Dimensions): Promise<RawImageData> {
    const primaryPath = this.resolvePath(imagePath);

    // Try primary path first, then fallback paths
    const pathsToTry = [primaryPath];

    // Add fallback for StackBlitz: if primary is /assets/*, try /public/assets/*
    if (primaryPath.startsWith('/assets/')) {
      pathsToTry.push(primaryPath.replace('/assets/', '/public/assets/'));
    }

    return this.tryLoadImage(imagePath, pathsToTry, maxDimensions);
  }

  /**
   * Attempts to load an image from multiple possible paths.
   */
  private async tryLoadImage(
    originalPath: string,
    pathsToTry: string[],
    maxDimensions: Dimensions,
    attemptIndex: number = 0
  ): Promise<RawImageData> {
    if (attemptIndex >= pathsToTry.length) {
      throw new Error(
        `Failed to load image: ${originalPath}. Tried paths: ${pathsToTry.join(', ')}`
      );
    }

    const currentPath = pathsToTry[attemptIndex];

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        if (attemptIndex > 0) {
          console.log(`Successfully loaded image from fallback path: ${currentPath}`);
        }

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
        // Try next path
        this.tryLoadImage(originalPath, pathsToTry, maxDimensions, attemptIndex + 1)
          .then(resolve)
          .catch(reject);
      };

      img.src = currentPath;
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

