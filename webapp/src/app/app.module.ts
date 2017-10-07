import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { MatButtonModule, MatCheckboxModule, MatSidenavModule, MatButtonToggleModule, MatExpansionModule } from '@angular/material';

import { Emulator} from './services/NESService'

import { AppComponent } from './app.component';
import { ChiChiComponent } from './chichines.component';
import { ControlPanelComponent } from './controlpanel.component';
import { DebugOutputComponent } from './debugoutput/debugoutput.component';

@NgModule({
  declarations: [
      AppComponent,
      ChiChiComponent,
      ControlPanelComponent,
      DebugOutputComponent
  ],
  imports: [
      BrowserModule, HttpModule, MatSidenavModule, BrowserAnimationsModule, MatButtonToggleModule, MatButtonModule, MatExpansionModule

  ],
  providers: [HttpModule, Emulator],
  bootstrap: [AppComponent]
})

export class AppModule { }
