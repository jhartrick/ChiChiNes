import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Emulator } from '../../../services/NESService';

@Component({
  selector: 'debug-nametableviewer',
  templateUrl: './debug-nametableviewer.component.html',
  styleUrls: ['./debug-nametableviewer.component.css']
})

export class NameTableViewerComponent {

    @ViewChild('tileDoodle') tileDoodle: ElementRef;

    constructor(private nes: Emulator) {
    }

    private doDoodle(ctx: CanvasRenderingContext2D, nametable: number, x: number, y: number) : void {
        const imgData = ctx.getImageData(0, 0, 256, 256);

        this.nes.tiler.DoodleNameTable(nametable, imgData.data);
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
