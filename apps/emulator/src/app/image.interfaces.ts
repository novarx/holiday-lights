import { Matrix } from './matrix';

export interface Cell {
  color: string;
  brightness: number;
}

/**
 * Service interface for generating matrix images.
 */
export interface IImageService {
  /**
   * Generates a matrix for the current frame.
   * @param frame - The current frame number (0-99, representing 100ms intervals over 10 seconds)
   * @param previousMatrix - The matrix from the previous frame, or null for the first frame
   * @returns A new matrix representing the current frame's image
   */
  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix;
}
