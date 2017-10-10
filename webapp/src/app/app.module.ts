﻿import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatTableModule, MatPaginatorModule, MatGridListModule, MatTabsModule } from '@angular/material';
import { MatButtonModule, MatCheckboxModule, MatSidenavModule, MatButtonToggleModule, MatExpansionModule } from '@angular/material';
import * as JSZip from 'jszip';
import { Emulator} from './services/NESService'

import { AppComponent } from './app.component';
import { ChiChiComponent } from './chichines/chichines.component';
import { ControlPanelComponent } from './controlpanel/controlpanel.component';
import { DebugOutputComponent } from './debugoutput/debugoutput.component';
import { MemViewerComponent, MyTrComponent, AsciiPipe } from './chichines.memviewer/chichines.memviewer.component';
import { InstructionHistoryComponent } from './chichines.instructionhistory/chichines.instructionhistory.component';

@NgModule({
  declarations: [
      AppComponent,
      ChiChiComponent,
      ControlPanelComponent,
      DebugOutputComponent,
      MemViewerComponent,
      MyTrComponent,
      InstructionHistoryComponent,
      AsciiPipe
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
	  MatTabsModule
  ],
  providers: [HttpModule, Emulator],
  bootstrap: [AppComponent]
})

export class AppModule { }
