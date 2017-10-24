import { Emulator } from '../../services/NESService'
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
//import { Pipe, PipeTransform } from '@angular/core';

// @Component({
//     styleUrls: ['./chichines.memviewer.component.css'],
//     selector: '[myTr]',
//     template: `<td>{{ lineAddress() }}:</td><td *ngFor="let item of row">{{item | ascii: showAscii}}</td>`
// })
// export class MyTrComponent {
//     @Input('myTr') row;
//     @Input('myIndex') myIndex;
//     lineAddress() {
//         return '0x' + ((this.myIndex * 16).toString(16)).padStart(4, '0');
//     }
//     @Input('showAscii') showAscii: string;
// }

@Component({
  selector: 'app-spriteviewer',
  templateUrl: './spriteviewer.component.html',
  styleUrls: ['./spriteviewer.component.css']
})

export class SpriteViewerComponent {

    @ViewChild('spriteDoodle') tileDoodle: ElementRef;
    
    constructor(private nes: Emulator) {
    }

    private doDoodle(ctx: CanvasRenderingContext2D, sprintenum: number, x: number, y: number) : void {
        const imgData = ctx.getImageData(0, 0, 8, 8);
        this.nes.tiler.DoodleSprite(sprintenum, imgData.data);
        //this.nes.tiler.DoodleNameTable(nametable, imgData.data);
        ctx.putImageData(imgData, x, y);
    }

    public doodle(): void {
        //debugger;
        requestAnimationFrame(() => {
            for (let i = 0; i < 8; ++i) {
                for (let j = 0; j < 8; ++j) {
                    this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), (i * 8 + j), i * 8, j* 8);
                }
            }
        });
    }


}
