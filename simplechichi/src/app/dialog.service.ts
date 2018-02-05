import { HttpClient } from "@angular/common/http";
import { BaseCart } from "chichi";
import { CartInfoDialogComponent } from "../cartinfo/cartinfo-dialog.component";
import { MatDialog } from "@angular/material";
import { Injectable } from "@angular/core";

@Injectable()
export class DialogService {
    constructor(private http: HttpClient, private dialog: MatDialog) {
        
    }

    showCartInfo (cart: BaseCart) {

        this.http.get(`assets/carts/${cart.ROMHashFunction}.json`)
        .subscribe((info) => {
            const dialogRef = this.dialog.open(CartInfoDialogComponent, {
                height: '80%',
                width: '60%',
                data: { cart: cart, info: info }
            });
        }, (err) => {
            const dialogRef = this.dialog.open(CartInfoDialogComponent, {
                height: '80%',
                width: '60%',
                data: { cart: cart, info: {} }
            });
        });
    }
}