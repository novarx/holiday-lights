import {type Imager, Matrix, DefaultScene,} from '@holiday-lights/imager-core';

/**
 * Service that provides matrix images for the emulator display.
 * Acts as a facade, delegating image generation to the composed Imager.
 */
export class ImageService implements Imager {
  private readonly imager: Imager;

  constructor() {
    this.imager = new DefaultScene();
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    return this.imager.getMatrix(frame, previousMatrix);
  }
}

