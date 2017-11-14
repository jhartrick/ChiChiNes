import { CartInfoComponent } from './chichi.cartinfo/chichi.cartinfo';
import { CartInfoDialogComponent } from './chichi.cartinfo/chichi.cartinfo.dialog';
import { CartInfoBoardComponent, CartInfoDetailsComponent,
    CartInfoPrgComponent, CartInfoPadComponent } from './chichi.cartinfo/chichi.cartinfo.details';
import { MatDialogModule, MatButtonModule, MatExpansionModule } from '@angular/material';
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
      CartInfoPadComponent
  ],
  entryComponents: [
    CartInfoDialogComponent
],
  imports: [
      BrowserModule,
      MatDialogModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatExpansionModule,
  ],
  exports: [
    CartInfoDialogComponent,
    CartInfoComponent,
    CartInfoBoardComponent,
    CartInfoDetailsComponent,
    CartInfoPrgComponent,
    CartInfoPadComponent
  ]
})
export class CartInfoModule { }
