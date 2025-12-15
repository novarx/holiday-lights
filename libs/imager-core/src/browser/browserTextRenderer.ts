import type { TextRenderer, TextRenderResult } from '../lib/imagers/textRenderer.interface';

/**
 * Browser-specific implementation of TextRenderer using Canvas API.
 */
export class BrowserTextRenderer implements TextRenderer {
  /**
   * Renders text to pixel data using the browser's canvas API.
   */
  renderText(
    text: string,
    fontSize: number,
    fontFamily: string,
    color: string
  ): TextRenderResult {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context for text rendering');
    }

    ctx.font = `${fontSize}px ${fontFamily}`;

    const metrics = ctx.measureText(text);
    const textWidth = Math.ceil(metrics.width);
    const actualHeight = Math.ceil(
      (metrics.actualBoundingBoxAscent || fontSize * 0.8) +
      (metrics.actualBoundingBoxDescent || fontSize * 0.2)
    );

    canvas.width = textWidth + 4;
    canvas.height = actualHeight + 4;

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.fillText(text, 2, 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    return {
      data: imageData.data,
      width: canvas.width,
      height: canvas.height,
    };
  }
}

