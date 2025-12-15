import {
  CompositeImager,
  type Imager,
  Position,
  Dimensions,
  type Matrix,
  ImageFileImager,
  TextImager,
} from '@holiday-lights/imager-core';
import { SceneRegistry } from '../lib/main/sceneRegistry';

/**
 * Bubblegum image scene with centered image and label.
 */
export class BubblegumScene implements Imager {
  private readonly imager: Imager;

  constructor(imagePath: string = 'bubblegum.png') {
    this.imager = new CompositeImager(
      Dimensions.square(64),
      'rgb(45, 45, 45)'
    )
      .addImager(
        new ImageFileImager(imagePath, Dimensions.square(45)),
        Position.center()
      )
      .addImager(
        new TextImager('Bubblegum', 10, 'monospace', 'rgb(255, 100, 200)'),
        Position.centerHorizontal(55)
      );
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    return this.imager.getMatrix(frame, previousMatrix);
  }
}

// Self-register this scene
SceneRegistry.register(() => new BubblegumScene());

