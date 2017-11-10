import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import {  MatSidenavModule, MatDrawer } from '@angular/material';

import { Emulator } from './services/NESService'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Emulator]

})
export class AppComponent {
  @ViewChild('debugNav') public debugNav: MatDrawer;
  constructor(private nesService: Emulator){
    this.nesService.DebugUpdateEvent.subscribe(() => {
      this.debugNav.open();
    });
  }

  title = 'ChiChiNES';
}
