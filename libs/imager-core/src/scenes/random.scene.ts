import {
  CompositeImager,
  type Imager,
  Position,
  Dimensions,
  RandomImage,
  type Matrix,
  TextImager,
} from '@holiday-lights/imager-core';

/**
 * Random pattern scene with animated random pixels.
 */
export class RandomScene implements Imager {
  private readonly imager: Imager;

  constructor() {
    this.imager = new CompositeImager(
      Dimensions.square(64),
      'rgb(10, 10, 30)'
    )
      .addImager(
        new RandomImage(Dimensions.square(50)),
        Position.center()
      )
      .addImager(
        new TextImager('Random', 10, 'monospace', 'rgb(100, 255, 100)'),
        Position.centerHorizontal(55)
      );
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    return this.imager.getMatrix(frame, previousMatrix);
  }
}

