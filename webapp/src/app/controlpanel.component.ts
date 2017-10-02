import { Component } from '@angular/core';
import { ChiChiComponent } from './chichines.component'
import { Emulator } from './services/NESService'

@Component({
  selector: 'controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrls: ['./controlpanel.component.css']
})
export class ControlPanelComponent {

    powerstate: string;
    constructor(private nesService: Emulator) {
        this.powerstate = 'stopped';
    }
    poweron() {
        this.nesService.StartEmulator();   
        this.powerstate = 'started';
    }
    poweroff() {
        this.nesService.StopEmulator();
        this.powerstate = 'stopped';
    }
}
