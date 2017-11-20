import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import {  MatSidenavModule, MatDrawer } from '@angular/material';

import { NESService } from './services/NESService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {
  @ViewChild('debugNav') public debugNav: MatDrawer;
  constructor(private nesService: NESService) {
    this.nesService.onDebug.filter((data) => data.eventType == 'showDebugger').subscribe((data) => {
      this.debugNav.open();
    });
  }

  title = 'ChiChiNES';
}
