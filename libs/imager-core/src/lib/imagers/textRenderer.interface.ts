/**
 * Result of rendering text to pixel data.
 */
export interface TextRenderResult {
  /** Raw pixel data in RGBA format (4 bytes per pixel) */
  data: Uint8ClampedArray;
  /** Width of the rendered text in pixels */
  width: number;
  /** Height of the rendered text in pixels */
  height: number;
}

/**
 * Interface for rendering text to pixel data in a platform-agnostic way.
 * Implementations handle the platform-specific text rendering logic.
 */
export interface TextRenderer {
  /**
   * Renders text to pixel data.
   * @param text - The text to render
   * @param fontSize - Font size in pixels
   * @param fontFamily - Font family to use
   * @param color - Text color as CSS color string
   * @returns The rendered text as pixel data
   */
  renderText(
    text: string,
    fontSize: number,
    fontFamily: string,
    color: string
  ): TextRenderResult;
}

