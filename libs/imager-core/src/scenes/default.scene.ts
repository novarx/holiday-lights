import {
  CompositeImager,
  Dimensions, ImageFileImager,
  type Imager,
  type Matrix,
  Position,
  RandomImage,
  TextImager,
} from '@holiday-lights/imager-core';
import { SceneRegistry } from '../lib/main/sceneRegistry';

/**
 * Random pattern scene with animated random pixels.
 */
export class DefaultScene implements Imager {
  private readonly imager: Imager;

  constructor() {
    this.imager = new CompositeImager(
      Dimensions.square(64),
      'rgb(45, 45, 45)'
    )
      .addImager(
        new ImageFileImager('bubblegum.png', Dimensions.square(45)),
        Position.center()
      )
      .addImager(
        new TextImager('Lorem', 12, 'monospace', 'rgb(0, 255, 0)'),
        Position.centerHorizontal(53)
      )
      .addImager(
        new RandomImage(Dimensions.square(15)),
        Position.static(0, 0)
      );
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    return this.imager.getMatrix(frame, previousMatrix);
  }
}

// Self-register this scene
SceneRegistry.register(() => new DefaultScene());

