import { CartInfoComponent } from './cartinfo-main.component';
import { CartInfoDialogComponent } from './cartinfo-dialog.component';
import { CartInfoBoardComponent, CartInfoDetailsComponent,
    CartInfoPrgComponent, CartInfoPadComponent, CartInfoGameComponent } from './cartinfo-details.component';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { MatTabsModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
      CartInfoDialogComponent,
      CartInfoComponent,
      CartInfoBoardComponent,
      CartInfoDetailsComponent,
      CartInfoPrgComponent,
      CartInfoPadComponent,
      CartInfoGameComponent,
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
      MatExpansionModule
  ],
  exports: [
    CartInfoDialogComponent,
    CartInfoComponent,
  ]
})
export class CartInfoModule { }
