import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ChiChiNsfMachine } from "chichi";

@Component({
    selector: 'chichines-instructionhistory',
    templateUrl: './chichines.instructionhistory.component.html',
    styleUrls: ['./chichines.instructionhistory.component.css']
})
export class InstructionHistoryComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public instructions: string[];

    constructor(public nes: ChiChiNsfMachine) { }

    ngOnInit(): void {
    }

}
