import { CartInfoComponent } from './cartinfo-main.component';
import { CartInfoDialogComponent } from './cartinfo-dialog.component';
import { MatDialogModule, MatButtonModule, MatIconModule } from '@angular/material';
import { MatTabsModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CartInfoButtonComponent } from './cartinfo-button.component';

@NgModule({
  declarations: [
      CartInfoDialogComponent,
      CartInfoComponent,
      CartInfoDialogComponent,
      CartInfoButtonComponent
  ],
  entryComponents: [
    CartInfoDialogComponent,
    CartInfoComponent,
    CartInfoButtonComponent
],
  imports: [
      BrowserModule,
      MatDialogModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatTabsModule,
      MatExpansionModule,
      MatIconModule

  ],
  exports: [
    CartInfoComponent
  ]
})
export class CartInfoModule { }
