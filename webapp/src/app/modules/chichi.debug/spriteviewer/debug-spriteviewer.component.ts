import { Emulator } from '../../../services/NESService'
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'debug-spriteviewer',
  templateUrl: './debug-spriteviewer.component.html',
  styleUrls: ['./debug-spriteviewer.component.css']
})

export class SpriteViewerComponent {

    @ViewChild('spriteDoodle') tileDoodle: ElementRef;

    constructor(private nes: Emulator) {
    }

    private doDoodle(ctx: CanvasRenderingContext2D, sprintenum: number, x: number, y: number): void {
        const imgData = ctx.getImageData(0, 0, 8, 8);
        this.nes.tiler.DoodleSprite(sprintenum, imgData.data);
        ctx.putImageData(imgData, x, y);
    }

    public doodle(): void {
        requestAnimationFrame(() => {
            for (let i = 0; i < 8; ++i) {
                for (let j = 0; j < 8; ++j) {
                    this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), ((i * 8) + j), i * 8, j * 8);
                }
            }
        });
    }


}
