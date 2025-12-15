/**
 * pixelit - convert an image to Pixel Art, with/out grayscale and based on a color palette.
 * @author José Moreira @ <https://github.com/giventofly/pixelit>
 **/

/** RGB color represented as a tuple of three numbers [R, G, B] */
export type RGBColor = [number, number, number];

/** Configuration options for Pixelit */
export interface PixelitConfig {
  /** Target canvas element to draw to */
  to?: HTMLCanvasElement;
  /** Source image element to read from */
  from?: HTMLImageElement;
  /** Pixelation scale from 1 to 50 (default: 8) */
  scale?: number;
  /** Color palette as array of RGB colors */
  palette?: RGBColor[];
  /** Maximum height for the output image */
  maxHeight?: number;
  /** Maximum width for the output image */
  maxWidth?: number;
}

/** Default color palette */
const DEFAULT_PALETTE: RGBColor[] = [
  [140, 143, 174],
  [88, 69, 99],
  [62, 33, 55],
  [154, 99, 72],
  [215, 155, 125],
  [245, 237, 186],
  [192, 199, 65],
  [100, 125, 52],
  [228, 148, 58],
  [157, 48, 59],
  [210, 100, 113],
  [112, 55, 127],
  [126, 196, 193],
  [52, 133, 157],
  [23, 67, 75],
  [31, 14, 28],
];

export class Pixelit {
  private drawto: HTMLCanvasElement;
  private drawfrom: HTMLImageElement | null;
  private scale: number;
  private palette: RGBColor[];
  private maxHeight?: number;
  private maxWidth?: number;
  private ctx: CanvasRenderingContext2D;
  private endColorStats: Record<string, unknown>;

  constructor(config: PixelitConfig = {}) {
    // Target for canvas
    this.drawto = config.to || document.getElementById("pixelitcanvas") as HTMLCanvasElement;
    // Origin of uploaded image/src img
    this.drawfrom = config.from || document.getElementById("pixelitimg") as HTMLImageElement;
    // Hide image element
    this.hideFromImg();
    // Range between 0 to 50 (input 0..50 -> 0..0.5)
    this.scale =
      config.scale && config.scale > 0 && config.scale <= 50
        ? config.scale * 0.01
        : 8 * 0.01;
    this.palette = config.palette || DEFAULT_PALETTE;
    this.maxHeight = config.maxHeight;
    this.maxWidth = config.maxWidth;
    this.ctx = this.drawto.getContext("2d")!;
    // Save latest converted colors
    this.endColorStats = {};
  }

  /** Hide from image */
  hideFromImg(): this {
    if (!this.drawfrom) return this;
    this.drawfrom.style.visibility = "hidden";
    this.drawfrom.style.position = "fixed";
    this.drawfrom.style.top = "0";
    this.drawfrom.style.left = "0";
    return this;
  }

  /**
   * Change the src from the image element
   * @param src - The new image source URL
   */
  setFromImgSource(src: string): this {
    if (this.drawfrom) this.drawfrom.src = src;
    return this;
  }

  /**
   * Set element to read image from
   * @param elem - The image element to read from
   */
  setDrawFrom(elem: HTMLImageElement): this {
    this.drawfrom = elem;
    this.hideFromImg();
    return this;
  }

  /**
   * Set element canvas to write the image
   * @param elem - The canvas element to write to
   */
  setDrawTo(elem: HTMLCanvasElement): this {
    this.drawto = elem;
    this.ctx = this.drawto.getContext("2d")!;
    return this;
  }

  /**
   * Set the color palette
   * @param arr - Array of RGB colors
   */
  setPalette(arr: RGBColor[]): this {
    this.palette = arr;
    return this;
  }

  /**
   * Set canvas image maxWidth
   * @param width - Maximum width in pixels
   */
  setMaxWidth(width: number): this {
    this.maxWidth = width;
    return this;
  }

  /**
   * Set canvas image maxHeight
   * @param height - Maximum height in pixels
   */
  setMaxHeight(height: number): this {
    this.maxHeight = height;
    return this;
  }

  /**
   * Set pixelate scale
   * @param scale - Scale value from 1 to 50
   */
  setScale(scale: number): this {
    this.scale = scale > 0 && scale <= 50 ? scale * 0.01 : 8 * 0.01;
    return this;
  }

  /**
   * Get current palette
   * @returns Array of RGB colors
   */
  getPalette(): RGBColor[] {
    return this.palette;
  }

  /**
   * Calculate color similarity between colors, lower is better
   * @param rgbColor - RGB color to compare
   * @param compareColor - RGB color to compare against
   * @returns Similarity value (0-441.67)
   */
  colorSim(rgbColor: RGBColor, compareColor: RGBColor): number {
    let d = 0;
    for (let i = 0; i < rgbColor.length; i++) {
      const diff = rgbColor[i] - compareColor[i];
      d += diff * diff;
    }
    return Math.sqrt(d);
  }

  /**
   * Given actualColor, find the most similar color from the palette
   * @param actualColor - RGB color to match
   * @returns The closest RGB color from the palette
   */
  similarColor(actualColor: RGBColor): RGBColor {
    let selectedColor = this.palette[0];
    let currentSim = this.colorSim(actualColor, selectedColor);
    for (let i = 1; i < this.palette.length; i++) {
      const color = this.palette[i];
      const nextColor = this.colorSim(actualColor, color);
      if (nextColor <= currentSim) {
        selectedColor = color;
        currentSim = nextColor;
      }
    }
    return selectedColor;
  }

