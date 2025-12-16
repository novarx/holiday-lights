import {Dimensions, type Imager, type Matrix, Matrix as MatrixClass,} from '@holiday-lights/imager-core';
import {SceneRegistry} from '../lib/main/sceneRegistry';

// Tetromino shapes (relative coordinates)
const TETROMINOS = {
  I: {blocks: [[0, 0], [1, 0], [2, 0], [3, 0]], color: 'rgb(0, 255, 255)'},
  O: {blocks: [[0, 0], [1, 0], [0, 1], [1, 1]], color: 'rgb(255, 255, 0)'},
  T: {blocks: [[1, 0], [0, 1], [1, 1], [2, 1]], color: 'rgb(128, 0, 128)'},
  S: {blocks: [[1, 0], [2, 0], [0, 1], [1, 1]], color: 'rgb(0, 255, 0)'},
  Z: {blocks: [[0, 0], [1, 0], [1, 1], [2, 1]], color: 'rgb(255, 0, 0)'},
  J: {blocks: [[0, 0], [0, 1], [1, 1], [2, 1]], color: 'rgb(0, 0, 255)'},
  L: {blocks: [[2, 0], [0, 1], [1, 1], [2, 1]], color: 'rgb(255, 165, 0)'},
};

type TetrominoType = keyof typeof TETROMINOS;

interface GamePiece {
  type: TetrominoType;
  x: number;
  y: number;
  landed: boolean;
}

/**
 * Tetris Scene - A simplified Tetris game animation
 *
 * Features:
 * - Falling tetromino pieces
 * - Stacking mechanics
 * - Line clearing animation
 * - Border walls
 *
 * Designed to run for 100 frames (10*10)
 */
export class TetrisScene implements Imager {
  private readonly GRID_WIDTH = 10;
  private readonly GRID_HEIGHT = 10;
  private readonly GRID_OFFSET_X = 7; // Center on 64x64 matrix
  private readonly GRID_OFFSET_Y = 13;
  private readonly SCALE = 5; // Each block is 2x2 pixels
  private readonly SPAWN_INTERVAL = 20; // Frames between piece spawns
  private readonly FALL_SPEED = 3; // Frames between each downward movement

  private pieces: GamePiece[] = [];
  private settledBlocks: Map<string, string> = new Map(); // key: "x,y", value: color
  private linesToClear: number[] = [];
  private clearAnimationFrame = -1;

