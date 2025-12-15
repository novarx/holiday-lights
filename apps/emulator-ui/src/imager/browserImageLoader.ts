import type { Dimensions, ImageLoader, RawImageData } from '@holiday-lights/imager-core';

/**
 * Browser-specific implementation of ImageLoader using HTMLCanvasElement.
 */
export class BrowserImageLoader implements ImageLoader {
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
        reject(new Error(`Failed to load image: ${imagePath}`));
      };

      img.src = imagePath;
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

