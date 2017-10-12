import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Emulator, EmuState } from 'app/services/NESService'
import { Observable } from 'rxjs';
import * as JSZip from 'jszip';

@Component({
    selector: 'chichi-status',
    template: `<p>Loaded: {{ (emuState | async)?.romLoaded }}</p>`,
    changeDetection: ChangeDetectionStrategy.OnPush
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
    show: boolean = true;
    powerstate: string;
    currentFilename: string;
    state: EmuState;
    framesPerSecond: number;
    constructor(public nesService: Emulator, private cd: ChangeDetectorRef) {
        this.powerstate = 'OFF';
        this.nesService.emuState.subscribe(d => {
            this.state = new EmuState(d.romLoaded, d.powerState, d.paused, d.debugging);
            this.cd.markForCheck();
        });
    }

    handleFile(e: Event) {
        var fileReader: FileReader = new FileReader();
        var zipReader: FileReader = new FileReader();
        let target: HTMLInputElement = <HTMLInputElement>e.target;
        let files: FileList = target.files;
        if (files[0].name.endsWith('.zip')) {
          fileReader.onload = (e) => {
              this.poweroff();
              let rom: number[] = Array.from(new Uint8Array(fileReader.result));
                //zip file
                JSZip.loadAsync(rom).then((zip: any) =>{
                    zip.forEach((relativePath, zipEntry) => {  // 2) print entries
                        zipEntry.async('blob').then((fileData) => {
                            zipReader.onload= (ze) =>{
                                let zrom: number[] = Array.from(new Uint8Array(zipReader.result));
                                this.nesService.LoadRom(zrom, zipEntry.name);
                            }
                            zipReader.readAsArrayBuffer(fileData);
                        });
                    });
                });
          };
        } else if (files[0].name.endsWith('.nes')) {
          fileReader.onload = (e) => {
              this.poweroff();
              let rom: number[] = Array.from(new Uint8Array(fileReader.result));
              this.nesService.LoadRom(rom, files[0].name);
              
          };
        }
        fileReader.readAsArrayBuffer(files[0]);
    }

    poweron() {
        this.nesService.StartEmulator();   
        this.powerstate = 'ON';
    }

    poweroff() {
        this.nesService.StopEmulator();
        this.powerstate = 'OFF';
    }

    fps() {
        //this.framesPerSecond = this.nesService.framesPerSecond;
        //this.cd.markForCheck();
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
