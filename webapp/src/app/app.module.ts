import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatPaginatorModule, MatGridListModule, MatTabsModule } from '@angular/material';
import { MatButtonModule, MatCheckboxModule, MatSidenavModule, MatSliderModule } from '@angular/material';
import { MatButtonToggleModule, MatExpansionModule, MatDialogModule } from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material';
import * as JSZip from 'jszip';

import { Emulator  } from './services/NESService';

import { AppComponent } from './app.component';
import { ChiChiComponent } from './chichines/chichines.component';
import { ControlPanelComponent, PowerStatusComponent } from './controlpanel/controlpanel.component';
import { ControlConfigComponent } from './chichines.controlconfig/chichines.controlconfig.component';
import { ControlDialogComponent } from './chichines.controlconfig/chichines.controldialog.component';
import { AudioSettingsComponent } from './controlpanel/chichines.audiosettings/chichi.audiosettings';
import { GameGenieComponent } from './controlpanel/chichi.gamegenie/chichi.gamegenie';
import { GameGenieDialogComponent } from './controlpanel/chichi.gamegenie/chichi.gamegenie.dialog';
import { WishboneCheats } from './services/wishbone/wishbone.cheats';
import { WishboneMachine } from './services/wishbone/wishbone';
import { CartInfoModule } from './modules/chichi.cartinfo/cartinfo.module';
import { DebugOutputModule } from './modules/debugoutput/debugoutput.module';
import { ProgressComponent } from './controlpanel/progress.component';
import { RomLoader } from './services/cartloader';

@NgModule({
  declarations: [
      AppComponent,
      ChiChiComponent,
      ControlPanelComponent,
      PowerStatusComponent,
      ControlConfigComponent,
      ControlDialogComponent,
      AudioSettingsComponent,
      GameGenieComponent,
      GameGenieDialogComponent,
      ProgressComponent
  ],
  entryComponents: [
    ControlConfigComponent,
    ControlDialogComponent,
    GameGenieDialogComponent,
    ProgressComponent
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
      MatProgressSpinnerModule,
      CartInfoModule,
      DebugOutputModule
  ],
  providers: [HttpModule, Emulator, RomLoader],
  bootstrap: [AppComponent]
})

export class AppModule { }
