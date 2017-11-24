import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatPaginatorModule, MatGridListModule, MatTabsModule } from '@angular/material';
import { MatButtonModule, MatCheckboxModule, MatSidenavModule, MatSliderModule } from '@angular/material';
import { MatButtonToggleModule, MatExpansionModule, MatDialogModule } from '@angular/material';
import { MatIconRegistry, MatIconModule } from '@angular/material';

import * as JSZip from 'jszip';

import { AppComponent } from './app.component';
import { ChiChiComponent } from './chichines/chichines.component';

import { NESService  } from './services/NESService';

import { WishboneCheats } from './services/wishbone/wishbone.cheats';
import { WishboneMachine } from './services/wishbone/wishbone';

import { RomLoader } from './services/cartloader';

import { CartInfoModule } from './modules/cartinfo/cartinfo.module';
import { DebugOutputModule } from './modules/debugview/debug.module';
import { CheatingModule } from './modules/cheating/cheating.module';
import { ControlPadModule } from './modules/controlpad/controlpad.module';
import { ToolStripModule } from './modules/toolstrip/toolstrip.module';
import { ControlPanelModule } from './modules/controlpanel/controlpanel.module';
import { RoutingModule } from './modules/routing.module';
import { DebugLayoutComponent } from './layouts/debuglayout.component';
import { PlayLayoutComponent } from './layouts/playlayout.component';
import { DomSanitizer } from '@angular/platform-browser';


@NgModule({
  declarations: [
      AppComponent,
      ChiChiComponent,
      DebugLayoutComponent,
      PlayLayoutComponent

  ],
  entryComponents: [
],
  imports: [
    RoutingModule,
      BrowserModule,
      HttpModule,
      MatSidenavModule,
      BrowserAnimationsModule,
      MatButtonToggleModule,
      MatButtonModule,
      MatExpansionModule,
      MatTableModule,
      MatPaginatorModule,
      MatGridListModule,
      MatTabsModule,
      MatDialogModule,
      MatSliderModule,
      CartInfoModule,
      CheatingModule,
      ControlPadModule,
      MatIconModule,
      DebugOutputModule,
      ToolStripModule,
      ControlPanelModule
  ],
  providers: [HttpModule, WishboneMachine, NESService, RomLoader, MatIconRegistry],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(public matIconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {

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
}
