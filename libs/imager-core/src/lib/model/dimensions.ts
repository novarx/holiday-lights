/**
 * Coordinates representing a position.
 */
export interface Coordinates {
  x: number;
  y: number;
}

/**
 * Represents dimensions (width and height) of an element.
 */
export class Dimensions {
  constructor(
    public readonly width: number,
    public readonly height: number
  ) {}

  /**
   * Creates a square dimension.
   */
  static square(size: number): Dimensions {
    return new Dimensions(size, size);
  }

  /**
   * Calculates the center point offset for centering an element within this dimension.
   * @param element - The dimensions of the element to center
   */
  centerOffset(element: Dimensions): Coordinates {
    return {
      x: Math.floor((this.width - element.width) / 2),
      y: Math.floor((this.height - element.height) / 2)
    };
  }
}

