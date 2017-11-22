import { CartInfoComponent } from './cartinfo-main.component';
import { CartInfoDialogComponent } from './cartinfo-dialog.component';
import { MatDialogModule, MatButtonModule, MatIconModule } from '@angular/material';
import { MatTabsModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
      CartInfoDialogComponent,
      CartInfoComponent,
      CartInfoDialogComponent
  ],
  entryComponents: [
    CartInfoDialogComponent
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
