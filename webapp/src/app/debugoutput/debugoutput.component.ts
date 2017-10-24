import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { Emulator } from '../services/NESService';
import { DecodedInstruction, InstructionHistoryDatabase, DebugInstructionDataSource } from '../services/debug.interface';
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
  styleUrls: ['./debugoutput.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DebugOutputComponent implements OnInit  {
    selectedTabIndex = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public instructions: string[];
    public dbgDataSource:  DebugInstructionDataSource ;

    constructor(public nes: Emulator, private cd: ChangeDetectorRef) {
        // this.cd.detach();
    }


    ngOnInit(): void {
    }
}
