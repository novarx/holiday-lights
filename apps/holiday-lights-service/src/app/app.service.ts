import {Injectable} from '@nestjs/common';
import {DefaultScene, Imager, Matrix,} from '@holiday-lights/imager-core';

@Injectable()
export class AppService {
  private readonly imager: Imager = new DefaultScene()


  constructor() {
    console.log('AppService constructor');
  }

  getMatrix(frame: number): Matrix {
    return this.imager.getMatrix(frame, null);
  }
}
