import { Emulator } from '../../../services/NESService';
import { Component, ElementRef, ViewChild } from '@angular/core';

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
        this.nes.tiler.DoodlePatternTable(nametable, imgData.data);
        ctx.putImageData(imgData, x, y);
    }

    public doodle(): void {
        requestAnimationFrame(() => {
            this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0, 0, 0);
            this.doDoodle(this.tileDoodle2.nativeElement.getContext('2d'), 0x1000, 0, 0);
        });
    }
}
