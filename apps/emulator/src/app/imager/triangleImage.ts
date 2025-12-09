import {Imager} from "./imager";
import {Matrix, Matrix64x64} from "../matrix";

export class TriangleImage extends Imager {
  private readonly height: number;
  private readonly baseWidth: number;

  constructor(
    private readonly sideA: number,
    private readonly sideB: number
  ) {
    super();
    // For an isosceles triangle with two equal sides (sideA and sideB)
    // We'll create an isosceles triangle where sideA and sideB are the two equal sides
    // and calculate the base and height

    // Assuming an isosceles triangle with two equal sides
    // If sideA = sideB, we need to determine the base
    // For simplicity, we'll use sideA and sideB as the two equal sides
    // and calculate a reasonable base width

    // Using sideA as one of the equal sides and sideB as the base
    this.baseWidth = sideB;
    // Height using Pythagorean theorem: h = sqrt(sideA^2 - (base/2)^2)
    const halfBase = sideB / 2;
    this.height = Math.sqrt(Math.max(0, sideA * sideA - halfBase * halfBase));
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix64x64 {
    // Calculate rotation angle based on frame (full rotation every 100 frames / 10 seconds)
    const angle = (frame / 100) * 2 * Math.PI;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return new Matrix64x64((x, y) => {
      // Center of the matrix
      const centerX = 32;
      const centerY = 32;

      // Translate point to origin (relative to center)
      const relX = x - centerX;
      const relY = y - centerY;

      // Apply reverse rotation to the point
      const rotatedX = relX * cos + relY * sin;
      const rotatedY = -relX * sin + relY * cos;

      // Triangle dimensions and position in non-rotated space
      const topY = -this.height / 2;      // Center vertically around origin
      const bottomY = topY + this.height;

      // Calculate if rotated point is inside triangle
      const triangleRelY = rotatedY - topY;
      const maxWidth = (triangleRelY / this.height) * this.baseWidth;
      const leftBound = -maxWidth / 2;
      const rightBound = maxWidth / 2;

      const isInside = rotatedY >= topY && rotatedY <= bottomY &&
        rotatedX >= leftBound && rotatedX <= rightBound;

      if (isInside) {
        // Color gradient from top (red) to bottom (yellow)
        const gradient = triangleRelY / this.height;
        return {
          color: Imager.color(255, Math.floor(255 * gradient), 0),
          brightness: 255
        };
      } else {
        return {
          color: Imager.color(0, 0, 0),
          brightness: 255
        };
      }
    });
  }
}
