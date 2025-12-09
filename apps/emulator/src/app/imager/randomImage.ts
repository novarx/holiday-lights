import { Imager } from './imager';
import { Matrix, Matrix64x64 } from '../matrix';
import { rgb } from '../utils/color.utils';

export class RandomImage implements Imager {
  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix64x64 {
    return new Matrix64x64((x, y) => ({
      color: rgb(),
      brightness: 255 * (x / 64)
    }));
  }
}
