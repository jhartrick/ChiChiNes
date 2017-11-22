﻿import { BrowserModule } from '@angular/platform-browser';
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

import { ControlPanelComponent, PowerStatusComponent } from './controlpanel/controlpanel.component';
import { AudioSettingsComponent } from './controlpanel/chichines.audiosettings/chichi.audiosettings';

import { NESService  } from './services/NESService';

import { WishboneCheats } from './services/wishbone/wishbone.cheats';
import { WishboneMachine } from './services/wishbone/wishbone';

import { RomLoader } from './services/cartloader';

import { CartInfoModule } from './modules/cartinfo/cartinfo.module';
import { DebugOutputModule } from './modules/debugview/debug.module';
import { CheatingModule } from './modules/cheating/cheating.module';
import { ControlPadModule } from './modules/controlpad/controlpad.module';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  declarations: [
      AppComponent,
      ChiChiComponent,
      ControlPanelComponent,
      PowerStatusComponent,
      AudioSettingsComponent,
  ],
  entryComponents: [
],
  imports: [
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
      DebugOutputModule
  ],
  providers: [HttpModule, WishboneMachine, NESService, RomLoader],
  bootstrap: [AppComponent]
})

export class AppModule {

}
