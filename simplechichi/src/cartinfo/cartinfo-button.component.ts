import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CartInfoDialogComponent } from './cartinfo-dialog.component';

import { BaseCart } from 'chichi';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'cartinfo-button',
  template: `<button mat-mini-fab (click)="showDialog()" ><mat-icon svgIcon='chip'></mat-icon></button>`
})
export class CartInfoButtonComponent {
    @Input('cart') cart: BaseCart;

    constructor(private dialog: MatDialog, private http: HttpClient) {
    }

    showDialog () {

        this.http.get(`assets/carts/${this.cart.ROMHashFunction}.json`)
        .subscribe((info) => {
            const dialogRef = this.dialog.open(CartInfoDialogComponent, {
                height: '80%',
                width: '60%',
                data: { cart: this.cart, info: info }
            });
        }, (err) => {
            console.log('cart info fail');
        });
    }
}
