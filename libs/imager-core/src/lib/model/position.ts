import { Coordinates, Dimensions } from './dimensions';

/**
 * Interface for position calculators.
 */
export abstract class Position {
  /**
   * Calculates the actual x, y coordinates.
   * @param container - Dimensions of the container
   * @param element - Dimensions of the element being positioned
   */
  abstract calculate(container: Dimensions, element: Dimensions): Coordinates;


  /**
   * Creates a static position at specific coordinates.
   */
  static static(x: number, y: number): StaticPosition {
    return new StaticPosition(x, y);
  }

  /**
   * Creates a horizontally centered position with a y offset.
   */
  static centerHorizontal(y: number): CenterHorizontalPosition {
    return new CenterHorizontalPosition(y);
  }

  /**
   * Creates a vertically centered position with an x offset.
   */
  static centerVertical(x: number): CenterVerticalPosition {
    return new CenterVerticalPosition(x);
  }

  /**
   * Creates a fully centered position.
   */
  static center(): CenterPosition {
    return new CenterPosition();
  }
}

/**
 * Static position with explicit x and y coordinates.
 */
export class StaticPosition extends Position {
  constructor(
    private readonly x: number,
    private readonly y: number
  ) {
    super();
  }

  calculate(): Coordinates {
    return {x: this.x, y: this.y};
  }
}

/**
 * Horizontally centered position with fixed y coordinate.
 */
export class CenterHorizontalPosition extends Position {
  constructor(private readonly y: number) {
    super();
  }

  calculate(container: Dimensions, element: Dimensions): Coordinates {
    return {
      x: Math.floor((container.width - element.width) / 2),
      y: this.y
    };
  }
}

/**
 * Vertically centered position with fixed x coordinate.
 */
export class CenterVerticalPosition extends Position {
  constructor(private readonly x: number) {
    super();
  }

  calculate(container: Dimensions, element: Dimensions): Coordinates {
    return {
      x: this.x,
      y: Math.floor((container.height - element.height) / 2)
    };
  }
}

/**
 * Fully centered position (both x and y).
 */
export class CenterPosition extends Position {
  calculate(container: Dimensions, element: Dimensions): Coordinates {
    return container.centerOffset(element);
  }
}

