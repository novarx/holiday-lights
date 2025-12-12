import { Imager, Matrix, rgb, Dimensions } from '@holiday-lights/imager-core';
import { ImageToMatrixConverter } from './imageToMatrixConverter';

/**
 * Imager that loads and displays an image file, scaled to fit within the matrix dimensions.
 */
export class ImageFileImager implements Imager {
  private readonly converter: ImageToMatrixConverter;

  /**
   * Creates an ImageFileImager that loads an image from the specified path.
   * @param imagePath - Path to the image file
   * @param maxDimensions - Maximum dimensions to scale the image (default: 64x64)
   */
  constructor(
    imagePath: string,
    private readonly maxDimensions: Dimensions = Dimensions.square(64)
  ) {
    this.converter = new ImageToMatrixConverter(imagePath, maxDimensions);
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    const dimensions = this.converter.getScaledDimensions() ?? this.maxDimensions;

    return new Matrix(dimensions, (x, y) => {
      const pixelColor = this.converter.getPixelColor(x, y);

      if (pixelColor) {
        const [r, g, b] = pixelColor;
        return { color: rgb(r, g, b), brightness: 255 };
      }

      return { color: rgb(0, 0, 0), brightness: 255 };
    });
  }
}



