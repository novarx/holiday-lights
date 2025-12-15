import type { TextRenderer, TextRenderResult } from '../lib/textRenderer.interface';

/**
 * Node.js-specific implementation of TextRenderer using node-canvas.
 * Note: Requires 'canvas' package to be installed as a dependency.
 */
export class NodeTextRenderer implements TextRenderer {
  /**
   * Renders text to pixel data using node-canvas.
   */
  renderText(
    text: string,
    fontSize: number,
    fontFamily: string,
    color: string
  ): TextRenderResult {
    // Dynamic require to avoid bundling canvas in browser builds
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createCanvas } = require('canvas');

    // Create a temporary canvas to measure text
    const measureCanvas = createCanvas(1, 1);
    const measureCtx = measureCanvas.getContext('2d');

    measureCtx.font = `${fontSize}px ${fontFamily}`;
    const metrics = measureCtx.measureText(text);
    const textWidth = Math.ceil(metrics.width);
    const actualHeight = Math.ceil(fontSize * 1.2);

    // Create the actual canvas with proper dimensions
    const canvas = createCanvas(textWidth + 4, actualHeight + 4);
    const ctx = canvas.getContext('2d');

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = color;
    ctx.fillText(text, 2, 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    return {
      data: new Uint8ClampedArray(imageData.data),
      width: canvas.width,
      height: canvas.height,
    };
  }
}

