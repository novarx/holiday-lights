/**
 * Converts an image file to a matrix representation with pixel color data.
 */
export class ImageToMatrixConverter {
  private imageData: ImageData | null = null;
  private scaledWidth: number = 0;
  private scaledHeight: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private isLoaded: boolean = false;

  /**
   * Creates an ImageToMatrixConverter that loads an image from the specified path.
   * @param imagePath - Path to the image file
   * @param maxWidth - Maximum width to scale the image
   * @param maxHeight - Maximum height to scale the image
   */
  constructor(
    private readonly imagePath: string,
    private readonly maxWidth: number,
    private readonly maxHeight: number
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
   * @param x - X coordinate in the matrix
   * @param y - Y coordinate in the matrix
   * @returns RGB values as [r, g, b] or null if out of bounds or not loaded
   */
  getPixelColor(x: number, y: number): [number, number, number] | null {
    if (!this.isLoaded || !this.imageData) {
      return null;
    }

    // Check if pixel is within the image bounds
    if (x < 0 || x >= this.scaledWidth || y < 0 || y >= this.scaledHeight) {
      return null;
    }

    const index = (y * this.scaledWidth + x) * 4;
    const r = this.imageData.data[index];
    const g = this.imageData.data[index + 1];
    const b = this.imageData.data[index + 2];

    return [r, g, b];
  }

  /**
   * Checks if the image has been loaded successfully.
   * @returns true if the image is loaded, false otherwise
   */
  isImageLoaded(): boolean {
    return this.isLoaded;
  }

  /**
   * Gets the scaled dimensions of the image.
   * @returns Object with width and height of the scaled image
   */
  getScaledDimensions(): { width: number; height: number } {
    return {
      width: this.scaledWidth,
      height: this.scaledHeight
    };
  }

  /**
   * Gets the offset values used to center the image.
   * @returns Object with x and y offsets
   */
  getOffsets(): { x: number; y: number } {
    return {
      x: this.offsetX,
      y: this.offsetY
    };
  }
}

