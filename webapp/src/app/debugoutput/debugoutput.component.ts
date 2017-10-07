import { Component, OnInit } from '@angular/core';
import { Emulator } from '../services/NESService'

@Component({
  selector: 'app-debugoutput',
  templateUrl: './debugoutput.component.html',
  styleUrls: ['./debugoutput.component.css']
})
export class DebugOutputComponent implements OnInit  {

    public instructions: string[];
    constructor(public nes: Emulator) {
        
    }

    get debugging(): boolean {
        return this.nes.isDebugging;
    }

    set debugging(value: boolean) {
        this.nes.isDebugging = value;
    }


    ngOnInit() : void {
        this.nes.DebugUpdateEvent.subscribe((info) => {
          if (this.nes.debugger.lastInstructions) this.instructions = this.nes.debugger.lastInstructions; 
        });
    }

    
}
