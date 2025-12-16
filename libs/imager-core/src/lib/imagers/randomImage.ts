import { Imager } from '../model/imager';
import { Matrix } from '../model/matrix';
import { rgb } from '../color.utils';
import { Dimensions } from '../model/dimensions';

export class RandomImage implements Imager {
  constructor(private readonly dimensions: Dimensions = Dimensions.square(64)) {}

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    return new Matrix(this.dimensions, (x) => ({
      color: rgb(),
      brightness: 255 * (x / this.dimensions.width)
    }));
  }
}

