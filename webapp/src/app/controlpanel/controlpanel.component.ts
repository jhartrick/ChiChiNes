import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Emulator, EmuState } from 'app/services/NESService'
import * as JSZip from 'jszip';
@Component({
  selector: 'controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrls: ['./controlpanel.component.css']
})


export class ControlPanelComponent {
    show: boolean = true;
    powerstate: string;
    currentFilename: string;
    state: EmuState;

    constructor(public nesService: Emulator) {
        this.powerstate = 'OFF';
        this.nesService.emuState.subscribe((data) => {
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
                        this.currentFilename = zipEntry.name;
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
          this.currentFilename = files[0].name;
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
