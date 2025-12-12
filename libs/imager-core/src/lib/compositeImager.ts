import { Imager } from './imager';
import { Matrix } from './matrix';
import { Position } from './position';
import { Dimensions } from './dimensions';

/**
 * Positioned imager with position config and optional dimensions.
 */
interface PositionedImager {
  imager: Imager;
  position: Position;
  dimensions?: Dimensions;
}

/**
 * Composite imager that combines multiple imagers at specified positions.
 * Imagers are layered in the order they are added (later ones render on top).
 */
export class CompositeImager implements Imager {
  private layers: PositionedImager[] = [];
  private readonly dimensions: Dimensions;

  /**
   * Creates a new CompositeImager.
   * @param dimensions - Dimensions of the composite canvas (default: 64x64)
   * @param backgroundColor - Background color for empty areas (default: black)
   */
  constructor(
    dimensions: Dimensions = Dimensions.square(64),
    private readonly backgroundColor: string = 'rgb(0, 0, 0)'
  ) {
    this.dimensions = dimensions;
  }

  /**
   * Adds an imager at the specified position.
   * @param imager - The imager to add
   * @param position - Positioner object defining where to place the imager
   * @param dimensions - Optional dimension constraints for the imager
   * @returns This CompositeImager for method chaining
   */
  addImager(
    imager: Imager,
    position: Position,
    dimensions?: Dimensions
  ): CompositeImager {
    this.layers.push({ imager, position, dimensions });
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

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    const result = new Matrix(this.dimensions, () => ({
      color: this.backgroundColor,
      brightness: 255
    }));

    for (const layer of this.layers) {
      const layerMatrix = layer.imager.getMatrix(frame, previousMatrix);
      const layerDimensions = layer.dimensions ?? layerMatrix.dimensions;

      const { x, y } = layer.position.calculate(this.dimensions, layerDimensions);

      for (let ly = 0; ly < layerDimensions.height && ly < layerMatrix.dimensions.height; ly++) {
        for (let lx = 0; lx < layerDimensions.width && lx < layerMatrix.dimensions.width; lx++) {
          const resultX = x + lx;
          const resultY = y + ly;

          if (resultX >= 0 && resultX < this.dimensions.width && resultY >= 0 && resultY < this.dimensions.height) {
            const cell = layerMatrix.get(lx, ly);
            if (cell && cell.color !== 'rgb(0, 0, 0)') {
              result.set(resultX, resultY, cell);
            }
          }
        }
      }
    }

    return result;
  }
}

