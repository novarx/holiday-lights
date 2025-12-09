import {Imager} from "./imager";
import {Matrix, Matrix64x64} from "../matrix";

export class RandomImage extends Imager {
  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix64x64 {
    return new Matrix64x64((x, y) => ({
      color: Imager.randomColor(),
      brightness: 255 * (x / 64)
    }))
  }
}
