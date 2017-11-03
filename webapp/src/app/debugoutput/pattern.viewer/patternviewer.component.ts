import { Emulator } from '../../services/NESService'
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

// import { Pipe, PipeTransform } from '@angular/core';

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
  selector: 'chichi-patternviewer',
  templateUrl: './patternviewer.component.html',
  styleUrls: ['./patternviewer.component.css']
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
        //debugger;
        requestAnimationFrame(() => {
            this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0, 0, 0);
            this.doDoodle(this.tileDoodle2.nativeElement.getContext('2d'), 0x1000, 0, 0);
        });
    }


}
