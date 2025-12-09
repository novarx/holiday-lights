import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Controls the animation frame loop for the emulator.
 * Manages frame timing and provides frame updates as an observable.
 */
@Injectable({
  providedIn: 'root'
})
export class AnimationController implements OnDestroy {
  private readonly frameSubject = new BehaviorSubject<number>(0);
  private intervalId?: number;
  private currentFrame = 0;

  /**
   * Observable that emits the current frame number.
   */
  readonly frame$: Observable<number> = this.frameSubject.asObservable();

  /**
   * Gets the current frame number.
   */
  get frame(): number {
    return this.currentFrame;
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
      this.frameSubject.next(this.currentFrame);
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
    this.frameSubject.next(this.currentFrame);
  }

  ngOnDestroy(): void {
    this.stop();
    this.frameSubject.complete();
  }
}

