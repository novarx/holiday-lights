import { Dimensions, type Imager, type Matrix, Matrix as MatrixClass } from '@holiday-lights/imager-core';
import { SceneRegistry } from '../lib/main/sceneRegistry';

/**
 * Rotating Square Scene
 *
 * Displays a square that rotates around the center of the matrix.
 * The square smoothly rotates 360 degrees over the course of the animation.
 */
export class RotatingSquareScene implements Imager {
  private readonly dimensions = Dimensions.square(64);
  private readonly squareSize = 35; // Size of the square
  private readonly centerX = 32;
  private readonly centerY = 32;

  constructor() {}

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    const matrix = new MatrixClass(this.dimensions, () => ({
      color: 'rgb(0, 0, 0)',
      brightness: 255
    }));

    // Calculate rotation angle based on frame (0-99 frames = 0-360 degrees)
    const angle = (frame / 100) * 2 * Math.PI;

    // Define the square's corners relative to center (before rotation)
    const halfSize = this.squareSize / 2;
    const corners = [
      { x: -halfSize, y: -halfSize }, // Top-left
      { x: halfSize, y: -halfSize },  // Top-right
      { x: halfSize, y: halfSize },   // Bottom-right
      { x: -halfSize, y: halfSize },  // Bottom-left
    ];

    // Rotate corners and translate to screen coordinates
    const rotatedCorners = corners.map(corner => {
      const rotatedX = corner.x * Math.cos(angle) - corner.y * Math.sin(angle);
      const rotatedY = corner.x * Math.sin(angle) + corner.y * Math.cos(angle);
      return {
        x: Math.round(rotatedX + this.centerX),
        y: Math.round(rotatedY + this.centerY),
      };
    });

    // Optional: Fill the square
    this.fillSquare(matrix, rotatedCorners, 'rgb(0, 200, 255)');

    return matrix;
  }

  /**
   * Fills the square using a simple scanline algorithm.
   */
  private fillSquare(
    matrix: Matrix,
    corners: Array<{ x: number; y: number }>,
    color: string
  ): void {
    // Find bounding box
    const minX = Math.max(0, Math.min(...corners.map(c => c.x)));
    const maxX = Math.min(this.dimensions.width - 1, Math.max(...corners.map(c => c.x)));
    const minY = Math.max(0, Math.min(...corners.map(c => c.y)));
    const maxY = Math.min(this.dimensions.height - 1, Math.max(...corners.map(c => c.y)));

    // Check each point in bounding box
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (this.isPointInPolygon(x, y, corners)) {
          matrix.set(x, y, { color, brightness: 255 });
        }
      }
    }
  }

  /**
   * Checks if a point is inside a polygon using ray casting algorithm.
   */
  private isPointInPolygon(
    x: number,
    y: number,
    polygon: Array<{ x: number; y: number }>
  ): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;
      const xj = polygon[j].x;
      const yj = polygon[j].y;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }
}

// Self-register this scene
SceneRegistry.register(() => new RotatingSquareScene());

