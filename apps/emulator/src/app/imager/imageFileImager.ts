import { Imager } from './imager';
import { Matrix, Matrix64x64 } from '../matrix';

/**
 * Imager that loads and displays an image file, scaled to fit within the matrix dimensions.
 */
export class ImageFileImager extends Imager {
  private imageData: ImageData | null = null;
  private scaledWidth: number = 0;
  private scaledHeight: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private isLoaded: boolean = false;

  /**
   * Creates an ImageFileImager that loads an image from the specified path.
   * @param imagePath - Path to the image file
   * @param maxWidth - Maximum width to scale the image (default: 64)
   * @param maxHeight - Maximum height to scale the image (default: 64)
   */
  constructor(
    private readonly imagePath: string,
    private readonly maxWidth: number = 64,
    private readonly maxHeight: number = 64
  ) {
    super();
    this.loadImage();
  }

  /**
   * Loads the image and scales it to fit within the specified dimensions.
   */
  private loadImage(): void {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Calculate scaled dimensions while maintaining aspect ratio
      const aspectRatio = img.width / img.height;

      if (img.width > img.height) {
        this.scaledWidth = Math.min(img.width, this.maxWidth);
        this.scaledHeight = Math.round(this.scaledWidth / aspectRatio);

        if (this.scaledHeight > this.maxHeight) {
          this.scaledHeight = this.maxHeight;
          this.scaledWidth = Math.round(this.scaledHeight * aspectRatio);
        }
      } else {
        this.scaledHeight = Math.min(img.height, this.maxHeight);
        this.scaledWidth = Math.round(this.scaledHeight * aspectRatio);

        if (this.scaledWidth > this.maxWidth) {
          this.scaledWidth = this.maxWidth;
          this.scaledHeight = Math.round(this.scaledWidth / aspectRatio);
        }
      }

      // Calculate offsets to center the image
      this.offsetX = Math.floor((this.maxWidth - this.scaledWidth) / 2);
      this.offsetY = Math.floor((this.maxHeight - this.scaledHeight) / 2);

      // Draw scaled image to canvas to extract pixel data
      const canvas = document.createElement('canvas');
      canvas.width = this.scaledWidth;
      canvas.height = this.scaledHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(img, 0, 0, this.scaledWidth, this.scaledHeight);
        this.imageData = ctx.getImageData(0, 0, this.scaledWidth, this.scaledHeight);
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
   * Gets the pixel color from the loaded image data.
   * @param x - X coordinate in the scaled image
   * @param y - Y coordinate in the scaled image
   * @returns RGB color string or black if out of bounds
   */
  private getPixelColor(x: number, y: number): string {
    if (!this.imageData || x < 0 || x >= this.scaledWidth || y < 0 || y >= this.scaledHeight) {
      return Imager.color(0, 0, 0);
    }

    const index = (y * this.scaledWidth + x) * 4;
    const r = this.imageData.data[index];
    const g = this.imageData.data[index + 1];
    const b = this.imageData.data[index + 2];

    return Imager.color(r, g, b);
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix64x64 {
    return new Matrix64x64((x, y) => {
      // If image not loaded yet, show black
      if (!this.isLoaded || !this.imageData) {
        return {
          color: Imager.color(0, 0, 0),
          brightness: 255
        };
      }

      // Calculate position in the scaled image (accounting for centering offset)
      const imageX = x - this.offsetX;
      const imageY = y - this.offsetY;

      // Check if pixel is within the image bounds
      if (imageX >= 0 && imageX < this.scaledWidth && imageY >= 0 && imageY < this.scaledHeight) {
        return {
          color: this.getPixelColor(imageX, imageY),
          brightness: 255
        };
      } else {
        // Outside image bounds - show black
        return {
          color: Imager.color(0, 0, 0),
          brightness: 255
        };
      }
    });
  }
}

