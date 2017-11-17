import { Emulator } from '../../../services/NESService'
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChiChiPPU } from 'chichi';

@Component({
  selector: 'debug-spriteviewer',
  templateUrl: './debug-spriteviewer.component.html',
  styleUrls: ['./debug-spriteviewer.component.css']
})

export class SpriteViewerComponent {

    @ViewChild('spriteDoodle') tileDoodle: ElementRef;

    constructor(private nes: Emulator) {
    }

    private doDoodle(ctx: CanvasRenderingContext2D, spriteNumber: number, x: number, y: number): void {
        const imgData = ctx.getImageData(0, 0, 8, 8);
        const outbuf = imgData.data;
        const wishbone = this.nes.wishbone;

        const doodle1 = wishbone.tileDoodler.getSprite(spriteNumber);
        
        const pal = ChiChiPPU.pal;

        for (let i = 0; i <= doodle1.length; ++i) {
            const color = pal[doodle1[i]];
            outbuf[i * 4] = (color >> 0) & 0xFF;
            outbuf[(i * 4) + 1] = (color >> 8) & 0xFF;
            outbuf[(i * 4) + 2] = (color >> 16 ) & 0xFF;
            outbuf[(i * 4) + 3] =  0xFF;
        }

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
