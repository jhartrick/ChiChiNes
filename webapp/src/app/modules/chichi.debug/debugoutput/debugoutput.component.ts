import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Emulator } from '../../../services/NESService';
import { Debugger } from '../debug.interface';



@Component({
  selector: 'app-debugoutput',
  templateUrl: './debugoutput.component.html',
  styleUrls: ['./debugoutput.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebugOutputComponent {
    selectedTabIndex = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public debugger: Debugger;

    decodedStatusRegister = '';

    constructor(public nes: Emulator, private cd: ChangeDetectorRef) {
        this.debugger = new Debugger(this.nes.wishbone);
        // this.cd.detach();
    }

}
