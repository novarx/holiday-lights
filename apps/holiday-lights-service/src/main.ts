/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { configurePlatform } from '@holiday-lights/imager-core';
import { NodeImageLoader, NodeTextRenderer } from '@holiday-lights/imager-core/node';
import { AppModule } from './app/app.module';
import { join } from 'path';

// Configure platform-specific implementations for Node.js
// Point to the imager-core lib's assets folder directly
// From dist/apps/holiday-lights-service -> back to root -> to source libs folder
configurePlatform({
  imageLoader: new NodeImageLoader(join(__dirname, '../../../libs/imager-core/src/assets')),
  textRenderer: new NodeTextRenderer(),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
