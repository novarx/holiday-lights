import { Imager } from './imager';
import { Matrix, Matrix64x64 } from '../matrix';
import { ImageToMatrixConverter } from './imageToMatrixConverter';

/**
 * Imager that loads and displays an image file, scaled to fit within the matrix dimensions.
 */
export class ImageFileImager extends Imager {
  private converter: ImageToMatrixConverter;

  /**
   * Creates an ImageFileImager that loads an image from the specified path.
   * @param imagePath - Path to the image file
   * @param maxWidth - Maximum width to scale the image (default: 64)
   * @param maxHeight - Maximum height to scale the image (default: 64)
   */
  constructor(
    imagePath: string,
    maxWidth: number = 64,
    maxHeight: number = 64
  ) {
    super();
    this.converter = new ImageToMatrixConverter(imagePath, maxWidth, maxHeight);
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix64x64 {
    return new Matrix64x64((x, y) => {
      const pixelColor = this.converter.getPixelColor(x, y);

      if (pixelColor) {
        const [r, g, b] = pixelColor;
        return {
          color: Imager.color(r, g, b),
          brightness: 255
        };
      } else {
        // Image not loaded or pixel outside bounds - show black
        return {
          color: Imager.color(0, 0, 0),
          brightness: 255
        };
      }
    });
  }
}



