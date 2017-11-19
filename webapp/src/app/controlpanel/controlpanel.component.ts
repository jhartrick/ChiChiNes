import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Emulator, EmuState } from '../services/NESService';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import * as JSZip from 'jszip';
import * as crc from 'crc';

import { AudioSettings } from 'chichi';

import { WishboneMachine } from '../services/wishbone/wishbone';
import { LocalAudioSettings } from '../services/wishbone/wishbone.audio.localsettings';
import { RomLoader } from '../services/cartloader';

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
    state: EmuState;
    framesPerSecond: number;

    wishbone: WishboneMachine;

    constructor(public nesService: Emulator,
        cd: ChangeDetectorRef,
        private romLoader: RomLoader,
        private ngZone: NgZone,
        private dialog: MatDialog) {

        this.powerstate = 'OFF';
        this.localSettings = this.nesService.audioSettings;
        
        this.nesService.cartChanged.subscribe((settings)=>{
            this.cartSettings = settings;
        });
    }


    
    handleFile(e: Event) {
        const files: FileList = (<HTMLInputElement>e.target).files;
        this.romLoader.loadRom(files).subscribe((rom) => {
            this.poweroff();
        }, (error) => {
            console.log('handleFile error %s', error);
        });
    }

    poweron() {
        this.nesService.wishbone.Run();
        this.powerstate = 'ON';
    }

    poweroff() {
        this.nesService.wishbone.PowerOff();
        this.powerstate = 'OFF';
    }

    showDebugger(): void {
        this.nesService.onDebug.emit({eventType: 'showDebugger'});
    }

    reset(): void {
        this.nesService.wishbone.Reset();
    }

    powertoggle() {
        if (this.powerstate === 'OFF') {
            this.poweron();
        } else {
            this.poweroff();
        }
    }
}
