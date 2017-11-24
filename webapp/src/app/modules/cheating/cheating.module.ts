import { MatDialogModule, MatButtonModule, MatButtonToggleModule, MatIconModule } from '@angular/material';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameGenieComponent } from './gamegenie.component';
import { GameGenieDialogComponent } from './gamegenie.dialog.component';

@NgModule({
  declarations: [
    GameGenieComponent,
    GameGenieDialogComponent
  ],
  entryComponents: [
    GameGenieDialogComponent
],
  imports: [
      BrowserModule,
      MatDialogModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatIconModule
  ],
  exports: [
    GameGenieComponent
  ]
})
export class CheatingModule { }
