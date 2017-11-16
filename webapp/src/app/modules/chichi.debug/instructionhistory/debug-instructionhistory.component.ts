import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { DebugInstructionDataSource, Debugger } from '../debug.interface';
import { Emulator } from '../../../services/NESService';

@Component({
    selector: 'debug-instructionhistory',
    templateUrl: './debug-instructionhistory.component.html',
    styleUrls: ['./debug-instructionhistory.component.css']
})

export class InstructionHistoryComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input('debugger') debugger: Debugger;

    get dataLength(): number {
        return this.debugger.lastInstructions.length | 0;
    }

    public dbgDataSource: DebugInstructionDataSource;

    ngOnInit(): void {
        // debugger
        this.dbgDataSource = new DebugInstructionDataSource(this.debugger.lastInstructions, this.paginator);
    }

}
