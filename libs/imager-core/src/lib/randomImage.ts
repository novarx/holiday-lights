import { Imager } from './imager';
import { Matrix } from './matrix';
import { rgb } from './color.utils';
import { Dimensions } from './dimensions';

export class RandomImage implements Imager {
  constructor(private readonly dimensions: Dimensions = Dimensions.square(64)) {}

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    return new Matrix(this.dimensions, (x) => ({
      color: rgb(),
      brightness: 255 * (x / this.dimensions.width)
    }));
  }
}

