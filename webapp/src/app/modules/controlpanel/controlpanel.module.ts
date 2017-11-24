import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatPaginatorModule, MatGridListModule, MatTabsModule } from '@angular/material';
import { MatButtonModule, MatCheckboxModule, MatSidenavModule, MatSliderModule } from '@angular/material';
import { MatButtonToggleModule, MatExpansionModule, MatDialogModule } from '@angular/material';
import { MatIconRegistry, MatIconModule } from '@angular/material';

import { ControlPanelComponent, PowerStatusComponent } from './controlpanel.component';
import { VolumeComponent } from './volume.component';
import { AudioSettingsComponent } from './chichines.audiosettings/chichi.audiosettings';
import { CartLoaderComponent } from './cartloader.component';
import { PowerButtonComponent } from './powerbutton.component';

@NgModule({
  declarations: [
      ControlPanelComponent,
      PowerStatusComponent,
      AudioSettingsComponent,
      VolumeComponent,
      CartLoaderComponent,
      PowerButtonComponent,
  ],
  entryComponents: [
    VolumeComponent,
    CartLoaderComponent
],
  imports: [
      BrowserModule,
      HttpModule,
      MatSidenavModule,
      BrowserAnimationsModule,
      MatButtonToggleModule,
      MatButtonModule,
      MatExpansionModule,
      MatTableModule,
      MatPaginatorModule,
      MatGridListModule,
      MatTabsModule,
      MatDialogModule,
      MatSliderModule,
      MatIconModule,
  ],
  exports: [
    ControlPanelComponent,
    PowerStatusComponent,
    AudioSettingsComponent,
    VolumeComponent,
    CartLoaderComponent,
    PowerButtonComponent
],
  providers: []
})

export class ControlPanelModule {

}
