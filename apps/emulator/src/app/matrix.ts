import {Cell} from './image.interfaces';

type CellInitializer = (x: number, y: number) => Cell


export class Matrix {
  private cells: Cell[][];
  public readonly width: number;
  public readonly height: number;

  /**
   * Creates a new matrix with the specified dimensions.
   * @param width - The width of the matrix
   * @param height - The height of the matrix
   * @param initializer - Optional function to initialize cells at each position
   */
  constructor(width: number, height: number, initializer?: (x: number, y: number) => Cell) {
    this.width = width;
    this.height = height;
    this.cells = Array.from({length: height}, (_, y) =>
      Array.from({length: width}, (_, x) =>
        initializer ? initializer(x, y) : {color: 'rgb(0, 0, 0)', brightness: 255}
      )
    );
  }

  /**
   * Gets the cell at the specified coordinates.
   * @param x - The x coordinate
   * @param y - The y coordinate
   * @returns The cell at (x, y) or undefined if out of bounds
   */
  get(x: number, y: number): Cell | undefined {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return undefined;
    }
    return this.cells[y][x];
  }

  /**
   * Sets the cell at the specified coordinates.
   * @param x - The x coordinate
   * @param y - The y coordinate
   * @param cell - The cell to set
   * @returns true if successful, false if out of bounds
   */
  set(x: number, y: number, cell: Cell): boolean {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    }
    this.cells[y][x] = cell;
    return true;
  }

  /**
   * Updates the color of the cell at the specified coordinates.
   * @param x - The x coordinate
   * @param y - The y coordinate
   * @param color - The RGB color string
   * @returns true if successful, false if out of bounds
   */
  setColor(x: number, y: number, color: string): boolean {
    const cell = this.get(x, y);
    if (!cell) {
      return false;
    }
    cell.color = color;
    return true;
  }

  /**
   * Updates the brightness of the cell at the specified coordinates.
   * @param x - The x coordinate
   * @param y - The y coordinate
   * @param brightness - The brightness value (0-255)
   * @returns true if successful, false if out of bounds
   */
  setBrightness(x: number, y: number, brightness: number): boolean {
    const cell = this.get(x, y);
    if (!cell) {
      return false;
    }
    cell.brightness = brightness;
    return true;
  }

  /**
   * Gets all rows in the matrix.
   * @returns A 2D array of cells
   */
  getRows(): Cell[][] {
    return this.cells;
  }

  /**
   * Iterates over each cell in the matrix.
   * @param callback - Function called for each cell with the cell and its coordinates
   */
  forEach(callback: (cell: Cell, x: number, y: number) => void): void {
    this.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        callback(cell, x, y);
      });
    });
  }

  /**
   * Fills the entire matrix with the specified cell or using an initializer function.
   * @param cellOrInitializer - A cell to copy to all positions or a function to create cells
   */
  fill(cellOrInitializer: Cell | CellInitializer): void {
    this.cells.forEach((row, y) => {
      row.forEach((_, x) => {
        this.cells[y][x] = typeof cellOrInitializer === 'function'
          ? cellOrInitializer(x, y)
          : {...cellOrInitializer};
      });
    });
  }
}

export class Matrix64x64 extends Matrix {
  constructor(initializer?: CellInitializer) {
    super(64, 64, initializer);
  }
}
