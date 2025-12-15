import { applyBrightness, type Cell, type Matrix, type Imager, AnimationController } from '@holiday-lights/imager-core';

/**
 * Emulator component that renders multiple LED matrix displays in sequence.
 * Displays each Matrix for one complete animation cycle, then moves to the next.
 */
export class MultiMatrixEmulator {
  private readonly animationController: AnimationController;
  private readonly container: HTMLElement;
  private readonly imagers: Imager[];
  private currentImagerIndex = 0;
  private matrix: Matrix;
  private unsubscribe?: () => void;
  private frameCounter?: HTMLElement;
  private matrixIndicator?: HTMLElement;
  private cellElements: HTMLElement[][] = [];
  private previousColors: string[][] = [];
  private readonly maxFrames: number;
  private cycling: boolean;

  constructor(container: HTMLElement, imagers: Imager[], maxFrames: number = 100, cycling: boolean = true) {
    this.container = container;
    this.imagers = imagers;
    this.maxFrames = maxFrames;
    this.cycling = cycling;
    this.animationController = new AnimationController();
    this.matrix = this.getCurrentImager().getMatrix(0, null);
  }

  /**
   * Gets the current imager based on the index.
   */
  private getCurrentImager(): Imager {
    return this.imagers[this.currentImagerIndex];
  }

  /**
   * Starts the emulator and begins rendering.
   */
  start(): void {
    this.render();

    this.unsubscribe = this.animationController.subscribe(frame => {
      // Check if we completed a full cycle (frame wrapped to 0) and cycling is enabled
      if (frame === 0 && this.cycling && this.imagers.length > 1) {
        this.advanceToNextMatrix();
      }

      this.matrix = this.getCurrentImager().getMatrix(frame, this.matrix);
      this.updateCells();
      this.updateFrameCounter(frame);
      this.updateMatrixIndicator();
    });

    this.animationController.start(100, this.maxFrames);
  }

  /**
   * Advances to the next matrix in the sequence.
   */
  private advanceToNextMatrix(): void {
    this.currentImagerIndex = (this.currentImagerIndex + 1) % this.imagers.length;
    // Reset the matrix for the new imager
    this.matrix = this.getCurrentImager().getMatrix(0, null);
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

    // Create header with indicators
    const header = document.createElement('div');
    header.className = 'multi-matrix-header';

    // Create matrix indicator
    this.matrixIndicator = document.createElement('div');
    this.matrixIndicator.className = 'matrix-indicator';
    this.updateMatrixIndicator();
    header.appendChild(this.matrixIndicator);

    // Create frame counter
    this.frameCounter = document.createElement('div');
    this.frameCounter.className = 'frame-counter';
    this.updateFrameCounter(0);
    header.appendChild(this.frameCounter);

    this.container.appendChild(header);

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
      const total = this.maxFrames;
      this.frameCounter.textContent = `Frame: ${current}/${total}`;
    }
  }

  /**
   * Updates the matrix indicator display.
   */
  private updateMatrixIndicator(): void {
    if (this.matrixIndicator) {
      const current = this.currentImagerIndex + 1;
      const total = this.imagers.length;
      this.matrixIndicator.textContent = `Matrix: ${current}/${total}`;
    }
  }

  /**
   * Sets whether to cycle through scenes.
   */
  setCycling(enabled: boolean): void {
    this.cycling = enabled;
  }

  /**
   * Sets the current scene index.
   */
  setCurrentScene(index: number): void {
    if (index >= 0 && index < this.imagers.length) {
      this.currentImagerIndex = index;
      this.matrix = this.getCurrentImager().getMatrix(0, null);
      this.updateMatrixIndicator();
    }
  }

  /**
   * Gets the current scene index.
   */
  getCurrentSceneIndex(): number {
    return this.currentImagerIndex;
  }
}

