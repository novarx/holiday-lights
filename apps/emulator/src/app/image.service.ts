import {Injectable} from '@angular/core';
import {Matrix} from './matrix';
import {CompositeImager, ImageFileImager, Imager, Position, RandomImage, TextImager} from './imager';
import {Dimensions} from './utils';

/**
 * Service that provides matrix images for the emulator display.
 * Acts as a facade, delegating image generation to the composed Imager.
 */
@Injectable({
    providedIn: 'root'
})
export class ImageService implements Imager {
    private readonly imager: Imager = new CompositeImager(
        Dimensions.square(64),
        'rgb(45, 45, 45)'
    )
        .addImager(
            new ImageFileImager('bubblegum.png', Dimensions.square(45)),
            Position.center()
        )
        .addImager(
            new TextImager('Lorem', 12, 'monospace', 'rgb(0, 255, 0)'),
            Position.centerHorizontal(53)
        )
        .addImager(
            new RandomImage(Dimensions.square(15)),
            Position.static(0, 0)
        )
    ;

    getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
        return this.imager.getMatrix(frame, previousMatrix);
    }
}
