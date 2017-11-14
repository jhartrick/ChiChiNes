import { Component } from '@angular/core';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { Emulator } from '../../services/NESService';
import { MatDialog } from '@angular/material';
import { CartInfoDialogComponent } from './chichi.cartinfo.dialog';


@Component({
  selector: 'chichi-cartinfo',
  templateUrl: './chichi.cartinfo.html',
  styleUrls: ['./chichi.cartinfo.css']
})
export class CartInfoComponent {
    wishbone: WishboneMachine;
    constructor(private nesService: Emulator, private dialog: MatDialog) {
        this.wishbone = nesService.wishbone;
    }

    showDialog () {
        this.wishbone.PadOne.enabled = false;
        const dialogRef = this.dialog.open(CartInfoDialogComponent, {
            height: '80%',
            width: '60%',
            data: { wishbone:  this.wishbone }
          });
    }
}
