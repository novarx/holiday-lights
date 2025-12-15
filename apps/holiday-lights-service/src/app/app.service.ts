import {Injectable} from '@nestjs/common';
import {
  BubblegumScene,
  CompositeImager, DefaultScene,
  Dimensions,
  Imager,
  Matrix,
  Position,
  RandomImage
} from '@holiday-lights/imager-core';

@Injectable()
export class AppService {
  private readonly bubblegum: Imager = new BubblegumScene('bubblegum.png');
  private readonly random: Imager = new CompositeImager(
    Dimensions.square(64),
    'rgb(0, 0, 0)'
  ).addImager(
    new RandomImage(Dimensions.square(32)),
    Position.center()
  );

  private readonly imager: Imager = new DefaultScene()

  constructor() {
    console.log('AppService constructor');
  }

  getData(): { message: string } {
    return {message: 'Hello API'};
  }

  getMatrix(frame: number): Matrix {
    return this.imager.getMatrix(frame, null);
  }
}
