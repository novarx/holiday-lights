import {
  Dimensions,
  type Imager,
  Matrix as MatrixClass,
} from '@holiday-lights/imager-core';
import { SceneRegistry } from '../lib/main/sceneRegistry';

/**
 * Christmas Tree Scene with blinking lights
 *
 * This scene displays a Christmas tree with:
 * - Green triangle for the tree
 * - Brown trunk at the bottom
 * - Colorful blinking lights (red, yellow, blue, white)
 * - A yellow star on top
 * - The lights blink at different rates for a twinkling effect
 */
export class ChristmasTreeScene implements Imager {
  private readonly lightPositions: Array<{ x: number; y: number; color: string; offset: number }>;

  constructor() {
    // Define positions for the Christmas lights with different blink offsets
    this.lightPositions = [
      // Top section of tree
      { x: 32, y: 12, color: 'rgb(255, 0, 0)', offset: 0 },     // red
      { x: 28, y: 16, color: 'rgb(255, 255, 0)', offset: 15 },  // yellow
      { x: 36, y: 16, color: 'rgb(0, 0, 255)', offset: 30 },    // blue

      // Upper middle section
      { x: 24, y: 20, color: 'rgb(255, 255, 255)', offset: 45 }, // white
      { x: 32, y: 21, color: 'rgb(255, 0, 0)', offset: 10 },     // red
      { x: 40, y: 20, color: 'rgb(255, 255, 0)', offset: 25 },   // yellow

      // Middle section
      { x: 20, y: 25, color: 'rgb(0, 0, 255)', offset: 40 },     // blue
      { x: 28, y: 26, color: 'rgb(255, 255, 255)', offset: 5 },  // white
      { x: 36, y: 26, color: 'rgb(255, 0, 0)', offset: 20 },     // red
      { x: 44, y: 25, color: 'rgb(255, 255, 0)', offset: 35 },   // yellow

      // Lower middle section
      { x: 18, y: 31, color: 'rgb(255, 0, 0)', offset: 50 },     // red
      { x: 24, y: 32, color: 'rgb(0, 0, 255)', offset: 15 },     // blue
      { x: 32, y: 33, color: 'rgb(255, 255, 0)', offset: 30 },   // yellow
      { x: 40, y: 32, color: 'rgb(255, 255, 255)', offset: 45 }, // white
      { x: 46, y: 31, color: 'rgb(255, 0, 0)', offset: 10 },     // red

      // Lower section
      { x: 16, y: 37, color: 'rgb(255, 255, 0)', offset: 25 },   // yellow
      { x: 22, y: 38, color: 'rgb(0, 0, 255)', offset: 40 },     // blue
      { x: 28, y: 39, color: 'rgb(255, 255, 255)', offset: 5 },  // white
      { x: 36, y: 39, color: 'rgb(255, 0, 0)', offset: 20 },     // red
      { x: 42, y: 38, color: 'rgb(255, 255, 0)', offset: 35 },   // yellow
      { x: 48, y: 37, color: 'rgb(0, 0, 255)', offset: 50 },     // blue

      // Bottom section
      { x: 14, y: 43, color: 'rgb(255, 255, 255)', offset: 15 }, // white
      { x: 20, y: 44, color: 'rgb(255, 0, 0)', offset: 30 },     // red
      { x: 26, y: 45, color: 'rgb(255, 255, 0)', offset: 45 },   // yellow
      { x: 32, y: 46, color: 'rgb(0, 0, 255)', offset: 10 },     // blue
      { x: 38, y: 45, color: 'rgb(255, 255, 255)', offset: 25 }, // white
      { x: 44, y: 44, color: 'rgb(255, 0, 0)', offset: 40 },     // red
      { x: 50, y: 43, color: 'rgb(255, 255, 0)', offset: 5 },    // yellow
    ];
  }

