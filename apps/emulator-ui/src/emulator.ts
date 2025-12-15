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

    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    const rows = this.matrix.getRows();
    rows.forEach((row, rowIndex) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'row';

      row.forEach((cell, cellIndex) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        cellDiv.dataset.row = String(rowIndex);
        cellDiv.dataset.col = String(cellIndex);
        cellDiv.style.backgroundColor = this.getCellColor(cell);
        rowDiv.appendChild(cellDiv);
      });

      wrapper.appendChild(rowDiv);
    });

    this.container.appendChild(wrapper);
  }

  /**
   * Updates cell colors without rebuilding the DOM.
   */
  private updateCells(): void {
    const rows = this.matrix.getRows();
    rows.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const cellDiv = this.container.querySelector<HTMLElement>(
          `.cell[data-row="${rowIndex}"][data-col="${cellIndex}"]`
        );
        if (cellDiv) {
          cellDiv.style.backgroundColor = this.getCellColor(cell);
        }
      });
    });
  }
}

