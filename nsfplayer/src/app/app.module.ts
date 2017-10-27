import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChiChiNsfMachine } from 'chichi'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ ChiChiNsfMachine ],
  bootstrap: [AppComponent]
})
export class AppModule { }
