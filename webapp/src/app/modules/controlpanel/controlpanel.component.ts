import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { NESService } from '../../services/NESService';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import * as JSZip from 'jszip';
import * as crc from 'crc';

import { AudioSettings } from 'chichi';

import { WishboneMachine } from '../../services/wishbone/wishbone';
import { LocalAudioSettings } from '../../services/wishbone/wishbone.audio.localsettings';
import { RomLoader } from '../../services/cartloader';
import { WishboneWorker } from '../../services/wishbone/wishbone.worker';

@Component({
    selector: 'chichi-status',
    template: `<p>Loaded: {{ (emuState | async)?.romLoaded }}</p>`
})

export class PowerStatusComponent {
    @Input('emuState') emuState: Observable<any>;
    constructor() {
    }
}

@Component({
  selector: 'controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrls: ['./controlpanel.component.css']
})
export class ControlPanelComponent {
    localSettings: LocalAudioSettings;
    cartSettings: any;

    show = true;
    powerstate: string;
    currentFilename: string;
    framesPerSecond: number;



    constructor(public nesService: NESService,
        cd: ChangeDetectorRef,
        private ngZone: NgZone,
        private dialog: MatDialog) {

        this.localSettings = this.nesService.audioSettings;

        this.nesService.cartChanged.subscribe((settings) => {
            this.cartSettings = settings;
        });

    }


    showDebugger(): void {
        this.nesService.onDebug.emit({eventType: 'showDebugger'});
    }

}
