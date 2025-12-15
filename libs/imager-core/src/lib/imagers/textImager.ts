import type { Imager } from '../model/imager';
import { Matrix } from '../model/matrix';
import { rgb } from '../color.utils';
import { Dimensions } from '../model/dimensions';
import { getTextRenderer } from '../main/platform';

/**
 * Imager that renders text as a bitmap.
 * Uses the platform-configured TextRenderer for rendering text.
 */
export class TextImager implements Imager {
  private textMatrix: Matrix | null = null;
  private readonly text: string;
  private readonly height: number;
  private readonly fontFamily: string;
  private readonly color: string;

  /**
   * Creates a TextImager that displays the specified text.
   * @param text - The text to display
   * @param height - The height of the text in pixels
   * @param fontFamily - Font family to use (default: 'monospace')
   * @param color - Text color as RGB string (default: white)
   */
  constructor(
    text: string,
    height: number,
    fontFamily: string = 'monospace',
    color: string = 'rgb(255, 255, 255)'
  ) {
    this.text = text;
    this.height = height;
    this.fontFamily = fontFamily;
    this.color = color;
    this.renderText();
  }

  /**
   * Renders the text using the platform text renderer.
   */
  private renderText(): void {
    try {
      const textRenderer = getTextRenderer();
      const result = textRenderer.renderText(
        this.text,
        Math.round(this.height),
        this.fontFamily,
        this.color
      );
      this.textMatrix = this.extractTextMatrix(result.data, result.width, result.height);
    } catch (error) {
      console.error('Failed to render text:', error);
    }
  }

  /**
   * Extracts the text matrix from image data, trimming transparent pixels.
   */
  private extractTextMatrix(data: Uint8ClampedArray, width: number, height: number): Matrix {
    const bounds = this.findTextBounds(data, width, height);

    if (!bounds) {
      return new Matrix(new Dimensions(1, 1), () => ({ color: rgb(0, 0, 0), brightness: 255 }));
    }

    const { minX, maxX, minY, maxY } = bounds;
    const dimensions = new Dimensions(maxX - minX + 1, maxY - minY + 1);

    return new Matrix(dimensions, (x, y) => {
      const sourceX = x + minX;
      const sourceY = y + minY;
      const index = (sourceY * width + sourceX) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const alpha = data[index + 3];

      if (alpha > 128) {
        return { color: rgb(r, g, b), brightness: 255 };
      }
      return { color: rgb(0, 0, 0), brightness: 255 };
    });
  }

  /**
   * Finds the bounding box of non-transparent pixels.
   */
  private findTextBounds(
    data: Uint8ClampedArray,
    width: number,
    height: number
  ): { minX: number; maxX: number; minY: number; maxY: number } | null {
    let minX = width, maxX = 0;
    let minY = height, maxY = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];
        if (alpha > 128) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (minX > maxX || minY > maxY) {
      return null;
    }

    return { minX, maxX, minY, maxY };
  }

  getMatrix(_frame: number, _previousMatrix: Matrix | null): Matrix {
    if (!this.textMatrix) {
      return new Matrix(new Dimensions(1, 1), () => ({ color: rgb(0, 0, 0), brightness: 255 }));
    }
    return this.textMatrix;
  }
}

