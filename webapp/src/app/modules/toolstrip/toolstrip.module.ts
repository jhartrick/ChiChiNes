import { MatDialogModule, MatButtonModule, MatButtonToggleModule, MatIconModule } from '@angular/material';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolStripComponent } from './toolstrip.component';
import { PopoverComponent } from './popover/popover.component';
import { PopoverDirective } from './popover/popover.directive';
import { AppModule } from '../../app.module';
import { ControlPanelModule } from '../controlpanel/controlpanel.module';
import { CartInfoModule } from '../cartinfo/cartinfo.module';
import { CheatingModule } from '../cheating/cheating.module';
import { ControlPadModule } from '../controlpad/controlpad.module';
import { RouterModule } from '@angular/router';
import { RoutingModule } from '../routing.module';

@NgModule({
  declarations: [
    ToolStripComponent,
    PopoverComponent,
    PopoverDirective
  ],
  entryComponents: [
  ],
  imports: [
      RoutingModule,
      RouterModule,
      BrowserModule,
      MatDialogModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatIconModule,
      ControlPanelModule,
      CartInfoModule,
      CheatingModule,
      ControlPadModule
  ],
  exports: [
    ToolStripComponent
  ]
})
export class ToolStripModule { }
