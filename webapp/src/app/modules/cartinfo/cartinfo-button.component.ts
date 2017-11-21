import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CartInfoDialogComponent } from './cartinfo-dialog.component';
import { Http } from '@angular/http';
import { RomLoader } from '../../services/cartloader';
import { ICartSettings } from '../../services/ICartSettings';


@Component({
  selector: 'cartinfo-button',
  template: `
  <button (click)="showDialog()" *ngIf='cartSettings ? true : false' mat-icon-button>
  <mat-icon fontSet="fa" fontIcon="fa-microchip" aria-label="">CartInfo</mat-icon>
</button>
`
})
export class CartInfoButtonComponent {
    @Input('cartSettings') cartSettings: ICartSettings;

    constructor(private loader: RomLoader, private dialog: MatDialog, private http: Http) {
    }

    showDialog () {
        this.loader.getCartInfo().subscribe((info) => {
            const dialogRef = this.dialog.open(CartInfoDialogComponent, {
                height: '80%',
                width: '60%',
                data: { cart: this.cartSettings, info: info }
            });
        }, (err) => {
            console.log('cart info fail');
        });
    }
}
