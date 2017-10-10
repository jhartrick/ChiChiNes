import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Emulator } from '../services/NESService'
import { DecodedInstruction, InstructionHistoryDatabase, DebugInstructionDataSource } from '../services/debug.interface'
import {MatPaginator} from '@angular/material';

@Component({
  selector: 'app-debugoutput',
  templateUrl: './debugoutput.component.html',
  styleUrls: ['./debugoutput.component.css']
})
export class DebugOutputComponent implements OnInit  {
    
    @ViewChild('tileDoodle') tileDoodle: ElementRef;
    @ViewChild('tileDoodle2') tileDoodle2: ElementRef;
    @ViewChild('tileDoodle3') tileDoodle3: ElementRef;
    @ViewChild('tileDoodle4') tileDoodle4: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public instructions: string[];

    public dbgDataSource:  DebugInstructionDataSource ;
    
    constructor(public nes: Emulator) {
    }

    private doDoodle(ctx: CanvasRenderingContext2D, nametable: number) : void {
        var imgData = ctx.getImageData(0, 0, 256, 256);

        this.nes.tileDoodler.DoodleNameTable(nametable, imgData.data);
        ctx.putImageData(imgData, 0, 0);
    }

    public doodle(): void {
        //debugger;
        this.doDoodle(this.tileDoodle.nativeElement.getContext('2d'),0);
        this.doDoodle(this.tileDoodle2.nativeElement.getContext('2d'), 0x400);
        this.doDoodle(this.tileDoodle3.nativeElement.getContext('2d'), 0x800);
        this.doDoodle(this.tileDoodle4.nativeElement.getContext('2d'), 0xC00);
    }

    ngOnInit(): void {


        this.dbgDataSource = new DebugInstructionDataSource(this.nes.debugger.lastInstructions, this.paginator); 
        //this.nes.DebugUpdateEvent.subscribe((info) => {
          //this.dbgDataSource = new DebugInstructionDataSource(this.nes.debugger.lastInstructions);
        //});
    }

    
}
