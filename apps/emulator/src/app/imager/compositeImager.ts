import { Imager } from './imager';
import { Matrix } from '../matrix';
import { Position } from './position';

/**
 * Positioned imager with position config and optional dimensions.
 */
interface PositionedImager {
  imager: Imager;
  position: Position;
  width?: number;
  height?: number;
}

/**
 * Composite imager that combines multiple imagers at specified positions.
 * Imagers are layered in the order they are added (later ones render on top).
 */
export class CompositeImager implements Imager {
  private layers: PositionedImager[] = [];

  /**
   * Creates a new CompositeImager.
   * @param width - Width of the composite canvas (default: 64)
   * @param height - Height of the composite canvas (default: 64)
   * @param backgroundColor - Background color for empty areas (default: black)
   */
  constructor(
    private readonly width: number = 64,
    private readonly height: number = 64,
    private readonly backgroundColor: string = 'rgb(0, 0, 0)'
  ) {}

  /**
   * Adds an imager at the specified position.
   * @param imager - The imager to add
   * @param position - Position object defining where to place the imager
   * @param width - Optional width constraint for the imager
   * @param height - Optional height constraint for the imager
   * @returns This CompositeImager for method chaining
   */
  addImager(
    imager: Imager,
    position: Position,
    width?: number,
    height?: number
  ): CompositeImager {
    this.layers.push({ imager, position, width, height });
    return this;
  }

  /**
   * Calculates the actual x, y coordinates from a Position object.
   * @param position - The position configuration
   * @param layerWidth - Width of the layer being positioned
   * @param layerHeight - Height of the layer being positioned
   * @returns Object with x and y coordinates
   */
  private calculatePosition(position: Position, layerWidth: number, layerHeight: number): { x: number; y: number } {
    switch (position.type) {
      case 'static':
        return { x: position.x, y: position.y };

      case 'centerHorizontal':
        return {
          x: Math.floor((this.width - layerWidth) / 2),
          y: position.y
        };

      case 'centerVertical':
        return {
          x: position.x,
          y: Math.floor((this.height - layerHeight) / 2)
        };

      case 'center':
        return {
          x: Math.floor((this.width - layerWidth) / 2),
          y: Math.floor((this.height - layerHeight) / 2)
        };
    }
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

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    // Start with a background matrix
    const result = new Matrix(this.width, this.height, () => ({
      color: this.backgroundColor,
      brightness: 255
    }));

    // Render each layer in order
    for (const layer of this.layers) {
      const layerMatrix = layer.imager.getMatrix(frame, previousMatrix);

      // Use the actual dimensions of the layer matrix
      const layerWidth = layer.width ?? layerMatrix.width;
      const layerHeight = layer.height ?? layerMatrix.height;

      // Calculate actual position from Position object
      const { x, y } = this.calculatePosition(layer.position, layerWidth, layerHeight);

      // Copy pixels from the layer matrix to the result
      for (let ly = 0; ly < layerHeight && ly < layerMatrix.height; ly++) {
        for (let lx = 0; lx < layerWidth && lx < layerMatrix.width; lx++) {
          // Calculate position in the result matrix
          const resultX = x + lx;
          const resultY = y + ly;

          // Check if the position is within the composite bounds
          if (resultX >= 0 && resultX < this.width && resultY >= 0 && resultY < this.height) {
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

