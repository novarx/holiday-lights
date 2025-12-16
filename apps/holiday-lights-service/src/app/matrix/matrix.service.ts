import {Injectable, OnModuleDestroy} from '@nestjs/common';
import {AllScenesLoader, applyBrightness, Imager, Matrix} from '@holiday-lights/imager-core';
import {LedMatrix} from "./led-matrix.adapter";
import {matrixOptions, runtimeOptions} from './_config';

@Injectable()
export class MatrixService implements OnModuleDestroy {
  private readonly imagers: Imager[];
  private matrix: LedMatrix;
  private currentImagerIndex = 0;
  private currentFrame = 0;
  private previousMatrix: Matrix | null = null;
  private intervalId?: NodeJS.Timeout;
  private readonly maxFrames = 100;
  private readonly intervalMs = 100;

  constructor() {
    // Load all scenes from the scene registry
    const sceneLoader = new AllScenesLoader();
    this.imagers = sceneLoader.getImagers();

    if (this.imagers.length === 0) {
      console.warn('No scenes loaded! Make sure scenes are registered.');
      // Fallback to a simple scene
      throw new Error('No scenes available to display');
    }

    console.log(`Loaded ${this.imagers.length} scene(s) for display`);
  }

  /**
   * Converts an RGB color string to a hex number.
   * @param rgbString - Color string in format "rgb(r, g, b)"
   * @returns Hex number (e.g., 0x0000ff for blue)
   */
  private rgbToHex(rgbString: string): number {
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) {
      return 0x000000;
    }
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    return (r << 16) | (g << 8) | b;
  }

  /**
   * Gets the current imager/scene being displayed.
   */
  private getCurrentImager(): Imager {
    return this.imagers[this.currentImagerIndex];
  }

  /**
   * Advances to the next scene in the sequence.
   * Loops back to the first scene after the last one.
   */
  private advanceToNextScene(): void {
    if (this.imagers.length === 0) return;

    this.currentImagerIndex = (this.currentImagerIndex + 1) % this.imagers.length;
    this.previousMatrix = null; // Reset matrix for new scene

    if (this.imagers.length > 1) {
      console.log(`Switching to scene ${this.currentImagerIndex + 1}/${this.imagers.length}`);
    }
  }

  /**
   * Updates the LED matrix with the current frame.
   */
  private updateMatrix(): void {
    const matrixDefinition = this.getCurrentImager().getMatrix(this.currentFrame, this.previousMatrix);
    this.previousMatrix = matrixDefinition;

    // Clear and prepare for drawing
    this.matrix.clear();

    // Draw each pixel from the matrix definition
    matrixDefinition.forEach((cell, x, y) => {
      const colorWithBrightness = applyBrightness(cell.color, cell.brightness);
      const hexColor = this.rgbToHex(colorWithBrightness);
      this.matrix.fgColor(hexColor).setPixel(x, y);
    });

    // Sync to display
    this.matrix.sync();
  }

  /**
   * Animation loop tick handler.
   */
  private onFrame(): void {
    // Update the matrix display with current frame
    this.updateMatrix();

    // Advance frame counter
    this.currentFrame = (this.currentFrame + 1) % this.maxFrames;

    // Check if we just wrapped to frame 0 (completed a full cycle)
    // If so, advance to next scene for the next render
    if (this.currentFrame === 0) {
      this.advanceToNextScene();
    }
  }

  /**
   * Initializes the LED matrix and starts the animation loop.
   */
  async initMatrix(): Promise<void> {
    console.log('Initializing LED matrix...');

    // Create the LED matrix instance
    this.matrix = new LedMatrix(matrixOptions, runtimeOptions);

    console.log(`Matrix initialized: ${this.matrix.width()}x${this.matrix.height()}`);

    // Start the animation loop
    this.start();

    console.log(`Animation started with ${this.imagers.length} scene(s)`);
  }

  /**
   * Starts the animation loop.
   */
  private start(): void {
    if (this.intervalId !== undefined) {
      return; // Already running
    }

    this.intervalId = setInterval(() => {
      this.onFrame();
    }, this.intervalMs);
  }

  /**
   * Stops the animation loop.
   */
  private stop(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  /**
   * Cleanup when the module is destroyed.
   */
  onModuleDestroy(): void {
    console.log('Stopping matrix animation...');
    this.stop();
    if (this.matrix) {
      this.matrix.clear().sync();
    }
  }
}
