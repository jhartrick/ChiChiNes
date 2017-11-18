import { Emulator } from '../../services/NESService';
import { Component } from '@angular/core';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { ControlDialogComponent } from './controlpad.dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'controlpad-config',
  templateUrl: './controlpad.component.html',
  styleUrls: ['./controlpad.component.css']
})
export class ControlConfigComponent {
    wishbone: WishboneMachine;
    constructor(private nesService: Emulator, private dialog: MatDialog) {
        this.wishbone = nesService.wishbone;
    }

    showDialog () {
        this.wishbone.PadOne.enabled = false;
        const dialogRef = this.dialog.open(ControlDialogComponent, {
            height: '80%',
            width: '60%',
            data: { wishbone:  this.wishbone }
          });
        dialogRef.afterClosed().subscribe( () => {
            this.wishbone.PadOne.enabled = true;
        });
    }

}
