import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Emulator } from '../../../services/NESService';
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
  selector: 'app-nametableviewer',
  templateUrl: './nametableviewer.component.html',
  styleUrls: ['./nametableviewer.component.css']
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
        //debugger;
        requestAnimationFrame(() => {
            this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0, 0, 0);
            this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0x400, 256, 0);
            this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0x800, 0, 240);
            this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0xC00, 256, 240);
        });
    }


}
