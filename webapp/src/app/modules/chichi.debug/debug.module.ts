import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatPaginatorModule, MatGridListModule, MatTabsModule } from '@angular/material';
import { MatButtonModule, MatCheckboxModule, MatSidenavModule, MatSliderModule } from '@angular/material';
import { MatButtonToggleModule, MatExpansionModule, MatDialogModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material';
import * as JSZip from 'jszip';

import { Emulator } from '../../services/NESService';

import { DebugOutputComponent } from './debugoutput/debugoutput.component';
import { PpuStatusComponent } from './debugoutput/debugoutput-ppustatus.component';
import { CpuStatusComponent } from './debugoutput/debugoutput-cpustatus.component';

import { MemViewerComponent, MyTrComponent, AsciiPipe } from './debug-memviewer/debug-memviewer.component';
import { InstructionHistoryComponent } from './instructionhistory/debug-instructionhistory.component';
import { NameTableViewerComponent } from './nametableviewer/debug-nametableviewer.component';
import { SpriteViewerComponent } from './spriteviewer/debug-spriteviewer.component';
import { PatternViewerComponent } from './patternviewer/debug-patternviewer.component';

@NgModule({
  declarations: [
      DebugOutputComponent,
      MemViewerComponent,
      MyTrComponent,
      InstructionHistoryComponent,
      AsciiPipe,
      CpuStatusComponent,
      PpuStatusComponent,
      NameTableViewerComponent,
      SpriteViewerComponent,
      PatternViewerComponent
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
],

  exports: [
    DebugOutputComponent
  ]
})

export class DebugOutputModule { }
