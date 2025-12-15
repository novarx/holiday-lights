import type { Imager } from './imager';
import { Matrix } from './matrix';
import { rgb } from './color.utils';
import { Dimensions } from './dimensions';
import { ImageToMatrixConverter } from './imageToMatrixConverter';
import { getImageLoader } from './platform';

/**
 * Imager that loads and displays an image file, scaled to fit within the matrix dimensions.
 * Uses the platform-configured ImageLoader for loading images.
 */
export class ImageFileImager implements Imager {
  private readonly converter: ImageToMatrixConverter;
  private readonly maxDimensions: Dimensions;

  /**
   * Creates an ImageFileImager that loads an image from the specified path.
   * @param imagePath - Path to the image file
   * @param maxDimensions - Maximum dimensions to scale the image (default: 64x64)
   */
  constructor(imagePath: string, maxDimensions: Dimensions = Dimensions.square(64)) {
    this.maxDimensions = maxDimensions;
    this.converter = new ImageToMatrixConverter(
      getImageLoader(),
      imagePath,
      maxDimensions
    );
  }

  getMatrix(_frame: number, _previousMatrix: Matrix | null): Matrix {
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