  /**
   * Generate the matrix for the current frame.
   */
  getMatrix(frame: number, previousMatrix: MatrixClass | null): MatrixClass {
    const matrix = new MatrixClass(Dimensions.square(64));

    // Fill background with black
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        matrix.set(x, y, { color: 'rgb(0, 0, 0)', brightness: 255 });
      }
    }

    // Draw the tree (green triangle)
    this.drawTree(matrix);

    // Draw the trunk (brown rectangle)
    this.drawTrunk(matrix);

    // Draw the star on top (yellow)
    this.drawStar(matrix);

    // Draw blinking lights
    this.drawLights(matrix, frame);

    return matrix;
  }

  /**
   * Draw the Christmas tree (green triangle)
   */
  private drawTree(matrix: MatrixClass): void {
    const treeColor = 'rgb(0, 150, 0)'; // Dark green
    const centerX = 32;
    const topY = 10;
    const bottomY = 48;

    // Draw triangle from top to bottom
    for (let y = topY; y <= bottomY; y++) {
      const progress = (y - topY) / (bottomY - topY);
      const width = Math.floor(progress * 40); // Max width of 40 pixels

      for (let dx = -width; dx <= width; dx++) {
        const x = centerX + dx;
        if (x >= 0 && x < 64) {
          matrix.set(x, y, { color: treeColor, brightness: 255 });
        }
      }
    }
  }

  /**
   * Draw the tree trunk (brown rectangle)
   */
  private drawTrunk(matrix: MatrixClass): void {
    const trunkColor = 'rgb(139, 69, 19)'; // Brown
    const trunkWidth = 6;
    const trunkHeight = 10;
    const centerX = 32;
    const startY = 49;

    for (let y = startY; y < startY + trunkHeight && y < 64; y++) {
      for (let dx = -trunkWidth / 2; dx < trunkWidth / 2; dx++) {
        const x = centerX + dx;
        if (x >= 0 && x < 64) {
          matrix.set(x, y, { color: trunkColor, brightness: 255 });
        }
      }
    }
  }

  /**
   * Draw a star on top of the tree
   */
  private drawStar(matrix: MatrixClass): void {
    const starColor = 'rgb(255, 215, 0)'; // Gold
    const centerX = 32;
    const centerY = 6;

    // Draw a simple 5-pointed star pattern
    const starPoints = [
      { x: 0, y: -3 },   // top
      { x: 1, y: -1 },
      { x: 3, y: -1 },   // right top
      { x: 1, y: 0 },
      { x: 2, y: 2 },    // right bottom
      { x: 0, y: 1 },
      { x: -2, y: 2 },   // left bottom
      { x: -1, y: 0 },
      { x: -3, y: -1 },  // left top
      { x: -1, y: -1 },
      { x: 0, y: 0 },    // center
    ];

    starPoints.forEach(point => {
      const x = centerX + point.x;
      const y = centerY + point.y;
      if (x >= 0 && x < 64 && y >= 0 && y < 64) {
        matrix.set(x, y, { color: starColor, brightness: 255 });
      }
    });
  }

  /**
   * Draw blinking lights on the tree
   */
  private drawLights(matrix: MatrixClass, frame: number): void {
    this.lightPositions.forEach(light => {
      // Create a blinking effect using sine wave
      // Each light has a different offset so they blink at different times
      const blinkCycle = ((frame + light.offset) % 50) / 50; // 0 to 1
      const brightness = Math.sin(blinkCycle * Math.PI * 2) * 0.5 + 0.5; // 0 to 1

      // Only draw if brightness is above threshold (creates twinkling effect)
      if (brightness > 0.3) {
        const adjustedBrightness = Math.floor(brightness * 255);

        // Draw the light (2x2 pixels for visibility)
        for (let dy = 0; dy <= 1; dy++) {
          for (let dx = 0; dx <= 1; dx++) {
            const x = light.x + dx;
            const y = light.y + dy;
            if (x >= 0 && x < 64 && y >= 0 && y < 64) {
              matrix.set(x, y, { color: light.color, brightness: adjustedBrightness });
            }
          }
        }
      }
    });
  }
}

// Self-register this scene
SceneRegistry.register(() => new ChristmasTreeScene());

