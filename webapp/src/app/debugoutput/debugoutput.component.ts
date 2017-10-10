import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Emulator } from '../services/NESService'
import { DecodedInstruction, InstructionHistoryDatabase, DebugInstructionDataSource } from '../services/debug.interface'
import {MatPaginator} from '@angular/material';

@Component({
  selector: 'app-debugoutput',
  templateUrl: './debugoutput.component.html',
  styleUrls: ['./debugoutput.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebugOutputComponent implements OnInit  {
    
    @ViewChild('tileDoodle') tileDoodle: ElementRef;
    //@ViewChild('tileDoodle2') tileDoodle2: ElementRef;
    //@ViewChild('tileDoodle3') tileDoodle3: ElementRef;
    //@ViewChild('tileDoodle4') tileDoodle4: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public instructions: string[];

    public dbgDataSource:  DebugInstructionDataSource ;
    
    constructor(public nes: Emulator) {
    }

    private doDoodle(ctx: CanvasRenderingContext2D, nametable: number, x: number, y: number) : void {
        var imgData = ctx.getImageData(0, 0, 256, 256);

        this.nes.tileDoodler.DoodleNameTable(nametable, imgData.data);
        ctx.putImageData(imgData, x, y);
    }

    public doodle(): void {
        //debugger;
        this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'),0, 0, 0);
        this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0x400, 256, 0);
        this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0x800, 0, 240);
        this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'), 0xC00, 256, 240);
    }

    ngOnInit(): void {
        this.dbgDataSource = new DebugInstructionDataSource(this.nes.debugger.lastInstructions, this.paginator); 
    }

    
}
