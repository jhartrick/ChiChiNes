import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ChiChiModule } from '../chichi/chichi.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ChiChiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
