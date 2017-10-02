import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ChiChiComponent } from './chichines.component';

@NgModule({
  declarations: [
      AppComponent,
      ChiChiComponent
  ],
  imports: [
      BrowserModule, HttpModule
  ],
  providers: [HttpModule ],
  bootstrap: [AppComponent]
})

export class AppModule { }
