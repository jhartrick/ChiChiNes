import { Component, ViewChild, ChangeDetectionStrategy, ComponentFactoryResolver } from '@angular/core';
import {  MatSidenavModule, MatDrawer, MatIconRegistry } from '@angular/material';

import { NESService } from '../services/NESService';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-playlayout',
  templateUrl: './playlayout.component.html',
  styleUrls: ['./playlayout.component.css'],
})
export class PlayLayoutComponent {
  constructor(private nesService: NESService) {
  }
  title = 'ChiChiNES';

  showVolume = false;


}
