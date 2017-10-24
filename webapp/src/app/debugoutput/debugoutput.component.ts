import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { Emulator } from '../services/NESService'
import { DecodedInstruction, InstructionHistoryDatabase, DebugInstructionDataSource, Debugger } from '../services/debug.interface'
import { MatPaginator } from '@angular/material';
import { CpuStatus, PpuStatus } from "../../../workers/chichi/ChiChiTypes";
import { WishboneMachine } from "../services/wishbone/wishbone";
import { Observable } from "rxjs/Observable";


@Component({
    selector: '[ppuStatus]',
    template: `X: {{ ppuStatus?.X }} Y: {{ ppuStatus?.Y }} Name Table: {{ ppuStatus?.nameTableStart }} Tile: {{ ppuStatus?.currentTile }} Status: {{ ppuStatus?.status }}`
})
export class PpuStatusComponent {
    @Input('ppuStatus') ppuStatus;
}


@Component({
    selector: '[cpuStatus]',
    template: `PC: {{ cpuStatus?.PC.toString(16) }} A: {{ cpuStatus?.A.toString(16) }} X: {{ cpuStatus?.X.toString(16) }} Y: {{ cpuStatus?.Y.toString(16) }} SP: {{ cpuStatus?.SP.toString(16) }}`
})
export class CpuStatusComponent {
    @Input('cpuStatus') cpuStatus;
}


@Component({
  selector: 'app-debugoutput',
  templateUrl: './debugoutput.component.html',
  styleUrls: ['./debugoutput.component.css']
})

export class DebugOutputComponent implements OnInit  {
    selectedTabIndex = 0;

    @ViewChild('tileDoodle') tileDoodle: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    decodedStatusRegister = '';
    constructor(public nes: Emulator, private cd: ChangeDetectorRef) {
        // this.cd.detach();
        nes.wishbone.asObservable().subscribe((boner) => {
            if (boner.cpuStatus) {
                this.decodedStatusRegister = Debugger.decodeCpuStatusRegister(boner.cpuStatus.SR);
            }
        });
    }

    private doDoodle(ctx: CanvasRenderingContext2D, nametable: number, x: number, y: number) : void {
        const imgData = ctx.getImageData(0, 0, 256, 256);

        this.nes.tiler.DoodleNameTable(nametable, imgData.data);
        ctx.putImageData(imgData, x, y);
    }
    interval: any;
    public doodle(): void {
        this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0, 0, 0);
        this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0x400, 256, 0);
        this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0x800, 0, 240);
        this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0xC00, 256, 240);
    }

    ngOnInit(): void {
    }
}
