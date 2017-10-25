import { Component, OnInit, ViewChild } from '@angular/core';
import { Emulator } from '../services/NESService'
import { DecodedInstruction, InstructionHistoryDatabase, DebugInstructionDataSource } from '../services/debug.interface'
import { MatPaginator } from '@angular/material';

@Component({
    selector: 'chichines-instructionhistory',
    templateUrl: './chichines.instructionhistory.component.html',
    styleUrls: ['./chichines.instructionhistory.component.css']
})
export class InstructionHistoryComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public instructions: string[];
    get dataLength(): number {
        return this.nes.debugger.lastInstructions.length | 0;
    }
    public dbgDataSource: DebugInstructionDataSource;

    constructor(public nes: Emulator) { }


    ngOnInit(): void {
        //   debugger;
        this.dbgDataSource = new DebugInstructionDataSource(this.nes.debugger.lastInstructions, this.paginator);
    }

}