  /**
   * Draws a pixelated version of an image in the canvas
   * Based on @author rogeriopvl <https://github.com/rogeriopvl/8bit>
   */
  pixelate(): this {
    if (!this.drawfrom) return this;
    const natW = this.drawfrom.naturalWidth || this.drawfrom.width;
    const natH = this.drawfrom.naturalHeight || this.drawfrom.height;
    this.drawto.width = natW;
    this.drawto.height = natH;

    // Do not mutate user-defined this.scale; use local working scale
    let workScale = this.scale;
    let scaledW = natW * workScale;
    let scaledH = natH * workScale;

    // Make temporary canvas to make new scaled copy
    const tempCanvas = document.createElement("canvas");

    // Set temp canvas width/height & hide (fixes higher scaled cutting off image bottom)
    tempCanvas.width = natW;
    tempCanvas.height = natH;
    tempCanvas.style.visibility = "hidden";
    tempCanvas.style.position = "fixed";
    tempCanvas.style.top = "0";
    tempCanvas.style.left = "0";

    // Corner case of bigger images, increase the temporary canvas size to fit everything
    if (natW > 900 || natH > 900) {
      workScale *= 0.5;
      scaledW = natW * workScale;
      scaledH = natH * workScale;
      tempCanvas.width = Math.max(scaledW, scaledH) + 50;
      tempCanvas.height = Math.max(scaledW, scaledH) + 50;
    }
    // Get the context
    const tempContext = tempCanvas.getContext("2d")!;
    // Draw the image into the canvas
    tempContext.drawImage(this.drawfrom, 0, 0, scaledW, scaledH);
    document.body.appendChild(tempCanvas);

    // Configs to pixelate
    this.ctx.imageSmoothingEnabled = false;

    // Calculations to remove extra border
    let finalWidth = natW;
    if (natW > 300) {
      finalWidth +=
        natW > natH
          ? Math.floor(natW / (natW * workScale)) / 1.5
          : Math.floor(natW / (natW * workScale));
    }
    let finalHeight = natH;
    if (natH > 300) {
      finalHeight +=
        natH > natW
          ? Math.floor(natH / (natH * workScale)) / 1.5
          : Math.floor(natH / (natH * workScale));
    }
    // Draw to final canvas
    this.ctx.drawImage(
      tempCanvas,
      0,
      0,
      scaledW,
      scaledH,
      0,
      0,
      finalWidth,
      finalHeight
    );
    // Remove temp element
    tempCanvas.remove();

    return this;
  }

  /**
   * Converts image to grayscale
   */
  convertGrayscale(): this {
    const w = this.drawto.width;
    const h = this.drawto.height;
    const imgPixels = this.ctx.getImageData(0, 0, w, h);
    const data = imgPixels.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }
    this.ctx.putImageData(imgPixels, 0, 0);
    return this;
  }

  /**
   * Converts image to palette using the defined palette or default palette
   */
  convertPalette(): this {
    const w = this.drawto.width;
    const h = this.drawto.height;
    const imgPixels = this.ctx.getImageData(0, 0, w, h);
    const data = imgPixels.data;
    for (let i = 0; i < data.length; i += 4) {
      const finalcolor = this.similarColor([data[i], data[i + 1], data[i + 2]]);
      data[i] = finalcolor[0];
      data[i + 1] = finalcolor[1];
      data[i + 2] = finalcolor[2];
    }
    this.ctx.putImageData(imgPixels, 0, 0);
    return this;
  }

  /**
   * Resizes image proportionally according to a max width or max height
   * Height takes precedence if defined
   */
  resizeImage(): this {
    if (!this.maxWidth && !this.maxHeight) {
      return this;
    }

    const canvasCopy = document.createElement("canvas");
    const copyContext = canvasCopy.getContext("2d")!;
    let ratio = 1.0;

    if (this.maxWidth && this.drawto.width > this.maxWidth) {
      ratio = this.maxWidth / this.drawto.width;
    }
    if (this.maxHeight && this.drawto.height > this.maxHeight) {
      ratio = this.maxHeight / this.drawto.height;
    }

    canvasCopy.width = this.drawto.width;
    canvasCopy.height = this.drawto.height;
    copyContext.drawImage(this.drawto, 0, 0);

    this.drawto.width = Math.max(1, this.drawto.width * ratio);
    this.drawto.height = Math.max(1, this.drawto.height * ratio);
    this.ctx.drawImage(
      canvasCopy,
      0,
      0,
      canvasCopy.width,
      canvasCopy.height,
      0,
      0,
      this.drawto.width,
      this.drawto.height
    );

    return this;
  }

  /**
   * Draw to canvas from image source and resize
   */
  draw(): this {
    if (!this.drawfrom) return this;
    const w = this.drawfrom.naturalWidth || this.drawfrom.width;
    const h = this.drawfrom.naturalHeight || this.drawfrom.height;
    this.drawto.width = w;
    this.drawto.height = h;
    this.ctx.drawImage(this.drawfrom, 0, 0);
    this.resizeImage();
    return this;
  }

  /**
   * Save image from canvas
   */
  saveImage(): void {
    const link = document.createElement("a");
    link.download = "pxArt.png";
    link.href = this.drawto
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

