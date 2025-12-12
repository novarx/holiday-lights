import { Dimensions, Coordinates } from '@holiday-lights/imager-core';

/**
 * Converts an image file to a matrix representation with pixel color data.
 */
export class ImageToMatrixConverter {
  private imageData: ImageData | null = null;
  private scaledDimensions: Dimensions | null = null;
  private offset: Coordinates = { x: 0, y: 0 };
  private isLoaded: boolean = false;

  /**
   * Creates an ImageToMatrixConverter that loads an image from the specified path.
   * @param imagePath - Path to the image file
   * @param maxDimensions - Maximum dimensions to scale the image
   */
  constructor(
    private readonly imagePath: string,
    private readonly maxDimensions: Dimensions
  ) {
    this.loadImage();
  }

  /**
   * Loads the image and scales it to fit within the specified dimensions.
   */
  private loadImage(): void {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      this.scaledDimensions = this.calculateScaledDimensions(img.width, img.height);
      this.offset = this.maxDimensions.centerOffset(this.scaledDimensions);

      const canvas = document.createElement('canvas');
      canvas.width = this.scaledDimensions.width;
      canvas.height = this.scaledDimensions.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(img, 0, 0, this.scaledDimensions.width, this.scaledDimensions.height);
        this.imageData = ctx.getImageData(0, 0, this.scaledDimensions.width, this.scaledDimensions.height);
        this.isLoaded = true;
      }
    };

    img.onerror = () => {
      console.error(`Failed to load image: ${this.imagePath}`);
      this.isLoaded = false;
    };

    img.src = this.imagePath;
  }

  /**
   * Calculates scaled dimensions while maintaining aspect ratio.
   */
  private calculateScaledDimensions(originalWidth: number, originalHeight: number): Dimensions {
    const aspectRatio = originalWidth / originalHeight;
    let width: number;
    let height: number;

    if (originalWidth > originalHeight) {
      width = Math.min(originalWidth, this.maxDimensions.width);
      height = Math.round(width / aspectRatio);

      if (height > this.maxDimensions.height) {
        height = this.maxDimensions.height;
        width = Math.round(height * aspectRatio);
      }
    } else {
      height = Math.min(originalHeight, this.maxDimensions.height);
      width = Math.round(height * aspectRatio);

      if (width > this.maxDimensions.width) {
        width = this.maxDimensions.width;
        height = Math.round(width / aspectRatio);
      }
    }

    return new Dimensions(width, height);
  }

  /**
   * Gets the pixel color from the loaded image data.
   * @param x - X coordinate in the matrix
   * @param y - Y coordinate in the matrix
   * @returns RGB values as [r, g, b] or null if out of bounds or not loaded
   */
  getPixelColor(x: number, y: number): [number, number, number] | null {
    if (!this.isLoaded || !this.imageData || !this.scaledDimensions) {
      return null;
    }

    if (x < 0 || x >= this.scaledDimensions.width || y < 0 || y >= this.scaledDimensions.height) {
      return null;
    }

    const index = (y * this.scaledDimensions.width + x) * 4;
    const r = this.imageData.data[index];
    const g = this.imageData.data[index + 1];
    const b = this.imageData.data[index + 2];

    return [r, g, b];
  }

  /**
   * Checks if the image has been loaded successfully.
   */
  isImageLoaded(): boolean {
    return this.isLoaded;
  }

  /**
   * Gets the scaled dimensions of the image.
   */
  getScaledDimensions(): Dimensions | null {
    return this.scaledDimensions;
  }

  /**
   * Gets the offset values used to center the image.
   */
  getOffsets(): Coordinates {
    return this.offset;
  }
}

