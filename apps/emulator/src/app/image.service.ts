import {Injectable} from '@angular/core';
import {IImageService} from './image.interfaces';
import {Matrix} from './matrix';
import {ImageFileImager} from "./imager/imageFileImager";
import {CompositeImager} from "./imager/compositeImager";
import {TextImager} from "./imager/textImager";
import {Position} from "./imager/position";

@Injectable({
    providedIn: 'root'
})
export class ImageService implements IImageService {

    private readonly image = new CompositeImager(64, 64, 'rgb(45, 45, 45)')
        .addImager(new ImageFileImager('bubblegum.png', 45, 45), Position.center())
        .addImager(new TextImager('Lorem', 12, 'monospace', 'rgb(0, 255, 0)'), Position.centerHorizontal(2))
    ;


    getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
        return this.image.getMatrix(frame, previousMatrix);
    }
}
