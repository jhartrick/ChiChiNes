import { Component } from '@angular/core';
import { ChiChiComponent } from './chichines.component'
import { Emulator } from './services/NESService'

@Component({
  selector: 'controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrls: ['./controlpanel.component.css']
})


export class ControlPanelComponent {
    show: boolean = true;
    powerstate: string;
    currentFilename: string;
    constructor(private nesService: Emulator) {
        this.powerstate = 'OFF';
    }
    handleFile(e: Event) {
        var fileReader: FileReader = new FileReader();
        let target: HTMLInputElement = <HTMLInputElement>e.target;
        let files: FileList = target.files;
        fileReader.onload = (e) => {
            this.poweroff();
            var rom: number[] = Array.from(new Uint8Array(fileReader.result));
            this.nesService.LoadRom(rom);
            this.poweron();
        };
        fileReader.readAsArrayBuffer(files[0]);
        this.currentFilename = files[0].name;
    }
    poweron() {
        this.nesService.StartEmulator();   
        this.powerstate = 'ON';
    }
    poweroff() {
        this.nesService.StopEmulator();
        this.powerstate = 'OFF';
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
