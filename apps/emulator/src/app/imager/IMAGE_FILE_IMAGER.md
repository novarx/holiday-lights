# ImageFileImager Usage

The `ImageFileImager` class allows you to load and display image files on the LED matrix.

## Features

- **Automatic Scaling**: Images are automatically scaled to fit within the specified maximum dimensions while maintaining aspect ratio
- **Centering**: Scaled images are automatically centered in the matrix
- **Asynchronous Loading**: Images load asynchronously without blocking the UI
- **Format Support**: Supports all image formats supported by the browser (PNG, JPG, GIF, etc.)

## Constructor Parameters

```typescript
constructor(
  imagePath: string,      // Path to the image file
  maxWidth: number = 64,  // Maximum width (default: 64)
  maxHeight: number = 64  // Maximum height (default: 64)
)
```

## Usage Examples

### Basic Usage

```typescript
// Load an image from the assets folder
const imager = new ImageFileImager('assets/my-image.png');
```

### Custom Size

```typescript
// Load and scale to fit within 32x32
const imager = new ImageFileImager('assets/my-image.png', 32, 32);
```

### Using in ImageService

```typescript
private readonly images = {
  random: new RandomImage(),
  triangle: new TriangleImage(30, 30),
  myImage: new ImageFileImager('assets/logo.png', 64, 64),
}

getMatrix(frame: number, previousMatrix: Matrix | null): Matrix64x64 {
  return this.images.myImage.getMatrix(frame, previousMatrix);
}
```

## How It Works

1. **Image Loading**: When instantiated, the imager loads the image file
2. **Aspect Ratio Calculation**: Determines the scaled size that fits within maxWidth × maxHeight while maintaining aspect ratio
3. **Canvas Rendering**: Draws the scaled image to an off-screen canvas
4. **Pixel Extraction**: Extracts pixel data from the canvas for rendering on the matrix
5. **Centering**: Calculates offsets to center the image in the matrix
6. **Matrix Generation**: Each call to `getMatrix()` returns a matrix with the image pixels at the correct positions

## Notes

- Images load asynchronously, so the matrix will show black until the image is loaded
- Images are centered both horizontally and vertically
- Pixels outside the image area are rendered as black
- Cross-origin images require proper CORS headers

