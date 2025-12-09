import {Matrix, Matrix64x64} from "../matrix";

export abstract class Imager {

  public static randomColorValue() {
    return Math.floor(Math.random() * 256);
  }

  public static randomColor(): string {
    return this.color();
  }

  public static color(
    red: number = this.randomColorValue(),
    green: number = this.randomColorValue(),
    blue: number = this.randomColorValue(),
  ) {
    return `rgb(${red}, ${(green)}, ${blue})`;
  }

  abstract getMatrix(frame: number, previousMatrix: Matrix | null): Matrix64x64;
}
