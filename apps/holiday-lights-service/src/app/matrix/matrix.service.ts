import {Injectable} from '@nestjs/common';
import {CompositeImager, Dimensions, Imager, Position, RandomImage} from '@holiday-lights/imager-core';
import {LedMatrix} from "rpi-led-matrix";
import {matrixOptions, runtimeOptions} from './_config';

@Injectable()
export class MatrixService {
  private readonly imager: Imager = new CompositeImager(
    Dimensions.square(64),
    'rgb(0, 0, 0)'
  ).addImager(
    new RandomImage(Dimensions.square(32)),
    Position.center()
  );

  /**
   * Converts an RGB color string to a hex number.
   * @param rgbString - Color string in format "rgb(r, g, b)"
   * @returns Hex number (e.g., 0x0000ff for blue)
   */
  private rgbToHex(rgbString: string): number {
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) {
      return 0x000000;
    }
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    return (r << 16) | (g << 8) | b;
  }

  async initMatrix(): Promise<void> {
    const matrixDefinition = this.imager.getMatrix(1, null);

    const matrix = new LedMatrix(matrixOptions, runtimeOptions);

    matrix
      .clear() // clear the display
      .brightness(100)
      .fgColor(0x000000)
      .fill()

    matrixDefinition.forEach((cell, x, y) => {
      matrix.fgColor(this.rgbToHex(cell.color)).setPixel(x, y)
    })

    matrix.sync();
  }
}
