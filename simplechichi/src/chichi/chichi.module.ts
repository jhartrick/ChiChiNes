import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChiChiComponent } from './chichiview/chichines.component';


@NgModule({
  declarations: [
    ChiChiComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  exports: [
      ChiChiComponent
  ]
})
export class ChiChiModule { }
