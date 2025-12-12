import { Component, ViewEncapsulation, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ImageService } from './image.service';
import { AnimationController } from './animation';
import { applyBrightness, Cell, Matrix } from '@holiday-lights/imager-core';

@Component({
  selector: 'app-nx-welcome',
  imports: [CommonModule],
  templateUrl: './emulator.component.html',
  styleUrls: ['./emulator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Emulator implements OnInit, OnDestroy {
  private readonly imageService = inject(ImageService);
  private readonly animationController = inject(AnimationController);
  private subscription?: Subscription;

  matrix: Matrix = this.imageService.getMatrix(0, null);

  ngOnInit(): void {
    this.subscription = this.animationController.frame$.subscribe(frame => {
      this.matrix = this.imageService.getMatrix(frame, this.matrix);
    });
    this.animationController.start();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.animationController.stop();
  }

  getCellColor(cell: Cell): string {
    return applyBrightness(cell.color, cell.brightness);
  }
}
