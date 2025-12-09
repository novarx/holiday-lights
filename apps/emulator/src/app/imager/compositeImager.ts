import { Imager } from './imager';
import { Matrix, Matrix64x64 } from '../matrix';

/**
 * Positioned imager with x, y coordinates and optional dimensions.
 */
interface PositionedImager {
  imager: Imager;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

/**
 * Composite imager that combines multiple imagers at specified positions.
 * Imagers are layered in the order they are added (later ones render on top).
 */
export class CompositeImager extends Imager {
  private layers: PositionedImager[] = [];

  /**
   * Creates a new CompositeImager.
   * @param backgroundColor - Background color for empty areas (default: black)
   */
  constructor(private readonly backgroundColor: string = 'rgb(0, 0, 0)') {
    super();
  }

  /**
   * Adds an imager at the specified position.
   * @param imager - The imager to add
   * @param x - X coordinate of the upper-left corner
   * @param y - Y coordinate of the upper-left corner
   * @param width - Optional width constraint for the imager
   * @param height - Optional height constraint for the imager
   * @returns This CompositeImager for method chaining
   */
  addImager(
    imager: Imager,
    x: number,
    y: number,
    width?: number,
    height?: number
  ): CompositeImager {
    this.layers.push({ imager, x, y, width, height });
    return this;
  }

  /**
   * Removes all imagers from the composite.
   * @returns This CompositeImager for method chaining
   */
  clear(): CompositeImager {
    this.layers = [];
    return this;
  }

  /**
   * Removes the last added imager.
   * @returns This CompositeImager for method chaining
   */
  pop(): CompositeImager {
    this.layers.pop();
    return this;
  }

  /**
   * Gets the number of layers in this composite.
   * @returns The number of imagers
   */
  getLayerCount(): number {
    return this.layers.length;
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix64x64 {
    // Start with a background matrix
    const result = new Matrix64x64((x, y) => ({
      color: this.backgroundColor,
      brightness: 255
    }));

    // Render each layer in order
    for (const layer of this.layers) {
      const layerMatrix = layer.imager.getMatrix(frame, previousMatrix);

      // Determine the effective size of the layer
      const maxWidth = layer.width ?? 64;
      const maxHeight = layer.height ?? 64;

      // Copy pixels from the layer matrix to the result
      for (let ly = 0; ly < maxHeight && ly < 64; ly++) {
        for (let lx = 0; lx < maxWidth && lx < 64; lx++) {
          // Calculate position in the result matrix
          const resultX = layer.x + lx;
          const resultY = layer.y + ly;

          // Check if the position is within the 64x64 bounds
          if (resultX >= 0 && resultX < 64 && resultY >= 0 && resultY < 64) {
            const cell = layerMatrix.get(lx, ly);
            if (cell) {
              // Only copy non-black pixels (for transparency effect)
              // You can modify this logic for different compositing modes
              if (cell.color !== 'rgb(0, 0, 0)') {
                result.set(resultX, resultY, cell);
              }
            }
          }
        }
      }
    }

    return result;
  }
}

