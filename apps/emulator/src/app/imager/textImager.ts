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
    // Font size is typically 1.2-1.5x the actual rendered height
    const fontSize = Math.round(this.height * 1.3);
    ctx.font = `${fontSize}px ${this.fontFamily}`;

    // Measure the text to determine canvas size
    const metrics = ctx.measureText(this.text);
    const textWidth = Math.ceil(metrics.width);
    const textHeight = this.height;

    // Set canvas size to fit the text
    canvas.width = textWidth;
    canvas.height = textHeight;

    // Re-set font after canvas resize (canvas reset clears settings)
    ctx.font = `${fontSize}px ${this.fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    // Fill with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the text
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, 0, 0);

    // Extract pixel data
    const imageData = ctx.getImageData(0, 0, textWidth, textHeight);

    // Create matrix from pixel data
    this.textMatrix = new Matrix(textWidth, textHeight, (x, y) => {
      const index = (y * textWidth + x) * 4;
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

