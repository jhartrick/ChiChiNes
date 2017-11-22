import { Component, ViewChild, ChangeDetectionStrategy, ComponentFactoryResolver } from '@angular/core';
import {  MatSidenavModule, MatDrawer, MatIconRegistry } from '@angular/material';

import { NESService } from './services/NESService';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MatIconRegistry]

})
export class AppComponent {
  @ViewChild('debugNav') public debugNav: MatDrawer;
  constructor(private nesService: NESService, public matIconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.nesService.onDebug.filter((data) => data.eventType === 'showDebugger').subscribe((data) => {
      this.debugNav.open();
    });

    matIconRegistry
      .addSvgIcon('gamepad', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/gamepad.svg'))
      .addSvgIcon('chip', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/chip.svg'))
      .addSvgIcon('amp',  sanitizer.bypassSecurityTrustResourceUrl('assets/icons/amplifier.svg'));
  }
  title = 'ChiChiNES';

  showVolume = false;

}