  constructor() {
    // Pre-generate the sequence of pieces for 100 frames
    const pieceTypes: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

    // Spawn pieces throughout the animation
    for (let i = 0; i < 5; i++) {
      this.pieces.push({
        type: pieceTypes[i % pieceTypes.length],
        x: 4, // Start in the middle
        y: -2, // Start above the visible area
        landed: false,
      });
    }
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    // Reset game state when animation loops back to frame 0
    if (frame === 0) {
      this.resetGame();
    }

    const matrix = new MatrixClass(Dimensions.square(64));

    // Fill background
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        matrix.set(x, y, {color: 'rgb(0, 0, 0)', brightness: 0});
      }
    }

    // Update game state based on frame
    this.updateGameState(frame);

    // Draw playing field borders
    this.drawBorders(matrix);

    // Draw settled blocks
    this.drawSettledBlocks(matrix);

    // Handle line clearing animation
    if (this.clearAnimationFrame >= 0 && frame >= this.clearAnimationFrame && frame < this.clearAnimationFrame + 5) {
      this.drawLineClearAnimation(matrix, frame - this.clearAnimationFrame);
    } else if (frame === this.clearAnimationFrame + 5) {
      this.clearLines();
      this.clearAnimationFrame = -1;
    }

    // Draw current falling piece
    this.drawCurrentPiece(matrix, frame);

    // Draw title at top
    this.drawTitle(matrix);

    return matrix;
  }

  private resetGame(): void {
    // Clear all settled blocks
    this.settledBlocks.clear();

    // Clear line clearing state
    this.linesToClear = [];
    this.clearAnimationFrame = -1;

    // Reset all pieces to initial state
    const pieceTypes: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    this.pieces = [];
    for (let i = 0; i < 5; i++) {
      this.pieces.push({
        type: pieceTypes[i % pieceTypes.length],
        x: 4,
        y: -2,
        landed: false,
      });
    }
  }

  private updateGameState(frame: number): void {
    // Update all active pieces
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      const pieceStartFrame = i * this.SPAWN_INTERVAL;

      // Piece hasn't spawned yet
      if (frame < pieceStartFrame) {
        break;
      }

      // Piece already landed
      if (piece.landed) {
        continue;
      }

      // Move piece down every FALL_SPEED frames
      const framesSinceSpawn = frame - pieceStartFrame;
      if (framesSinceSpawn % this.FALL_SPEED === 0) {
        piece.y = Math.floor(framesSinceSpawn / this.FALL_SPEED) - 2;

        // Check if piece should land
        if (this.shouldLand(piece)) {
          piece.landed = true;
          this.settlePiece(piece);
          this.checkForLines(frame);
        }
      }
    }
  }

  private shouldLand(piece: GamePiece): boolean {
    const tetromino = TETROMINOS[piece.type];

    for (const [bx, by] of tetromino.blocks) {
      const worldX = piece.x + bx;
      const worldY = piece.y + by + 1; // Check one position below

      // Hit bottom
      if (worldY >= this.GRID_HEIGHT) {
        return true;
      }

      // Hit another block
      if (this.settledBlocks.has(`${worldX},${worldY}`)) {
        return true;
      }
    }

    return false;
  }

  private settlePiece(piece: GamePiece): void {
    const tetromino = TETROMINOS[piece.type];

    for (const [bx, by] of tetromino.blocks) {
      const worldX = piece.x + bx;
      const worldY = piece.y + by;

      if (worldY >= 0) {
        this.settledBlocks.set(`${worldX},${worldY}`, tetromino.color);
      }
    }
  }

  private checkForLines(frame: number): void {
    const linesToClear: number[] = [];

    for (let y = 0; y < this.GRID_HEIGHT; y++) {
      let fullLine = true;
      for (let x = 0; x < this.GRID_WIDTH; x++) {
        if (!this.settledBlocks.has(`${x},${y}`)) {
          fullLine = false;
          break;
        }
      }
      if (fullLine) {
        linesToClear.push(y);
      }
    }

    if (linesToClear.length > 0) {
      this.linesToClear = linesToClear;
      this.clearAnimationFrame = frame + 1;
    }
  }

  private clearLines(): void {
    // Remove cleared lines
    for (const lineY of this.linesToClear) {
      for (let x = 0; x < this.GRID_WIDTH; x++) {
        this.settledBlocks.delete(`${x},${lineY}`);
      }
    }

    // Move blocks down
    const newBlocks = new Map<string, string>();
    for (const [key, color] of this.settledBlocks.entries()) {
      const [x, y] = key.split(',').map(Number);
      let newY = y;

      // Count how many cleared lines are below this block
      for (const clearedY of this.linesToClear) {
        if (clearedY > y) {
          newY++;
        }
      }

      newBlocks.set(`${x},${newY}`, color);
    }

    this.settledBlocks = newBlocks;
    this.linesToClear = [];
  }

  private drawBorders(matrix: Matrix): void {
    const borderColor = {color: 'rgb(100, 100, 150)', brightness: 255};

    // Left and right walls
    for (let y = 0; y < this.GRID_HEIGHT * this.SCALE; y++) {
      const screenY = this.GRID_OFFSET_Y + y;
      matrix.set(this.GRID_OFFSET_X - 1, screenY, borderColor);
      matrix.set(this.GRID_OFFSET_X + this.GRID_WIDTH * this.SCALE, screenY, borderColor);
    }

    // Bottom wall
    for (let x = -1; x <= this.GRID_WIDTH * this.SCALE; x++) {
      const screenX = this.GRID_OFFSET_X + x;
      matrix.set(screenX, this.GRID_OFFSET_Y + this.GRID_HEIGHT * this.SCALE, borderColor);
    }
  }

  private drawSettledBlocks(matrix: Matrix): void {
    for (const [key, color] of this.settledBlocks.entries()) {
      const [x, y] = key.split(',').map(Number);
      this.drawBlock(matrix, x, y, color);
    }
  }

  private drawLineClearAnimation(matrix: Matrix, animFrame: number): void {
    const flashColor = animFrame % 2 === 0 ? 'rgb(255, 255, 255)' : 'rgb(255, 255, 0)';

    for (const lineY of this.linesToClear) {
      for (let x = 0; x < this.GRID_WIDTH; x++) {
        this.drawBlock(matrix, x, lineY, flashColor);
      }
    }
  }

  private drawCurrentPiece(matrix: Matrix, frame: number): void {
    // Draw all active pieces
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      const pieceStartFrame = i * this.SPAWN_INTERVAL;

      // Piece hasn't spawned yet
      if (frame < pieceStartFrame) {
        break;
      }

      // Piece already landed
      if (piece.landed) {
        continue;
      }

      const tetromino = TETROMINOS[piece.type];

      for (const [bx, by] of tetromino.blocks) {
        const worldX = piece.x + bx;
        const worldY = piece.y + by;

        if (worldY >= 0) {
          this.drawBlock(matrix, worldX, worldY, tetromino.color);
        }
      }
    }
  }

  private drawBlock(matrix: Matrix, gridX: number, gridY: number, color: string): void {
    const screenX = this.GRID_OFFSET_X + gridX * this.SCALE;
    const screenY = this.GRID_OFFSET_Y + gridY * this.SCALE;

    for (let dy = 0; dy < this.SCALE; dy++) {
      for (let dx = 0; dx < this.SCALE; dx++) {
        matrix.set(screenX + dx, screenY + dy, {color, brightness: 255});
      }
    }
  }

  private drawTitle(matrix: Matrix): void {
    // Draw "TETRIS" text at top
    const title = 'TETRIS';
    const startX = 17;
    const y = 5;

    // Simple pixel font (5x5 per character)
    const letters: Record<string, number[][]> = {
      'T': [[1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]],
      'E': [[1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 1, 1, 1, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1]],
      'R': [[1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0], [1, 0, 1, 0, 0], [1, 0, 0, 1, 0]],
      'I': [[1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [1, 1, 1, 1, 1]],
      'S': [[0, 1, 1, 1, 1], [1, 0, 0, 0, 0], [0, 1, 1, 1, 0], [0, 0, 0, 0, 1], [1, 1, 1, 1, 0]],
    };

    let currentX = startX;
    for (const char of title) {
      const letter = letters[char];
      if (letter) {
        for (let ly = 0; ly < 5; ly++) {
          for (let lx = 0; lx < 5; lx++) {
            if (letter[ly][lx]) {
              matrix.set(currentX + lx, y + ly, {color: 'rgb(255, 255, 255)', brightness: 255});
            }
          }
        }
        currentX += 6; // 5 pixel width + 1 pixel spacing
      }
    }
  }
}

// Self-register this scene
SceneRegistry.register(() => new TetrisScene());

