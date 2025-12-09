import { Matrix } from './matrix';

export interface Cell {
  color: string;
  brightness: number;
}

export interface IImageService {
  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix;
}
