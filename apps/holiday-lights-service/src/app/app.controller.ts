import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { applyBrightness } from '@holiday-lights/imager-core';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getMatrix(1);
  }

  @Get('matrix')
  getMatrix() {
    const matrix = this.appService.getMatrix(0);
    return {
      dimensions: {
        width: matrix.dimensions.width,
        height: matrix.dimensions.height,
      },
      cells: matrix.getRows(),
    };
  }

  @Get('matrix/html')
  @Header('Content-Type', 'text/html')
  getMatrixHtml(): string {
    const matrix = this.appService.getMatrix(0);
    const rows = matrix.getRows();

    const cellsHtml = rows
      .map(
        (row) =>
          `<div class="row">${row
            .map((cell) => {
              const color = applyBrightness(cell.color, cell.brightness);
              return `<div class="cell" style="background-color: ${color};"></div>`;
            })
            .join('')}</div>`
      )
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Matrix Display</title>
  <style>
    :root {
      color-scheme: dark;
      background-color: #242424;
    }
    body {
      margin: 0;
      display: flex;
      place-items: center;
      min-height: 100vh;
    }
    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 20px;
      background-color: #1a1a1a;
      width: fit-content;
      margin: 0 auto;
    }
    .row {
      display: flex;
      gap: 2px;
    }
    .cell {
      width: 10px;
      height: 10px;
      background-color: #333;
      border: 1px solid #555;
      box-sizing: border-box;
    }
    .cell:hover {
      border-color: #777;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    ${cellsHtml}
  </div>
</body>
</html>`;
  }
}
