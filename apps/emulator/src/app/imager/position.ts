/**
 * Position types for placing imagers in a composite.
 */

/**
 * Static position with explicit x and y coordinates.
 */
export interface StaticPosition {
  type: 'static';
  x: number;
  y: number;
}

/**
 * Horizontally centered position with y coordinate.
 */
export interface CenterHorizontalPosition {
  type: 'centerHorizontal';
  y: number;
}

/**
 * Vertically centered position with x coordinate.
 */
export interface CenterVerticalPosition {
  type: 'centerVertical';
  x: number;
}

/**
 * Fully centered position (both x and y).
 */
export interface CenterPosition {
  type: 'center';
}

/**
 * Union type of all position types.
 */
export type Position = StaticPosition | CenterHorizontalPosition | CenterVerticalPosition | CenterPosition;

/**
 * Helper functions to create positions.
 */
export const Position = {
  /**
   * Creates a static position at specific coordinates.
   * @param x - X coordinate
   * @param y - Y coordinate
   */
  static(x: number, y: number): StaticPosition {
    return { type: 'static', x, y };
  },

  /**
   * Creates a horizontally centered position with a y offset.
   * @param y - Y coordinate
   */
  centerHorizontal(y: number): CenterHorizontalPosition {
    return { type: 'centerHorizontal', y };
  },

  /**
   * Creates a vertically centered position with an x offset.
   * @param x - X coordinate
   */
  centerVertical(x: number): CenterVerticalPosition {
    return { type: 'centerVertical', x };
  },

  /**
   * Creates a fully centered position (both x and y).
   */
  center(): CenterPosition {
    return { type: 'center' };
  }
};

