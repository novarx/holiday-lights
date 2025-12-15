import type { TextRenderer, TextRenderResult } from '../lib/imagers/textRenderer.interface';

/**
 * Node.js-specific implementation of TextRenderer using sharp with SVG text.
 * Note: Requires 'sharp' package to be installed as a dependency.
 */
export class NodeTextRenderer implements TextRenderer {
  /**
   * Renders text to pixel data using sharp with SVG text rendering.
   */
  async renderText(
    text: string,
    fontSize: number,
    fontFamily: string,
    color: string
  ): Promise<TextRenderResult> {
    // Dynamic require to avoid bundling sharp in browser builds
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sharp = require('sharp');

    // Estimate text dimensions (approximate - 0.6 chars per pixel width for monospace-ish fonts)
    const estimatedCharWidth = fontSize * 0.6;
    const textWidth = Math.ceil(text.length * estimatedCharWidth) + 10;
    const textHeight = Math.ceil(fontSize * 1.5) + 10;

    // Create SVG with text
    const svg = `
      <svg width="${textWidth}" height="${textHeight}" xmlns="http://www.w3.org/2000/svg">
        <text
          x="5"
          y="${fontSize + 2}"
          font-family="${fontFamily}"
          font-size="${fontSize}"
          fill="${color}"
        >${text}</text>
      </svg>
    `;

    try {
      // Convert SVG to raw pixel data
      const { data, info } = await sharp(Buffer.from(svg))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      return {
        data: new Uint8ClampedArray(data),
        width: info.width,
        height: info.height,
      };
    } catch (error) {
      console.error('Failed to render text with sharp:', error);
      // Fallback: create a minimal image
      const fallbackWidth = textWidth;
      const fallbackHeight = textHeight;
      const fallbackData = new Uint8ClampedArray(fallbackWidth * fallbackHeight * 4);

      return {
        data: fallbackData,
        width: fallbackWidth,
        height: fallbackHeight,
      };
    }
  }
}

