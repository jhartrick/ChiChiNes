import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ChiChiModule } from '../chichi/chichi.module';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    ChiChiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
