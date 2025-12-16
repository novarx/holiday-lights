import {
  CompositeImager,
  Dimensions, ImageFileImager,
  type Imager,
  type Matrix,
  Position,
  RandomImage,
  TextImager,
} from '@holiday-lights/imager-core';
import { SceneRegistry } from '../lib/main/sceneRegistry';


/**
 * Default scene demonstrating the use of multiple imagers.
 *
 * This example shows:
 * - A 64x64 matrix with gray background
 * - A centered image (bubblegum.png) scaled to 45x45
 * - Centered text "Lorem" in green at y position 53
 * - Random pixels in a 15x15 area at top-left corner
 *
 * TIPS FOR LLM PROMPTS (copy this entire file and ask):
 * - "Create an animated scrolling text scene that moves from right to left"
 * - "Make a snake game scene where the snake moves in a pattern"
 * - "Build a scene with pulsing colors based on frame number creating a plasma effect"
 * - "Create a scene showing 'Hello World' in the center with a rainbow gradient"
 * - "Implement a falling rain animation with random drops"
 * - "Create a digital clock that displays the frame number as time"
 * - "Make a bouncing ball animation that bounces off the edges"
 */
export class DefaultScene implements Imager {
  private readonly imager: Imager;

  constructor() {
    this.imager = new CompositeImager(
      Dimensions.square(64),
      'rgb(0, 0, 0)'
    )
      .addImager(
        new ImageFileImager('bubblegum.png', Dimensions.square(45)),
        Position.center()
      )
      .addImager(
        new TextImager('DevTalk', 12, 'monospace', 'rgb(0, 255, 0)'),
        Position.centerHorizontal(53)
      )
      .addImager(
        new RandomImage(Dimensions.square(15)),
        Position.static(0, 0)
      );
  }

  /**
   * Generate the matrix for the current frame.
   *
   * @param frame - Frame number from 0 to 100 (representing 0 to 10 seconds at 10fps).
   *                Use this for animations by calculating positions/colors based on the frame count.
   *                The frame resets to 0 after reaching 100.
   * @param previousMatrix - The matrix returned from the previous frame, or null for the first frame.
   *                         You can modify and return this matrix for optimization, or create a new one.
   * @returns A Matrix object representing the 64x64 LED display state for this frame.
   */
  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    return this.imager.getMatrix(frame, previousMatrix);
  }
}

// Self-register this scene
SceneRegistry.register(() => new DefaultScene());

/**
 * -- Context for LLM --
 *
 * HOLIDAY LIGHTS LED MATRIX SCENE
 *
 * This scene will be displayed on a 64x64 LED matrix in the office.
 * Copy this entire file to implement your own custom scene.
 *
 * QUICK START:
 * 1. Copy this file and rename it to your-scene-name.scene.ts
 * 2. Rename the class (e.g., MyAwesomeScene)
 * 3. Implement your scene logic in the constructor
 * 4. Register with SceneRegistry.register(() => new YourScene())
 * 5. Update AllScenesLoader with your import (do NOT commit AllScenesLoader.ts)
 *
 * AVAILABLE IMAGERS (from '@holiday-lights/imager-core'):
 * - CompositeImager(dimensions, backgroundColor) - Combine multiple imagers into one scene
 *   - .addImager(imager, position) - Add an imager at a specific position
 *
 * - TextImager(text, fontSize, fontFamily, color) - Render text
 *   - text: string to display
 *   - fontSize: number (e.g., 12)
 *   - fontFamily: string (e.g., 'monospace', 'Arial', 'sans-serif')
 *   - color: CSS color string (e.g., 'rgb(255, 0, 0)', '#ff0000', 'red')
 *
 * - ImageFileImager(filename, dimensions) - Display an image
 *   - filename: image file in libs/imager-core/src/assets/ (e.g., 'bubblegum.png')
 *   - dimensions: Dimensions object for scaling
 *
 * - RandomImage(dimensions) - Random colored pixels
 *   - dimensions: Dimensions object for the random area
 *
 * HELPER CLASSES:
 * - Dimensions.square(size) - Create square dimensions (e.g., Dimensions.square(64))
 * - Dimensions.of(width, height) - Create custom dimensions
 *
 * - Position.center() - Center the imager on the matrix
 * - Position.centerHorizontal(y) - Center horizontally at y position
 * - Position.centerVertical(x) - Center vertically at x position
 * - Position.static(x, y) - Fixed position at x, y coordinates
 *
 * ANIMATION:
 * - The getMatrix() method is called for each frame
 * - Use the 'frame' parameter for animations (increments each frame)
 * - Example: Position.static(frame % 64, 10) for scrolling horizontally
 * - Create smooth animations by calculating positions based on frame
 *
 * ADVANCED: CUSTOM IMAGER (for complex animations):
 * You can create a custom imager by implementing the Imager interface:
 *
 * class MyCustomImager implements Imager {
 *   getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
 *     const matrix = new Matrix(Dimensions.square(64));
 *     // Manually set pixels using matrix.set(x, y, { color: 'rgb(r,g,b)', brightness: 255 })
 *     for (let x = 0; x < 64; x++) {
 *       for (let y = 0; y < 64; y++) {
 *         const color = `rgb(${(x * 4)}, ${(y * 4)}, ${(frame % 256)})`;
 *         matrix.set(x, y, { color, brightness: 255 });
 *       }
 *     }
 *     return matrix;
 *   }
 * }
 *
 * Matrix manipulation:
 * - new Matrix(dimensions) - Create a new blank matrix
 * - matrix.set(x, y, cell) - Set pixel at position (x, y)
 * - matrix.get(x, y) - Get pixel at position (x, y)
 * - Cell format: { color: 'rgb(r, g, b)', brightness: 0-255 }
 *
 * IMPORTANT CONSTRAINTS:
 * - Matrix size is 64x64 pixels
 * - Coordinate system: (0,0) is top-left, (63,63) is bottom-right
 * - Do NOT use browser-specific APIs (window, document, etc.)
 * - Do NOT use Node.js-specific APIs (fs, path, etc.)
 * - Keep all scene code in this single file
 * - Use only the provided imagers and utilities
 *
 * SCENE IDEAS:
 * - Animated team logo with pulsing colors
 * - Scrolling text banner with your team name
 * - Snake game with fruit and growing tail
 * - Tetris with falling blocks
 * - Conway's Game of Life
 * - Matrix rain effect
 * - Plasma/fire animation
 * - Clock or countdown timer
 * - Weather display with icons
 * - QR code display
 */
