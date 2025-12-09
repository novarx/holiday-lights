import { Imager } from './imager';
import { Matrix } from '../matrix';
import { rgb } from '../utils/color.utils';

/**
 * Imager that renders text as a bitmap using canvas text rendering.
 */
export class TextImager implements Imager {
  private textMatrix: Matrix | null = null;

  /**
   * Creates a TextImager that displays the specified text.
   * @param text - The text to display
   * @param height - The height of the text in pixels
   * @param fontFamily - Font family to use (default: 'monospace')
   * @param color - Text color as RGB string (default: white)
   */
  constructor(
    private readonly text: string,
    private readonly height: number,
    private readonly fontFamily: string = 'monospace',
    private readonly color: string = 'rgb(255, 255, 255)'
  ) {
    this.renderText();
  }

  /**
   * Renders the text to a canvas and extracts pixel data.
   */
  private renderText(): void {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context for text rendering');
      return;
    }

    const fontSize = Math.round(this.height);
    ctx.font = `${fontSize}px ${this.fontFamily}`;

    const metrics = ctx.measureText(this.text);
    const textWidth = Math.ceil(metrics.width);
    const actualHeight = Math.ceil(
      (metrics.actualBoundingBoxAscent || fontSize * 0.8) +
      (metrics.actualBoundingBoxDescent || fontSize * 0.2)
    );

    canvas.width = textWidth + 4;
    canvas.height = actualHeight + 4;

    ctx.font = `${fontSize}px ${this.fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, 2, 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.textMatrix = this.extractTextMatrix(imageData, canvas.width, canvas.height);
  }

  /**
   * Extracts the text matrix from image data, trimming transparent pixels.
   */
  private extractTextMatrix(imageData: ImageData, canvasWidth: number, canvasHeight: number): Matrix {
    const bounds = this.findTextBounds(imageData, canvasWidth, canvasHeight);

    if (!bounds) {
      return new Matrix(1, 1, () => ({ color: rgb(0, 0, 0), brightness: 255 }));
    }

    const { minX, maxX, minY, maxY } = bounds;
    const trimmedWidth = maxX - minX + 1;
    const trimmedHeight = maxY - minY + 1;

    return new Matrix(trimmedWidth, trimmedHeight, (x, y) => {
      const sourceX = x + minX;
      const sourceY = y + minY;
      const index = (sourceY * canvasWidth + sourceX) * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      const alpha = imageData.data[index + 3];

      if (alpha > 128) {
        return { color: rgb(r, g, b), brightness: 255 };
      }
      return { color: rgb(0, 0, 0), brightness: 255 };
    });
  }

  /**
   * Finds the bounding box of non-transparent pixels.
   */
  private findTextBounds(imageData: ImageData, width: number, height: number): { minX: number; maxX: number; minY: number; maxY: number } | null {
    let minX = width, maxX = 0;
    let minY = height, maxY = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const alpha = imageData.data[index + 3];
        if (alpha > 128) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (minX > maxX) {
      return null;
    }

    return { minX, maxX, minY, maxY };
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    if (!this.textMatrix) {
      return new Matrix(1, 1, () => ({ color: rgb(0, 0, 0), brightness: 255 }));
    }

    return this.textMatrix;
  }
}

