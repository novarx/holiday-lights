/**
 * Mock implementation of rpi-led-matrix for non-Raspberry Pi environments.
 * This allows development and testing without the actual hardware.
 */

export enum GpioMapping {
  Regular = 0,
  AdafruitHat = 1,
  AdafruitHatPwm = 2,
  RegularPi1 = 3,
  Classic = 4,
  ClassicPi1 = 5,
}

export enum PixelMapperType {
  Chainlink = 'Chainlink',
  Rotate = 'Rotate',
  Mirror = 'Mirror',
  U = 'U-mapper',
}

export enum RuntimeFlag {
  Off = 0,
  On = 1,
}

export interface MatrixOptions {
  rows: number;
  cols: number;
  chainLength: number;
  parallel: number;
  hardwareMapping: GpioMapping;
  brightness: number;
  pixelMapperConfig?: string;
  pwmBits?: number;
  pwmLsbNanoseconds?: number;
  pwmDitherBits?: number;
  scanMode?: number;
  multiplexing?: number;
  rowAddressType?: number;
  disableHardwarePulsing?: boolean;
  showRefreshRate?: boolean;
  inverseColors?: boolean;
  ledRgbSequence?: string;
  limitRefreshRateHz?: number;
}

export interface RuntimeOptions {
  gpioSlowdown: number;
  dropPrivileges: RuntimeFlag;
  daemon?: RuntimeFlag;
  doGpioInit?: boolean;
}

export const LedMatrixUtils = {
  encodeMappers: (..._mappers: Array<{ type: PixelMapperType; angle?: number }>): string => {
    return '';
  },
};

export class LedMatrix {
  private _brightness: number = 100;
  private _fgColor: number = 0xffffff;
  private _bgColor: number = 0x000000;
  private _width: number;
  private _height: number;
  private _pixels: Map<string, number> = new Map();

  constructor(matrixOptions: MatrixOptions, _runtimeOptions: RuntimeOptions) {
    this._width = matrixOptions.cols * matrixOptions.chainLength;
    this._height = matrixOptions.rows * matrixOptions.parallel;
    console.log(`[LED Matrix Mock] Initialized ${this._width}x${this._height} display`);
  }

  static defaultMatrixOptions(): MatrixOptions {
    return {
      rows: 32,
      cols: 32,
      chainLength: 1,
      parallel: 1,
      hardwareMapping: GpioMapping.Regular,
      brightness: 100,
    };
  }

  static defaultRuntimeOptions(): RuntimeOptions {
    return {
      gpioSlowdown: 1,
      dropPrivileges: RuntimeFlag.Off,
    };
  }

  width(): number {
    return this._width;
  }

  height(): number {
    return this._height;
  }

  getBrightness(): number {
    return this._brightness;
  }

  brightness(value: number): this {
    this._brightness = value;
    return this;
  }

  getFgColor(): number {
    return this._fgColor;
  }

  fgColor(color: number): this {
    this._fgColor = color;
    return this;
  }

  getBgColor(): number {
    return this._bgColor;
  }

  bgColor(color: number): this {
    this._bgColor = color;
    return this;
  }

  clear(): this {
    this._pixels.clear();
    console.log('[LED Matrix Mock] Display cleared');
    return this;
  }

  fill(x0 = 0, y0 = 0, x1 = this._width - 1, y1 = this._height - 1): this {
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        this._pixels.set(`${x},${y}`, this._fgColor);
      }
    }
    return this;
  }

  setPixel(x: number, y: number): this {
    this._pixels.set(`${x},${y}`, this._fgColor);
    return this;
  }

  sync(): void {
    console.log(`[LED Matrix Mock] Synced ${this._pixels.size} pixels to display`);
  }

  afterSync(callback: (matrix: this, dt: number, t: number) => void): this {
    // Mock implementation - just call the callback once
    setTimeout(() => callback(this, 0, Date.now()), 0);
    return this;
  }
}

