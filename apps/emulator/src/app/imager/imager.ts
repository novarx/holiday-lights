import { Matrix } from '../matrix';

/**
 * Interface for generating matrix images.
 * Implementations provide different strategies for creating visual content.
 */
export interface Imager {
  /**
   * Generates a matrix for the current frame.
   * @param frame - The current frame number
   * @param previousMatrix - The matrix from the previous frame, or null for the first frame
   * @returns A matrix representing the current frame's image
   */
  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix;
}
