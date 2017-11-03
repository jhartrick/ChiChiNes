import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Emulator, EmuState, RomLoader } from '../services/NESService';
import { Observable } from 'rxjs/Observable';
import * as JSZip from 'jszip';
import { AudioSettings } from 'chichi';
import { WishboneMachine } from '../services/wishbone/wishbone';
import * as crc from 'crc';

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
    show = true;
    powerstate: string;
    currentFilename: string;
    state: EmuState;
    framesPerSecond: number;
    audioSettings: AudioSettings = new AudioSettings();

    wishbone: WishboneMachine;

    get enableSquare0(): boolean {
        return this.audioSettings.enableSquare0;
    }

    set enableSquare0(value: boolean) {
        this.audioSettings.enableSquare0 = value;
        this.wishbone.SoundBopper.audioSettings = this.audioSettings;
        // this.wishbone.RequestSync();
    }

    get enableSquare1(): boolean {
        return this.audioSettings.enableSquare1;
    }

    set enableSquare1(value: boolean) {
        this.audioSettings.enableSquare1 = value;
        this.wishbone.SoundBopper.audioSettings = this.audioSettings;
       // this.wishbone.RequestSync();
    }

    get enableTriangle(): boolean {
        return this.audioSettings.enableTriangle;
    }

    set enableTriangle(value: boolean) {
        this.audioSettings.enableTriangle = value;
        this.wishbone.SoundBopper.audioSettings = this.audioSettings;
        // this.wishbone.RequestSync();
    }

    get enableNoise(): boolean {
        return this.audioSettings.enableNoise;
    }

    set enableNoise(value: boolean) {
        this.audioSettings.enableNoise = value;
        this.wishbone.SoundBopper.audioSettings = this.audioSettings;
       // this.wishbone.RequestSync();
    }

    constructor(public nesService: Emulator, cd: ChangeDetectorRef, private romLoader: RomLoader, private ngZone: NgZone) {
        this.powerstate = 'OFF';
        this.wishbone = nesService.wishbone;
        this.wishbone.asObservable().subscribe((machine) => {
            if (machine && machine.SoundBopper) {
                this.audioSettings = machine.SoundBopper.audioSettings;
            }
            cd.markForCheck();
        });
    }

    handleFile(e: Event) {
        const files: FileList = (<HTMLInputElement>e.target).files;
        this.romLoader.loadRom(files).subscribe((rom) => {
            this.poweroff();
            if (rom.nsf) {
                this.nesService.LoadNsf(rom.data, rom.name);
            } else {
                this.nesService.LoadRom(rom.data, rom.name);
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
