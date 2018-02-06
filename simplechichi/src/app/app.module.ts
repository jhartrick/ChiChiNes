import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ChiChiModule } from '../chichi/chichi.module';
import {MatButtonModule, MatCheckboxModule, MatIconRegistry} from '@angular/material';
import { ToolStripComponent } from './toolstrip/toolstrip.component';
import { ToolStripModule } from './toolstrip/toolstrip.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CartInfoModule } from '../cartinfo/cartinfo.module';
import { DialogService } from './dialog.service';
import { CheatingModule } from '../cartinfo/cheating/cheating.module';

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    ToolStripModule,
    HttpClientModule,
    CartInfoModule,
    CheatingModule,
    ChiChiModule
  ],
  providers: [MatIconRegistry, HttpClient, DialogService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public matIconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {

    matIconRegistry
      .addSvgIcon('gamepad', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/gamepad.svg'))
      .addSvgIcon('chip', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/chip.svg'))
      .addSvgIcon('upload', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/upload.svg'))
      .addSvgIcon('power', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/power.svg'))
      .addSvgIcon('play', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/play.svg'))
      .addSvgIcon('pause', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/pause.svg'))
      .addSvgIcon('stop', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/stop.svg'))
      .addSvgIcon('settings', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/settings.svg'))
      .addSvgIcon('reset', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/reset.svg'))
      .addSvgIcon('volume-high', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/volume-high.svg'))
      .addSvgIcon('volume-off', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/volume-off.svg'))
      .addSvgIcon('baby-buggy', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baby-buggy.svg'))
      .addSvgIcon('amplifier',  sanitizer.bypassSecurityTrustResourceUrl('assets/icons/amplifier.svg'));
  }

 }
