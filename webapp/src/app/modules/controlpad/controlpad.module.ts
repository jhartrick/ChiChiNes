import { MatDialogModule, MatButtonModule, MatButtonToggleModule, MatIconModule } from '@angular/material';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlDialogComponent } from './controlpad.dialog.component';
import { ControlConfigComponent } from './controlpad.component';
import { WishboneKeyboardSettings } from './keyboardsettings' 
@NgModule({
  declarations: [
    ControlDialogComponent,
    ControlConfigComponent
  ],
  entryComponents: [
    ControlDialogComponent,
    ControlConfigComponent
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
    ControlConfigComponent
  ],
  providers: [ WishboneKeyboardSettings ]
})
export class ControlPadModule { }
