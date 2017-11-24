import { Component, ViewChild, ChangeDetectionStrategy, ComponentFactoryResolver } from '@angular/core';
import {  MatSidenavModule, MatDrawer, MatIconRegistry } from '@angular/material';

import { NESService } from '../services/NESService';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-debuglayout',
  templateUrl: './debuglayout.component.html',
  styleUrls: ['./debuglayout.component.css'],
  

})
export class DebugLayoutComponent {
  @ViewChild('debugNav') public debugNav: MatDrawer;
  constructor(private nesService: NESService) {
    this.nesService.onDebug.filter((data) => data.eventType === 'showDebugger').subscribe((data) => {
      this.debugNav.open();
    });

  }
  title = 'ChiChiNES';

  showVolume = false;


}
