import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Emulator, EmuState, RomLoader } from 'app/services/NESService'
import { Observable } from 'rxjs';
import * as JSZip from 'jszip';

@Component({
    selector: 'chichi-status',
    template: `<p>Loaded: {{ (emuState | async)?.romLoaded }}</p>`
})
export class PowerStatusComponent {

    @Input('emuState') emuState: Observable<any>;

    constructor() {
        
        //this.emuState.subscribe(data => this.state = data);
    }
}



@Component({
  selector: 'controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrls: ['./controlpanel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush 
})

export class ControlPanelComponent {
    show = true;
    powerstate: string;
    currentFilename: string;
    state: EmuState;
    framesPerSecond: number;

    constructor(public nesService: Emulator, private cd: ChangeDetectorRef, private romLoader: RomLoader) {
        this.powerstate = 'OFF';
        this.nesService.emuState.subscribe(d => {
            this.state = new EmuState(d.romLoaded, d.powerState, d.paused, d.debugging);
            this.cd.markForCheck();
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
        this.nesService.StartEmulator();
        this.powerstate = 'ON';
    }

    poweroff() {
        this.nesService.StopEmulator();
        this.powerstate = 'OFF';
    }

    showDebugger() : void {
        this.nesService.DebugUpdateEvent.emit({eventType: "showDebugger"});
    }

    reset(): void {
        this.nesService.ResetEmulator();
    }
    powertoggle() {
        if (this.powerstate == 'OFF') {
            this.poweron();
        } else {
            this.poweroff();
        }
    }
}
