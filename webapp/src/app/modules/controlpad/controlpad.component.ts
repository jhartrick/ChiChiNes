import { NESService } from '../../services/NESService';
import { Component } from '@angular/core';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { ControlDialogComponent } from './controlpad.dialog.component';
import { MatDialog } from '@angular/material';
import { WishboneKeyboardSettings } from './keyboardsettings';

@Component({
  selector: 'controlpad-config',
  templateUrl: './controlpad.component.html',
  styleUrls: ['./controlpad.component.css']
})
export class ControlConfigComponent {
    
    constructor(private keysettings: WishboneKeyboardSettings, private dialog: MatDialog) {
        
    }

    showDialog () {
        this.keysettings.padOne.enabled = this.keysettings.padTwo.enabled = false;
        const dialogRef = this.dialog.open(ControlDialogComponent, {
            height: '80%',
            width: '60%',
            data: { }
          });
        dialogRef.afterClosed().subscribe( () => {
            this.keysettings.padOne.enabled = this.keysettings.padTwo.enabled = true;
        });
    }

}
