import { Component, OnInit, ViewChild } from '@angular/core';
import { Emulator } from '../services/NESService'
import { DecodedInstruction, InstructionHistoryDatabase, DebugInstructionDataSource } from '../services/debug.interface'
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'chichines-instructionhistory',
  templateUrl: './chichines.instructionhistory.component.html',
  styleUrls: ['./chichines.instructionhistory.component.css']
})
export class InstructionHistoryComponent  {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public instructions: string[];
    get dataLength(): number {
        return this.nes.debugger.lastInstructions.length | 0;
    }
    public dbgDataSource: DebugInstructionDataSource;

    constructor(public nes: Emulator) { }
    myUrl: any;
    private textFile: any;
    makeFile(): void {
        let text: string[] = new Array<string>();

        for(let i =0; i< this.dbgDataSource.length; ++i){
            text.push(this.dbgDataSource.dataBase[i].toString());
        }
        const data = new Blob([text], {type: 'text/plain'});
    
        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (this.textFile !== null) {
            window.URL.revokeObjectURL(this.textFile);
        }
        this.textFile = window.URL.createObjectURL(data);
        this.myUrl = this.textFile;
        

    }

    ngOnInit(): void {
     //   debugger;
      this.dbgDataSource = new DebugInstructionDataSource(this.nes.debugger.lastInstructions, this.paginator);
  }

}
