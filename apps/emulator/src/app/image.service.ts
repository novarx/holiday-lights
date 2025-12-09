import { Injectable } from '@angular/core';
import { Matrix } from './matrix';
import { Imager, ImageFileImager, CompositeImager, TextImager, Position } from './imager';

/**
 * Service that provides matrix images for the emulator display.
 * Acts as a facade, delegating image generation to the composed Imager.
 */
@Injectable({
  providedIn: 'root'
})
export class ImageService implements Imager {
  private readonly imager: Imager = new CompositeImager(64, 64, 'rgb(0, 0, 0)')
    .addImager(new ImageFileImager('bubblegum.png', 45, 45), Position.center())
    .addImager(new TextImager('Lorem', 12, 'monospace', 'rgb(0, 255, 0)'), Position.centerHorizontal(2));

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    return this.imager.getMatrix(frame, previousMatrix);
  }
}
