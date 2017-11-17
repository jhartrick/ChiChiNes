import { Emulator } from '../../../services/NESService';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChiChiPPU } from 'chichi';

@Component({
  selector: 'debug-patternviewer',
  templateUrl: './debug-patternviewer.component.html',
  styleUrls: ['./debug-patternviewer.component.css']
})

export class PatternViewerComponent {

    @ViewChild('tileDoodle') tileDoodle: ElementRef;
    @ViewChild('tileDoodle2') tileDoodle2: ElementRef;

    constructor(private nes: Emulator) {
    }

    private doDoodle(ctx: CanvasRenderingContext2D, nametable: number, x: number, y: number) : void {
        const imgData = ctx.getImageData(0, 0, 128, 128);

        const doodle1 = this.nes.wishbone.tileDoodler.doodlePatternTable(nametable);
        const pal = ChiChiPPU.pal;
 
        for (let i = 0; i <= doodle1.length; ++i) {
            const color = pal[doodle1[i]];
            imgData.data[i * 4] = (color >> 0) & 0xFF;
            imgData.data[(i * 4) + 1] = (color >> 8) & 0xFF;
            imgData.data[(i * 4) + 2] = (color >> 16 ) & 0xFF;
            imgData.data[(i * 4) + 3] =  0xFF;
        }

        ctx.putImageData(imgData, x, y);
    }

    public doodle(): void {
        requestAnimationFrame(() => {
            this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0, 0, 0);
            this.doDoodle(this.tileDoodle2.nativeElement.getContext('2d'), 0x1000, 0, 0);
        });
    }
}
