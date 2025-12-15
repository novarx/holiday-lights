import {
  CompositeImager,
  type Imager,
  Position,
  Dimensions,
  type Matrix,
  TextImager,
} from '@holiday-lights/imager-core';
import { SceneRegistry } from '../lib/main/sceneRegistry';

/**
 * Text-focused scene with "Hello World" message.
 */
export class TextScene implements Imager {
  private readonly imager: Imager;

  constructor() {
    this.imager = new CompositeImager(
      Dimensions.square(64),
      'rgb(20, 20, 40)'
    )
      .addImager(
        new TextImager('Hello', 20, 'serif', 'rgb(255, 200, 50)'),
        Position.center()
      )
      .addImager(
        new TextImager('World!', 12, 'monospace', 'rgb(50, 200, 255)'),
        Position.centerHorizontal(50)
      );
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    return this.imager.getMatrix(frame, previousMatrix);
  }
}

// Self-register this scene
SceneRegistry.register(() => new TextScene());

