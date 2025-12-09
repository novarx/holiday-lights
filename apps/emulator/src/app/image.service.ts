import {Injectable} from '@angular/core';
import {IImageService} from './image.interfaces';
import {Matrix} from './matrix';
import {RandomImage} from "./imager/randomImage";
import {TriangleImage} from "./imager/triangleImage";
import {ImageFileImager} from "./imager/imageFileImager";
import {CompositeImager} from "./imager/compositeImager";
import {TextImager} from "./imager/textImager";

@Injectable({
    providedIn: 'root'
})
export class ImageService implements IImageService {

    private readonly images = {
        random: new RandomImage(),
        triangle: new TriangleImage(30, 30),
        imageFile: new ImageFileImager('bubblegum.png', 64, 64),
        text: new TextImager('Hello!', 16, 'monospace', 'rgb(255, 100, 0)'),
        composite: new CompositeImager( 'rgb(0, 0, 0)')
            .addImager(new ImageFileImager('bubblegum.png', 45, 45), 10, 20)
            .addImager(new TextImager('Lorem', 12, 'monospace', 'rgb(0, 255, 0)'), 10, 0)
    }


    getMatrix(frame: number, previousMatrix: Matrix | null): Matrix {
        return this.images.composite.getMatrix(frame, previousMatrix);
    }
}
