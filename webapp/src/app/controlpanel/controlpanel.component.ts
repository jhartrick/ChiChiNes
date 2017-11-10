import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Emulator, EmuState, RomLoader } from '../services/NESService';
import { Observable } from 'rxjs/Observable';
import * as JSZip from 'jszip';
import { AudioSettings } from 'chichi';
import { WishboneMachine } from '../services/wishbone/wishbone';
import * as crc from 'crc';
import { LocalAudioSettings } from '../services/wishbone/wishbone.audio';

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

    constructor(public nesService: Emulator, cd: ChangeDetectorRef, private romLoader: RomLoader, private ngZone: NgZone) {
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
        const files: FileList = (<HTMLInputElement>e.target).files;
        this.romLoader.loadRom(files).subscribe((rom) => {
            this.poweroff();
            if (rom.nsf) {
                this.nesService.LoadNsf(rom.data, rom.name);
            } else {
                this.wishbone.loadCart(rom.data, rom.name);
                // this.nesService.LoadRom(rom.data, rom.name);
            }
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
