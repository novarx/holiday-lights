import { Imager } from './imager';
import { Matrix } from '../matrix';

/**
 * Imager that renders text as a bitmap using canvas text rendering.
 */
export class TextImager extends Imager {
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
    super();
    this.renderText();
  }

  /**
   * Renders the text to a canvas and extracts pixel data.
   */
  private renderText(): void {
    // Create a temporary canvas to measure and render the text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context for text rendering');
      return;
    }

    // Set font - approximate font size based on desired height
    const fontSize = Math.round(this.height);
    ctx.font = `${fontSize}px ${this.fontFamily}`;

    // Measure the text to determine canvas size
    const metrics = ctx.measureText(this.text);
    const textWidth = Math.ceil(metrics.width);

    // Use font metrics for more accurate height calculation
    const actualHeight = Math.ceil(
      (metrics.actualBoundingBoxAscent || fontSize * 0.8) +
      (metrics.actualBoundingBoxDescent || fontSize * 0.2)
    );

    // Set canvas size with some padding to ensure we capture all pixels
    canvas.width = textWidth + 4;
    canvas.height = actualHeight + 4;

    // Re-set font after canvas resize (canvas reset clears settings)
    ctx.font = `${fontSize}px ${this.fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    // Fill with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the text with slight padding
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, 2, 2);

    // Extract pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Find the actual bounding box of non-transparent pixels
    let minX = canvas.width, maxX = 0;
    let minY = canvas.height, maxY = 0;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        const alpha = imageData.data[index + 3];
        if (alpha > 128) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }

    // If no pixels found, create minimal matrix
    if (minX > maxX) {
      this.textMatrix = new Matrix(1, 1, () => ({
        color: Imager.color(0, 0, 0),
        brightness: 255
      }));
      return;
    }

    // Create matrix from the trimmed bounding box
    const trimmedWidth = maxX - minX + 1;
    const trimmedHeight = maxY - minY + 1;

    this.textMatrix = new Matrix(trimmedWidth, trimmedHeight, (x, y) => {
      const sourceX = x + minX;
      const sourceY = y + minY;
      const index = (sourceY * canvas.width + sourceX) * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      const alpha = imageData.data[index + 3];

      // If pixel has alpha > 0, it's part of the text
      if (alpha > 128) {
        return {
          color: Imager.color(r, g, b),
          brightness: 255
        };
      } else {
        // Transparent pixel - use black (will be treated as transparent in compositing)
        return {
          color: Imager.color(0, 0, 0),
          brightness: 255
        };
      }
    });
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    // If text matrix hasn't been generated, create a minimal matrix
    if (!this.textMatrix) {
      return new Matrix(1, 1, () => ({
        color: Imager.color(0, 0, 0),
        brightness: 255
      }));
    }

    return this.textMatrix;
  }
}

