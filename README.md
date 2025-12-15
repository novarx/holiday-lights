# Holiday Lights

## Getting Started

```bash
npm install
npm run serve:emulator
```

or go to

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/novarx/holiday-lights?file=libs/imager-core/src/scenes/default.scene.ts)

## Creating a New Scene

1. **Copy the DefaultScene**: Duplicate `libs/imager-core/src/scenes/default.scene.ts` and rename it to your scene name (e.g., `my-scene.ts`)

2. **Implement your scene**: Modify the copied file with your scene logic
   - Use available imagers from `imager-core/src/lib/imagers`:
     - `CompositeImager` - Combine multiple imagers
     - `ImageFileImager` - Display an image file
     - `TextImager` - Render text
     - `RandomImage` - Random pixel patterns
   - Keep all scene code in the single file
   - **Do not** add dependencies to browser or Node.js-specific APIs
   - Register your scene with `SceneRegistry.register(() => new YourScene())`

3. **Update AllScenesLoader**: Import your new scene in `libs/imager-core/src/scenes/allScenesLoader.ts`
   - **Do NOT commit** `allScenesLoader.ts` - this will be handled by the moderator to avoid merge conflicts

## Example Scene Structure

```typescript
import { CompositeImager, Dimensions, Imager, Matrix, Position, TextImager } from '@holiday-lights/imager-core';
import { SceneRegistry } from '../lib/main/sceneRegistry';

export class MyScene implements Imager {
  private readonly imager: Imager;

  constructor() {
    this.imager = new CompositeImager(Dimensions.square(64), 'black')
      .addImager(new TextImager('Hello', 12, 'monospace', 'red'), Position.center());
  }

  getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
    return this.imager.getMatrix(frame, previousMatrix);
  }
}

SceneRegistry.register(() => new MyScene());
```

## Scene Ideas

Your scene will be displayed on the office LED matrix! Here are some ideas to get you started:

### Animations & Graphics
- **Animated Team Logo** - Make your team logo pulse, rotate, or sparkle
- **Scrolling Text Banner** - Display team names, quotes, or welcome messages
- **Weather Display** - Show current weather with animated icons (sun, rain, snow)
- **Clock/Timer** - Digital or analog clock display
- **QR Code** - Display a QR code linking to team resources
- **Fireworks** - Animated particle effects celebrating achievements
- **Matrix Rain** - Classic falling code effect
- **Starfield** - Moving stars or space scene

### Games & Interactive
- **Snake Game** - Classic snake with increasing difficulty
- **Tetris** - Falling blocks with line clearing
- **Pong** - Bouncing ball game
- **Conway's Game of Life** - Cellular automaton patterns
- **Maze Generator** - Procedurally generated mazes
- **Breakout** - Brick breaking game

### Company Culture
- **Team Member Showcase** - Cycle through team member names/avatars
- **Sprint Countdown** - Days remaining in current sprint
- **Build Status** - Visual CI/CD pipeline status
- **Commit Leaderboard** - Top contributors visualization
- **Coffee Counter** - Track team coffee consumption
- **Meeting Room Status** - Available/busy indicators

### Artistic & Fun
- **Plasma Effect** - Colorful animated plasma waves
- **Mandelbrot Zoom** - Fractal exploration
- **Rainbow Waves** - Animated color gradients
- **Music Visualizer** - Bars or waveforms (use data patterns)
- **Holiday Themes** - Seasonal decorations and animations
- **Emoji Reactions** - Animated emoji sequences

**Pro Tip**: Use GitHub Copilot, ChatGPT, or other AI assistants to help implement your ideas! They're great at generating animation logic, color schemes, and mathematical patterns.
