import {Injectable} from '@angular/core';
import {IImageService} from './image.interfaces';
import {Matrix, Matrix64x64} from './matrix';
import {RandomImage} from "./imager/randomImage";
import {TriangleImage} from "./imager/triangleImage";
import {ImageFileImager} from "./imager/imageFileImager";

@Injectable({
    providedIn: 'root'
})
export class ImageService implements IImageService {

    private readonly images = {
        random: new RandomImage(),
        triangle: new TriangleImage(30, 30),
        imageFile: new ImageFileImager('bubblegum.png', 64, 64),
    }


    getMatrix(frame: number, previousMatrix: Matrix | null): Matrix64x64 {
        return this.images.imageFile.getMatrix(frame, previousMatrix);
    }
}
