﻿import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Emulator, EmuState } from '../services/NESService';
import { Observable } from 'rxjs/Observable';
import * as JSZip from 'jszip';
import { AudioSettings } from 'chichi';
import { WishboneMachine } from '../services/wishbone/wishbone';
import * as crc from 'crc';
import { LocalAudioSettings } from '../services/wishbone/wishbone.audio';
import { ProgressComponent } from './progress.component';
import { MatDialog } from '@angular/material';
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
        this.wishbone = nesService.wishbone;
        this.localSettings = this.wishbone.SoundBopper.localSettings;
        this.wishbone.asObservable().subscribe((machine) => {
            if (machine && machine.SoundBopper) {
                this.localSettings = this.wishbone.SoundBopper.localSettings;
            }
        });
    }

    handleFile(e: Event) {
        const dialogRef = this.dialog.open(ProgressComponent, {
            height: '50%',
            width: '50%',
            disableClose: true,
            data: { wishbone: this.wishbone }
        });
        dialogRef.afterOpen().subscribe(() => {
            const files: FileList = (<HTMLInputElement>e.target).files;
            this.romLoader.wishbone = this.wishbone;
            this.romLoader.loadRom(files).subscribe((rom) => {
                this.poweroff();
                dialogRef.close();
            }, (error) => {
                console.log('handleFile error %s', error);
                dialogRef.close();
            });
        });
    }

    poweron() {
        this.wishbone.Run();
        this.powerstate = 'ON';
    }

    poweroff() {
        this.wishbone.PowerOff();
        this.powerstate = 'OFF';
    }

    showDebugger(): void {
        this.nesService.DebugUpdateEvent.emit({eventType: 'showDebugger'});
    }

    reset(): void {
        this.wishbone.Reset();
    }

    powertoggle() {
        if (this.powerstate === 'OFF') {
            this.poweron();
        } else {
            this.poweroff();
        }
    }
}
