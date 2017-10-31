import { Emulator } from '../services/NESService';
import { Component } from '@angular/core';
import { WishboneMachine } from '../services/wishbone/wishbone';
import { ControlDialogComponent } from './chichines.controldialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'chichines-controlconfig',
  templateUrl: './chichines.controlconfig.component.html',
  styleUrls: ['./chichines.controlconfig.component.css']
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
