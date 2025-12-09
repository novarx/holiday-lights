import { Imager } from './imager';
import { Matrix } from '../matrix';
import { ImageToMatrixConverter } from './imageToMatrixConverter';
import { rgb } from '../utils/color.utils';

/**
 * Imager that loads and displays an image file, scaled to fit within the matrix dimensions.
 */
export class ImageFileImager implements Imager {
  private readonly converter: ImageToMatrixConverter;

  /**
   * Creates an ImageFileImager that loads an image from the specified path.
   * @param imagePath - Path to the image file
   * @param maxWidth - Maximum width to scale the image (default: 64)
   * @param maxHeight - Maximum height to scale the image (default: 64)
   */
  constructor(
    imagePath: string,
    private readonly maxWidth: number = 64,
    private readonly maxHeight: number = 64
  ) {
    this.converter = new ImageToMatrixConverter(imagePath, maxWidth, maxHeight);
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    const dimensions = this.converter.getScaledDimensions();
    const width = dimensions.width || this.maxWidth;
    const height = dimensions.height || this.maxHeight;

    return new Matrix(width, height, (x, y) => {
      const pixelColor = this.converter.getPixelColor(x, y);

      if (pixelColor) {
        const [r, g, b] = pixelColor;
        return { color: rgb(r, g, b), brightness: 255 };
      }

      return { color: rgb(0, 0, 0), brightness: 255 };
    });
  }
}



