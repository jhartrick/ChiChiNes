import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NESService } from '../../../services/NESService';
import { ChiChiPPU } from 'chichi';

@Component({
  selector: 'debug-nametableviewer',
  templateUrl: './debug-nametableviewer.component.html',
  styleUrls: ['./debug-nametableviewer.component.css']
})

export class NameTableViewerComponent {

    @ViewChild('tileDoodle') tileDoodle: ElementRef;

    constructor(private nes: NESService) {
    }

    doodleNameTable(nametable: number, outbuf:  Uint8ClampedArray ): void
    {
        const doodle1 = this.nes.wishbone.tileDoodler.doodleNameTable(nametable);

        const pal = ChiChiPPU.pal;
 
        for (let i = 0; i <= doodle1.length; ++i) {
            const color = pal[doodle1[i]];
            outbuf[i * 4] = (color >> 0) & 0xFF;
            outbuf[(i * 4) + 1] = (color >> 8) & 0xFF;
            outbuf[(i * 4) + 2] = (color >> 16 ) & 0xFF;
            outbuf[(i * 4) + 3] =  0xFF;
        }
    }

    private doDoodle(ctx: CanvasRenderingContext2D, nametable: number, x: number, y: number) : void {
        const imgData = ctx.getImageData(0, 0, 256, 256);

        this.doodleNameTable(nametable, imgData.data);
        ctx.putImageData(imgData, x, y);
    }

    public doodle(): void {
        requestAnimationFrame(() => {
            this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0, 0, 0);
            this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0x400, 256, 0);
            this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0x800, 0, 240);
            this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0xC00, 256, 240);
        });
    }
}
