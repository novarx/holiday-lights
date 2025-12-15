import {Injectable} from '@nestjs/common';
import {
  BubblegumScene,
  CompositeImager, DefaultScene,
  Dimensions,
  Imager,
  Matrix,
  Position,
  RandomImage,
  // Alternative: Use AllScenesLoader to automatically load all scenes
  // AllScenesLoader
} from '@holiday-lights/imager-core';

@Injectable()
export class AppService {
  // Option 1: Manually create specific imagers
  private readonly bubblegum: Imager = new BubblegumScene('bubblegum.png');
  private readonly random: Imager = new CompositeImager(
    Dimensions.square(64),
    'rgb(0, 0, 0)'
  ).addImager(
    new RandomImage(Dimensions.square(32)),
    Position.center()
  );

  private readonly imager: Imager = new DefaultScene()

  // Option 2: Use AllScenesLoader to load all scenes dynamically
  // private readonly allScenes = new AllScenesLoader().getImagers();
  // private readonly imager: Imager = this.allScenes[0];

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
