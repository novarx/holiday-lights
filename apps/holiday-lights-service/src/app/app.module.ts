import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MatrixService} from "./matrix/matrix.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, MatrixService],
})
export class AppModule {
  constructor(private readonly matrixService: MatrixService) {
    matrixService.initMatrix().then(v => console.log(v));
  }
}
