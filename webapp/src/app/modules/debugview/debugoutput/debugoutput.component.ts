import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { NESService } from '../../../services/NESService';
import { Debugger } from '../debug.interface';
import { WishboneWorker } from '../../../services/wishbone/wishbone.worker';
import { WishboneMachine } from '../../../services/wishbone/wishbone';

@Component({
  selector: 'app-debugoutput',
  templateUrl: './debugoutput.component.html',
  styleUrls: ['./debugoutput.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebugOutputComponent {
    selectedTabIndex = 0;

    decodedStatusRegister = '';

    constructor(private cd: ChangeDetectorRef, private dbg: Debugger, public wishbone: WishboneMachine, public worker: WishboneWorker) {
    }
}
