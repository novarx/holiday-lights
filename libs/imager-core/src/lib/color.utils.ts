/**
 * Utility functions for color manipulation.
 */

/**
 * Generates a random color value (0-255).
 */
export function randomColorValue(): number {
  return Math.floor(Math.random() * 256);
}

/**
 * Creates an RGB color string.
 * @param red - Red component (0-255), random if not provided
 * @param green - Green component (0-255), random if not provided
 * @param blue - Blue component (0-255), random if not provided
 */
export function rgb(
  red: number = randomColorValue(),
  green: number = randomColorValue(),
  blue: number = randomColorValue()
): string {
  return `rgb(${red}, ${green}, ${blue})`;
}

/**
 * Creates an RGBA color string with specified alpha.
 * @param red - Red component (0-255)
 * @param green - Green component (0-255)
 * @param blue - Blue component (0-255)
 * @param alpha - Alpha component (0-1)
 */
export function rgba(red: number, green: number, blue: number, alpha: number): string {
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

/**
 * Parses an RGB string and returns the components.
 * @param color - RGB string in format "rgb(r, g, b)"
 * @returns Tuple of [r, g, b] or null if invalid
 */
export function parseRgb(color: string): [number, number, number] | null {
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  }
  return null;
}

/**
 * Applies brightness to a color.
 * @param color - RGB color string
 * @param brightness - Brightness value (0-255)
 * @returns RGBA string with brightness applied as alpha
 */
export function applyBrightness(color: string, brightness: number): string {
  if (brightness === 255) {
    return color;
  }

  const parsed = parseRgb(color);
  if (parsed) {
    const alpha = brightness / 255;
    return rgba(parsed[0], parsed[1], parsed[2], alpha);
  }
  return color;
}

