/**
 * Callback type for frame updates.
 */
export type FrameCallback = (frame: number) => void;

/**
 * Controls the animation frame loop for the emulator.
 * Manages frame timing and provides frame updates via callbacks.
 */
export class AnimationController {
  private intervalId?: number;
  private currentFrame = 0;
  private readonly subscribers: Set<FrameCallback> = new Set();

  /**
   * Gets the current frame number.
   */
  get frame(): number {
    return this.currentFrame;
  }

  /**
   * Subscribes to frame updates.
   * @param callback - Function to call on each frame update
   * @returns Unsubscribe function
   */
  subscribe(callback: FrameCallback): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Starts the animation loop.
   * @param intervalMs - Interval between frames in milliseconds (default: 100)
   * @param maxFrames - Maximum frame count before wrapping (default: 100)
   */
  start(intervalMs: number = 100, maxFrames: number = 100): void {
    if (this.intervalId !== undefined) {
      return; // Already running
    }

    this.intervalId = window.setInterval(() => {
      this.currentFrame = (this.currentFrame + 1) % maxFrames;
      this.notifySubscribers();
    }, intervalMs);
  }

  /**
   * Stops the animation loop.
   */
  stop(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  /**
   * Resets the frame counter to 0.
   */
  reset(): void {
    this.currentFrame = 0;
    this.notifySubscribers();
  }

  /**
   * Destroys the controller, stopping the animation and clearing subscribers.
   */
  destroy(): void {
    this.stop();
    this.subscribers.clear();
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.currentFrame));
  }
}

