import { Component, OnInit, Input } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { Emulator } from '../../../services/NESService';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({ name: 'ascii' })
export class AsciiPipe implements PipeTransform {
    transform(value: number, ascii?: string): string {
        if (ascii == "hex") {
            var val = value.toString(16);
            if (val.length == 1) {
                val = "0" + val.toUpperCase();
            }
            return val;
        }
        else {
            return String.fromCharCode(value);
        }
    }
}

@Component({
    styleUrls: ['./chichines.memviewer.component.css'],
    selector: '[myTr]',
    template: `<td>{{ lineAddress() }}:</td><td *ngFor="let item of row">{{item | ascii: showAscii}}</td>`
})
export class MyTrComponent {
    @Input('myTr') row;
    @Input('myIndex') myIndex;
    lineAddress() {
        return '0x' + ((this.myIndex * 16).toString(16)).padStart(4, '0');
    }
    @Input('showAscii') showAscii: string;
}

@Component({
  selector: 'chichines-memviewer',
  templateUrl: './chichines.memviewer.component.html',
  styleUrls: ['./chichines.memviewer.component.css']
})
export class MemViewerComponent implements OnInit {
    _data = new Array<Uint8Array>();// [[1, 2, 3], [11, 12, 13]];

    get data(): Array<Uint8Array> {
        return this._data;
    }
    hexMode = true;
    _ramStart = 0x0000;
    _ramEnd = 0x07FF;

    get ramStart(): any {
        return this._ramStart;
    }
    set ramStart(value: any) {
        this._ramStart = parseInt(value, 16);
    }

    get displayType(): string {
        if (this.hexMode) {
            return 'hex';
        } else {
            return 'ascii';
        }
    }

    toggleHexMode() {
        this.hexMode = !this.hexMode;
        this.look();
    }
    pageSize = 16;
    constructor(private nes: Emulator) {
    }

    public look(): void {
        const ram = new Uint8Array(this.nes.wishbone.Cpu.Rams.slice(0));
        const chunks = 0x7FF / 16;
        const data = new Array<Uint8Array>();
        for (let i = 0; i < chunks ; ++i) {
            data.push(ram.slice(i * this.pageSize, i * this.pageSize + this.pageSize));
        }
        this._data = data;
    }

    ngOnInit() {
        this.look();
    }

}
