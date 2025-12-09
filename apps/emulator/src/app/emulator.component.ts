import {Component, ViewEncapsulation, inject, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageService} from './image.service';
import {Cell} from './image.interfaces';
import {Matrix} from './matrix';

@Component({
  selector: 'app-nx-welcome',
  imports: [CommonModule],
  templateUrl: './emulator.component.html',
  styleUrls: ['./emulator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Emulator implements OnInit, OnDestroy {
  private imageService = inject(ImageService);
  private intervalId?: number;
  private frame = 0;

  public matrix: Matrix = this.imageService.getMatrix(0, null);

  ngOnInit(): void {
    this.intervalId = window.setInterval(() => {
      this.frame = (this.frame + 1) % 100; // 0-99 for 10 seconds (100 frames * 100ms)
      this.matrix = this.imageService.getMatrix(this.frame, this.matrix);
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }

  getCellColor(cell: Cell): string {
    if (cell.brightness === 255) {
      return cell.color;
    }

    // Parse RGB string and convert to RGBA with brightness as alpha
    const match = cell.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const alpha = cell.brightness / 255;
      return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
    }
    return cell.color;
  }
}
