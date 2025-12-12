import { Injectable } from '@nestjs/common';
import {
  Matrix,
  Imager,
  CompositeImager,
  RandomImage,
  Position,
  Dimensions
} from '@holiday-lights/imager-core';

@Injectable()
export class AppService {
  private readonly imager: Imager = new CompositeImager(
    Dimensions.square(64),
    'rgb(0, 0, 0)'
  ).addImager(
    new RandomImage(Dimensions.square(32)),
    Position.center()
  );

  constructor() {
    console.log('AppService constructor');
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getMatrix(frame: number): Matrix {
    return this.imager.getMatrix(frame, null);
  }
}
