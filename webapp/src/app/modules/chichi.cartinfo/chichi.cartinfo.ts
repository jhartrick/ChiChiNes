import { Component } from '@angular/core';
import { WishboneMachine } from '../../services/wishbone/wishbone';
import { Emulator } from '../../services/NESService';
import { MatDialog } from '@angular/material';
import { CartInfoDialogComponent } from './chichi.cartinfo.dialog';
import { Http } from '@angular/http';


@Component({
  selector: 'chichi-cartinfo',
  templateUrl: './chichi.cartinfo.html',
  styleUrls: ['./chichi.cartinfo.css']
})
export class CartInfoComponent {
    wishbone: WishboneMachine;
    constructor(private nesService: Emulator, private dialog: MatDialog, private http: Http) {
        this.wishbone = nesService.wishbone;
    }
    showDialog () {
        const dialogRef = this.dialog.open(CartInfoDialogComponent, {
            height: '80%',
            width: '60%',
            data: { wishbone:  this.wishbone, info: this.wishbone.Cart.cartInfo }
        });
    }
}
