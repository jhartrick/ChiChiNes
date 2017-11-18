import { MatDialogModule, MatButtonModule, MatButtonToggleModule } from '@angular/material';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlDialogComponent } from './controlpad.dialog.component';
import { ControlConfigComponent } from './controlpad.component';

@NgModule({
  declarations: [
    ControlDialogComponent,
    ControlConfigComponent
  ],
  entryComponents: [
    ControlDialogComponent
],
  imports: [
      BrowserModule,
      MatDialogModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatButtonToggleModule,

  ],
  exports: [
    ControlConfigComponent
  ]
})
export class ControlPadModule { }
