import { applyBrightness, type Cell, type Matrix } from '@holiday-lights/imager-core';
import { ImageService } from './image.service';
import { AnimationController } from './animation';

/**
 * Emulator component that renders the LED matrix display.
 */
export class Emulator {
  private readonly imageService: ImageService;
  private readonly animationController: AnimationController;
  private readonly container: HTMLElement;
  private matrix: Matrix;
  private unsubscribe?: () => void;
  private frameCounter?: HTMLElement;
  private cellElements: HTMLElement[][] = [];
  private previousColors: string[][] = [];

  constructor(container: HTMLElement) {
    this.container = container;
    this.imageService = new ImageService();
    this.animationController = new AnimationController();
    this.matrix = this.imageService.getMatrix(0, null);
  }

  /**
   * Starts the emulator and begins rendering.
   */
  start(): void {
    this.render();

    this.unsubscribe = this.animationController.subscribe(frame => {
      this.matrix = this.imageService.getMatrix(frame, this.matrix);
      this.updateCells();
      this.updateFrameCounter(frame);
    });

    this.animationController.start();
  }

  /**
   * Stops the emulator and cleans up resources.
   */
  stop(): void {
    this.unsubscribe?.();
    this.animationController.destroy();
  }

  /**
   * Gets the CSS color for a cell.
   */
  private getCellColor(cell: Cell): string {
    return applyBrightness(cell.color, cell.brightness);
  }

  /**
   * Renders the initial matrix HTML structure.
   */
  private render(): void {
    this.container.innerHTML = '';
    this.cellElements = [];
    this.previousColors = [];

    // Create frame counter
    this.frameCounter = document.createElement('div');
    this.frameCounter.className = 'frame-counter';
    this.updateFrameCounter(0);
    this.container.appendChild(this.frameCounter);

    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    const rows = this.matrix.getRows();
    rows.forEach((row) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'row';

      const cellRow: HTMLElement[] = [];
      const colorRow: string[] = [];

      row.forEach((cell) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        const color = this.getCellColor(cell);
        cellDiv.style.backgroundColor = color;
        rowDiv.appendChild(cellDiv);

        cellRow.push(cellDiv);
        colorRow.push(color);
      });

      this.cellElements.push(cellRow);
      this.previousColors.push(colorRow);
      wrapper.appendChild(rowDiv);
    });

    this.container.appendChild(wrapper);
  }

  /**
   * Updates cell colors without rebuilding the DOM.
   * Only updates cells that have changed color.
   */
  private updateCells(): void {
    const rows = this.matrix.getRows();
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
        const color = this.getCellColor(row[cellIndex]);

        // Only update if color changed
        if (color !== this.previousColors[rowIndex][cellIndex]) {
          this.cellElements[rowIndex][cellIndex].style.backgroundColor = color;
          this.previousColors[rowIndex][cellIndex] = color;
        }
      }
    }
  }

  /**
   * Updates the frame counter display.
   */
  private updateFrameCounter(frame: number): void {
    if (this.frameCounter) {
      const current = frame + 1;
      const total = this.animationController.maxFrames;
      this.frameCounter.textContent = `${current}/${total}`;
    }
  }
}

