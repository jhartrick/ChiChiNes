import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatTableModule, MatPaginatorModule, MatGridListModule, MatTabsModule } from '@angular/material';
import { MatButtonModule, MatCheckboxModule, MatSidenavModule } from '@angular/material';
import { MatButtonToggleModule, MatExpansionModule, MatDialogModule } from '@angular/material';
import * as JSZip from 'jszip';
import { Emulator , RomLoader } from './services/NESService';

import { AppComponent } from './app.component';
import { ChiChiComponent } from './chichines/chichines.component';
import { ControlPanelComponent, PowerStatusComponent } from './controlpanel/controlpanel.component';
import { DebugOutputComponent, CpuStatusComponent, PpuStatusComponent } from './debugoutput/debugoutput.component';
import { MemViewerComponent, MyTrComponent, AsciiPipe } from './chichines.memviewer/chichines.memviewer.component';
import { InstructionHistoryComponent } from './chichines.instructionhistory/chichines.instructionhistory.component';
import { NameTableViewerComponent } from './debugoutput/nametableviewer/nametableviewer.component';
import { SpriteViewerComponent } from './debugoutput/spriteviewer/spriteviewer.component';
import { ControlConfigComponent } from './chichines.controlconfig/chichines.controlconfig.component';
import { ControlDialogComponent } from './chichines.controlconfig/chichines.controldialog.component';
import { AudioSettingsComponent } from './controlpanel/chichines.audiosettings/chichi.audiosettings';

@NgModule({
  declarations: [
      AppComponent,
      ChiChiComponent,
      ControlPanelComponent,
      DebugOutputComponent,
      MemViewerComponent,
      MyTrComponent,
      InstructionHistoryComponent,
      AsciiPipe,
      PowerStatusComponent,
      CpuStatusComponent,
      PpuStatusComponent,
      NameTableViewerComponent,
      SpriteViewerComponent,
      ControlConfigComponent,
      ControlDialogComponent,
      AudioSettingsComponent

  ],
  entryComponents: [
    ControlConfigComponent,
    ControlDialogComponent
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
      MatDialogModule
  ],
  providers: [HttpModule, Emulator, RomLoader],
  bootstrap: [AppComponent]
})

export class AppModule { }
