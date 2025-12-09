import {Injectable} from '@angular/core';
import {IImageService} from './image.interfaces';
import {Matrix, Matrix64x64} from './matrix';

export abstract class Imager {

    public static randomColorValue() {
        return Math.floor(Math.random() * 256);
    }

    public static randomColor(): string {
        return this.color();
    }

    public static color(
        red: number = this.randomColorValue(),
        green: number = this.randomColorValue(),
        blue: number = this.randomColorValue(),
    ) {
        return `rgb(${red}, ${(green)}, ${blue})`;
    }

    abstract getMatrix(frame: number, previousMatrix: Matrix | null): Matrix64x64;
}

export class RandomImage extends Imager {
    getMatrix(frame: number, previousMatrix: Matrix | null): Matrix64x64 {
        return new Matrix64x64((x, y) => ({
            color: Imager.randomColor(),
            brightness: 255 * (x / 64)
        }))
    }
}

@Injectable({
    providedIn: 'root'
})
export class ImageService implements IImageService {

    private readonly images = {
        random: new RandomImage(),
    }


    getMatrix(frame: number, previousMatrix: Matrix | null): Matrix64x64 {
        return this.images.random.getMatrix(frame, previousMatrix);
    }

}

