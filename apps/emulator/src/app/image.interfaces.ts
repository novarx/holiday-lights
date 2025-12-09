/**
 * Represents a single cell (pixel) in the LED matrix.
 */
export interface Cell {
  /** RGB color string in format "rgb(r, g, b)" */
  color: string;
  /** Brightness value from 0 (off) to 255 (full) */
  brightness: number;
}

