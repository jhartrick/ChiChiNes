import { Component, ViewChild, ChangeDetectionStrategy, ComponentFactoryResolver } from '@angular/core';
import {  MatSidenavModule, MatDrawer, MatIconRegistry } from '@angular/material';

import { NESService } from './services/NESService';
import { DomSanitizer } from '@angular/platform-browser';
import { PopoverComponent } from './popover/popover.component';
import { PopoverContent } from './popover/popover.content';
import { VolumeComponent } from './controlpanel/volume.component';

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
      .addSvgIcon('upload', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/upload.svg'))
      .addSvgIcon('power', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/power.svg'))
      .addSvgIcon('settings', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/settings.svg'))
      .addSvgIcon('reset', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/reset.svg'))
      .addSvgIcon('volume-high', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/volume-high.svg'))
      .addSvgIcon('volume-off', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/volume-off.svg'))
      .addSvgIcon('baby-buggy', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baby-buggy.svg'))
      .addSvgIcon('amp',  sanitizer.bypassSecurityTrustResourceUrl('assets/icons/amplifier.svg'));
  }
  title = 'ChiChiNES';

  showVolume = false;

  get volumePopover(): PopoverContent {
    return new PopoverContent(VolumeComponent,
      {
    });
  }

}
